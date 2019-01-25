require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtKey = require("../_secrets/keys").jwtKey;

// quickly see what this file exports
module.exports = {
  authenticate,
  generateToken
};

function generateToken(user) {
  const payload = {
    username: user.username
  };
  const secret = jwtKey;

  const options = {
    expiresIn: "10m"
  };
  return jwt.sign(payload, secret, options);
}

// implementation details
function authenticate(req, res, next) {
  const token = req.get("Authorization");

  if (token) {
    jwt.verify(token, jwtKey, (err, decodedToken) => {
      if (err) {
        res.status(401).json(err);
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    });
  } else {
    return res.status(401).json({
      error: "No token provided, must be set on the Authorization Header"
    });
  }
}
