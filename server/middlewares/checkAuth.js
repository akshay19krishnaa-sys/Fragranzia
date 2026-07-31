const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No Token" });
    }

    // 🔥 FIX: remove "Bearer "
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No Token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 IMPORTANT: your JWT uses { id: user._id }
    req.userId = decoded._id;
    console.log("AUTH HEADER:", req.headers.authorization);

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not Authorized" });
  }
};

module.exports = checkAuth;