const express = require("express");
const jwt = require("jsonwebtoken");
const books = require("../booksdb.js");

const authenticated = express.Router();
const users = [];
const jwtSecret = "book-review-jwt-secret";

function isValid(username) {
  return users.some((user) => user.username === username);
}

function authenticatedUser(username, password) {
  return users.some((user) => user.username === username && user.password === password);
}

authenticated.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists." });
  }

  users.push({ username, password });
  return res.status(201).json({ message: `User ${username} successfully registered. Now you can login.` });
});

authenticated.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const token = jwt.sign({ username }, jwtSecret, { expiresIn: "1h" });
  req.session.authorization = { accessToken: token, username };

  return res.status(200).json({ message: "User successfully logged in", username, token });
});

authenticated.use((req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : req.session.authorization?.accessToken;

  if (!token) {
    return res.status(403).json({ message: "Authentication token is required." });
  }

  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch (_error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
});

authenticated.put("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found for the requested ISBN" });
  }

  book.reviews[req.user.username] = req.body.review;
  return res.status(200).json({
    message: "Review successfully added or updated.",
    reviews: book.reviews
  });
});

authenticated.delete("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found for the requested ISBN" });
  }

  delete book.reviews[req.user.username];
  return res.status(200).json({ message: "Review successfully deleted." });
});

module.exports.authenticated = authenticated;
