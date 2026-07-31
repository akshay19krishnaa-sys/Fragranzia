const User = require("../../models/user/user");

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.userId);

    // Check if product already exists in wishlist
    const exists = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (exists) {
      return res.json({
        message: "Already in wishlist",
        wishlist: user.wishlist,
      });
    }

    // Add only if it doesn't exist
    user.wishlist.push(productId);
    await user.save();

    res.json({
      message: "Added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getWishlist = async (req, res) => {
  try {

    const user = await User.findById(req.userId)
      .populate("wishlist");


    const uniqueWishlist = [
      ...new Map(
        user.wishlist.map(item => [
          item._id.toString(),
          item
        ])
      ).values()
    ];


    res.json({
      wishlist: uniqueWishlist,
    });


  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const productId = req.params.productId;

    const user = await User.findById(req.userId);

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );

    await user.save();

    res.json({
      message: "Removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const productId = req.body.productId;

    const user = await User.findById(req.userId);

    const exists = user.wishlist.includes(productId);

    if (exists) {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== productId
      );
    } else {
      user.wishlist.push(productId);
    }

    await user.save();

    res.json({
      message: "Wishlist updated",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { addToWishlist,removeFromWishlist,getWishlist,toggleWishlist };