const jwt = require("jsonwebtoken");
const User = require("../models");

const authenticateUser = async (req, res, next) => {
  try {
    const accessToken = req.header("accessToken");

    if (!accessToken) {
      return res
        .status(401)
        .send({ message: "Authentication Invalid: No token provided" });
    }

    const decoded = jwt.verify(accessToken, process.env.TOKEN_SECRET);

    if (!decoded.user) {
      return res
        .status(401)
        .send({ message: "Authentication Invalid: No user in token" });
    }

    req.user = { id: decoded.user.id };

    // Fetch the user's role from the database
    const user = await User.findByPk(req.user.id, { attributes: ["role"] });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    req.user.role = user.role;
    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

const authenticate = async (req, res, next) => {
  try {
    let accessToken = req.header("accessToken");

    // Check if token exists
    if (!accessToken) {
      return res.status(403).send({
        success: false,
        msg: "Please login first!",
      });
    }

    // Verify the access token
    const isValidAccessToken = jwt.verify(
      accessToken,
      process.env.TOKEN_SECRET
    );

    if (!isValidAccessToken) {
      return res.status(403).send({
        success: false,
        message: "Invalid access token",
      });
    }

    req.user = {
      user: isValidAccessToken.user, // assuming 'user' is part of the token payload
      role: isValidAccessToken.role,
    };

    // Proceed to the next middleware
    next();
  } catch (err) {
    return res.status(500).send({
      success: false,
      msg: err.message, // Improved error message handling
    });
  }
};
/////
module.exports = { authenticate, authenticateUser };
