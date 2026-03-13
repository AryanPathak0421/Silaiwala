const express = require("express");
const router = express.Router();
const { getProducts, getProductDetails, getCategories, getFeaturedProducts } = require("../controllers/product.controller");

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductDetails);

module.exports = router;
