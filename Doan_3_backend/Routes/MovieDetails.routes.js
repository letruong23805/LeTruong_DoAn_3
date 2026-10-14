const express = require("express");
const router = express.Router();

const Moviesdetail = require("../controllers/MovieDetails.Controller");
const authenticateToken = require("../middlewares/auth.middleware");

router.get("/all", Moviesdetail.GetallMoviedetails);
router.get("/id/:id", Moviesdetail.GetidMoviedetails);
router.get("/iddetail/:id", Moviesdetail.GetidMovies);

router.post("/insert", authenticateToken, Moviesdetail.InsertMoviedetails);

router.put("/update/:id", authenticateToken, Moviesdetail.UpdateMoviedetails);

router.delete(
  "/delete/:id",
  authenticateToken,
  Moviesdetail.DeleteMovieDetails,
);

module.exports = router;
