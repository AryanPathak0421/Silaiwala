const express = require("express");
const router = express.Router();
const { getWalletBalance, getWalletTransactions, requestWithdrawal } = require("./controllers/wallet.controller");
const { protect, authorize } = require("../../middlewares/auth.middleware");

router.use(protect);
router.use(authorize("tailor", "delivery"));

router.get("/balance", getWalletBalance);
router.get("/transactions", getWalletTransactions);
router.post("/withdraw", requestWithdrawal);

module.exports = router;
