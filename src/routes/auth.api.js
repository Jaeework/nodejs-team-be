const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// 회원가입 API 라우팅
router.post("/signup", authController.signup);

// 로그인 API 라우팅
router.post("/signin", authController.signin);

// 로그아웃 API 라우팅
router.post("/signout", authController.signout);

module.exports = router;
