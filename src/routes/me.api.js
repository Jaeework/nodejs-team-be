const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const userWordsController = require("../controllers/userWords.controller");
const authMiddleware = require("../middlewares/auth.middleware");

=======
const authMiddleware  = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");
const userWordsController = require("../controllers/userWords.controller");
const userNewsController = require("../controllers/userNews.controller");

router.get("/", authMiddleware, userController.getMe); 
router.post("/news", authMiddleware, userNewsController.createUserNews);
router.delete("/news/:id", authMiddleware, userNewsController.deleteUserNews);
router.get("/news", authMiddleware, userNewsController.getUserNewsList);
router.post("/news/:id/hide", authMiddleware, userNewsController.hideUserNews);
>>>>>>> develop
router.post("/words", authMiddleware, userWordsController.createMyWord);
router.get(
  "/words/export",
  authMiddleware,
  userWordsController.exportMyWordsCSV
);
router.get("/words", authMiddleware, userWordsController.getMyWords);
router.put(
  "/words/:userWordId",
  authMiddleware,
  userWordsController.updateMyWord
);
router.delete(
  "/words/:userWordId",
  authMiddleware,
  userWordsController.deleteMyWord
);

module.exports = router;
