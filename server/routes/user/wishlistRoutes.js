const express = require("express");
const router = express.Router();

const checkAuth = require("../../middlewares/checkAuth");

const {
  addToWishlist,getWishlist,removeFromWishlist,toggleWishlist
} = require("../../controllers/user/wishlistController");

router.post("/addwish", checkAuth, addToWishlist);
router.get("/get", checkAuth, getWishlist);
router.delete("/remove/:productId", checkAuth, removeFromWishlist);
router.post("/toggle", checkAuth, toggleWishlist);

module.exports = router;