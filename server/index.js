require("dotenv").config();

const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/products/productRoutes");
const categoryRoutes = require("./routes/category/categoryRoutes");
const wishlistRoutes = require("./routes/user/wishlistRoutes");
const cartRoutes = require("./routes/user/cartRoutes");
const userRoutes = require("./routes/user/userRoutes");
const addressRoutes = require("./routes/user/addressRoutes");
const connectDb = require("./config/db");
const orderRoutes = require("./routes/orders/orderRoutes");
const adminRoutes = require("./routes/admin/adminRoutes");

require("dotenv").config();


connectDb() 

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);



app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));