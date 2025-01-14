const jwt = require("jsonwebtoken"); 

function userMiddleware(req, res, next) {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({ message: "Token is required for authentication" });
  }

  try {
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifyToken.id;
    next();
  } catch (error) {
    console.error("Invalid token:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = userMiddleware;