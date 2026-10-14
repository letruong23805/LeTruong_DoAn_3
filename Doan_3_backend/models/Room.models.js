const db = require("../common/ketnoimysql");

async function GetallRoom() {
  const [result] = await db.query(
    "SELECT room_id,theater_id,room_name,total_seats,created_at From Rooms",
  );
  return result;
}

async function GetidRoom(id) {
  const [result] = await db.query(
    "SELECT room_id,theater_id,room_name,total_seats,created_at From Rooms Where room_id=?",
    [id],
  );
  return result;
}

async function GetnameRoom(name) {
  const [result] = await db.query(
    "SELECT room_id,theater_id,room_name,total_seats,created_at From Rooms Where room_name like ?",
    [`%${name}%`],
  );
  return result;
}

async function InsertRoom(Theater_id, Room_name, Total_seats) {
  const [result] = await db.query(
    "Insert into Rooms (theater_id,room_name,total_seats) VALUES(?,?,?)",
    [Theater_id, Room_name, Total_seats],
  );
  return result;
}
async function UpdateRoom(id, Theater_id, Room_name, Total_seats) {
  const [result] = await db.query(
    "UPDATE Rooms set theater_id=?, room_name=?, total_seats=? WHERE room_id=?",
    [Theater_id, Room_name, Total_seats, id],
  );
  return result;
}
async function DeleteRoom(id) {
  const [result] = await db.query("DELETE FROM Rooms where room_id =?", [id]);
  return result;
}
async function CheckRoomName(Room_name) {
  const [result] = await db.query("SELECT * FROM Rooms WHERE room_name = ?", [
    Room_name,
  ]);
  return result;
}
async function CheckRoomNameUpdate(Room_name, room_id) {
  const [result] = await db.query(
    "SELECT * FROM Rooms WHERE room_name = ? AND room_id <> ?",
    [Room_name, room_id],
  );

  return result;
}
module.exports = {
  GetallRoom,
  GetidRoom,
  GetnameRoom,
  InsertRoom,
  UpdateRoom,
  DeleteRoom,
  CheckRoomName,
  CheckRoomNameUpdate,
};
