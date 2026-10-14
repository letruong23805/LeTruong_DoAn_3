const db = require("../common/ketnoimysql");

async function GetallTheaters() {
  const [result] = await db.query(
    "select theater_id,name,address,phone,created_at from Theaters",
  );
  return result;
}
async function GetidTheaters(id) {
  const [result] = await db.query("SElect * from Theaters where theater_id=?", [
    id,
  ]);
  return result;
}
async function GetnameTheaters(Name) {
  const [result] = await db.query(
    "select theater_id,name,address,phone,created_at from Theaters where name like ? ",
    [`%${Name}%`],
  );
  return result;
}
async function InsertTheaters(Name, Address, Phone) {
  const [result] = await db.query(
    "Insert into Theaters (name, address, phone) VALUES (?,?,?)",
    [Name, Address, Phone],
  );
  return result;
}
async function UpdateTheaters(id, Name, Address, Phone) {
  const [result] = await db.query(
    "UPDATE Theaters SET name=?, address=?,phone=? WHERE theater_id =?",
    [Name, Address, Phone, id],
  );
  return result;
}
async function DeleteTheaters(id) {
  const [result] = await db.query("DELETE from Theaters where theater_id = ?", [
    id,
  ]);
  return result;
}
async function CheckTheaterName(Name) {
  const [result] = await db.query("SELECT * FROM Theaters WHERE name = ?", [
    Name,
  ]);
  return result[0];
}

async function CheckTheaterNameUpdate(id, Name) {
  const [result] = await db.query(
    "SELECT * FROM Theaters WHERE name = ? AND theater_id != ?",
    [Name, id],
  );
  return result[0];
}
module.exports = {
  GetallTheaters,
  GetidTheaters,
  GetnameTheaters,
  InsertTheaters,
  UpdateTheaters,
  DeleteTheaters,
  CheckTheaterName,
  CheckTheaterNameUpdate,
};
