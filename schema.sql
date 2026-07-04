-- College Portal Database Schema
CREATE DATABASE IF NOT EXISTS college_portal;
USE college_portal;

-- Drop existing tables to ensure a clean setup (in reverse order of dependencies)
DROP TABLE IF EXISTS announcements;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

-- 1. Roles table
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Populate roles
INSERT INTO roles (name) VALUES ('student'), ('faculty'), ('admin');

-- 2. Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  branch VARCHAR(100),
  year INT,
  semester INT,
  avatar VARCHAR(500),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
  INDEX idx_email (email),
  INDEX idx_role (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Notes table
CREATE TABLE notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  subject VARCHAR(100) NOT NULL,
  branch VARCHAR(100) NOT NULL,
  semester INT NOT NULL,
  file_url VARCHAR(500),
  faculty_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (faculty_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notes_filter (branch, semester, subject)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Assignments table
CREATE TABLE assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  subject VARCHAR(100) NOT NULL,
  branch VARCHAR(100) NOT NULL,
  semester INT NOT NULL,
  file_url VARCHAR(500),
  deadline DATETIME NOT NULL,
  faculty_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (faculty_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_assignments_filter (branch, semester, subject),
  INDEX idx_deadline (deadline)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Announcements table
CREATE TABLE announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  posted_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_announcements_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
