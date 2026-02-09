// routes/quiz.js
const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");

router.get("/", quizController.listQuizzes);
router.post("/attempt", quizController.attemptQuiz); // body: { user_id, quiz_id, selected_answer }
router.get("/attempts/:userId", quizController.getAttemptsForUser);

module.exports = router;
