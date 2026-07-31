const Order = require("../../models/orders/order");
const Address = require("../../models/address/addressModel");
const { Product } = require("../../models/products/product");

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
      deliveryCharge
    } = req.body;


    const address = await Address.findById(addressId);

    if (!address) {
      return res.status(404).json({
        message:"Address not found"
      });
    }

    for (const item of items) {

  const product = await Product.findById(item.product._id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  if (product.quantity < item.quantity) {
    return res.status(400).json({
      message: `${product.title} is out of stock.`,
    });
  }

  await Product.findByIdAndUpdate(
    item.product._id,
    {
      $inc: {
        quantity: -item.quantity,
      },
    }
  );
}
   

const formattedItems = items.map((item) => ({
  productId: item.product._id,
  productName: item.product.title,
  productImage: item.product.images[0],
  salePrice: item.product.salePrice,
  quantity: item.quantity,
}));




    const order = await Order.create({

      userId:req.userId,

      items:formattedItems,

      totalAmount,

      shippingAddress:{
        fullName:address.fullName,
        phone:address.phone,
        house:address.house,
        city:address.city,
        state:address.state,
        pincode:address.pincode
      },

      paymentMethod,
      subtotal,
      discount,
      deliveryCharge

    });


    res.status(201).json(order);

    // console.log(order.items);


  } catch(error){

    // console.log("ORDER ERROR:",error);

    res.status(500).json({
      message:error.message
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


module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  cancelOrder,
  requestReturn,
  approveReturn,
  rejectReturn
};