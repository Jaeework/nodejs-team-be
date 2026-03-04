const axios = require("axios");
const News = require("../models/News");
const Word = require("../models/Word");
const NewsWord = require("../models/NewsWord");
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const analyzeNewsContentWithAi = async (content) => {
  try {
    const prompt = process.env.NEWS_AI_PROMPT + content;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "당신은 전문적인 영어 선생님입니다. 반드시 순수한 JSON으로만 응답하세요.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" }, // JSON 출력 보장
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (err) {
    console.error("AI 분석 에러:", err.message);
    return null; // 분석 실패 시 null 반환
  }
};

const fetchAndStoreNews = async () => {
  const totalStartTime = Date.now(); // 전체 작업 시작 시간 기록
  console.log("뉴스 수집 시작:", new Date().toLocaleString());

  try {
    const API_KEY = process.env.GUARDIAN_API_KEY;
    const BASE_URL = "https://content.guardianapis.com/search";

    const response = await axios.get(BASE_URL, {
      params: {
        "api-key": API_KEY,
        section: "business", // 비즈니스 섹션 뉴스만 가져오기
        "show-fields": "all",
        "page-size": 1, // 한 번에 최대 1개 기사 가져오기
        "order-by": "newest", // 최신 기사부터 가져오기
      },
    });

    // 기존 데이터 삭제 (60일 주기라면 여기서 삭제 로직 실행)
    await News.deleteMany({});

    const articles = response.data.response.results;

    for (const item of articles) {
      const isExist = await News.exists({ url: item.webUrl });
      if (isExist) continue;

      const bodyText = item.fields?.bodyText;
      if (!bodyText) continue;

      // --- 기사별 AI 분석 시간 측정 시작 ---
      const articleStartTime = Date.now();
      console.log(
        `\n[분석 시작] ${item.webTitle} (${new Date().toLocaleTimeString()})`,
      );

      const aiResponse = await analyzeNewsContentWithAi(bodyText);
      if (!aiResponse || !aiResponse.aiData) {
        console.log(`[분석 실패] ${item.webTitle}`);
        continue;
      }
      console.log(`[분석 데이터]${JSON.stringify(aiResponse.aiData)}`);

      for (const data of aiResponse.aiData) {
        const newNews = await News.create({
          title: item.webTitle,
          content: data.content,
          url: item.webUrl,
          image: item.fields?.thumbnail || null,
          published_at: new Date(item.webPublicationDate),
          level: data.level,
          source: "The Guardian",
        });
        console.log(`[저장 완료] ${item.webTitle} (ID: ${newNews._id})`);

        // 단어 저장 및 NewsWord 연결
        //   for (const v of data.words) {
        //     const wordEntry = await Word.findOneAndUpdate(
        //       { text: v.word },
        //       { meaning: v.meaning, type: v.type },
        //       { upsert: true, returnDocument: "after" },
        //     );
        //     await NewsWord.findOneAndUpdate(
        //       { news: newNews._id, word: wordEntry._id },
        //       { news: newNews._id, word: wordEntry._id },
        //       { upsert: true },
        //     );
        //   }
      }

      const articleEndTime = Date.now();
      const duration = ((articleEndTime - articleStartTime) / 1000).toFixed(2);
      console.log(`[저장 완료] ${item.webTitle} (소요시간: ${duration}초)`);
      // --- 기사별 AI 분석 시간 측정 종료 ---
    }

    const totalEndTime = Date.now();
    const totalDuration = ((totalEndTime - totalStartTime) / 1000 / 60).toFixed(
      2,
    );
    console.log(`\n=========================================`);
    console.log(`모든 뉴스 수집 및 AI 분석 완료!`);
    console.log(`총 소요 시간: 약 ${totalDuration}분`);
    console.log(`=========================================`);
  } catch (err) {
    console.error("에러 발생:", err.message);
  }
};

module.exports = { fetchAndStoreNews };
