const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders, getOrderDetails, createRazorpayOrder, verifyPayment } = require("../controllers/order.controller");
const { protect, authorize } = require("../../../middlewares/auth.middleware");

router.use(protect);

router.post("/razorpay/create", authorize("customer"), createRazorpayOrder);
router.post("/razorpay/verify", authorize("customer"), verifyPayment);
router.post("/", authorize("customer"), createOrder);
router.get("/my-orders", authorize("customer", "delivery", "tailor", "admin"), getMyOrders);
router.get("/:id", getOrderDetails);

module.exports = router;
