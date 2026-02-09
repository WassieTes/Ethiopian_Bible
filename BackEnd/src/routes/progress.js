// routes/progress.js
const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");

router.post("/", progressController.addOrUpdateProgress);
router.get("/:userId", progressController.getProgressForUser);

module.exports = router;
