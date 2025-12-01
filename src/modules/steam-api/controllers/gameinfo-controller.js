const { getGameInfo } = require("../services/gameinfo-service");


async function gameInfoController(req, res) {
  const { appId } = req.params;
  const language = req.query.language;
  const steamid = req.query.steamid;

  return res.json(await getGameInfo(appId, language, steamid));
}

module.exports = { gameInfoController };
