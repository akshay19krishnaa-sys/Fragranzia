const express = require("express");
const router = express.Router();

const checkAuth = require("../../middlewares/checkAuth");

const {
  addAddress,
  getAddresses,
  getAddressById,
  deleteAddress,
  setPrimaryAddress,
  updateAddress,
} = require("../../controllers/address/addressController");
router.get("/", checkAuth, getAddresses);

router.post("/", checkAuth, addAddress);

router.get("/:id", checkAuth, getAddressById);

router.put("/:id", checkAuth, updateAddress);

router.put("/primary/:id", checkAuth, setPrimaryAddress);

router.delete("/:id", checkAuth, deleteAddress);
module.exports = router;