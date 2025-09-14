const express = require("express");
const router = express.Router();
const captainController = require("../controllers/captain.controller.js");
const authMiddleware = require("../middleware/authMiddleware.js");

router.post("/register", captainController.register);
router.post("/login", captainController.login);
router.get("/logout", captainController.logout);
router.get("/profile", authMiddleware.captainAuth, captainController.profile);
router.patch("/toggle-availability", authMiddleware.captainAuth, captainController.toggleAvailability);
router.get("/new-ride", authMiddleware.captainAuth, captainController.waitForNewRise);

module.exports = router;
