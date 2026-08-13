const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUsers, verifyOtp, resendOtp } = require("../controllers/authController");
const { Protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", loginUser);
router.get("/user", Protect, admin, getUsers);

module.exports = router;