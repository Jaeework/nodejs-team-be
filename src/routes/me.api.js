const express = require("express");
const router = express.Router();
const authMiddleware  = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");
const userNewsController = require("../controllers/userNews.controller");

router.get("/", authMiddleware, userController.getMe); 
router.post("/news", authMiddleware, userNewsController.createUserNews);
router.delete("/news/:id", authMiddleware, userNewsController.deleteUserNews);
router.get("/news", authMiddleware, userNewsController.getUserNewsList);
router.post("/news/:id/hide", authMiddleware, userNewsController.hideUserNews);

module.exports = router;
