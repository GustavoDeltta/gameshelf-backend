const axios = require("axios");
const {
  getPlayerAchievementsByGame,
  getGameAchievements,
  getAchievementsInfo,
} = require("./steamService");

jest.mock("axios");

describe("Steam Service", () => {
  beforeAll(() => {
    process.env.STEAM_API_KEY = "test-api-key";
  });

  describe("getPlayerAchievementsByGame", () => {
    it("should return player achievements for a valid steamId and appId", async () => {
      const mockData = {
        playerstats: {
          achievements: [{ apiname: "test_achievement", achieved: 1 }],
        },
      };
      axios.get.mockResolvedValue({ data: mockData });

      const result = await getPlayerAchievementsByGame(
        "steamid",
        "appid",
        "english"
      );
      expect(result.success).toBe(true);
      expect(result.achievements).toEqual(mockData.playerstats.achievements);
    });

    it("should handle invalid steamId", async () => {
      const mockData = { playerstats: { error: "Invalid SteamID" } };
      axios.get.mockResolvedValue({ data: mockData });

      const result = await getPlayerAchievementsByGame(
        "invalid-steamid",
        "appid",
        "english"
      );
      expect(result.success).toBe(false);
      expect(result.type).toBe("INVALID_STEAMID");
    });

    it("should handle game without stats", async () => {
      const mockData = {
        playerstats: { error: "Requested stats not available" },
      };
      axios.get.mockResolvedValue({ data: mockData });

      const result = await getPlayerAchievementsByGame(
        "steamid",
        "appid-no-stats",
        "english"
      );
      expect(result.success).toBe(false);
      expect(result.type).toBe("INVALID_APPID");
    });

    it("should handle private profile or invalid format", async () => {
      axios.get.mockRejectedValue(new Error("Network error"));

      const result = await getPlayerAchievementsByGame(
        "private-steamid",
        "appid",
        "english"
      );
      expect(result.success).toBe(false);
      expect(result.type).toBe("INVALID_STEAMID");
    });
  });

  describe("getGameAchievements", () => {
    it("should return game achievements for a valid appId", async () => {
      const mockData = {
        response: {
          achievements: [{ internal_name: "test_achievement" }],
        },
      };
      axios.get.mockResolvedValue({ data: mockData });

      const result = await getGameAchievements("appid", "english");
      expect(result.success).toBe(true);
      expect(result.achievements).toEqual(mockData.response.achievements);
    });

    it("should handle invalid appId", async () => {
      const mockData = {};
      axios.get.mockResolvedValue({ data: mockData });

      const result = await getGameAchievements("invalid-appid", "english");
      expect(result.success).toBe(false);
      expect(result.type).toBe("INVALID_APPID");
    });

    it("should handle game with no achievements", async () => {
      const mockData = { response: { achievements: [] } };
      axios.get.mockResolvedValue({ data: mockData });

      const result = await getGameAchievements(
        "appid-no-achievements",
        "english"
      );
      expect(result.success).toBe(false);
      expect(result.type).toBe("NO_ACHIEVEMENTS");
    });

    it("should handle API error", async () => {
      axios.get.mockRejectedValue(new Error("Network error"));

      const result = await getGameAchievements("appid", "english");
      expect(result.success).toBe(false);
      expect(result.type).toBe("API_ERROR");
    });
  });

  describe("getAchievementsInfo", () => {
    it("should merge player and game achievements", async () => {
      const gameAchievements = {
        response: {
          achievements: [
            { internal_name: "ach1", icon_gray: "icon_gray_url" },
            { internal_name: "ach2", icon_gray: "icon_gray_url" },
          ],
        },
      };
      const playerAchievements = {
        playerstats: {
          achievements: [
            { apiname: "ach1", achieved: 1 },
            { apiname: "ach2", achieved: 0 },
          ],
        },
      };

      axios.get
        .mockResolvedValueOnce({ data: gameAchievements })
        .mockResolvedValueOnce({ data: playerAchievements });

      const result = await getAchievementsInfo("steamid", "appid", "english");

      expect(result.success).toBe(true);
      expect(result.data.totalAchievements).toBe(2);
      expect(result.data.achieved).toBe(1);
      expect(result.data.notAchieved).toBe(1);
      expect(result.data.progress).toBe(50);
      expect(result.data.achievements).toEqual([
        { internal_name: "ach1", achieved: 1 },
        { internal_name: "ach2", achieved: 0 },
      ]);
    });

    it("should handle error from getGameAchievements", async () => {
      axios.get.mockResolvedValue({ data: { response: { achievements: [] } } }); // No achievements

      const result = await getAchievementsInfo("steamid", "appid", "english");

      expect(result.success).toBe(false);
      expect(result.type).toBe("NO_ACHIEVEMENTS");
    });

    it("should handle error from getPlayerAchievementsByGame", async () => {
      const gameAchievements = {
        response: {
          achievements: [{ internal_name: "ach1", icon_gray: "icon_gray_url" }],
        },
      };
      const playerAchievementsError = {
        playerstats: { error: "Invalid SteamID" },
      };

      axios.get
        .mockResolvedValueOnce({ data: gameAchievements })
        .mockResolvedValueOnce({ data: playerAchievementsError });

      const result = await getAchievementsInfo("steamid", "appid", "english");

      expect(result.success).toBe(false);
      expect(result.type).toBe("INVALID_STEAMID");
    });

    it("should handle internal merging error", async () => {
      // Force an error during the merge logic
      axios.get
        .mockResolvedValueOnce({
          data: {
            response: {
              achievements: [
                { internal_name: "ach1", icon_gray: "icon_gray_url" },
              ],
            },
          },
        })
        .mockResolvedValueOnce({
          data: { playerstats: { achievements: null } },
        }); // Invalid player stats

      const result = await getAchievementsInfo("steamid", "appid", "english");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Internal error merging Steam data.");
    });
  });
});
