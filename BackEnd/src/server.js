// server.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const usersRoutes = require("./routes/users");
const progressRoutes = require("./routes/progress");
const quizRoutes = require("./routes/quiz");
const streakRoutes = require("./routes/streak");
const dailyVerseRoutes = require("./routes/dailyVerse");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json()); // parse JSON request bodies

// Basic health check
app.get("/", (req, res) =>
  res.json({ status: "ok", message: "Ethiopian Bible Study API" }),
);

// Routes
app.use("/users", usersRoutes);
app.use("/progress", progressRoutes);
app.use("/quiz", quizRoutes);
app.use("/streaks", streakRoutes);
app.use("/daily-verse", dailyVerseRoutes);
app.use("/admin", adminRoutes);

// Global error handler (simple)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
