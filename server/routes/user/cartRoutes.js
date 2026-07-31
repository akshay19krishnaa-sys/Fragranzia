const express = require("express");
const   router = express.Router();

const checkAuth = require("../../middlewares/checkAuth");

const {addToCart,getCart,removeFromCart,increaseQty,decreaseQty ,clearCart} = require("../../controllers/user/cartController");

router.post("/add", checkAuth, addToCart);
router.get("/getcart", checkAuth, getCart);
router.delete("/remove/:productId",checkAuth, removeFromCart);
router.put("/increase/:productId",checkAuth, increaseQty);
router.put("/decrease/:productId",checkAuth, decreaseQty);
router.delete("/clear", checkAuth, clearCart);

// console.log("Cart route loaded");

module.exports = router;