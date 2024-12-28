const express = require("express");
const jwt = require("jsonwebtoken");
const books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return !users.some((user) => user.username === username) && username !== "";
};

const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!authenticatedUser(username, password)) {
    res.status(400).json({ message: "Invalid username/password" });
  }

  const token = jwt.sign({ username }, process.env.TOKEN_SECRET, {
    expiresIn: "1h",
  });

  return res
    .status(200)
    .json({ message: "Customer successfully logged in", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  books[req.params.isbn].reviews[req.username] = req.query.review;

  return res.status(200).json({
    message:
      "The review for the book with ISBN " +
      req.params.isbn +
      " has been added/updated",
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  delete books[req.params.isbn].reviews[req.username];

  return res.status(200).json({
    message:
      "The review for the book with ISBN " +
      req.params.isbn +
      " posted by the user " +
      res.username +
      " has been deleted",
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
