const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders, getOrderDetails } = require("../controllers/order.controller");
const { protect, authorize } = require("../../../middlewares/auth.middleware");

router.use(protect);

router.post("/", authorize("customer"), createOrder);
router.get("/my-orders", authorize("customer"), getMyOrders);
router.get("/:id", getOrderDetails);

module.exports = router;
