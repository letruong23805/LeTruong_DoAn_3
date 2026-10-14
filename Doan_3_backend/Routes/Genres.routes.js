const express = require("express");
const router = express.Router();

const genres = require("../controllers/Genres.Controller");
const authenticateToken = require("../middlewares/auth.middleware");

router.get("/all", genres.GetallGenres);
router.get("/id/:id", genres.GetidGenres);
router.get("/name", genres.GetnameGenres);
router.post("/insert", authenticateToken, genres.InsertGenres);
router.put("/update/:id", authenticateToken, genres.UpdateGenres);
router.delete("/delete/:id", authenticateToken, genres.DeleteGenres);
module.exports = router;
