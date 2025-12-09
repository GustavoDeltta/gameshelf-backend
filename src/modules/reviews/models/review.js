class Review {
  constructor({
    userId,
    gameId,
    rating,
    text,
    liked,
    containsSpoilers,
    gameLogStatus,
    achievementsCompleted,
  }) {
    this.userId = userId;
    this.gameId = gameId;
    this.rating = rating; // number (e.g. 3.5)
    this.text = text;
    this.liked = liked; // boolean
    this.containsSpoilers = containsSpoilers; // boolean
    this.gameLogStatus = gameLogStatus; // 'jogando', 'finalizado', 'backlog', or null
    this.achievementsCompleted = achievementsCompleted; // boolean
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  toFirestore() {
    return {
      userId: this.userId,
      gameId: this.gameId,
      rating: this.rating,
      text: this.text,
      liked: this.liked,
      containsSpoilers: this.containsSpoilers,
      gameLogStatus: this.gameLogStatus,
      achievementsCompleted: this.achievementsCompleted,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromFirestore(docId, data) {
    const review = new Review(data);
    review.id = docId;
    return review;
  }
}

module.exports = Review;
