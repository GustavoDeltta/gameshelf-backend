const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review-controller");
const authMiddleware = require("../../../core/middlewares/auth-middleware");

// Public routes
router.get("/game/:gameId", reviewController.getGameReviews);
router.get("/game/:gameId/ratings", reviewController.getGameRatings);
router.get("/user/:userId", reviewController.getUserReviews);

// Private routes
router.use(authMiddleware);

router.get("/me", reviewController.getMyReviews);
router.post("/:gameId", reviewController.createOrUpdateReview);
router.get("/me/:gameId", reviewController.getMyReviewForGame);
router.delete("/:gameId", reviewController.deleteReview);

module.exports = router;
