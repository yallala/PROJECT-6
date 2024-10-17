const { Model } = require("mongoose");
const Sauce = require("../models/sauce");
const fs = require("fs");
const { routes } = require("../app");
const { error } = require("console");


exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
      }`,
  });

  if (sauce.userId === req.auth.userId) {
    sauce
      .save()
      .then(() =>
        res.status(201).json({ message: "Sauce created successfully!" })
      )
      .catch((error) => res.status(403).json({ error }));
  } else {
    res.status(401).json({ error: "Unauthorized creation!" });
  }
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({ error: "Sauce not found!" });
      }
      if (sauce.userId !== req.auth.userId) {
        return res.status(401).json({ error: "Unauthorized request!" });
      }
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce deleted!" }))
          .catch((error) => res.status(403).json({ error }));
      });
    })
    .catch((error) => res.status(400).json({ error }));
};

// exports.modifySauce = (req, res, next) => {
//   Sauce.findOne({ _id: req.params.id }).then((sauce) => {
//     const sauceObject = req.file ?
//       {
//         ...JSON.parse(req.body.sauce),
//         imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
//           }`,
//       }
//       :
//       { ...req.body };

//     if (sauceObject.userId && sauceObject.userId !== sauce.userId) {
//       res.status(401).json({ error: "Unauthorized modification!" });
//     }

//     if (!sauce) {
//       return res.status(404).json({ error: "Sauce not found!" });
//     }

//     if (req.file) {
//       Sauce.findOne({ _id: req.params.id })
//         .then((sauce) => {
//           const filename = sauce.imageUrl.split("/images/")[1];
//           fs.unlink(`images/${filename}`, (error) => {
//             if (error) {
//               throw new Error(error);
//             }
//           });
//         })
//         .catch((error) => res.status(400).json({ error: error.message }));
//     }

//     Sauce.updateOne(
//       { _id: req.params.id },
//       { ...sauceObject, _id: req.params.id }
//     )
//       .then(() =>
//         res.status(200).json({ message: "Sauce updated successfully!" })
//       )
//       .catch((error) => res.status(400).json({ error }));
//   });
// };



exports.modifySauce = (req, res, next) => {
  // Check if a new file (image) is uploaded
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : { ...req.body };  // If no file is uploaded, just modify the text fields

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Check if the user is authorized to modify the sauce
      if (sauce.userId !== req.auth.userId) {
        return res.status(403).json({ message: "Unauthorized request" });
      }

      // If a new file (image) is uploaded, delete the old image
      // if (req.file) {
      //   const filename = sauce.imageUrl.split("/images/")[1];  // Extract the old image filename
      //   fs.unlink(`images/${filename}`, (err) => {
      //     if (err) throw new Error(err);  // Handle file deletion error
      //   });
      // }

      if (req.file && sauce.imageUrl) {  // Ensure that an image exists before trying to delete it
        const filename = sauce.imageUrl.split("/images/")[1];  // Extract the old image filename
      
        if (filename) {  // Check if the filename is valid (not undefined)
          fs.unlink(`images/${filename}`, (err) => {
            if (err && err.code !== 'ENOENT') {  // Only throw an error if it's not 'file not found'
              throw new Error(err);  
            }
          });
        }
      }
      

      // Proceed with the update
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Sauce updated!" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};




exports.likeASauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({ message: "Sauce not found!" });
      }

      let usersLiked = sauce.usersLiked;
      let usersDisliked = sauce.usersDisliked;

      switch (req.body.like) {
        case 1:
          if (!usersLiked.includes(req.body.userId)) {
            usersLiked.push(req.body.userId);
          } else {
            return res.status(400).json({ error: "User already liked this sauce!" });
          }
          if (usersDisliked.includes(req.body.userId)) {
            return res.status(400).json({ error: "Remove dislike before liking!" });
          }
          break;

        case -1:
          if (!usersDisliked.includes(req.body.userId)) {
            usersDisliked.push(req.body.userId);
          } else {
            return res.status(400).json({ error: "User already disliked this sauce!" });
          }
          if (usersLiked.includes(req.body.userId)) {
            return res.status(400).json({ error: "Remove like before disliking!" });
          }
          break;

        case 0:
          if (usersLiked.includes(req.body.userId)) {
            usersLiked = usersLiked.filter(user => user !== req.body.userId);
          } else if (usersDisliked.includes(req.body.userId)) {
            usersDisliked = usersDisliked.filter(user => user !== req.body.userId);
          } else {
            return res.status(400).json({ error: "User has no like or dislike to cancel!" });
          }
          break;

        default:
          return res.status(400).json({ error: "Invalid like value!" });
      }

      const likes = usersLiked.length;
      const dislikes = usersDisliked.length;

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


