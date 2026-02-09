// controllers/streakController.js
const pool = require("../db");

exports.getStreak = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const [rows] = await pool.execute(
      "SELECT * FROM streaks WHERE user_id = ?",
      [userId],
    );
    if (!rows.length)
      return res.status(404).json({ error: "No streak info for user" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/*
  updateStreak expects:
  { user_id: 1, active_today: true }
  active_today = true means user used the app today (count as a day in streak)
  This is a simple algorithm:
   - If last_active is yesterday and active_today = true => current_streak += 1
   - If last_active is today and active_today = true => no change
   - If active_today = false and last_active < yesterday => reset current_streak to 0
*/
exports.updateStreak = async (req, res, next) => {
  try {
    const { user_id, active_today } = req.body;
    const [rows] = await pool.execute(
      "SELECT * FROM streaks WHERE user_id = ?",
      [user_id],
    );
    const today = new Date();
    const todayDate = today.toISOString().slice(0, 10); // YYYY-MM-DD

    if (!rows.length) {
      // create initial
      const current_streak = active_today ? 1 : 0;
      const best_streak = current_streak;
      await pool.execute(
        "INSERT INTO streaks (user_id, current_streak, best_streak, last_active) VALUES (?, ?, ?, ?)",
        [user_id, current_streak, best_streak, active_today ? todayDate : null],
      );
      return res.json({
        message: "Streak created",
        current_streak,
        best_streak,
      });
    }

    const record = rows[0];
    const lastActive = record.last_active
      ? record.last_active.toISOString().slice(0, 10)
      : null;
    // compute yesterday date
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().slice(0, 10);

    let newCurrent = record.current_streak;
    let newBest = record.best_streak;

    if (active_today) {
      if (lastActive === todayDate) {
        // already counted today
      } else if (lastActive === yesterdayDate) {
        newCurrent = record.current_streak + 1;
      } else {
        newCurrent = 1; // streak restarted
      }
      if (newCurrent > newBest) newBest = newCurrent;
      await pool.execute(
        "UPDATE streaks SET current_streak = ?, best_streak = ?, last_active = ? WHERE id = ?",
        [newCurrent, newBest, todayDate, record.id],
      );
      return res.json({
        message: "Streak updated",
        current_streak: newCurrent,
        best_streak: newBest,
      });
    } else {
      // If not active today and last_active is not yesterday, maybe reset in future. Keep simple: do nothing.
      return res.json({ message: "No update applied (active_today=false)" });
    }
  } catch (err) {
    next(err);
  }
};
