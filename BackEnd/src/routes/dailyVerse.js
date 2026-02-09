const express = require("express");
const router = express.Router();
const {
  getTodayVerse,
  saveReflection,
  getMyReflections,
} = require("../controllers/dailyVerseController");

router.get("/today", getTodayVerse);
router.post("/reflect", saveReflection);
router.get("/my-reflections/:userId", getMyReflections);

module.exports = router;
