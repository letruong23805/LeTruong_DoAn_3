const express = require("express");
const router = express.Router();
const seats = require("../controllers/seats.Controller");
const authenticateToken = require("../middlewares/auth.middleware");

router.get("/all", seats.GetallSeats);
router.get("/id/:id", seats.GetidSeats);
router.get("/number/:id", seats.Getseatnumber);
router.get("/type/:id", authenticateToken, seats.Getseattype);
router.post("/Insert", authenticateToken, seats.InsertSeats);
router.put("/Update/:id", authenticateToken, seats.UpdateSeats);
router.delete("/delete/:id", authenticateToken, seats.DeleteSeats);
router.post("/create-seats", authenticateToken, seats.CreateRoomSeats);

module.exports = router;
