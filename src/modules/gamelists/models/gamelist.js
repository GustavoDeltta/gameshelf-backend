class Gamelist {
  constructor(userId, title, description) {
    this.userId = userId;
    this.title = title;
    this.description = description;
    this.games = []; // Array of gameIds
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  toFirestore() {
    return {
      userId: this.userId,
      title: this.title,
      description: this.description,
      games: this.games,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromFirestore(docId, data) {
    const gameList = new Gamelist(data.userId, data.title, data.description);
    gameList.id = docId;
    gameList.games = data.games || [];
    gameList.createdAt = data.createdAt;
    gameList.updatedAt = data.updatedAt;
    return gameList;
  }
}

module.exports = Gamelist;