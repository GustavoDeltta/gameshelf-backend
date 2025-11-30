const express = require("express");
const achievementsRoutes = require("./modules/steam-api/routes/achievements-routes");
const gameInfoRoutes = require("./modules/steam-api/routes/gameinfo-routes");

const app = express();

app.use(express.json());

app.use("/api", achievementsRoutes);
app.use("/api", gameInfoRoutes);

module.exports = app;
