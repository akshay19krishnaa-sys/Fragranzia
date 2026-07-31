const express = require("express");
const { getProducts, getProductById, postProducts, deleteProducts, updateProduct,toggleProductBlock,getUserProducts } = require("../../controllers/products/productController");
const router = express.Router();
const upload = require("../../middlewares/upload");

router.get("/user", getUserProducts);
router.put("/toggle-block/:id", toggleProductBlock);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", upload.array("images", 4), postProducts);
router.put("/:id", upload.single("images"), updateProduct);
router.delete("/:id", deleteProducts)


module.exports = router;
