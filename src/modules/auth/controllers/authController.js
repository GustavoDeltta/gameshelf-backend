const authService = require("../services/authService");

class AuthController {
  async register(req, res) {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const user = await authService.register(email, password, username);
      return res
        .status(201)
        .json({ message: "User created successfully", user });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const session = await authService.login(email, password);
      return res
        .status(200)
        .json({ message: "User logged in successfully", session });
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  }

  async linkSteamId(req, res) {
    const { steamId } = req.body;
    const { uid } = req.user;

    if (!steamId) {
      return res.status(400).json({ message: "Steam ID is required" });
    }

    try {
      const updatedUser = await authService.linkSteamId(uid, steamId);
      return res.status(200).json({
        message: "Steam ID linked successfully",
        user: updatedUser,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new AuthController();
