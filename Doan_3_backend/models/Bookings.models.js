const db = require("../common/ketnoimysql");

async function Getallbooking() {
  const [result] = await db.query(
    "SElect booking_id,user_id,booking_code,showtime_id,total_amount,booking_status,created_at From Bookings",
  );
  return result;
}

async function Getidbooking(id) {
  const [result] = await db.query(
    "SElect booking_id,user_id,booking_code,showtime_id,total_amount,booking_status,created_at From Bookings where booking_id =?",
    [id],
  );
  return result;
}
async function Insertbooking(
  User_id,
  booking_code,
  showtime_id,
  total_amount,
  booking_status,
) {
  const [result] = await db.query(
    "Insert into Bookings (user_id, booking_code, showtime_id, total_amount, booking_status) values(?,?,?,?,?)",
    [User_id, booking_code, showtime_id, total_amount, booking_status],
  );
  return result;
}

async function Updatebooking(
  booking_id,
  User_id,
  booking_code,
  showtime_id,
  total_amount,
  booking_status,
) {
  const [result] = await db.query(
    "Update Bookings set user_id=?, booking_code =?, showtime_id=?, total_amount=?, booking_status=? where booking_id =?",
    [
      User_id,
      booking_code,
      showtime_id,
      total_amount,
      booking_status,
      booking_id,
    ],
  );
  return result;
}
async function Deletebooking(id) {
  const [result] = await db.query("delete from Bookings where booking_id =?", [
    id,
  ]);
  return result;
}
async function GetBookingsByUserId(user_id) {
  const [result] = await db.query(
    `SELECT 
      b.booking_id, b.booking_code, b.total_amount, b.booking_status, b.created_at,
      m.title, m.poster,
      t.name AS theater_name,
      r.room_name,
      st.start_time,
      GROUP_CONCAT(s.seat_number ORDER BY s.seat_number SEPARATOR ', ') AS seats
    FROM Bookings b
    JOIN Showtimes st ON b.showtime_id = st.showtime_id
    JOIN Movies m ON st.movie_id = m.movie_id
    JOIN Rooms r ON st.room_id = r.room_id
    JOIN Theaters t ON r.theater_id = t.theater_id
    LEFT JOIN BookingDetails bd ON bd.booking_id = b.booking_id
    LEFT JOIN Seats s ON s.seat_id = bd.seat_id
    WHERE b.user_id = ?
    GROUP BY b.booking_id
    ORDER BY b.created_at DESC`,
    [user_id],
  );
  return result;
}
module.exports = {
  Getallbooking,
  Getidbooking,
  GetBookingsByUserId,
  Insertbooking,
  Updatebooking,
  Deletebooking,
};
