const userRepository = require("../../auth/repositories/user-repository");
const steamUserService = require("../../steam-api/services/steamUserService");
const {
  getGameName,
} = require("../../steam-api/services/steam-api-service");
const ReviewViewModel = require("../models/ReviewViewModel");
const gameLogRepository = require("../../gamelog/repositories/gamelog-repository");

async function toViewModel(review, language = "en") {
  const user = await userRepository.findByUid(review.userId);
  if (!user) {
    // This should not happen in practice if the data is consistent
    return null;
  }

  let hoursPlayed = "N/A";
  if (user.steamId) {
    const ownedGames = await steamUserService.getOwnedGames(user.steamId);
    const game = ownedGames.find((g) => g.appid.toString() === review.gameId);
    if (game) {
      hoursPlayed = (game.playtime_forever / 60).toFixed(1);
    }
  }

  const gameLog = await gameLogRepository.findByUserAndGame(
    review.userId,
    review.gameId,
  );

  const gameName = await getGameName(review.gameId);

  return new ReviewViewModel({
    appid: review.gameId,
    gameName,
    profilePicture: user.steamProfilePicture,
    profileName: user.username,
    log: gameLog ? gameLog.status : null,
    hoursPlayed: hoursPlayed,
    reviewScore: review.rating,
    reviewComment: review.text,
    reviewDate: review.createdAt,
    liked: review.liked,
  });
}

module.exports = { toViewModel };
