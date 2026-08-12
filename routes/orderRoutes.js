const express = require("express");
const { Protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const{ createOrder, getOrders, myorders, updateOrderStatus } = require("../controllers/orderController.js");

const router = express.Router();

router.route("/").post(Protect, createOrder).get(Protect, admin, getOrders);
router.route('/myorders').get(Protect, myorders);
router.route("/:id/status").put(Protect, admin, updateOrderStatus);

module.exports = router;

