/* This file contains the business logic for managing sauces */

/* --- IMPORT --- */
/* Import the Sauce model */
const { Model } = require("mongoose");
const Sauce = require("../models/sauce");
/* Import the 'file system' package to manage file operations */
const fs = require("fs");
const { routes } = require("../app");

/* --- CONTROLLERS --- */

/* Create a new sauce */
exports.createSauce = (req, res, next) => {
  /* Parse the sauce data from the request body (the sauce is sent as a string) */
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id; // Remove the _id field, as MongoDB will generate one automatically

  /* Create a new Sauce instance using the parsed object */
  const sauce = new Sauce({
    /* Use the spread operator (...) to copy all the properties from sauceObject */
    ...sauceObject,
    /* Configure the image URL using the protocol (http/https) and host */
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  /* Check if the authenticated user is allowed to create the sauce */
  if (sauce.userId === req.auth.userId) {
    sauce
      .save() // Save the new sauce to the database
      .then(() =>
        res.status(201).json({ message: "Sauce created successfully!" })
      )
      .catch((error) => res.status(403).json({ error })); // Forbidden if saving fails
  } else {
    res.status(401).json({ error: "Unauthorized creation!" }); // Unauthorized if the userId doesn't match
  }
};

/* Get all sauces */
exports.getAllSauces = (req, res, next) => {
  Sauce.find() // Fetch all sauces from the database
    .then((sauces) => res.status(200).json(sauces)) // Return the sauces in the response
    .catch((error) => res.status(404).json({ error })); // Error if not found
};

/* Get a single sauce by ID */
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) // Fetch the sauce with the given ID
    .then((sauce) => res.status(200).json(sauce)) // Return the sauce in the response
    .catch((error) => res.status(404).json({ error })); // Error if not found
};

/* Delete a sauce */
exports.deleteSauce = (req, res, next) => {
  /* Find the sauce by ID in the request parameters */
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      /* Check if the sauce exists */
      if (!sauce) {
        return res.status(404).json({ error: "Sauce not found!" });
      }
      /* Ensure the authenticated user is authorized to delete the sauce */
      if (sauce.userId !== req.auth.userId) {
        return res.status(401).json({ error: "Unauthorized request!" });
      }
      const filename = sauce.imageUrl.split("/images/")[1]; // Extract the image file name from the URL
      /* Delete the image from the local file system */
      fs.unlink(`images/${filename}`, () => {
        /* After the image is deleted, delete the sauce from the database */
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce deleted!" }))
          .catch((error) => res.status(403).json({ error })); // Forbidden if deletion fails
      });
    })
    .catch((error) => res.status(400).json({ error })); // Error if something goes wrong
};

/* Modify an existing sauce */
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    /* Store the modifications to the sauce */
    const sauceObject = req.file
      ? /* If a new image file is uploaded */
        {
          /* Parse the new sauce data and update the image URL */
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : /* If no new image is uploaded, only update the sauce data */
        { ...req.body };

    /* Ensure the authenticated user is authorized to modify the sauce */
    if (sauceObject.userId && sauceObject.userId !== sauce.userId) {
      res.status(401).json({ error: "Unauthorized modification!" });
    }

    if (!sauce) {
      return res.status(404).json({ error: "Sauce not found!" });
    }

    /* If a new image was uploaded, delete the old image from the file system */
    if (req.file) {
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          const filename = sauce.imageUrl.split("/images/")[1]; // Extract the old image file name
          fs.unlink(`images/${filename}`, (error) => {
            if (error) {
              throw new Error(error);
            }
          });
        })
        .catch((error) => res.status(400).json({ error: error.message }));
    }

    /* Update the sauce in the database */
    Sauce.updateOne(
      { _id: req.params.id }, // Find the sauce to modify by ID
      { ...sauceObject, _id: req.params.id } // Update the sauce with new data
    )
      .then(() =>
        res.status(200).json({ message: "Sauce updated successfully!" })
      )
      .catch((error) => res.status(400).json({ error })); // Error if updating fails
  });
};

/* Handle sauce like/dislike */
exports.likeASauce = (req, res, next) => {
  /* Find the sauce in the database by ID */
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({ message: "Sauce not found!" });
      }

      /* Initialize variables to track the sauce's like/dislike status */
      let usersLiked = sauce.usersLiked;
      let usersDisliked = sauce.usersDisliked;

      /* Handle different cases based on the value of 'like' in the request body */
      switch (req.body.like) {
        /* If req.body.like = 1, the user likes the sauce */
        case 1:
          if (!usersLiked.includes(req.body.userId)) {
            usersLiked.push(req.body.userId); // Add user to usersLiked array
          } else {
            return res.status(400).json({ error: "User already liked this sauce!" });
          }
          if (usersDisliked.includes(req.body.userId)) {
            return res.status(400).json({ error: "Remove dislike before liking!" });
          }
          break;

        /* If req.body.like = -1, the user dislikes the sauce */
        case -1:
          if (!usersDisliked.includes(req.body.userId)) {
            usersDisliked.push(req.body.userId); // Add user to usersDisliked array
          } else {
            return res.status(400).json({ error: "User already disliked this sauce!" });
          }
          if (usersLiked.includes(req.body.userId)) {
            return res.status(400).json({ error: "Remove like before disliking!" });
          }
          break;

        /* If req.body.like = 0, the user is canceling their like or dislike */
        case 0:
          if (usersLiked.includes(req.body.userId)) {
            usersLiked = usersLiked.filter(user => user !== req.body.userId); // Remove user from usersLiked array
          } else if (usersDisliked.includes(req.body.userId)) {
            usersDisliked = usersDisliked.filter(user => user !== req.body.userId); // Remove user from usersDisliked array
          } else {
            return res.status(400).json({ error: "User has no like or dislike to cancel!" });
          }
          break;

        default:
          return res.status(400).json({ error: "Invalid like value!" });
      }

      /* Calculate the total number of likes and dislikes */
      const likes = usersLiked.length;
      const dislikes = usersDisliked.length;

      /* Update the sauce with the new like/dislike status */
      Sauce.updateOne(
        { _id: req.params.id },
        {
          $set: {
            usersLiked: usersLiked,
            usersDisliked: usersDisliked,
            likes: likes,
            dislikes: dislikes,
          },
        }
      )
        .then(() => res.status(200).json({ message: "Sauce rating updated!" }))
        .catch((error) => res.status(400).json({ error: error.message }));
    })
    .catch((error) => res.status(400).json({ error: error.message }));
};


// Model
// CONTROLLER
// routes