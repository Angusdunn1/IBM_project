const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 10: Get all books using async/await
public_users.get('/async/books', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000'); 
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch books', error: error.message });
    }
});

// Task 11: Get book details by ISBN using Promises
public_users.get('/async/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    axios.get(`http://localhost:5000/isbn/${isbn}`) 
        .then((response) => {
            res.status(200).json(response.data);
        })
        .catch((error) => {
            res.status(404).json({ message: 'Book not found', error: error.message });
        });
});

// Task 12: Get books by author using async/await
public_users.get('/async/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`); 
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: 'No books found for the given author', error: error.message });
    }
});

// Task 13: Get books by title using Promises
public_users.get('/async/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();
    axios.get(`http://localhost:5000/title/${title}`) 
        .then((response) => {
            res.status(200).json(response.data);
        })
        .catch((error) => {
            res.status(404).json({ message: 'No books found for the given title', error: error.message });
        });
});

// Existing Routes
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users.find((user) => user.username === username)) {
        return res.status(400).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(JSON.stringify(books[isbn], null, 4));
    } else {
        res.status(404).send({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const filteredBooks = Object.values(books).filter((book) => book.author === author);
    if (filteredBooks.length > 0) {
        res.send(JSON.stringify(filteredBooks, null, 4));
    } else {
        res.status(404).send({ message: "No books found for the given author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    const filteredBooks = Object.values(books).filter((book) =>
        book.title.toLowerCase().includes(title)
    );
    if (filteredBooks.length > 0) {
        res.send(JSON.stringify(filteredBooks, null, 4));
    } else {
        res.status(404).send({ message: "No books found for the given title" });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn] && books[isbn].reviews) {
        res.send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        res.status(404).send({ message: "No reviews found for the given ISBN" });
    }
});

module.exports.general = public_users;

