const express = require("express");
const router = express.Router();

const userWordsController = require("../controllers/userWords.controller");

// 단어 저장
router.post("/", userWordsController.createMyWord);

// 단어장 조회
router.get("/", userWordsController.getMyWords);

// 상태 수정
router.put("/:userWordId", userWordsController.updateMyWord);

// 단어 삭제
router.delete("/:userWordId", userWordsController.deleteMyWord);

module.exports = router;
