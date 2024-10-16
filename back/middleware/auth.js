const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const jwtTokenSecret = process.env.JWT_TOKEN;
    const decodedToken = jwt.verify(token, jwtTokenSecret);
    const userId = decodedToken.userId;

    req.auth = {
      userId: userId,
    };

    next();
  } catch (error) {

    res.status(401).json({ error: error.message });
  }
};
