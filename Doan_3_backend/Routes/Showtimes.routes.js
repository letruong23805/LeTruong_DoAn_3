const express = require("express");
const router = express.Router();

const Showtimes = require("../controllers/Showtimes.Controller");
const authenticateToken = require("../middlewares/auth.middleware");

router.get("/all", Showtimes.GetallShowtimes);
router.get("/id/:id", Showtimes.GetidShowtimes);
router.post("/insert", authenticateToken, Showtimes.InsertShowtimes);
router.put("/update/:id", authenticateToken, Showtimes.UpdateShowtimes);
router.delete("/delete/:id", authenticateToken, Showtimes.DeleteShowtimes);

module.exports = router;
