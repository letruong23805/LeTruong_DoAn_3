const db = require("../common/ketnoimysql");

// Lấy tất cả
async function GetallBookingdetails() {
  const [result] = await db.query(
    "SELECT booking_detail_id, booking_id, seat_id, showtime_id FROM BookingDetails",
  );
  return result;
}

// Lấy theo ID
async function GetidBookingdetails(id) {
  const [result] = await db.query(
    "SELECT booking_detail_id, booking_id, seat_id, showtime_id FROM BookingDetails WHERE booking_detail_id = ?",
    [id],
  );
  return result;
}

// Lấy theo booking_id
async function GetBookingdetailsByBookingId(booking_id) {
  const [result] = await db.query(
    "SELECT booking_detail_id, booking_id, seat_id, showtime_id FROM BookingDetails WHERE booking_id = ?",
    [booking_id],
  );
  return result;
}
async function getidseatbookingdetail(showtime_id) {
  const [result] = await db.query(
    "SELECT seat_id from BookingDetails WHERE showtime_id = ? ",
    [showtime_id],
  );
  return result;
}
async function InsertBookingdetails(Booking_id, Seat_id, Showtime_id) {
  const [result] = await db.query(
    "INSERT INTO BookingDetails (booking_id, seat_id, showtime_id) VALUES (?,?,?)",
    [Booking_id, Seat_id, Showtime_id],
  );
  return result;
}

async function UpdateBookingdetails(
  Booking_detail_id,
  Booking_id,
  Seat_id,
  Showtime_id,
) {
  const [result] = await db.query(
    "UPDATE BookingDetails SET booking_id=?, seat_id=?, showtime_id=? WHERE booking_detail_id=?",
    [Booking_id, Seat_id, Showtime_id, Booking_detail_id],
  );
  return result;
}

// Xóa
async function DeleteBookingdetails(Booking_detail_id) {
  const [result] = await db.query(
    "DELETE FROM BookingDetails WHERE booking_detail_id=?",
    [Booking_detail_id],
  );
  return result;
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
