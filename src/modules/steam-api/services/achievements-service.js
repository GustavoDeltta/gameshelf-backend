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
      achievements:
        data.playerstats.achievements?.map((a) => ({
          apiname: a.apiname,
          achieved: a.achieved,
          unlocktime: a.unlocktime,
        })) || [],
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

    const schemaUrl =
      "https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/";
    const percentagesUrl =
      "https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/";

    const [schemaResponse, percentagesResponse] = await Promise.all([
      axios.get(schemaUrl, {
        params: { key: apiKey, appid: appId, l: language },
      }),
      axios.get(percentagesUrl, { params: { gameid: appId } }),
    ]);

    const schemaAchievements =
      schemaResponse.data.game.availableGameStats.achievements;
    const percentageAchievements =
      percentagesResponse.data.achievementpercentages.achievements;

    if (!schemaAchievements) {
      return {
        success: false,
        type: "NO_ACHIEVEMENTS",
        message: "This game does not have achievements available.",
      };
    }

    const achievements = schemaAchievements.map((schema) => {
      const percentageData = percentageAchievements.find(
        (p) => p.name === schema.name
      );
      return {
        internal_name: schema.name,
        localized_name: schema.displayName,
        localized_desc: schema.description,
        icon: schema.icon.split("/").pop(),
        icongray: schema.icongray.split("/").pop(),
        hidden: schema.hidden,
        player_percent_unlocked: percentageData?.percent,
      };
    });

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

      const achieved = playerAchievement?.achieved === 1;

      return {
        name: gameAchievement.localized_name,
        description: gameAchievement.localized_desc,
        icon: achieved ? gameAchievement.icon : gameAchievement.icongray,
        hidden: gameAchievement.hidden === 1,
        player_percent_unlocked: gameAchievement.player_percent_unlocked,
        achieved,
        unlocktime: playerAchievement?.unlocktime || null,
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

async function getAchievementsHighlights(steamId, appId, language) {
  try {
    const full = await getAchievementsInfo(steamId, appId, language);

    if (!full.success) return full;

    const all = full.data.achievements;

    const unlocked = all.filter((a) => a.achieved);
    const locked = all.filter((a) => !a.achieved);

    unlocked.sort((a, b) => (b.unlocktime || 0) - (a.unlocktime || 0));

    const lastUnlocked = unlocked[0] || null;
    let lastFive = unlocked.slice(1, 6);

    if (lastFive.length < 5) {
      locked.sort((a, b) => {
        const pa = parseFloat(a.player_percent_unlocked) || 0;
        const pb = parseFloat(b.player_percent_unlocked) || 0;
        return pa - pb;
      });

      const missing = 5 - lastFive.length;
      lastFive = lastFive.concat(locked.slice(0, missing));
    }

    return {
      success: true,
      data: {
        achieved: full.data.achieved,
        max: full.data.totalAchievements,
        progress: Number(full.data.progress),

        lastUnlocked: lastUnlocked
          ? {
              img: lastUnlocked.icon,
              name: lastUnlocked.name,
              desc: lastUnlocked.description,
              unlocktime: lastUnlocked.unlocktime,
            }
          : null,

        lastFive: lastFive.map((a) => ({
          img: a.icon,
          name: a.name,
        })),
      },
    };
  } catch {
    return {
      success: false,
      message: "Internal error generating achievement highlights.",
    };
  }
}

module.exports = {
  getPlayerAchievementsByGame,
  getGameAchievements,
  getAchievementsInfo,
  getAchievementsHighlights,
};
