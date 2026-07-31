const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: String,
        productImage: String,
        salePrice: Number,
        quantity: Number,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Return Requested",
        "Returned",
      ],
      default: "Pending",
    },

    // Return reason
    returnReason: {
      type: String,
      default: "",
    },
    
    returnStatus: {
      type: String,
      enum: ["None", "Requested", "Approved", "Rejected"],
      default: "None",
    },

    shippingAddress: {
      fullName: String,
      phone: String,
      house: String,
      city: String,
      state: String,
      pincode: String,
    },

    paymentMethod: {
      type: String,
    },

    subtotal: {
      type: Number,
    },

    discount: {
      type: Number,
    },

    deliveryCharge: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);