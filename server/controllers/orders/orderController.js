const crypto = require("crypto");
const Order = require("../../models/orders/order");
const Address = require("../../models/address/addressModel");
const { Product } = require("../../models/products/product");
const User = require("../../models/user/user");
const razorpay = require("../../config/razorpay");

// Helper to validate and save an order in MongoDB, decrement stock, and clear cart
const saveOrderToDatabase = async ({
  userId,
  items,
  totalAmount,
  addressId,
  paymentMethod,
  paymentStatus,
  status,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  subtotal,
  discount,
  deliveryCharge,
}) => {
  const address = await Address.findById(addressId);
  if (!address) {
    const error = new Error("Delivery address not found");
    error.statusCode = 404;
    throw error;
  }

  if (!items || items.length === 0) {
    const error = new Error("Order items cannot be empty");
    error.statusCode = 400;
    throw error;
  }

  // Stock check and decrement
  for (const item of items) {
    const prodId = item.product?._id || item.product || item.productId;
    if (!prodId) continue;

    const product = await Product.findById(prodId);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    if (product.quantity < item.quantity) {
      const error = new Error(`${product.title} is out of stock.`);
      error.statusCode = 400;
      throw error;
    }

    await Product.findByIdAndUpdate(prodId, {
      $inc: { quantity: -item.quantity },
    });
  }

  const formattedItems = items.map((item) => ({
    productId: item.product?._id || item.product || item.productId,
    productName: item.product?.title || item.productName || "Product",
    productImage: item.product?.images?.[0] || item.productImage || "",
    salePrice: item.product?.salePrice ?? item.salePrice ?? 0,
    quantity: item.quantity,
  }));

  const order = await Order.create({
    userId,
    items: formattedItems,
    totalAmount,
    shippingAddress: {
      fullName: address.fullName,
      phone: address.phone,
      house: address.house,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    },
    paymentMethod: paymentMethod || "cod",
    paymentStatus: paymentStatus || "pending",
    status: status || (paymentStatus === "paid" ? "Processing" : "Pending"),
    razorpayOrderId: razorpayOrderId || "",
    razorpayPaymentId: razorpayPaymentId || "",
    razorpaySignature: razorpaySignature || "",
    subtotal: subtotal !== undefined ? subtotal : totalAmount,
    discount: discount || 0,
    deliveryCharge: deliveryCharge || 0,
  });

  // Clear user's cart in DB after order is saved
  try {
    await User.findByIdAndUpdate(userId, { cart: [] });
  } catch (cartErr) {
    console.warn("Could not clear user cart in DB:", cartErr.message);
  }

  return order;
};

