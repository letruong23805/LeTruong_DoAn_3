const db = require("../common/ketnoimysql");

async function GetallSeats() {
  const [result] = await db.query(
    "SELECT seat_id,room_id,seat_number,seat_type,created_at FROM Seats",
  );
  return result;
}
async function GetidSeats(id) {
  const [result] = await db.query(
    "SELECT seat_id,room_id,seat_number,seat_type,created_at FROM Seats Where seat_id = ?",
    [id],
  );
  return result;
}
async function Getseatnumber(Seat_number) {
  const [result] = await db.query(
    "SELECT seat_id,room_id,seat_number,seat_type,created_at FROM Seats where seat_number like ?",
    [`%${Seat_number}%`],
  );
  return result;
}
async function Getseattype(Seat_type) {
  const [result] = await db.query(
    "SELECT seat_id,room_id,seat_number,seat_type,created_at FROM Seats where seat_type = ?",
    [Seat_type],
  );
  return result;
}

async function InsertSeats(Room_id, Seat_number, Seat_type) {
  const [result] = await db.query(
    "Insert into Seats (room_id, seat_number, seat_type) values(?,?,?)",
    [Room_id, Seat_number, Seat_type],
  );
  return result;
}
async function UpdateSeats(id, Room_id, Seat_number, Seat_type) {
  const [result] = await db.query(
    "Update Seats SET room_id=?,seat_number=?,seat_type=? WHERE seat_id = ?",
    [Room_id, Seat_number, Seat_type, id],
  );
  return result;
}
async function DeleteSeats(id) {
  const [result] = await db.query("DELETE FROM seats WHERE seat_id =?", [id]);
  return result;
}
async function CreateSeats(room_id, Total_seats) {
  const seats = [];

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i < Total_seats; i++) {
    // A, B, C...
    const row = letters[Math.floor(i / 10)];

    // 1 -> 10
    const number = (i % 10) + 1;

    // A1
    const seat_number = `${row}${number}`;

    seats.push([room_id, seat_number, "normal"]);
  }

  await db.query(
    "INSERT INTO Seats (room_id, seat_number, seat_type) VALUES ?",
    [seats],
  );
}
module.exports = {
  GetallSeats,
  GetidSeats,
  Getseatnumber,
  Getseattype,
  InsertSeats,
  UpdateSeats,
  DeleteSeats,
  CreateSeats,
};
