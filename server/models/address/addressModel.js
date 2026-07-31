const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
 fullName: String,
  phone: String,
  house: String,
  city: String,
  state: String,
  pincode: String,
    isPrimary: {
      type: Boolean,
      default: false,
    },

    type: {
      type: String,
      enum: ["Home", "Work"],
      default: "Home",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);