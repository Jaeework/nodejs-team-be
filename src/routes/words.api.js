const express = require("express");
const router = express.Router();

const wordsController = require("../controllers/words.controller");

// 단어 저장
router.post("/", wordsController.createMyWord);

// 단어장 조회
router.get("/", wordsController.getMyWords);

// 상태 수정
router.put("/:userWordId", wordsController.updateMyWord);

// 단어 삭제
router.delete("/:userWordId", wordsController.deleteMyWord);

module.exports = router;
