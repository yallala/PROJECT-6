/* This file contains the schema for sauce data, to be used with the MongoDB Atlas database */

/* --- IMPORT --- */
/* Import the 'Mongoose' package for working with MongoDB in Node.js */
const mongoose = require("mongoose");

/* --- SCHEMA --- */
/* Schema for sauce data */
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true }, // ID of the user who created the sauce
  name: { type: String, required: true, trim: true }, // Name of the sauce, trimming spaces
  manufacturer: { type: String, required: true, trim: true }, // Manufacturer of the sauce, trimming spaces
  description: { type: String, required: true, trim: true }, // Description of the sauce, trimming spaces
  mainPepper: { type: String, required: true, trim: true }, // Main ingredient (pepper) in the sauce, trimming spaces
  imageUrl: { type: String, required: true }, // URL of the sauce image
  heat: { type: Number, required: true, min: 1, max: 10 }, // Spiciness level of the sauce, from 1 to 10
  likes: { type: Number, required: true, default: 0 }, // Number of likes the sauce has received, default is 0
  dislikes: { type: Number, required: true, default: 0 }, // Number of dislikes the sauce has received, default is 0
  usersLiked: { type: [String], required: true, default: [] }, // Array of user IDs who liked the sauce
  usersDisliked: { type: [String], required: true, default: [] }, // Array of user IDs who disliked the sauce
});

/* EXPORT the sauce schema */
module.exports = mongoose.model("Sauce", sauceSchema);
