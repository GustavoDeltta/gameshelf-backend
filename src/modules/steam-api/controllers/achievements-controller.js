const steamService = require("../services/achievements-service");
const { SUPPORTED_LANGUAGES } = require("../../../core/utils/Constants");

async function getPlayerAchievementsByGame(req, res) {
  try {
    const { appId, playerId } = req.params;

    const language = req.query.language;

    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return res.status(400).json({
        success: false,
        message: `Unsupported language '${language}'. Supported languages: ${SUPPORTED_LANGUAGES.join(
          ", "
        )}`,
      });
    }

    if (!appId || !playerId) {
      return res.status(400).json({
        success: false,
        error: "Missing required parameters: appId and playerId.",
      });
    }

    if (isNaN(appId) || isNaN(playerId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid parameter format: appId and playerId must be numbers.",
      });
    }

    const result = await steamService.getAchievementsInfo(
      playerId,
      appId,
      language
    );

    if (!result.success) {
      return res.json({
        success: false,
        message: result.message,
      });
    }

    return res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Error fetching player achievements:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error while fetching achievements.",
    });
  }
}

async function getAchievementsHighlights(req, res) {
  try {
    const { appId, playerId } = req.params;
    const language = req.query.language;

    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return res.status(400).json({
        success: false,
        message: `Unsupported language '${language}'. Supported languages: ${SUPPORTED_LANGUAGES.join(
          ", "
        )}`,
      });
    }

    if (!appId || !playerId) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters: appId and playerId.",
      });
    }

    if (isNaN(appId) || isNaN(playerId)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid parameter format: appId and playerId must be numbers.",
      });
    }

    const result = await steamService.getAchievementsHighlights(
      playerId,
      appId,
      language
    );

    if (!result.success) {
      return res.json({
        success: false,
        message: result.message,
      });
    }

    return res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Error fetching highlighted achievements:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching highlighted achievements.",
    });
  }
}

module.exports = {
  getPlayerAchievementsByGame,
  getAchievementsHighlights,
};
