-- create database (run once)
CREATE DATABASE IF NOT EXISTS ethiopian_bible;
USE ethiopian_bible;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE,
  age INT,
  age_group ENUM('0-10','11-19','20-39','40+') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Progress table (per user, per lesson/chapter)
CREATE TABLE IF NOT EXISTS progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  lesson VARCHAR(255) NOT NULL,
  progress_percent TINYINT NOT NULL DEFAULT 0, -- 0-100
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Streaks table
CREATE TABLE IF NOT EXISTS streaks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  current_streak INT DEFAULT 0,
  best_streak INT DEFAULT 0,
  last_active DATE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Quiz questions (simple)
CREATE TABLE IF NOT EXISTS quizzes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  question TEXT NOT NULL,
  correct_answer VARCHAR(255) NOT NULL,
  options JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  quiz_id INT NOT NULL,
  selected_answer VARCHAR(255),
  is_correct TINYINT(1) DEFAULT 0,
  score INT DEFAULT 0,
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Sample quizzes
INSERT INTO quizzes (title, question, correct_answer, options)
VALUES
('Genesis 1', 'On which day did God create light?', 'Day 1', JSON_ARRAY('Day 1','Day 2','Day 3','Day 4')),
('Noah', 'What did God command Noah to build?', 'Ark', JSON_ARRAY('Temple','Ark','Tower','Altar'));


CREATE TABLE daily_verses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  verse_date DATE NOT NULL UNIQUE,
  book VARCHAR(50) NOT NULL,
  chapter INT NOT NULL,
  verse INT NOT NULL,
  text TEXT NOT NULL
);

CREATE TABLE reflections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  verse_id INT NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (verse_id) REFERENCES daily_verses(id)
);