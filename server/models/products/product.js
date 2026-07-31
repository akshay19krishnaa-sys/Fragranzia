const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
 {
    title: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    salePrice: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    category: {
  type: String,
  required: true
},

   offer: {
  type: String,
  default: ""
},

    description: {
      type: String,
      required: true,
    },
    
    isBlocked: {
  type: Boolean,
  default: false,
},

    images: [
      {
        type: String,
      },
    ],

  },

  {
    timestamps: true,
  }
);

module.exports = {
  Product: mongoose.model("Product", productSchema),
};