const express = require("express");
const router = express.Router();
const gamelistController = require("../controllers/gamelist-controller");
const authMiddleware = require("../../../core/middlewares/auth-middleware");

router.use(authMiddleware);

router.post("/", gamelistController.createList);
router.get("/", gamelistController.getUserLists);
router.get("/:listId", gamelistController.getListById);
router.put("/:listId", gamelistController.updateList);
router.delete("/:listId", gamelistController.deleteList);

router.post("/:listId/games", gamelistController.addGameToList);
router.delete("/:listId/games", gamelistController.removeGameFromList);

module.exports = router;
