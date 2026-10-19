// controllers/products/productController.js

const { Product } = require("../../models/products/product");
const Category = require("../../models/category/category");
const cloudinary = require("../../config/cloudinary");


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
    // uploaded image paths from Cloudinary
    const imagePaths = req.files && req.files.length > 0 
      ? req.files.map((file) => file.path) 
      : (req.file ? [req.file.path] : []);

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
    console.error("Create Product Error:", error);
    res.status(500).json({
      error: error.message,
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
      updateData.images = [req.file.path];
    } else if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => file.path);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error("Update Product Error:", error);
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
        message: "ID is required",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Clean up images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const imgUrl of product.images) {
        if (typeof imgUrl === "string" && imgUrl.includes("cloudinary.com")) {
          try {
            const matches = imgUrl.match(/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
            if (matches && matches[1]) {
              await cloudinary.uploader.destroy(matches[1]);
            }
          } catch (destroyErr) {
            console.error("Cloudinary image delete error:", destroyErr.message);
          }
        }
      }
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      message: "Product deleted",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({
      error: error.message,
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