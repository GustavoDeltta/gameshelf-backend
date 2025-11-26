const express = require("express");
const authRoutes = require("./modules/auth/routes/authRoutes");
const steamRoutes = require("./modules/steam-api/routes/steamRoutes");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/steam", steamRoutes);

module.exports = app;
