const express = require("express");
const router = express.Router();

const authRoute = require("./auth.route");
const userRoute = require("./user.route");

router.use("/auth", authRoute);
router.use("/me", userRoute);

module.exports = router;
