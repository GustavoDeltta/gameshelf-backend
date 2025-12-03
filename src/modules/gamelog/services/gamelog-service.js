const gameLogRepository = require("../repositories/gamelog-repository");
const GameLog = require("../models/gamelog");
const { getGameInfo } = require("../../steam-api/services/gameinfo-service");

class GameLogService {
  async logGame(userId, gameId, status, language = "brazilian") {
    const existingLog = await gameLogRepository.findByUserAndGame(userId, gameId);

    if (existingLog) {
      await gameLogRepository.update(existingLog.id, { status });
      return gameLogRepository.findById(existingLog.id);
    } else {
      const gameInfoResult = await getGameInfo(gameId, language);
      if (!gameInfoResult.success) {
        throw new Error("Could not retrieve game information.");
      }
      const gameInfo = gameInfoResult.data;
      const newGameLog = new GameLog(
        userId,
        gameId,
        gameInfo.name,
        gameInfo.cover,
        status
      );
      const newLogId = await gameLogRepository.save(newGameLog);
      return gameLogRepository.findById(newLogId);
    }
  }

  async getUserGameLogs(userId) {
    return gameLogRepository.findByUser(userId);
  }

  async updateGameLogStatus(logId, status) {
    const log = await gameLogRepository.findById(logId);
    if (!log) {
      throw new Error("Game log not found.");
    }
    await gameLogRepository.update(logId, { status });
    return gameLogRepository.findById(logId);
  }

  async deleteGameLog(logId) {
    const log = await gameLogRepository.findById(logId);
    if (!log) {
      throw new Error("Game log not found.");
    }
    await gameLogRepository.delete(logId);
    return { message: "Game log deleted successfully" };
  }
}

module.exports = new GameLogService();
