require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const indexRouter = require("./src/routes/index");
const errorHandler = require("./src/utils/errorHandler");

const app = express();

const authRoute = require("./src/routes/auth.route");
const meRoute = require("./src/routes/me.route");



connectDB();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", indexRouter);
app.use(errorHandler);

app.use("/api/auth", authRoute);
app.use("/api/me", meRoute);

module.exports = app;
