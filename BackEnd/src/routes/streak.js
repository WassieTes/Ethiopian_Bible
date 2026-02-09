// routes/streak.js
const express = require("express");
const router = express.Router();
const streakController = require("../controllers/streakController");

router.get("/:userId", streakController.getStreak);
router.post("/update", streakController.updateStreak); // body: { user_id, active_today: true/false }

module.exports = router;
