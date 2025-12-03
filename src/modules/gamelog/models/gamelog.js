class GameLog {
  constructor(userId, gameId, gameName, gameCover, status) {
    this.userId = userId;
    this.gameId = gameId;
    this.gameName = gameName;
    this.gameCover = gameCover;
    this.status = status; // 'Playing', 'Finished', 'Backlog'
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  toFirestore() {
    return {
      userId: this.userId,
      gameId: this.gameId,
      gameName: this.gameName,
      gameCover: this.gameCover,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromFirestore(docId, data) {
    const gameLog = new GameLog(
      data.userId,
      data.gameId,
      data.gameName,
      data.gameCover,
      data.status
    );
    gameLog.id = docId;
    gameLog.createdAt = data.createdAt;
    gameLog.updatedAt = data.updatedAt;
    return gameLog;
  }
}

module.exports = GameLog;
