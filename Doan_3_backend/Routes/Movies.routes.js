const express = require("express");
const router = express.Router();

const Movies = require("../controllers/Movies.Controller");
const authenticateToken = require("../middlewares/auth.middleware");
const upload = require("../common/upload");

router.get("/all", Movies.GetallMovies);
router.get("/id/:id", Movies.GetidMovies);
router.get("/name", Movies.GetnameMovies);
router.get("/status/:status", Movies.GetMoviesByStatus);

router.post(
  "/insert",
  upload.single("Poster"),
  authenticateToken,
  Movies.InsertMovies,
);

router.put(
  "/update/:id",
  upload.single("Poster"),
  authenticateToken,
  Movies.UpdateMovies,
);

router.delete("/delete/:id", authenticateToken, Movies.deleteMovei);

module.exports = router;
