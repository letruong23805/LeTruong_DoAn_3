// routes/movieStatsRouter.js
const express = require("express");
const router = express.Router();
const movieStatsController = require("../controllers/movieStats.Controller");

// GET /api/moviestats
router.get("/", movieStatsController.getStats);

module.exports = router;
