const express = require('express');
let books = require("./booksdb.js");
const { usernameIsValid, passwordIsValid, users } = require("./auth_users.js")
const bcrypt = require('bcrypt');
const public_users = express.Router();



public_users.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!usernameIsValid(username)) {
    return res.status(409).json({ message: "Username is invalid." });
  }

  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists." });
  }

  if (!passwordIsValid(password)) {
    return res.status(401).json({ message: "Password is invalid." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({ username, password: hashedPassword });
    console.log("User registered successfully");
    console.log(hashedPassword);
    return res.status(201).json({ message: "User registered successfully" });

  } catch (error) {

    console.error("Error while hashing password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


// Get the book list available in the shop
public_users.get('/list',function (req, res) {

  const booksJSON = JSON.stringify(books);

  return res.status(200).json({ message: booksJSON });
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    const bookJSON = JSON.stringify(books[isbn]);

    return res.status(200).json({ message: bookJSON });

  } else {
    return res.status(404).json({ message: "Book not found." });

  }

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

  let authorInput = req.params.author;

  let booksByAuthor = [];

  let bookArray = Object.values(books);

  for (let book of bookArray) {
    if (book.author === authorInput) {
    booksByAuthor.push(book);
    }
  }

  if (booksByAuthor.length === 0){
    return res.status(404).json({ message: "This Author does not exist."});

  } else {
    return res.status(200).json({ message: booksByAuthor });

  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

  let titleInput = req.params.title;

  let bookByTitle = [];

  let bookArray = Object.values(books);

  for (let book of bookArray) {
    if (book.title === titleInput) {
      bookByTitle.push(book);
    }
}
  if (bookByTitle === 0) {
    return res.status(404).json({ message: "Book not found." });

  } else {
    return res.status(200).json({ message: bookByTitle });

}

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
      
      const reviews = books[isbn].reviews;

      const reviewsJSON = JSON.stringify(reviews);

      return res.status(200).json({ reviews: reviewsJSON });
      } else {

      return res.status(404).json({ message: 'Book not found.' });
      }


});

module.exports.general = public_users;
