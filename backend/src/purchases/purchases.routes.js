const express = require("express");
const { createPurchase, getPurchases } = require("./purchases.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authenticate);

// admin + logistics only
router.post("/", authorize(["admin", "logistics"]), createPurchase);
router.get("/", authorize(["admin", "logistics"]), getPurchases);

module.exports = router;
