const express = require("express");
const achievementsRoutes = require("./modules/steam-api/routes/achievements-routes");

const app = express();

app.use(express.json());

app.use("/api", achievementsRoutes);

module.exports = app;
