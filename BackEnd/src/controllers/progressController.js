// controllers/progressController.js
const pool = require("../db");

exports.addOrUpdateProgress = async (req, res, next) => {
  try {
    const { user_id, lesson, progress_percent } = req.body;
    // Check if exists
    const [rows] = await pool.execute(
      "SELECT id FROM progress WHERE user_id = ? AND lesson = ?",
      [user_id, lesson],
    );
    if (rows.length) {
      await pool.execute(
        "UPDATE progress SET progress_percent = ?, last_updated = NOW() WHERE id = ?",
        [progress_percent, rows[0].id],
      );
      return res.json({ message: "Progress updated" });
    } else {
      const [result] = await pool.execute(
        "INSERT INTO progress (user_id, lesson, progress_percent) VALUES (?, ?, ?)",
        [user_id, lesson, progress_percent],
      );
      return res
        .status(201)
        .json({ id: result.insertId, message: "Progress created" });
    }
  } catch (err) {
    next(err);
  }
};

exports.getProgressForUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const [rows] = await pool.execute(
      "SELECT * FROM progress WHERE user_id = ?",
      [userId],
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};
