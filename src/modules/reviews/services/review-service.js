const reviewRepository = require("../repositories/review-repository");
const gameLogRepository = require("../../gamelog/repositories/gamelog-repository");
const {
  getAchievementsHighlights,
} = require("../../steam-api/services/achievements-service");
const Review = require("../models/review");
const userRepository = require("../../auth/repositories/user-repository");

class ReviewService {
  async createOrUpdateReview(userId, gameId, reviewData) {
    const user = await userRepository.findByUid(userId);
    if (!user || !user.steamId) {
      throw new Error("User or Steam ID not found.");
    }

    const [gameLog, achievements] = await Promise.all([
      gameLogRepository.findByUserAndGame(userId, gameId),
      getAchievementsHighlights(user.steamId, gameId),
    ]);

    const reviewPayload = {
      userId,
      gameId,
      rating: reviewData.rating,
      text: reviewData.text,
      liked: reviewData.liked,
      containsSpoilers: reviewData.containsSpoilers,
      gameLogStatus: gameLog ? gameLog.status : null,
      achievementsCompleted: achievements.success
        ? achievements.data.achievementsCompleted
        : false,
    };

    const review = new Review(reviewPayload);
    const reviewId = await reviewRepository.save(review);
    return reviewRepository.findById(reviewId);
  }

  async getReview(userId, gameId) {
    return reviewRepository.findByUserAndGame(userId, gameId);
  }

  async getUserReviews(userId) {
    return reviewRepository.findByUser(userId);
  }

  async getGameReviews(gameId) {
    return reviewRepository.findByGame(gameId);
  }

  async getGameReviewsWithCount(gameId, limit) {
    const [count, reviews] = await Promise.all([
      reviewRepository.countByGame(gameId),
      reviewRepository.findRecentByGame(gameId, limit),
    ]);

    return { count, reviews };
  }

  async deleteReview(userId, gameId) {
    const docId = `${userId}_${gameId}`;
    await reviewRepository.delete(docId);
    return { message: "Review deleted successfully" };
  }
}

module.exports = new ReviewService();
