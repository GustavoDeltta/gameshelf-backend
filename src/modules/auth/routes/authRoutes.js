const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../../../core/middlewares/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/link-steam", authMiddleware, authController.linkSteamId);

module.exports = router;
