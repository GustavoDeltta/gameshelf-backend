const express = require("express");
const steamController = require("../controllers/steamController");

const router = express.Router();

router.get(
  "/games/:appId/achievements/:playerId",
  steamController.getPlayerAchievementsByGame
);

module.exports = router;
