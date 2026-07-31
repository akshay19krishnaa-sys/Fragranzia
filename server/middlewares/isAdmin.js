const User = require("../models/user/user");

const isAdmin = async (req, res, next) => {
  try {

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = isAdmin;