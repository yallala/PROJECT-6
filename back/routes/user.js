// In user routes, we have login and signup paths

/* This file contains the logic for user-related routes. */

/* --- IMPORT --- */
/* Import the 'express' package to create the router */
const express = require("express");
/* Import the user controllers, which contain the logic for user actions */
const userCtrl = require("../controllers/user");
/* Load the router function from express */
const router = express.Router();

/* --- Route Logic --- */
/* Route for user signup (creating a new user) */
router.post("/signup", userCtrl.signup);

/* Route for user login (user authentication) */
router.post("/login", userCtrl.login);

/* EXPORT the routes */
module.exports = router;
