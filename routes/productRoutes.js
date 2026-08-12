const express = require("express");
const { Protect} = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const { getProducts, createProduct, getProductById, updateProduct, deleteProduct } = require("../controllers/productController.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });


const router = express.Router();

// all products
router.route("/").get(getProducts).post(Protect, admin, upload.single("image"), createProduct);
// specific product
router.route("/:id").get(getProductById).put(Protect, admin, upload.single("image"), updateProduct).delete(Protect, admin, deleteProduct);

module.exports = router;

