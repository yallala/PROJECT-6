// In user model, we made our Schema

/* This file contains the schema for user data, to be used with the MongoDB Atlas database */

/* --- IMPORT --- */
/* Import the 'Mongoose' package for working with MongoDB in Node.js */
const mongoose = require("mongoose");
/* Import the 'mongoose-unique-validator' package to enforce unique fields in the schema */
const uniqueValidator = require("mongoose-unique-validator");

/* --- SCHEMA --- */
/* Schema for user data */
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Email of the user, must be unique
  password: { type: String, required: true }, // Password of the user
});

/* --- PLUG-IN --- */
/* Apply the uniqueValidator plugin to ensure that the email is unique in the database */
userSchema.plugin(uniqueValidator);

/* EXPORT the user schema */
module.exports = mongoose.model("User", userSchema);