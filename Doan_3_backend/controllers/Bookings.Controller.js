const bookings = require("../models/Bookings.models");

async function Getallbooking(req, res) {
  try {
    const booking = await bookings.Getallbooking();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function Getidbooking(req, res) {
  try {
    const id = req.params.id;
    const booking = await bookings.Getidbooking(id);
    if (booking.length === 0) {
      res.status(404).json({ message: "Booking không tồn tại" });
    } else {
      res.json(booking);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function Insertbooking(req, res) {
  try {
    const { User_id, booking_code, showtime_id, total_amount, booking_status } =
      req.body;
    if (!User_id || !booking_code || !showtime_id || !booking_status) {
      return res
        .status(400)
        .json({ message: "vui lòng nhập đầy đủ thông tin" });
    }
    const booking = await bookings.Insertbooking(
      User_id,
      booking_code,
      showtime_id,
      total_amount ?? 0,
      booking_status,
    );
    res.status(200).json({ message: "Thêm thành công", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function Updatebooking(req, res) {
  try {
    const id = req.params.id;
    const { User_id, booking_code, showtime_id, total_amount, booking_status } =
      req.body;
    if (
      !User_id ||
      !booking_code ||
      !showtime_id ||
      !total_amount ||
      !booking_status
    ) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }
    const booking = await bookings.Updatebooking(
      id,
      User_id,
      booking_code,
      showtime_id,
      total_amount,
      booking_status,
    );
    if (booking.affectedRows === 0) {
      return res.status(404).json({ message: "Booking không tồn tại" });
    }
    res.json({ message: "Cập nhật thành công", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function Deletebooking(req, res) {
  try {
    const id = req.params.id;
    const booking = await bookings.Deletebooking(id);
    if (booking.affectedRows === 0) {
      return res.status(404).json({ message: "Booking không tồn tại" });
    }
    res.status(200).json({ message: "Xóa thành công", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function GetBookingsByUserId(req, res) {
  try {
    const user_id = req.params.user_id;
    const result = await bookings.GetBookingsByUserId(user_id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
module.exports = {
  Getallbooking,
  Getidbooking,
  Insertbooking,
  Updatebooking,
  Deletebooking,
  GetBookingsByUserId,
};
