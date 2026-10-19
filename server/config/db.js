const mongoose = require("mongoose");

let cachedConnection = null;

const connectDb = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    cachedConnection = connection;
    console.log("Database Connected: " + connection.connection.name);
    return cachedConnection;
  } catch (error) {
    console.error("Database Connection Error:", error);
  }
};

module.exports = connectDb;

// Admin Dashboard (Products): http://localhost:5173/admin
// Add Product Page: http://localhost:5173/admin/add-product

// Categories Dashboard: http://localhost:5173/admin/categories
// Add a Category: http://localhost:5173/admin/add-category