const express = require("express");
const router = express.Router();

const myWordsApi = require("./words.api");

router.use("/me/words", myWordsApi);

module.exports = router;
