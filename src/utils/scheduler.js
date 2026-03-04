const cron = require("node-cron");
const { fetchAndStoreNews, clearOldNews } = require("../services/news.service");

const initSchedule = () => {
  // 앱 시작 시 최초 1회 실행 (필요한 경우)
  fetchAndStoreNews();

  // 1. 뉴스 수집: 매주 월요일 자정 (0 0 * * 1)
  cron.schedule("0 0 * * 1", () => {
    console.log("주간 뉴스 수집을 시작합니다.");
    fetchAndStoreNews();
  });

  // 2. 전체 뉴스 삭제: 2개월마다 1일 자정 (0 0 1 */2 *)
  cron.schedule("0 0 1 */2 *", () => {
    console.log("2개월 주기 데이터 초기화를 시작합니다.");
    clearOldNews();
  });

  console.log("뉴스 수집(매주) 및 삭제(2개월) 스케줄러가 등록되었습니다.");
};

module.exports = initSchedule;
