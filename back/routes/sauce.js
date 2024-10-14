// TODO Code sauceroute using userroute as sample guide
/* This file contains the logic for sauce-related routes. */

/* --- IMPORT --- */
/* Import the 'express' package to create the router */
const express = require("express");
/* Load the router function from express */
const router = express.Router();
/* Import the sauce controllers which contain the logic for each route */
const sauceCtrl = require("../controllers/sauce");
/* Import the authentication middleware */
const auth = require("../middleware/auth");
/* Import the "multer" middleware for handling file uploads */
const multer = require("../middleware/multer-config");

/* --- Route Logic --- */
/* Create a new sauce (authentication required and image handling with multer) */
router.post("/", auth, multer, sauceCtrl.createSauce);

/* Retrieve all sauces (authentication required) */
router.get("/", auth, sauceCtrl.getAllSauces);

/* Retrieve a specific sauce by its id (authentication required) */
router.get("/:id", auth, sauceCtrl.getOneSauce);

/* Delete a sauce (authentication required, only the sauce creator can delete) */
router.delete("/:id", auth, sauceCtrl.deleteSauce);

/* Modify a sauce (authentication required and image handling with multer) */
router.put("/:id", auth, multer, sauceCtrl.modifySauce);

/* Like or dislike a sauce (authentication required) */
router.post("/:id/like", auth, sauceCtrl.likeASauce);

/* EXPORT the routes */
module.exports = router;
