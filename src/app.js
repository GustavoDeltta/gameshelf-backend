const express = require("express");
const achievementsRoutes = require("./modules/steam-api/routes/achievements-routes");
const gameInfoRoutes = require("./modules/steam-api/routes/gameinfo-routes");
const authRoutes = require("./modules/auth/routes/auth-routes");
const gamelogRoutes = require("./modules/gamelog/routes/gamelog-routes");

const app = express();

app.use(express.json());

app.use("/api", achievementsRoutes);
app.use("/api", gameInfoRoutes);
app.use("/api", authRoutes);
app.use("/api/gamelog", gamelogRoutes);

module.exports = app;
