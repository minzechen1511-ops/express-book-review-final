const express = require("express");
const axios = require("axios");
const booksFallback = require("../booksdb.js");

const general = express.Router();
const booksApiUrl = process.env.BOOKS_API_URL;

async function retrieveBooks() {
  if (booksApiUrl) {
    const response = await axios.get(booksApiUrl);
    return response.data;
  }

  return booksFallback;
}

general.get("/", async (_req, res) => {
  try {
    const books = await retrieveBooks();
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: "Unable to retrieve books", error: error.message });
  }
});

general.get("/isbn/:isbn", async (req, res) => {
  try {
    const books = await retrieveBooks();
    const book = books[req.params.isbn];

    if (!book) {
      return res.status(404).json({ message: "Book not found for the requested ISBN" });
    }

    return res.status(200).json({ [req.params.isbn]: book });
  } catch (error) {
    return res.status(500).json({ message: "Unable to retrieve book by ISBN", error: error.message });
  }
});

general.get("/author/:author", async (req, res) => {
  try {
    const books = await retrieveBooks();
    const requestedAuthor = req.params.author.toLowerCase();
    const matchingBooks = Object.fromEntries(
      Object.entries(books).filter(([_isbn, book]) => book.author.toLowerCase() === requestedAuthor)
    );

    return res.status(200).json(matchingBooks);
  } catch (error) {
    return res.status(500).json({ message: "Unable to retrieve books by author", error: error.message });
  }
});

general.get("/title/:title", async (req, res) => {
  try {
    const books = await retrieveBooks();
    const requestedTitle = req.params.title.toLowerCase();
    const matchingBooks = Object.fromEntries(
      Object.entries(books).filter(([_isbn, book]) => book.title.toLowerCase() === requestedTitle)
    );

    return res.status(200).json(matchingBooks);
  } catch (error) {
    return res.status(500).json({ message: "Unable to retrieve books by title", error: error.message });
  }
});

general.get("/review/:isbn", async (req, res) => {
  try {
    const books = await retrieveBooks();
    const book = books[req.params.isbn];

    if (!book) {
      return res.status(404).json({ message: "Book not found for the requested ISBN" });
    }

    return res.status(200).json(book.reviews);
  } catch (error) {
    return res.status(500).json({ message: "Unable to retrieve book review", error: error.message });
  }
});

module.exports.general = general;
module.exports.retrieveBooks = retrieveBooks;
