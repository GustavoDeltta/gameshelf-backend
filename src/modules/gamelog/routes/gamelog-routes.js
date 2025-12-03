const express = require("express");
const router = express.Router();
const gameLogController = require("../controllers/gamelog-controller");
const authMiddleware = require("../../../core/middlewares/auth-middleware");

// All routes in this module are protected
router.use(authMiddleware);

router.post("/", gameLogController.logGame);
router.get("/", gameLogController.getUserGameLogs);
router.put("/:logId/status", gameLogController.updateGameLogStatus);
router.delete("/:logId", gameLogController.deleteGameLog);

module.exports = router;
