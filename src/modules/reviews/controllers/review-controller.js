const reviewService = require("../services/review-service");

class ReviewController {
  async createOrUpdateReview(req, res) {
    const { gameId } = req.params;
    const { uid: userId } = req.user;
    const { rating, text, liked, containsSpoilers } = req.body;

    if (rating === undefined || text === undefined || liked === undefined || containsSpoilers === undefined) {
      return res.status(400).json({ message: "Missing required review fields." });
    }

    try {
      const review = await reviewService.createOrUpdateReview(userId, gameId, req.body);
      res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getMyReviewForGame(req, res) {
    const { gameId } = req.params;
    const { uid: userId } = req.user;
    try {
      const review = await reviewService.getReview(userId, gameId);
      if (!review) {
        return res.status(404).json({ message: "Review not found." });
      }
      res.status(200).json(review);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getMyReviews(req, res) {
    const { uid: userId } = req.user;
    try {
      const reviews = await reviewService.getUserReviews(userId);
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUserReviews(req, res) {
    // This could be for a public user profile, or for the logged in user
    const { userId } = req.params;
    try {
      const reviews = await reviewService.getUserReviews(userId);
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  
  async getGameReviews(req, res) {
    const { gameId } = req.params;
    try {
      const reviews = await reviewService.getGameReviews(gameId);
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteReview(req, res) {
    const { gameId } = req.params;
    const { uid: userId } = req.user;
    try {
      await reviewService.deleteReview(userId, gameId);
      res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ReviewController();
