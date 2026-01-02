const express = require("express");
const { createTransfer, getTransfers } = require("./transfers.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authenticate);

// admin + logistics only
router.post("/", authorize(["admin", "logistics"]), createTransfer);
router.get("/", authorize(["admin", "logistics"]), getTransfers);

module.exports = router;
