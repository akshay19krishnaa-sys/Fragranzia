// controllers/products/productController.js

const { Product } = require("../../models/products/product");
const Category = require("../../models/category/category");


// GET ALL PRODUCTS

const getProducts = async (req, res) => {
  try {
    const blockedCategories = await Category.find(
      { isBlocked: true },
      "name"
    );

    const blockedNames = blockedCategories.map(
      (category) => category.name
    );

    const products = await Product.find({
      category: { $nin: blockedNames },
    });

    res.json(products);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};  


// GET SINGLE PRODUCT

const getProductById = async (req, res) => {
  try {

    
const product = await Product.findById(req.params.id);

if (!product) {
  return res.status(404).json({
    message: "Product not found",
  });
}

const category = await Category.findOne({
  name: product.category,
});

if (category && category.isBlocked) {
  return res.status(404).json({
    message: "Product not available",
  });
}

res.json(product);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};


// CREATE PRODUCT

const postProducts = async (req, res) => {

  try {

    // uploaded image paths
const imagePaths = req.files.map(
  (file) => file.filename
);

    const newproducts = await Product.create({

      title: req.body.title,

      price: req.body.price,

      salePrice: req.body.salePrice,

      quantity: req.body.quantity,

      category: req.body.category,

      offer: req.body.offer,

      description: req.body.description,

      images: imagePaths,

    });

    res.status(201).json(newproducts);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

};


// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

    if (req.file) {
      updateData.images = req.file.filename;
    
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedProduct);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};


// DELETE PRODUCT

const deleteProducts = async (req, res) => {

  try {

    const { id } = req.params;

    if (!id) {

      return res.status(400).json({
        message: "ID is required"
      });

    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      message: "Product deleted"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

};
const toggleProductBlock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isBlocked = !product.isBlocked;

    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getUserProducts = async (req, res) => {
  try {

    const blockedCategories = await Category.find(
      { isBlocked: true },
      "name"
    );

    const blockedNames = blockedCategories.map(
      (category) => category.name
    );

    const products = await Product.find({
      isBlocked: false,
      category: { $nin: blockedNames },
    });

    res.json(products);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {

  getProducts,

  getProductById,

  postProducts,

  updateProduct,

  deleteProducts,
  toggleProductBlock,
  getUserProducts

};