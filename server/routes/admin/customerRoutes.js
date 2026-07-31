const express = require("express");
const router = express.Router();

const {
 getAllUsers,
 toggleUserBlock
} = require("../../controllers/admin/customerController");

const checkAuth = require("../../middlewares/checkAuth");
const isAdmin = require("../../middlewares/isAdmin");


router.get("/", checkAuth, isAdmin, getAllUsers);

router.put("/block/:id", checkAuth, isAdmin, toggleUserBlock);


module.exports = router;