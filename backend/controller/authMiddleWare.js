const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  // Allow preflight OPTIONS requests to bypass auth check
  if (req.method === "OPTIONS") {
    return next();
  }

  const authHeader =
  req.headers.authorization ||
  req.headers["x-auth-token"] ||
  req.headers.token;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token =
  authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;