const axios = require("axios");
require("dotenv").config();

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_API_BASE_URL = "https://api.steampowered.com";

class SteamUserService {
  async getPlayerSummary(steamId) {
    try {
      const url = `${STEAM_API_BASE_URL}/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`;
      const response = await axios.get(url);
      const players = response.data.response.players;
      if (players && players.length > 0) {
        return {
          steamProfilePicture: players[0].avatarfull,
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching Steam player summary:", error);
      throw new Error("Failed to fetch Steam player summary.");
    }
  }

  async getOwnedGames(steamId) {
    try {
      const url = `${STEAM_API_BASE_URL}/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${steamId}&format=json&include_appinfo=true`;
      const response = await axios.get(url);
      const games = response.data.response.games;
      if (games) {
        return games.map((game) => ({
          appid: game.appid,
          name: game.name,
          playtime_forever: game.playtime_forever,
          playtime_2weeks: game.playtime_2weeks || null,
          last_played: game.rtime_last_played,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching Steam owned games:", error);
      throw new Error("Failed to fetch Steam owned games.");
    }
  }
}

module.exports = new SteamUserService();
