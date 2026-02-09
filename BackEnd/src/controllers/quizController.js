// controllers/quizController.js
const pool = require("../db");

exports.listQuizzes = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, title, question, options, created_at FROM quizzes",
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.attemptQuiz = async (req, res, next) => {
  try {
    const { user_id, quiz_id, selected_answer } = req.body;
    // fetch correct answer
    const [qrows] = await pool.execute(
      "SELECT correct_answer FROM quizzes WHERE id = ?",
      [quiz_id],
    );
    if (!qrows.length) return res.status(404).json({ error: "Quiz not found" });

    const correct = qrows[0].correct_answer;
    const is_correct = selected_answer === correct ? 1 : 0;
    const score = is_correct ? 1 : 0; // simple scoring: 1 or 0

    const [result] = await pool.execute(
      "INSERT INTO quiz_attempts (user_id, quiz_id, selected_answer, is_correct, score) VALUES (?, ?, ?, ?, ?)",
      [user_id, quiz_id, selected_answer, is_correct, score],
    );

    res.json({
      attempt_id: result.insertId,
      is_correct: Boolean(is_correct),
      score,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAttemptsForUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const [rows] = await pool.execute(
      "SELECT qa.*, q.title FROM quiz_attempts qa JOIN quizzes q ON qa.quiz_id = q.id WHERE qa.user_id = ? ORDER BY attempted_at DESC",
      [userId],
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};
