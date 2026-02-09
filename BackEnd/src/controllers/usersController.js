// controllers/usersController.js
const pool = require("../db");

function determineAgeGroup(age) {
  if (age === null || age === undefined) return "20-39";
  if (age <= 10) return "0-10";
  if (age <= 19) return "11-19";
  if (age <= 39) return "20-39";
  return "40+";
}

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, age } = req.body;
    const age_group = determineAgeGroup(age);
    const [result] = await pool.execute(
      "INSERT INTO users (name, email, age, age_group) VALUES (?, ?, ?, ?)",
      [name, email || null, age || null, age_group],
    );
    res.status(201).json({ id: result.insertId, name, email, age, age_group });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [
      req.params.id,
    ]);
    if (!rows.length) return res.status(404).json({ error: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.listUsers = async (req, res, next) => {
  try {
    const { age_group } = req.query;
    if (age_group) {
      const [rows] = await pool.execute(
        "SELECT * FROM users WHERE age_group = ?",
        [age_group],
      );
      return res.json(rows);
    } else {
      const [rows] = await pool.execute("SELECT * FROM users");
      return res.json(rows);
    }
  } catch (err) {
    next(err);
  }
};
