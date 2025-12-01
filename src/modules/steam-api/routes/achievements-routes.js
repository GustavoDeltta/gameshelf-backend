const express = require("express");
const steamController = require("../controllers/achievements-controller");

const router = express.Router();

router.get(
  "/game/:appId/achievements/:playerId",
  steamController.getPlayerAchievementsByGame
);
router.get(
  "/game/:appId/achievements-highlights/:playerId",
  steamController.getAchievementsHighlights
);


module.exports = router;
