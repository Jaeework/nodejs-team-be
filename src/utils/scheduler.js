const cron = require("node-cron");
const { fetchAndStoreNews } = require("../services/news.service");

const initSchedule = () => {
  // 예: 2개월마다 1일 자정에 실행
  cron.schedule("0 0 1 */2 *", () => {
    fetchAndStoreNews();
  });

  console.log("뉴스 수집 스케줄러가 등록되었습니다.");
};

module.exports = initSchedule;
