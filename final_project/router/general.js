const express = require("express");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }
  users.push({ username, password });

  return res
    .status(200)
    .json({ message: "Customer successfully registered. You can log in" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  const response = await axios.get("http://localhost:3000/books");
  const books = response.data;

  return res.status(200).json({ books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  axios.get("http://localhost:3000/books").then((response) => {
    const books = response.data;
    const book = books[req.params.isbn];
    return res.status(200).json(book);
  });
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const response = await axios.get("http://localhost:3000/books");
  const numberOfBooks = Object.keys(response.data).length;
  const booksByAuthor = [];
  for (let i = 0; i < numberOfBooks; i++) {
    if (response.data[i + 1].author.includes(req.params.author)) {
      booksByAuthor.push(response.data[i + 1]);
    }
  }
  return res.status(200).json({ booksByAuthor });
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const response = await axios.get("http://localhost:3000/books");
  const numberOfBooks = Object.keys(response.data).length;
  const booksByTitle = [];
  for (let i = 0; i < numberOfBooks; i++) {
    if (response.data[i + 1].title.includes(req.params.title)) {
      booksByTitle.push(response.data[i + 1]);
    }
  }
  return res.status(200).json({ booksByTitle });
});

//  Get book review
public_users.get("/review/:isbn", async function (req, res) {
  const response = await axios.get("http://localhost:3000/books");
  const books = response.data;
  const bookReviews = books[req.params.isbn].reviews;
  return res.status(200).json(bookReviews);
});

module.exports.general = public_users;
