const express = require("express");
const { Protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const{ getAdminStats} = require("../controllers/analyticsController.js");

const router = express.Router();

router.get("/", Protect, admin, getAdminStats);

module.exports = router;

