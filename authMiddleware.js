const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET || "default_secret_key"; // Use environment variable

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401); // Unauthorized (no token provided)
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired" });
      } else {
        return res.status(403).json({ message: "Invalid token" });
      }
    }
    
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
