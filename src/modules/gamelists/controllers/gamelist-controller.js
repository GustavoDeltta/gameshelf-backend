const gamelistService = require("../services/gamelist-service");

class GamelistController {
  async createList(req, res) {
    const { title, description } = req.body;
    const { uid: userId } = req.user;
    try {
      const list = await gamelistService.createList(userId, title, description);
      res.status(201).json(list);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUserLists(req, res) {
    const { uid: userId } = req.user;
    try {
      const lists = await gamelistService.getUserLists(userId);
      res.status(200).json(lists);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getListById(req, res) {
    const { listId } = req.params;
    try {
      const list = await gamelistService.getListById(listId);
      res.status(200).json(list);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateList(req, res) {
    const { listId } = req.params;
    const { title, description } = req.body;
    try {
      const list = await gamelistService.updateList(listId, title, description);
      res.status(200).json(list);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteList(req, res) {
    const { listId } = req.params;
    try {
      await gamelistService.deleteList(listId);
      res.status(200).json({ message: "List deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async addGameToList(req, res) {
    const { listId } = req.params;
    const { gameId } = req.body;
    try {
      const list = await gamelistService.addGameToList(listId, gameId);
      res.status(200).json(list);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async removeGameFromList(req, res) {
    const { listId } = req.params;
    const { gameId } = req.body;
    try {
      const list = await gamelistService.removeGameFromList(listId, gameId);
      res.status(200).json(list);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new GamelistController();
