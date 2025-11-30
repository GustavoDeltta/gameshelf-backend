const express = require("express");
const router = express.Router();

const { gameInfoController } = require("../controllers/gameinfo-controller");

router.get("/game/:appId", gameInfoController);

module.exports = router;
