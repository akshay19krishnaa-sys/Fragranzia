const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connection = await mongoose.connect("mongodb://localhost:27017/Fragranzia");
    console.log("Database Connected: " + connection.connection.name);
  } catch (error) {
    console.log(error);
  }

};

module.exports = connectDb;

// Admin Dashboard (Products): http://localhost:5173/admin
// Add Product Page: http://localhost:5173/admin/add-product

// Categories Dashboard: http://localhost:5173/admin/categories
// Add a Category: http://localhost:5173/admin/add-category