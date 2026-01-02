const express = require("express");
const cors = require("cors");
const authRoutes = require("./auth/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

app.use("/auth", authRoutes);

module.exports = app;
