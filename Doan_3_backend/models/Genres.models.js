const db = require("../common/ketnoimysql");

async function GetallGenres() {
  const [result] = await db.query(
    "SELECT genre_id, genre_name FROM Genres ORDER BY genre_id ASC",
  );
  return result;
}

async function GetidGenres(id) {
  const [result] = await db.query(
    "SELECT genre_id, genre_name FROM Genres WHERE genre_id = ?",
    [id],
  );
  return result;
}

async function GetnameGenres(name) {
  const [result] = await db.query(
    "SELECT genre_id, genre_name FROM Genres WHERE genre_name Like ? ",
    [`%${name}%`],
  );
  return result;
}
async function InsertGenres(name) {
  const [result] = await db.query(
    "Insert into Genres (genre_name) VALUES (?)",
    [name],
  );
  return result;
}
async function UpdateGenres(id, name) {
  const [result] = await db.query(
    "UPDATE Genres SET genre_name =? WHERE genre_id = ? ",
    [name, id],
  );
  return result;
}

async function DeleteGenres(id) {
  const [result] = await db.query("DELETE FROM Genres where genre_id = ? ", [
    id,
  ]);
  return result;
}
async function CheckGenreName(name) {
  const [result] = await db.query("SELECT * FROM Genres WHERE genre_name = ?", [
    name,
  ]);
  return result[0];
}

async function CheckGenreNameUpdate(id, name) {
  const [result] = await db.query(
    "SELECT * FROM Genres WHERE genre_name = ? AND genre_id != ?",
    [name, id],
  );
  return result[0];
}
module.exports = {
  GetallGenres,
  GetidGenres,
  GetnameGenres,
  InsertGenres,
  UpdateGenres,
  DeleteGenres,
  CheckGenreName,
  CheckGenreNameUpdate,
};
