const Bookingdetails = require("../models/Bookingdetails.models");

// Lấy tất cả
async function GetallBookingdetails(req, res) {
  try {
    const bookingdetails = await Bookingdetails.GetallBookingdetails();
    res.json(bookingdetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Lấy theo ID
async function GetidBookingdetails(req, res) {
  try {
    const id = req.params.id;
    const bookingdetails = await Bookingdetails.GetidBookingdetails(id);

    if (bookingdetails.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy chi tiết đặt vé" });
    }

    res.json(bookingdetails[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Lấy theo booking_id
async function GetBookingdetailsByBookingId(req, res) {
  try {
    const booking_id = req.params.booking_id;
    const data = await Bookingdetails.GetBookingdetailsByBookingId(booking_id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function getidseatbookingdetail(req, res) {
  try {
    const showtime_id = req.params.id;
    const data = await Bookingdetails.getidseatbookingdetail(showtime_id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Thêm mới (KHÔNG còn movie_id)
async function InsertBookingdetails(req, res) {
  try {
    const { Booking_id, Seat_id, Showtime_id } = req.body;

    if (!Booking_id || !Seat_id || !Showtime_id) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    const result = await Bookingdetails.InsertBookingdetails(
      Booking_id,
      Seat_id,
      Showtime_id,
    );

    res.status(201).json({
      message: "Thêm chi tiết đặt vé thành công",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Cập nhật (KHÔNG còn movie_id)
async function UpdateBookingdetails(req, res) {
  try {
    const id = req.params.id;
    const { Booking_id, Seat_id, Showtime_id } = req.body;

    if (!Booking_id || !Seat_id || !Showtime_id) {
      return res.status(400).json({ message: "Thiếu dữ liệu cập nhật" });
    }

    const result = await Bookingdetails.UpdateBookingdetails(
      id,
      Booking_id,
      Seat_id,
      Showtime_id,
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy để cập nhật" });
    }

    res.json({
      message: "Cập nhật thành công",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Xóa
async function DeleteBookingdetails(req, res) {
  try {
    const id = req.params.id;

    const result = await Bookingdetails.DeleteBookingdetails(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy để xóa" });
    }

    res.json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  GetallBookingdetails,
  GetidBookingdetails,
  GetBookingdetailsByBookingId,
  getidseatbookingdetail,
  InsertBookingdetails,
  UpdateBookingdetails,
  DeleteBookingdetails,
};
