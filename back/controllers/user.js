// In user controllers, all the code that need to write to control the user (how the user can be handle, what can be done with their CredentialsContainer, hash password)

/* This file contains the business logic for user management */

/* --- IMPORT --- */
/* Import the 'bcrypt' package for password hashing */
const bcrypt = require("bcrypt");
/* Import the 'jsonwebtoken' package for creating and verifying tokens */
const jwt = require("jsonwebtoken");
/* Import the User model */
const User = require("../models/user");

/* EXPORT: Business logic for user signup (registration) */
exports.signup = (req, res, next) => {
  /* Hash the user's password with a salt (hashing the password 10 times for security) */
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      /* Create a new user instance with the hashed password */
      const user = new User({
        email: req.body.email, // Store the email from the request
        password: hash, // Store the hashed password
      });
      /* Save the new user to the database */
      user
        .save()
        .then(() =>
          res.status(201).json({ message: "New user created successfully!" })
        ) // Respond with success when the user is created
        .catch((error) => res.status(400).json({ error })); // Handle any errors during saving
    })
    .catch((error) => res.status(500).json({ error })); // Handle errors during password hashing
};

/* EXPORT: Business logic for user login (authentication) */
exports.login = (req, res, next) => {
  /* Find the user in the database by email */
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        /* If no user is found, respond with a 401 Unauthorized status */
        return res
          .status(401)
          .json({ message: "Incorrect email or password!" });
      }
      /* Compare the entered password with the hashed password in the database */
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            /* If the password is invalid, respond with a 401 Unauthorized status */
            return res
              .status(401)
              .json({ message: "Incorrect email or password!" });
          }
          /* If the password is valid, respond with a 200 status and generate a token */
          res.status(200).json({
            userId: user._id, // Return the user's ID
            /* Generate a JWT (JSON Web Token) that includes the userId and expires in 24 hours */
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error })); // Handle any errors during password comparison
    })
    .catch((error) => res.status(500).json({ error })); // Handle any errors during user lookup
};
