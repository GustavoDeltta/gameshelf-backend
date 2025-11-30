const axios = require("axios");
const e = require("express");

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

    if (!data.playerstats?.success) {
      return {
        success: false,
        achievements: [],
      };
    }

    return {
      success: true,
      achievements: data.playerstats.achievements || [],
    };

  } catch (error) {
    return {
      success: false,
      achievements: [],
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

    const achievements = data.response.achievements;

    if (!achievements) {
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

    const playerStats = playerStatsResult.achievements || [];

    const merged = gameAchievements.map((gameAchievement) => {
      const playerAchievement = playerStats.find(
        (p) => p.apiname === gameAchievement.internal_name
      );

      return {
        name: gameAchievement.localized_name,
        description: gameAchievement.localized_desc,
        icon: gameAchievement.icon,
        hidden: gameAchievement.hidden,
        player_percent_unlocked: gameAchievement.player_percent_unlocked,
        achieved: playerAchievement?.achieved === 1 ? true : false,
      };
    });

    merged.sort((a, b) => {
      if (a.achieved !== b.achieved) {
        return a.achieved ? -1 : 1;
      }
      if (a.hidden !== b.hidden) {
        return a.hidden ? 1 : -1;
      }
      const pa = parseFloat(a.player_percent_unlocked) || 0;
      const pb = parseFloat(b.player_percent_unlocked) || 0;

      return pb - pa;
    });

    const totalAchievements = gameAchievements.length;
    const achieved = merged.filter((a) => a.achieved).length;
    const notAchieved = totalAchievements - achieved;
    const progress = ((achieved / totalAchievements) * 100).toFixed(2);

    return {
      success: true,
      data: {
        totalAchievements,
        achieved,
        notAchieved,
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
