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
    //const prompt = process.env.NEWS_AI_PROMPT + content;
    const prompt =
      `역할: 당신은 한국인 학습자를 위한 전문 영어 교육 콘텐츠 크리에이터이자 데이터 엔지니어입니다. 제공된 뉴스 기사를 분석하여 수준별 학습 콘텐츠를 JSON 형식으로 생성하세요.

[목표]
기사에서 가장 중요한 경제·정치 정보를 레벨별로 정리하고, 각 레벨 문단에 맞는 단어, 숙어, 두문자어/이니셜리즘, 예문을 추출하세요.
각 문단은 해당 레벨 학습자가 읽고 이해할 수 있는 난이도로 작성되어야 합니다.

[핵심 규칙]
- 기사 전체를 반복하지 마세요. 비슷한 내용은 반복하지 마세요. 핵심 정보만 포함하세요.
- 서론이나 결론 문장은 절대 쓰지 마세요. 정보와 사실만 나열하세요.
- 각 레벨 간 내용이 겹치지 않도록 하세요.
- 문단 안 단어는 그 CEFR레벨 학습자가 이해할 수 있는 수준이어야 합니다.
- 반드시 해당 레벨 본문에 사용된 단어만 추출해야 합니다.
- 반드시 4개 CEFR레벨(A2, B1, B2, C1) 모두에 대해 콘텐츠와 단어를 생성해야 합니다.
- 문단 안 단어는 해당 CEFR 레벨에 맞아야 합니다.
- 한국어 해석은 '멀리입니다' 같은 직역을 피하고 '거리가 꽤 멉니다'와 같이 자연스러운 구어체를 사용하세요.

[콘텐츠 생성 규칙]
 1. 레벨별 재작성: 하나의 기사를 기반으로 A2(기초), B1(중급), B2(중상급), C1(고급) 4개 레벨로 재작성해서 가져오세요.
  - A2: 매우 쉬운 어휘, 짧은 단문 위주
  - B1: 일상적 어휘, 명확한 문장 구조, 구동사 포함
  - B2: 전문 어휘 시작, 다양한 문장 구조 및 관용구
  - C1: 원문에 가까운 고급 어휘, 저널리즘 스타일, 세련된 표현

 2. 내용 구성: 서론/결론 등의 미사여구 없이 핵심 정보(경제·정치적 사실)만 포함하세요. 레벨이 높아질수록 정보의 깊이와 문맥의 복잡성을 더하세요.
 3. 분량 규칙
    - 각 레벨별 content 본문은 매우 상세해야 합니다. 
    - 각 레벨당 최소 5개 이상의 긴 문단으로 구성하세요.

 4. 언어 규칙: 모든 content와 title은 영어로 작성하며, meaning은 한국어로 작성합니다.
 5. 구조 규칙: * title: 해당 레벨 어휘로 작성된 영문 제목.
  - content: 기사 본문을 문단 단위로 나눈 영어 배열로 작성.
  - translated_content: content 배열과 1:1 대응되는 한국어 번역 배열.

[URGENT: NO DOUBLE SPACES]
- 모든 한국어/영어 텍스트에서 연속된 공백(Double Spaces)을 절대 금지합니다.
- 반드시 단일 공백(Single Space)만 사용하세요.

[words 배열 규칙]
1. 단어(word) 10개: 해당 레벨 학습자가 문단을 읽기 전 '힌트'로 삼을 수 있는 핵심 키워드.
2. 숙어(idioms) 5개:
   - A2/B1: 반드시 'go up', 'look for' 같은 쉬운 **구동사(Phrasal Verbs)** 위주로 선정.
   - B2/C1: 기사 문맥에 맞는 관용구 선정.
3. 두문자어/이니셜리즘 a개:
   - 의미(meaning) 란에 단순 사전적 정의가 아니라, 해당 레벨 학습자가 이해할 수 있는 **'쉬운 풀이'**를 한국어로 적으세요. (예: GDP -> 한 나라가 번 돈의 합계)
   - 반드시 해당 레벨 content 본문에 사용된 것만 추출하세요.
   - 개수는 해당 레벨 학습자가 문단을 읽을수 있을만큼 제공하세요.
4. 필드상세:
   - meaning : 해당 단어/숙어의 핵심적인 한국어 뜻.
   - example : 본문과 상관없이 경제/정치와 관련된 내용으로, 해당 단어의 쓰임새가 명확히 드러나는 학습자가 이해하기 쉬운 영어 예문 1개.
   - example_meaning : 예문의 한국어 해석. 
    * 주의: "It is a long way"를 "멀리입니다"라고 직역하지 마세요. 
    * 예: "공원까지는 거리가 꽤 멀어요" 또는 "공원까지 가는 길은 멉니다"와 같이 문맥에 맞는 자연스러운 문장으로 의역하세요.
   - type: "word", "idiom", "abbreviation" 중 하나만 사용.
5. 구성 및 정렬(중요): *각 레벨당 최소 15개 이상의 항목을 추출하되, 반드시 아래 순서대로 정렬하여 나열하세요.
   - (1) word (10개) → (2) idiom (5개) → (3) abbreviation (기사 내 약어 전체)

[언어 규칙]
- 모든 content와 title은 영어로 작성하며, meaning과 example_meaning은 한국어로 작성합니다.
- 한국어 번역 및 해석은 번역기 말투(~입니다, ~함)를 지양하고, 전문 교육 자료에 걸맞은 자연스러운 한국어 문장으로 작성하세요.
- 단순히 단어를 나열하는 것이 아니라, 한국어 화자가 실제 대화나 학습 시 사용하는 자연스러운 종결 어미(~예요, ~입니다, ~해요 등)를 사용하세요.


[출력 형식]
 - 응답은 반드시 순수한 JSON 코드만 제공하세요. (인사말, 설명, 마무리 멘트 절대 금지)
 - 아래의 스키마 구조를 엄격히 준수하세요.
 - JSON 응답 내의 모든 문자열 값에 대해 정규화된 공백을 사용하세요.
{
  "aiData": [
    {
      "news": {
        "title": "Level-specific Title",
        "content": ["Paragraph 1 sentence...", "Paragraph 2 sentence..."],
        "translated_content": ["문단 1 해석...", "문단 2 해석..."],
        "level": "A2",
      },
      "words": [
       {
          "text": "단어",
          "type": "word",
          "meaning": "한국어 뜻",
          "example": "Simple example sentence",
          "example_meaning": "예문 한국어 해석"
        },
        {
          "text": "숙어",
          "type": "idiom",
          "meaning": "한국어 뜻",
          "example": "Simple example sentence",
          "example_meaning": "예문 한국어 해석"
        },
        {
          "text": "약어",
          "type": "abbreviation",
          "meaning": "쉬운 풀이",
          "example": "Simple example sentence",
          "example_meaning": "예문 한국어 해석"
        }
      ]
    }
  ]
}

[대상 기사 본문]
` + content;

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

    const articles = response.data.response.results;
    if (articles.length === 0) return;

    for (const item of articles) {
      const bodyText = item.fields?.bodyText;
      if (!bodyText) continue;

      const articleStartTime = Date.now();
      console.log(
        `\n[분석 시작] ${item.webTitle} (${new Date().toLocaleTimeString()})`,
      );

      const aiResponse = await analyzeNewsContentWithAi(bodyText);
      if (!aiResponse || !Array.isArray(aiResponse.aiData)) {
        console.log(
          `[데이터 오류] AI 응답 형식이 올바르지 않습니다. 기사: ${item.webTitle}`,
        );
        continue;
      }
      console.log(`[분석 데이터]${JSON.stringify(aiResponse.aiData)}`);

      const allWordsFromAi = aiResponse.aiData.flatMap((d) => d.words);
      const uniqueWordTexts = [...new Set(allWordsFromAi.map((w) => w.text))];

      const wordOperations = uniqueWordTexts
        .map((text) => {
          const wordData = allWordsFromAi.find((w) => w.text === text);
          if (!wordData) return null; // 안전장치: wordData가 없는 경우 null 반환
          return {
            updateOne: {
              filter: { text },
              update: {
                $setOnInsert: {
                  text,
                  type: wordData.type,
                  meaning: wordData.meaning,
                  example: wordData.example,
                  example_meaning: wordData.example_meaning,
                },
              },
              upsert: true,
            },
          };
        })
        .filter((op) => op !== null); // null인 항목 제거

      // 업서트 방식으로 단어 데이터 저장
      await Word.bulkWrite(wordOperations);

      const dbWords = await Word.find(
        { text: { $in: uniqueWordTexts } },
        "_id text",
      );
      const wordMap = new Map(dbWords.map((w) => [w.text, w._id]));

      const newsToInsert = aiResponse.aiData.map((data) => ({
        title: data.news.title,
        content: data.news.content,
        translated_content: data.news.translated_content,
        url: item.webUrl,
        image: item.fields?.thumbnail || null,
        published_at: new Date(item.webPublicationDate),
        level: data.news.level,
        source: "The Guardian",
      }));

      const insertedNews = await News.insertMany(newsToInsert);

      const newsWordOperations = [];

      for (let i = 0; i < insertedNews.length; i++) {
        const currentNews = insertedNews[i];
        const currentAiWords = aiResponse.aiData[i].words;

        currentAiWords.forEach((w) => {
          const wordId = wordMap.get(w.text);
          if (wordId) {
            newsWordOperations.push({
              updateOne: {
                filter: { news: currentNews._id, word: wordId },
                update: { news: currentNews._id, word: wordId },
                upsert: true,
              },
            });
          }
        });
      }

      if (newsWordOperations.length > 0) {
        await NewsWord.bulkWrite(newsWordOperations);
      }

      const articleEndTime = Date.now();
      const duration = ((articleEndTime - articleStartTime) / 1000).toFixed(2);
      console.log(`[DB저장 완료] (소요시간: ${duration}초)`);
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

const clearOldNews = async () => {
  try {
    await News.deleteMany({});
    await NewsWord.deleteMany({});
    console.log("모든 뉴스 및 연관 단어 데이터가 삭제되었습니다.");
  } catch (err) {}
};

module.exports = { fetchAndStoreNews, clearOldNews };
