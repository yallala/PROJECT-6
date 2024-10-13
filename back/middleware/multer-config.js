/* This file contains the logic for handling incoming files in HTTP requests */

/* --- IMPORT --- */
/* Import the 'multer' package for handling file uploads */
const multer = require("multer");

/* MIME type dictionary, which defines the acceptable file types */
const MIME_TYPES = {
  "image/jpg": "jpg", // Accepts JPG image files
  "image/jpeg": "jpg", // Accepts JPEG image files
  "image/png": "png", // Accepts PNG image files
};

/* Configuration for multer to specify where to save incoming files */
const storage = multer.diskStorage({
  /*
   * 'destination' defines the folder where the uploaded files will be stored.
   * In this case, files will be saved in the 'images' folder.
   */
  destination: (req, file, callback) => {
    callback(null, "images"); // Save files to the 'images' folder
  },

  /*
   * 'filename' defines the name format for uploaded files.
   * It creates a unique filename by replacing spaces in the original file name with underscores
   * and appending the current timestamp to avoid overwriting files with the same name.
   */
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_"); // Replace spaces with underscores
    const extension = MIME_TYPES[file.mimetype]; // Get the file extension based on its MIME type
    callback(null, name + Date.now() + "." + extension); // Create a unique filename
  },
});

/* EXPORT the middleware for handling image storage */
/*
 * This middleware uses multer to handle file uploads.
 * The 'single' method specifies that it handles single file uploads,
 * and the field name in the form should be 'image'.
 */
module.exports = multer({ storage }).single("image");
