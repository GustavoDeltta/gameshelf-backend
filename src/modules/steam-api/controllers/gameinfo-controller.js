const { getGameInfo } = require("../services/gameinfo-service");

async function gameInfoController(req, res) {
  const { appId } = req.params;

  const result = await getGameInfo(appId);

  if (!result.success) {
    return res.status(404).json(result);
  }

  return res.json(result);
}

module.exports = { gameInfoController };
