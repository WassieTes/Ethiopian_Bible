// routes/users.js
const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

// create user
router.post("/", usersController.createUser);

// get user
router.get("/:id", usersController.getUser);

// list users (optional query: age_group)
router.get("/", usersController.listUsers);

module.exports = router;
