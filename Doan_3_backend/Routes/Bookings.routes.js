const express = require("express");
const router = express.Router();
const Booking = require("../controllers/Bookings.Controller");
const authenticateToken = require("../middlewares/auth.middleware");

router.get("/all", Booking.Getallbooking);
router.get("/id/:id", Booking.Getidbooking);
router.get("/user/:user_id", authenticateToken, Booking.GetBookingsByUserId);
router.post("/insert", authenticateToken, Booking.Insertbooking);
router.put("/update/:id", authenticateToken, Booking.Updatebooking);
router.delete("/delete/:id", authenticateToken, Booking.Deletebooking);

module.exports = router;
