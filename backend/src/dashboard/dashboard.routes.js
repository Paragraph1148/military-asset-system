const express = require("express");
const { getDashboard } = require("./dashboard.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authenticate);

// all roles can view dashboard (scope enforced via filters)
router.get("/", getDashboard);

module.exports = router;
