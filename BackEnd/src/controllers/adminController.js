const db = require("../db");

exports.updatePoints = async (req, res) => {
  const { userId, points } = req.body;

  await db.query("UPDATE users SET points = ? WHERE id = ?", [points, userId]);

  res.json({ message: "Points updated" });
};

exports.createPlan = async (req, res) => {
  const { title, description } = req.body;

  await db.query(
    "INSERT INTO reading_plans (title, description) VALUES (?, ?)",
    [title, description],
  );

  res.status(201).json({ message: "Plan created" });
};
