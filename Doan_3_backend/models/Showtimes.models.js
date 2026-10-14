const db = require("../common/ketnoimysql");

async function GetallShowtimes() {
  const [result] = await db.query(
    "SELECT showtime_id,movie_id,room_id,show_date,start_time,end_time,format,price,created_at FROM Showtimes",
  );
  return result;
}

async function GetidShowtimes(id) {
  const [result] = await db.query(
    "SELECT showtime_id,movie_id,room_id,show_date,start_time,end_time,format,price,created_at FROM Showtimes Where showtime_id =?",
    [id],
  );
  return result;
}
async function InsertShowtimes(
  Movie_id,
  Room_id,
  Show_date,
  Start_time,
  End_time,
  Format,
  Price,
) {
  const [result] = await db.query(
    "Insert into Showtimes(movie_id,room_id,show_date,start_time,end_time,format,price) Values(?,?,?,?,?,?,?)",
    [Movie_id, Room_id, Show_date, Start_time, End_time, Format, Price],
  );
  return result;
}

async function UpdateShowtimes(
  Showtime_id,
  Movie_id,
  Room_id,
  Show_date,
  Start_time,
  End_time,
  Format,
  Price,
) {
  const [result] = await db.query(
    "Update Showtimes set movie_id =?,room_id=?,show_date=?,start_time=?,end_time=?,format=?,price=? Where showtime_id=? ",
    [
      Movie_id,
      Room_id,
      Show_date,
      Start_time,
      End_time,
      Format,
      Price,
      Showtime_id,
    ],
  );
  return result;
}

async function DeleteShowtimes(id) {
  const [result] = await db.query(
    "DELETE FROM Showtimes WHERE showtime_id =?",
    [id],
  );
  return result;
}

module.exports = {
  GetallShowtimes,
  GetidShowtimes,
  InsertShowtimes,
  UpdateShowtimes,
  DeleteShowtimes,
};
