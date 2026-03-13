const express = require("express");
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/service.controller");

const router = express.Router();

// Public routes
router.get("/", getServices);
router.get("/:id", getServiceById);

// Protected routes (Admin role should be added in real scenario)
router.post("/", createService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

module.exports = router;
