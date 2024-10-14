
const express = require("express");
const mongoose = require("mongoose");


/* Provides access to file paths, used for serving static files */
const path = require("path");

const app = express();
const url = process.env.DB_URL;
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");


// Middleware
app.use(express.json());

/* --- DATABASE --- */
/* Connection to the MongoDB Atlas database */

// MongoDB Connection

mongoose.connect(url)
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch((error) => {
        console.log('Unable to connect to MongoDB Atlas!');
        console.error(error);
    });

    

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow access from any origin
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  ); // Allow specific headers
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

/* --- ROUTES SETTINGS --- */
/*
 * Serve static files from the 'images' folder when a request is made
 * to the '/images' route. For example, requests like '/images/pic.jpg'
 * will fetch files from the images folder.
 */
app.use("/images", express.static(path.join(__dirname, "images")));

/*
 * Set up routes for handling user-related requests.
 * The '/api/auth' route handles requests like user authentication (login, signup).
 */
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);


/* EXPORT the express application to be used in other files (like the server) */
module.exports = app;