const express = require("express");
const router = express.Router();

// Controllers
const { 
    registerUser,
    loginUser,
    getProfile,updateProfile
} = require("../../controllers/user/userController");

const checkAuth = require("../../middlewares/checkAuth");
const upload = require("../../middlewares/upload");

const { addToWishlist } = require("../../controllers/user/wishlistController");
const { addToCart, getCart } = require("../../controllers/user/cartController");


// AUTH
router.post("/register", registerUser);
router.post("/login", loginUser);

// PROFILE 
router.get("/", checkAuth, getProfile);
router.put("/profile", checkAuth, upload.single("image"), updateProfile);

// CART
router.post("/cart", addToCart);
router.get("/cart", getCart);

// WISHLIST
router.post("/addwish", addToWishlist);

module.exports = router;