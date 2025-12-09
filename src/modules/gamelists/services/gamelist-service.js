const gamelistRepository = require("../repositories/gamelist-repository");
const Gamelist = require("../models/gamelist");
const { getGameInfo } = require("../../steam-api/services/gameinfo-service");
const admin = require("firebase-admin");

const FieldValue = admin.firestore.FieldValue;

class GamelistService {
  async createList(userId, title, description) {
    const newList = new Gamelist(userId, title, description);
    const listId = await gamelistRepository.save(newList);
    return gamelistRepository.findById(listId);
  }

  async getUserLists(userId) {
    return gamelistRepository.findByUser(userId);
  }

  async getListById(listId) {
    const list = await gamelistRepository.findById(listId);
    if (!list) {
      throw new Error("Game list not found.");
    }

    // This is not efficient for large lists, but for now it's ok.
    // A better approach would be to store game info in the list, or fetch it on demand on the client side.
    const games = [];
    for (const gameId of list.games) {
        const gameInfo = await getGameInfo(gameId, "brazilian");
        if(gameInfo.success) {
            games.push(gameInfo.data);
        }
    }
    list.games = games;

    return list;
  }

  async updateList(listId, title, description) {
    await gamelistRepository.update(listId, { title, description });
    return gamelistRepository.findById(listId);
  }

  async deleteList(listId) {
    await gamelistRepository.delete(listId);
    return { message: "List deleted successfully" };
  }

  async addGameToList(listId, gameId) {
    await gamelistRepository.update(listId, {
      games: FieldValue.arrayUnion(gameId),
    });
    return gamelistRepository.findById(listId);
  }

  async removeGameFromList(listId, gameId) {
    await gamelistRepository.update(listId, {
      games: FieldValue.arrayRemove(gameId),
    });
    return gamelistRepository.findById(listId);
  }
}

module.exports = new GamelistService();