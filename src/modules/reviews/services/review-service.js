const reviewRepository = require("../repositories/review-repository");
const gameLogRepository = require("../../gamelog/repositories/gamelog-repository");
const Review = require("../models/review");
const userRepository = require("../../auth/repositories/user-repository");
const { toViewModel } = require("../view-models/review-view-model");

class ReviewService {
  async createOrUpdateReview(userId, gameId, reviewData, language) {
    const user = await userRepository.findByUid(userId);
    if (!user || !user.steamId) {
      throw new Error("User or Steam ID not found.");
    }

    const gameLog = await gameLogRepository.findByUserAndGame(userId, gameId);

    const reviewPayload = {
      userId,
      gameId,
      rating: reviewData.rating,
      text: reviewData.text,
      liked: reviewData.liked,
      containsSpoilers: reviewData.containsSpoilers,
      gameLogStatus: gameLog ? gameLog.status : null,
    };

    const review = new Review(reviewPayload);
    const reviewId = await reviewRepository.save(review);
    const savedReview = await reviewRepository.findById(reviewId);
    return toViewModel(savedReview, language);
  }

  async getReview(userId, gameId) {
    const review = await reviewRepository.findByUserAndGame(userId, gameId);
    if (!review) {
      return null;
    }
    return toViewModel(review);
  }

  async getUserReviews(userId) {
    const reviews = await reviewRepository.findByUser(userId);
    return Promise.all(reviews.map(toViewModel));
  }

  async getGameReviews(gameId) {
    const reviews = await reviewRepository.findByGame(gameId);
    return Promise.all(reviews.map(toViewModel));
  }

  async getGameReviewsWithCount(gameId, limit) {
    const [count, reviews] = await Promise.all([
      reviewRepository.countByGame(gameId),
      reviewRepository.findRecentByGame(gameId, limit),
    ]);

    const reviewViewModels = await Promise.all(reviews.map(toViewModel));

    return { count, reviews: reviewViewModels };
  }

  async getGameRatings(gameId) {
    const reviews = await reviewRepository.findByGame(gameId);
    if (!reviews || reviews.length === 0) {
      return {
        total: 0,
        average: 0,
        ratings: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
      };
    }

    const totalReviews = reviews.length;
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;

    for (const review of reviews) {
      ratingCounts[review.rating]++;
      totalRating += review.rating;
    }

    const ratingPercentages = {
      5: ratingCounts[5] / totalReviews,
      4: ratingCounts[4] / totalReviews,
      3: ratingCounts[3] / totalReviews,
      2: ratingCounts[2] / totalReviews,
      1: ratingCounts[1] / totalReviews,
    };

    const averageRating = parseFloat((totalRating / totalReviews).toFixed(1));

    return {
      total: totalReviews,
      average: averageRating,
      ratings: ratingPercentages,
    };
  }

  async deleteReview(userId, gameId) {
    const docId = `${userId}_${gameId}`;
    await reviewRepository.delete(docId);
    return { message: "Review deleted successfully" };
  }
}

module.exports = new ReviewService();
