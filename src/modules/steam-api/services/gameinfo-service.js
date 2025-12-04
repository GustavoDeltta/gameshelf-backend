const axios = require("axios");
const { getAchievementsHighlights } = require("./achievements-service");
const userRepository = require("../../auth/repositories/user-repository");
const gameLogRepository = require("../../gamelog/repositories/gamelog-repository");

async function getSteamRatings(appId) {
  try {
    const url = `https://store.steampowered.com/appreviews/${appId}`;
    const params = {
      json: 1,
      language: "all",
      num_per_page: 0,
    };

    const { data } = await axios.get(url, { params });

    if (!data || !data.query_summary) {
      return { success: false, message: "No review summary found from Steam." };
    }

    const summary = data.query_summary;

    const reviewScore0to5 = Number(((summary.review_score / 9) * 5).toFixed(1));

    return {
      success: true,
      data: {
        reviewScore0to5,
        reviewScoreDesc: summary.review_score_desc,
        totalReviews: summary.total_reviews,
        totalPositive: summary.total_positive,
        totalNegative: summary.total_negative,
      },
    };
  } catch (error) {
    console.error(
      "Error fetching Steam reviews:",
      error.response?.data || error.message
    );
    return { success: false, message: "Failed to fetch reviews from Steam." };
  }
}

async function getGameInfo(appId, language, steamId) {
  try {
    const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&l=${language}`;

    const promises = [
      axios.get(url),
      getSteamRatings(appId),
      getAchievementsHighlights(steamId, appId, language),
      steamId
        ? userRepository.findBySteamId(steamId).then((userId) => {
            if (userId) {
              return gameLogRepository.findByUserAndGame(userId, appId);
            }
            return null;
          })
        : Promise.resolve(null),
      gameLogRepository.countPlayingByGameId(appId),
    ];

    const results = await Promise.all(promises);

    const response = results[0];
    const steamRatings = results[1];
    const achievementHighlights = results[2];
    const userGameLog = results[3];
    const playingCount = results[4];

    if (
      !response.data ||
      !response.data[appId] ||
      !response.data[appId].success
    ) {
      return { success: false, data: null };
    }

    const data = response.data[appId].data;

    const cover_url = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_600x900.jpg`;

    const responseData = {
      type: data.type,
      cover: cover_url,
      background: data.header_image,
      name: data.name,
      description: data.short_description,
      developers: data.developers,
      publishers: data.publishers,
      releaseDate: data.release_date,
      categories: data.categories,
      genres: data.genres,
      dlcs: data.dlc ?? [],
      achievementHighlights: achievementHighlights,
      platforms: data.platforms,
      screenshots: data.screenshots ?? [],
      steamRatings: steamRatings.data,
      languages: data.supported_languages,
      userGameLog: userGameLog
        ? { id: userGameLog.id, status: userGameLog.status }
        : null,
      playingCount: playingCount,
    };

    if (achievementHighlights && achievementHighlights.success) {
      responseData.achievementHighlights = achievementHighlights.data;
    }

    return {
      success: true,
      data: responseData,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: "Erro ao buscar dados do jogo",
      details: err.message,
    };
  }
}

module.exports = { getGameInfo };
