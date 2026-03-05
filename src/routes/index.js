// src/routes/index.js
const express = require("express");
const router = express.Router();

const authApi = require("./auth.api");
const userApi = require("./user.api"); // GET/PUT/DELETE /
const meApi = require("./me.api");     // /words, /words/:id 등

router.use("/auth", authApi);
router.use("/me", userApi); // /me
router.use("/me", meApi);   // /me/words ...

module.exports = router;