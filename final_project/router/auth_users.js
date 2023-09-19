const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const bcrypt = require('bcrypt');
const regd_users = express.Router();


let users = [{username: "John", password: "1234"}];

const secretKey = 'super_duper_secret_key';

const usernameIsValid = (username, users)=>{ 
  if (username.length === 0 || !/^[a-zA-Z0-9]+$/.test(username)) {
    console.log("Invaid Username. Please use only letters and numbers.");
    return false;
  }

  console.log("Valid Username.");
  return true;

}

const passwordIsValid = (password, users)=>{ 
  if (password.length === 0 || !/^[a-zA-Z0-9.,!*)]+$/.test(password)) {
    console.log("Invaid Password. Please use only letters and numbers for now.");
    return false;
  }
  console.log("Valid Password.");
  return true;

}

const jwtAuth = (req, res, next) => {
  const tokenBearer = req.header('Authorization');
  const tokenParts = tokenBearer.split('Bearer ');
  const token = tokenParts[1];

  if (!token) {
    return res.status(401).json({ message: "You must be signed in to do that." });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    console.log(decoded);
    if (err) {
      console.log(token);
      console.log(secretKey);
      return res.status(401).json({ message: "Invalid Token." });
    }
    req.user = decoded;
    next();
  });
}


const registeredUser = (username, password) => {
  const user = users.find((user) => user.username === username);
  console.log(user);
  if (user && bcrypt.compareSync(password, user.password)) {
    return true;
  }

  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("we made it to login baby");
  console.log( username, password );

  if (registeredUser(username, password)) {
    const user = users.find((user) => user.username === username);
    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
    res.status(200).json({ message: 'Authentication successful', token });

  } else {
    console.log("Authentication failed.");
    res.status(401).json({ message: "Authentication failed. User not found or incorrect password." });

  }
});

// Add a book review
regd_users.put("/review/:isbn", jwtAuth, (req, res) => {
  const { isbn } = req.params;
  const { comment, user } = req.body;

  if (!comment || !user) {
    return res.status(400).json({ message: "Invalid review data" });
  }

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const existingReviewIndex = book.reviews.findIndex((review) => review.user === user);
  
  if (existingReviewIndex !== -1) {
    book.reviews[existingReviewIndex].comment = comment;
    return res.status(200).json({ message: "Review updated successfully", review: book.reviews[existingReviewIndex] });

  } else {
    const newReview = {
      user,
      comment,
    };

    book.reviews.push(newReview);

    return res.status(200).json({ message: "Review added successfully", review: newReview });
  }
});

// Delete a user review
regd_users.delete("/review/:isbn", jwtAuth, (req, res) => {
  const { isbn } = req.params;
  const user = req.user.username;

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const reviewIndex = book.reviews.findIndex((review) => review.user === user);

  if (reviewIndex === -1) {
    return res.status(404).json({ message: "Review not found" });
  }

  const deletedReview = book.reviews.splice(reviewIndex, 1)[0];

  return res.status(200).json({ message: "Review deleted successfully", deletedReview });
});



module.exports.authenticated = regd_users;
module.exports.usernameIsValid = usernameIsValid;
module.exports.passwordIsValid = passwordIsValid;
module.exports.users = users;
