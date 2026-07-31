const User = require("../../models/user/user");
const Order = require("../../models/orders/order");
const { Product } = require("../../models/products/product");

const getDashboard = async (req, res) => {
  try {
    // Total Counts
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Revenue Calculation
    const revenueData = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Category Wise Products
    const categorySales = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          value: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: 1,
        },
      },
    ]);

    // Send Response
    res.status(200).json({
      products: totalProducts,
      users: totalUsers,
      orders: totalOrders,
      revenue: totalRevenue,
      categorySales,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Dashboard Error",
    });
  }
};

module.exports = {
  getDashboard,
};