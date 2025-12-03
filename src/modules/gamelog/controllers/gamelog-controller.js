const gameLogService = require("../services/gamelog-service");

class GameLogController {
  async logGame(req, res) {
    const { gameId, status } = req.body;
    const { uid: userId } = req.user;

    if (!gameId || !status) {
      return res.status(400).json({ message: "gameId and status are required" });
    }

    const validStatuses = ["Playing", "Finished", "Backlog"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    try {
      const result = await gameLogService.logGame(userId, gameId, status);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getUserGameLogs(req, res) {
    const { uid: userId } = req.user;
    try {
      const logs = await gameLogService.getUserGameLogs(userId);
      return res.status(200).json(logs);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateGameLogStatus(req, res) {
    const { logId } = req.params;
    const { status } = req.body;
    const { uid: userId } = req.user;

    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }
    
    // Optional: Check if the log belongs to the user trying to update it.
    // This logic can be enhanced in the service layer.

    try {
      const updatedLog = await gameLogService.updateGameLogStatus(logId, status);
      return res.status(200).json(updatedLog);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteGameLog(req, res) {
    const { logId } = req.params;
    const { uid: userId } = req.user;

    // Optional: Check if the log belongs to the user trying to delete it.

    try {
      const result = await gameLogService.deleteGameLog(logId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new GameLogController();
