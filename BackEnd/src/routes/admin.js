const express = require("express");
const router = express.Router();
const admin = require("../controllers/adminController");

router.post("/points", admin.updatePoints);
router.post("/plans", admin.createPlan);

module.exports = router;
