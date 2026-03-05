const express = require("express");
const router = express.Router();
const meApi = require("./me.api");
const newsApi = require("./news.api");
const authApi = require("./auth.api");
const userApi = require("./user.api");


router.use("/me", meApi);
router.use("/auth", authApi);
router.use("/me", userApi);
router.use("/news", newsApi);

module.exports = router;
