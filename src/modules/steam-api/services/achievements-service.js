const axios = require("axios");

async function getPlayerAchievementsByGame(steamId, appId, language) {
  try {
    const apiKey = process.env.STEAM_API_KEY;

    const url =
      "https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/";

    const { data } = await axios.get(url, {
      params: {
        key: apiKey,
        steamid: steamId,
        appid: appId,
        l: language,
      },
    });

    if (data.playerstats?.error) {
      const msg = data.playerstats.error;

      if (msg.includes("Steam")) {
        return {
          success: false,
          type: "INVALID_STEAMID",
          message: "Invalid or private SteamID.",
        };
      }

      if (msg.includes("stats")) {
        return {
          success: false,
          type: "INVALID_APPID",
          message: "Invalid AppID or this game does not support stats.",
        };
      }
    }

    return {
      success: true,
      achievements: data.playerstats.achievements,
    };
  } catch (error) {
    return {
      success: false,
      type: "INVALID_STEAMID",
      message: "Private profile or invalid format.",
    };
  }
}

async function getGameAchievements(appId, language) {
  try {
    const apiKey = process.env.STEAM_API_KEY;

    const url =
      "https://api.steampowered.com/IPlayerService/GetGameAchievements/v1";

    const { data } = await axios.get(url, {
      params: {
        key: apiKey,
        appid: appId,
        language: language,
      },
    });

    if (!data.response) {
      return {
        success: false,
        type: "INVALID_APPID",
        message: "Invalid AppID.",
      };
    }

    const achievements = data.response?.achievements;

    if (!achievements || achievements.length === 0) {
      return {
        success: false,
        type: "NO_ACHIEVEMENTS",
        message: "This game does not have achievements available.",
      };
    }

    return {
      success: true,
      achievements,
    };
  } catch (error) {
    return {
      success: false,
      type: "API_ERROR",
      message: "Failed to fetch game achievements from Steam API.",
    };
  }
}

async function getAchievementsInfo(steamId, appId, language) {
  try {
    const gameAchievementsResult = await getGameAchievements(appId, language);

    if (!gameAchievementsResult.success) {
      return {
        success: false,
        type: gameAchievementsResult.type,
        message: gameAchievementsResult.message,
      };
    }

    const gameAchievements = gameAchievementsResult.achievements;

    const playerStatsResult = await getPlayerAchievementsByGame(
      steamId,
      appId,
      language
    );

    if (!playerStatsResult.success) {
      return {
        success: false,
        type: playerStatsResult.type,
        message: playerStatsResult.message,
      };
    }

    const playerStats = playerStatsResult.achievements;

    const totalAchievements = gameAchievements.length;
    const achieved = playerStats.filter((achievement) => achievement.achieved);
    const notAchieved = playerStats.filter(
      (achievement) => !achievement.achieved
    );

    const progress = (achieved.length / totalAchievements) * 100;

    const merged = gameAchievements.map((gameAchievement) => {
      const playerAchievement = playerStats.find(
        (playerAchievement) =>
          playerAchievement.apiname === gameAchievement.internal_name
      );
      const { icon_gray, ...rest } = gameAchievement;
      return {
        ...rest,
        achieved: playerAchievement?.achieved || 0,
      };
    });

    return {
      success: true,
      data: {
        totalAchievements,
        achieved: achieved.length,
        notAchieved: notAchieved.length,
        progress,
        achievements: merged,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal error merging Steam data.",
    };
  }
}

module.exports = {
  getPlayerAchievementsByGame,
  getGameAchievements,
  getAchievementsInfo,
};
