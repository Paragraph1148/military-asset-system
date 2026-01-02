const express = require("express");
const cors = require("cors");
const authRoutes = require("./auth/auth.routes");
const purchaseRoutes = require("./purchases/purchases.routes");
const transferRoutes = require("./transfers/transfers.routes");
const dashboardRoutes = require("./dashboard/dashboard.routes");
const assignmentRoutes = require("./assignments/assignments.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

app.use("/auth", authRoutes);
app.use("/purchases", purchaseRoutes);
app.use("/transfers", transferRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/assignments", assignmentRoutes);

module.exports = app;
