const express = require("express");
const router = express.Router();

const bookingdetails = require("../controllers/Bookingdetails.Controller");
const authenticateToken = require("../middlewares/auth.middleware");

router.get("/all", bookingdetails.GetallBookingdetails);
router.get("/id/:id", bookingdetails.GetidBookingdetails);
router.get("/showtime/:id", bookingdetails.getidseatbookingdetail);
router.get("/booking/:booking_id", bookingdetails.GetBookingdetailsByBookingId);
router.post("/insert", authenticateToken, bookingdetails.InsertBookingdetails);
router.put(
  "/update/:id",
  authenticateToken,
  bookingdetails.UpdateBookingdetails,
);
router.delete(
  "/delete/:id",
  authenticateToken,
  bookingdetails.DeleteBookingdetails,
);

module.exports = router;
