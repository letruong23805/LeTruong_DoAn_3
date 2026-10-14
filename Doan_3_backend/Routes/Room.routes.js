const express = require("express");
const router = express.Router();
const Room = require("../controllers/Room.Controller");
const authenticateToken = require("../middlewares/auth.middleware");

router.get("/all", Room.GetallRom);
router.get("/id/:id", Room.GetidRoom);
router.get("/name", Room.GetnameRoom);
router.post("/Insert", authenticateToken, Room.InsertRoom);
router.put("/update/:id", authenticateToken, Room.UpdateRoom);
router.delete("/delete/:id", authenticateToken, Room.DeleteRoom);
module.exports = router;
