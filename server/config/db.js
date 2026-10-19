const mongoose = require("mongoose");

let cachedConnection = null;

const connectDb = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  if (!process.env.MONGO_URI) {
    const errorMsg = "MONGO_URI is not defined in environment variables!";
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    cachedConnection = connection;
    console.log("Database Connected: " + connection.connection.name);
    return cachedConnection;
  } catch (error) {
    console.error("Database Connection Error:", error.message || error);
    throw error;
  }
};

module.exports = connectDb;

// Admin Dashboard (Products): http://localhost:5173/admin
// Add Product Page: http://localhost:5173/admin/add-product

// Categories Dashboard: http://localhost:5173/admin/categories
// Add a Category: http://localhost:5173/admin/add-category