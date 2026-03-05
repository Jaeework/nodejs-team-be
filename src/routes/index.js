const express = require("express");
const router = express.Router();

const authApi = require("./auth.api");
const meApi = require("./me.api");     

router.use("/auth", authApi);
router.use("/me", meApi);   

module.exports = router;