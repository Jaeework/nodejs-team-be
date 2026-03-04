const axios = require("axios");
const News = require("../models/News");
const { param } = require("../routes");

const fetchAndStoreNews = async () => {
  console.log("뉴스 수집 시작:", new Date().toLocaleString());
  try {
    const API_KEY = process.env.GUARDIAN_API_KEY;
    const BASE_URL = "https://content.guardianapis.com/search";

    const response = await axios.get(BASE_URL, {
      params: {
        "api-key": API_KEY,
        section: "business", // 비즈니스 섹션 뉴스만 가져오기
        "show-fields": "all",
        "page-size": 10, // 한 번에 최대 100개 기사 가져오기
        "order-by": "newest", // 최신 기사부터 가져오기
      },
    });

    // 기존 데이터 삭제 (60일 주기라면 여기서 삭제 로직 실행)
    await News.deleteMany({});

    const articles = response.data.response.results;
    for (const item of articles) {
      const isExist = await News.exists({ url: item.webUrl });
      if (isExist) continue;

      await News.create({
        title: item.webTitle,
        content: item.fields?.bodyText || null,
        url: item.webUrl,
        image: item.fields?.thumbnail || null,
        published_at: new Date(item.webPublicationDate),
        level: "B1",  // 예시로 모든 뉴스를 B1 레벨로 저장, 필요에 따라 레벨 분류 로직 추가 (TODO)
        source: "The Guardian",
      });
    }
    console.log("뉴스 수집 및 저장 완료!");
  } catch (error) {
    console.error("에러 발생:", error.message);
  }
};

module.exports = { fetchAndStoreNews };
