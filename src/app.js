const express = require("express");
const achievementsRoutes = require("./modules/steam-api/routes/achievements-routes");
const gameInfoRoutes = require("./modules/steam-api/routes/gameinfo-routes");
const authRoutes = require("./modules/auth/routes/auth-routes");
const gamelogRoutes = require("./modules/gamelog/routes/gamelog-routes");
const reviewRoutes = require("./modules/reviews/routes/review-routes");
const gamelistRoutes = require("./modules/gamelists/routes/gamelist-routes");

const app = express();

app.use(express.json());

app.use("/api", achievementsRoutes);
app.use("/api", gameInfoRoutes);
app.use("/api", authRoutes);
app.use("/api/gamelog", gamelogRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/gamelists", gamelistRoutes);

module.exports = app;
