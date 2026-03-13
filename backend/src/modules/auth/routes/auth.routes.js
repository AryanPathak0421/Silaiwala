const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");
const { validateRegister, validateLogin } = require("../validators/auth.validator");
const validate = require("../../../middlewares/validate.middleware");

router.post("/register", validateRegister, validate, register);
router.post("/register-customer", validateRegister, validate, register);
router.post("/login", validateLogin, validate, login);

module.exports = router;
