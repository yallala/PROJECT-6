/* This file contains the logic for verifying the user's authentication token before sending requests */

/* --- IMPORT --- */
/* Import the 'jsonwebtoken' package to handle token verification */
const jwt = require("jsonwebtoken");

/* EXPORT the authentication middleware */
module.exports = (req, res, next) => {
  try {
    /*
     * Extract the token from the Authorization header in the incoming request.
     * The format of the header is typically: "Bearer <token>", so we split it by space
     * and take the second part (the actual token).
     */
    const token = req.headers.authorization.split(" ")[1];

    /*
     * Verify the token using the secret key 'RANDOM_TOKEN_SECRET'.
     * This ensures that the token is valid and has not been tampered with.
     */
    // JWT_TOKEN=ASKLDFJL4J5JASJKFL398
    const jwtTokenSecret = process.env.JWT_TOKEN;


    const decodedToken = jwt.verify(token, jwtTokenSecret);

    /* Extract the userId from the decoded token */
    const userId = decodedToken.userId;

    /*
     * Attach the userId to the request object (req.auth) so that it can be
     * accessed in the next middleware or route handler.
     */
    req.auth = {
      userId: userId,
    };

    /* Call the next middleware or route handler */
    next();
  } catch (error) {
    /*
     * If there is any issue with token verification (e.g., token is missing,
     * expired, or invalid), respond with a 401 Unauthorized status and an error message.
     */
    res.status(401).json({ error: error.message });
  }
};
