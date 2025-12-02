const { auth } = require("../../../core/config/firebase");
const userRepository = require("../repositories/userRepository");
const User = require("../models/User");
const axios = require("axios");
const { refreshToken } = require("firebase-admin/app");
const steamUserService = require("../../steam-api/services/steamUserService");
require("dotenv").config();

const FIREBASEE_API_KEY = process.env.FIREBASE_API_KEY;

class AuthService {
  async register(email, password, username) {
    try {
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: username,
      });

      const newUser = new User(userRecord.uid, email, username);
      await userRepository.save(newUser);
      return newUser;
    } catch (error) {
      throw new Error("Erro ao criar usuário: " + error.message);
    }
  }

  async login(email, password) {
    try {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASEE_API_KEY}`;
      const response = await axios.post(url, {
        email,
        password,
        returnSecureToken: true,
      });
      return {
        token: response.data.idToken,
        uid: response.data.localId,
        refreshToken: response.data.refreshToken,
        expiresIn: response.data.expiresIn,
      };
    } catch (error) {
      throw new Error("Credenciais inválidas ou erro no login.");
    }
  }

  async linkSteamId(uid, steamId) {
    try {
      const user = await userRepository.findByUid(uid);
      if (!user) {
        throw new Error("Usuário não encontrado.");
      }

      const [playerSummary, ownedGames] = await Promise.all([
        steamUserService.getPlayerSummary(steamId),
        steamUserService.getOwnedGames(steamId),
      ]);

      const userDataToUpdate = {
        steamId: steamId,
        steamProfilePicture: playerSummary ? playerSummary.steamProfilePicture : null,
        ownedGames: ownedGames,
      };

      await userRepository.update(uid, userDataToUpdate);

      const updatedUser = await userRepository.findByUid(uid);
      return updatedUser;
    } catch (error) {
      throw new Error("Erro ao vincular Steam ID: " + error.message);
    }
  }
}

module.exports = new AuthService();
