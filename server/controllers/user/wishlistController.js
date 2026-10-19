const mongoose = require("mongoose");
const User = require("../../models/user/user");
const { Product } = require("../../models/products/product");

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid or missing product ID",
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!Array.isArray(user.wishlist)) {
      user.wishlist = [];
    }

    // Filter out null or undefined entries
    user.wishlist = user.wishlist.filter((id) => id);

    const exists = user.wishlist.some(
      (id) => id && id.toString() === productId.toString()
    );

    if (exists) {
      return res.json({
        message: "Already in wishlist",
        wishlist: user.wishlist,
      });
    }

    user.wishlist.push(productId);
    await user.save();

    res.json({
      message: "Added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("addToWishlist error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("wishlist");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!Array.isArray(user.wishlist)) {
      return res.json({ wishlist: [] });
    }

    // Filter out null/deleted products from populate
    const validWishlist = user.wishlist.filter((item) => item && item._id);

    // Clean up stale IDs in DB if any referenced products were deleted
    if (validWishlist.length !== user.wishlist.length) {
      user.wishlist = validWishlist.map((item) => item._id);
      await user.save();
    }

    // De-duplicate by _id
    const uniqueWishlist = [
      ...new Map(
        validWishlist.map((item) => [item._id.toString(), item])
      ).values(),
    ];

    res.json({
      wishlist: uniqueWishlist,
    });
  } catch (error) {
    console.error("getWishlist error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const productId = req.params.productId;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid or missing product ID",
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!Array.isArray(user.wishlist)) {
      user.wishlist = [];
    }

    user.wishlist = user.wishlist.filter(
      (id) => id && id.toString() !== productId.toString()
    );

    await user.save();

    res.json({
      message: "Removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("removeFromWishlist error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid or missing product ID",
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!Array.isArray(user.wishlist)) {
      user.wishlist = [];
    }

    // Filter out null or corrupted entries
    user.wishlist = user.wishlist.filter((id) => id);

    const exists = user.wishlist.some(
      (id) => id && id.toString() === productId.toString()
    );

    if (exists) {
      user.wishlist = user.wishlist.filter(
        (id) => id && id.toString() !== productId.toString()
      );
    } else {
      user.wishlist.push(productId);
    }

    await user.save();

    res.json({
      message: exists ? "Removed from wishlist" : "Added to wishlist",
      wishlist: user.wishlist,
      isInWishlist: !exists,
    });
  } catch (error) {
    console.error("toggleWishlist error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { addToWishlist, removeFromWishlist, getWishlist, toggleWishlist };