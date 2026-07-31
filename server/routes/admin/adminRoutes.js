const express = require("express");
const router = express.Router();
const customerRoutes = require("./customerRoutes");


const {
  adminRegister,
  adminLogin,
} = require("../../controllers/admin/adminController");

const {
  getAdminProfile,
  updateAdminProfile,
} = require("../../controllers/admin/profileController");

const checkAuth = require("../../middlewares/checkAuth");

const { getDashboard } = require("../../controllers/admin/dashboardController");

router.get("/test", (req,res)=>{
    res.json({
        message:"Admin route working"
    });
});

router.get("/dashboard", checkAuth, getDashboard);

router.use("/customers", customerRoutes);

router.post("/register", adminRegister);

router.post("/login", adminLogin);

router.get( "/profile", checkAuth, getAdminProfile);

router.put("/profile",checkAuth,updateAdminProfile);


module.exports = router;