const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");
const authMiddleware = require("../../../core/middlewares/auth-middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/link-steam", authMiddleware, authController.linkSteamId);

module.exports = router;
