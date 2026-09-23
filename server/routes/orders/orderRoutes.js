const express = require("express");

const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  cancelOrder,
  approveReturn,
  rejectReturn,
  requestReturn,
  createRazorpayOrder,
  verifyRazorpayPayment
} = require("../../controllers/orders/orderController");

const checkAuth = require("../../middlewares/checkAuth");

const isAdmin = require("../../middlewares/isAdmin");

const router = express.Router();


// Create order
router.post(
  "/",
  checkAuth,
  createOrder
);


// User orders
router.get(
  "/myorders",
  checkAuth,
  getUserOrders
);


// Admin all orders
router.get(
  "/",
  checkAuth,
  getAllOrders
);


// User cancel order
router.put(
  "/cancel/:id",
  checkAuth,
  cancelOrder
);


// User return order


// Admin return routes FIRST
router.put(
  "/return/approve/:id",
  checkAuth,
  isAdmin,
  approveReturn
);

router.put(
  "/return/reject/:id",
  checkAuth,
  isAdmin,
  rejectReturn
);

// User return route LAST
router.put(
  "/return/:id",
  checkAuth,
  requestReturn
);


// Admin update status
router.put(
  "/status/:id",
  checkAuth,
  updateOrderStatus
);


// Single order
router.get(
  "/:id",
  checkAuth,
  getOrderById
);

router.post("/razorpay/create-order", createRazorpayOrder);

router.post(
  "/razorpay/verify-payment",
  checkAuth,
  verifyRazorpayPayment
);



module.exports = router;