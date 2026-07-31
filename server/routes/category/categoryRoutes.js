const express = require("express");
const { getCategories, createCategory, updateCategory, deleteCategory ,toggleCategoryBlock,getCategoryById,getActiveCategories} = require("../../controllers/category/categoryController");
const router = express.Router();

router.get("/", getCategories);
router.post("/", createCategory);
router.get("/active", getActiveCategories);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);
router.put("/toggle-block/:id", toggleCategoryBlock);
router.get("/:id", getCategoryById);


module.exports = router;
