const Address = require("../../models/address/addressModel");

// Add Address

const addAddress = async (req, res) => {
  try {
    console.log("User:", req.userId);
    console.log("Body:", req.body);

    const address = await Address.create({
      ...req.body,
      userId: req.userId,
    });

    res.status(201).json(address);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get User Addresses

const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      userId: req.userId,
    });

    res.json(addresses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Address

const deleteAddress = async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.id);

    res.json({
      message: "Address deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const setPrimaryAddress = async (req, res) => {
  try {
    const userId = req.userId; // ✅ FIX HERE

    await Address.updateMany(
      { userId },
      { isPrimary: false }
    );

    const address = await Address.findByIdAndUpdate(
      req.params.id,
      { isPrimary: true },
      { new: true }
    );

    res.json(address);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
const updateAddress = async (req, res) => {
  try {
    const updated = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get Single Address

const getAddressById = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    res.json(address);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addAddress,
  getAddresses,
  deleteAddress,
  setPrimaryAddress,
  updateAddress,
  getAddressById
  
};