// Create order
const createOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      addressId,
      paymentMethod,
      subtotal,
      discount,
      deliveryCharge,
      paymentStatus,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    // Idempotency: Prevent duplicate orders if razorpayPaymentId already exists
    if (razorpayPaymentId) {
      const existing = await Order.findOne({ razorpayPaymentId: razorpayPaymentId.trim() });
      if (existing) {
        return res.status(200).json(existing);
      }
    }

    // If online payment (not COD), enforce server-side signature verification
    if (paymentMethod !== "cod") {
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return res.status(400).json({
          message: "Online orders require valid Razorpay payment details and signature",
        });
      }

      const secret = (process.env.RAZORPAY_KEY_SECRET || "").trim();
      if (!secret) {
        return res.status(500).json({
          message: "Razorpay Secret Key is not configured on server",
        });
      }

      const generatedSignature = crypto
        .createHmac("sha256", secret)
        .update(`${razorpayOrderId.trim()}|${razorpayPaymentId.trim()}`)
        .digest("hex");

      const userSignature = razorpaySignature.trim();
      const isMatch =
        generatedSignature.length === userSignature.length &&
        crypto.timingSafeEqual(
          Buffer.from(generatedSignature, "utf-8"),
          Buffer.from(userSignature, "utf-8")
        );

      if (!isMatch) {
        return res.status(400).json({
          message: "Payment signature verification failed. Cannot place unverified order.",
        });
      }
    }

    const order = await saveOrderToDatabase({
      userId: req.userId,
      items,
      totalAmount,
      addressId,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : (paymentStatus || "paid"),
      status: paymentMethod === "cod" ? "Pending" : "Processing",
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      subtotal,
      discount,
      deliveryCharge,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("ORDER ERROR:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to create order",
    });
  }
};
// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin - all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {

    const { status } = req.body;


    const allowedStatus = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Return Requested",
      "Returned"
    ];


    if (!allowedStatus.includes(status)) {

      return res.status(400).json({
        message:"Invalid order status"
      });

    }


    const order = await Order.findById(req.params.id);


    if(!order){

      return res.status(404).json({
        message:"Order not found"
      });

    }


    order.status = status;


    await order.save();


    res.json({
      message:"Order status updated successfully",
      order
    });


  } catch(error){

    res.status(500).json({
      message:error.message
    });

  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("userId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {

    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    if (
      order.status === "Delivered" ||
      order.status === "Cancelled"
    ) {
      return res.status(400).json({
        message: "Cannot cancel this order"
      });
    }

    // Restore product stock
    for (const item of order.items) {

      const product = await Product.findById(item.productId);

      if (product) {
        product.quantity += item.quantity;
        await product.save();
      }

    }

    order.status = "Cancelled";

    await order.save();

    res.json({
      message: "Order cancelled successfully",
      order
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const requestReturn = async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // 👇 IVIDE ADD CHEYYANAM
    if (order.status !== "Delivered") {
      return res.status(400).json({
        message: "Only delivered orders can be returned",
      });
    }

    order.status = "Return Requested";
    order.returnStatus = "Requested";
    order.returnReason = reason;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Return request submitted",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const approveReturn = async (req, res) => {

  //  console.log("Approve controller reached");
  try {

  const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "Returned";
    order.returnStatus = "Approved";

    if (order.returnReason !== "Damaged") {

      for (const item of order.items) {

        const product = await Product.findById(item.productId);

        if (product) {
          product.quantity += item.quantity;
          await product.save();
        }

      }

    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Return Approved",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectReturn = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.returnStatus = "Rejected";
    order.status = "Delivered";

    await order.save();

    res.json({
      success: true,
      message: "Return Rejected",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const numAmount = Number(amount);

    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid positive amount is required",
      });
    }

    const keyId = (process.env.RAZORPAY_KEY_ID || "").trim();
    if (!keyId) {
      return res.status(500).json({
        success: false,
        message: "Razorpay Key ID is not configured on server",
      });
    }

    const options = {
      amount: Math.round(numAmount * 100), // ₹ → paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      keyId,
      order,
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: error.message || error,
    });
  }
};

const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details (razorpay_order_id, razorpay_payment_id, razorpay_signature) are missing",
      });
    }

    const secret = (process.env.RAZORPAY_KEY_SECRET || "").trim();
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "Razorpay Secret Key is not configured on server",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id.trim()}|${razorpay_payment_id.trim()}`)
      .digest("hex");

    const userSignature = razorpay_signature.trim();

    const isMatch =
      generatedSignature.length === userSignature.length &&
      crypto.timingSafeEqual(
        Buffer.from(generatedSignature, "utf-8"),
        Buffer.from(userSignature, "utf-8")
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature. Verification failed.",
      });
    }

    // Deduplication check: Has this payment already created an order?
    const existingOrder = await Order.findOne({
      razorpayPaymentId: razorpay_payment_id.trim(),
    });

    if (existingOrder) {
      try {
        await User.findByIdAndUpdate(req.userId, { cart: [] });
      } catch (e) {
        console.warn("Cart clearing error:", e.message);
      }
      return res.status(200).json({
        success: true,
        order: existingOrder,
        message: "Payment verified (order already exists)",
      });
    }

    // Save order in MongoDB only after successful verification
    if (orderData) {
      const order = await saveOrderToDatabase({
        userId: req.userId,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        addressId: orderData.addressId,
        paymentMethod: orderData.paymentMethod || "razorpay",
        paymentStatus: "paid",
        status: "Processing",
        razorpayOrderId: razorpay_order_id.trim(),
        razorpayPaymentId: razorpay_payment_id.trim(),
        razorpaySignature: razorpay_signature.trim(),
        subtotal: orderData.subtotal,
        discount: orderData.discount,
        deliveryCharge: orderData.deliveryCharge,
      });

      return res.status(200).json({
        success: true,
        order,
        message: "Payment verified and order created successfully",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Payment Verification Error:", error);

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Payment verification failed",
    });
  }
};




module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  cancelOrder,
  requestReturn,
  approveReturn,
  rejectReturn,
  createRazorpayOrder,
  verifyRazorpayPayment
};