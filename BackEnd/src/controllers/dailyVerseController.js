const db = require("../db");

// Get today's verse
exports.getTodayVerse = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const [rows] = await db.query(
      "SELECT * FROM daily_verses WHERE verse_date = ?",
      [today],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No verse set for today" });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// Save user reflection
exports.saveReflection = async (req, res, next) => {
  try {
    const { userId, verseId, note } = req.body;

    await db.query(
      "INSERT INTO reflections (user_id, verse_id, note) VALUES (?, ?, ?)",
      [userId, verseId, note],
    );

    res.status(201).json({ message: "Reflection saved ✨" });
  } catch (err) {
    next(err);
  }
};

// Get user's reflections
exports.getMyReflections = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.query(
      `
      SELECT r.note, r.created_at, d.book, d.chapter, d.verse, d.text
      FROM reflections r
      JOIN daily_verses d ON r.verse_id = d.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
      `,
      [userId],
    );

    res.json(rows);
  } catch (err) {
    next(err);
  }
};
