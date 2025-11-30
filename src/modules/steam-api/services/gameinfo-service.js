const axios = require("axios");

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

async function getGameInfo(appId, language) {
  try {
    const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&l=${language}`;

    const response = await axios.get(url);

    if (
      !response.data ||
      !response.data[appId] ||
      !response.data[appId].success
    ) {
      return { success: false, data: null };
    }

    const data = response.data[appId].data;

    const cover_url = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_600x900.jpg`;

    const steamRatings = await getSteamRatings(appId);

    return {
      success: true,
      data: {
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
        platforms: data.platforms,
        screenshots: data.screenshots ?? [],
        steamRatings: steamRatings.data,
        languages: data.supported_languages,
      },
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
