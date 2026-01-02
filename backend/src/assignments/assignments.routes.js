const express = require("express");
const { assignAsset, expendAsset } = require("./assignments.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authenticate);

// admin + commander
router.post("/assign", authorize(["admin", "commander"]), assignAsset);
router.post("/expend", authorize(["admin", "commander"]), expendAsset);

module.exports = router;
