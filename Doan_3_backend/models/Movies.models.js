const db = require("../common/ketnoimysql");

async function GetallMovies() {
  const [result] = await db.query(
    `SELECT 
      m.movie_id,
      m.title,
      m.duration,
      m.release_date,
      m.poster,
      m.status,
      m.created_at,
      GROUP_CONCAT(DISTINCT g.genre_name ORDER BY g.genre_name SEPARATOR ', ') AS genres,
      GROUP_CONCAT(DISTINCT g.genre_id ORDER BY g.genre_id) AS genre_ids
    FROM Movies m
    LEFT JOIN MovieGenres mg ON m.movie_id = mg.movie_id
    LEFT JOIN Genres g ON g.genre_id = mg.genre_id
    GROUP BY m.movie_id, m.title, m.duration, m.release_date, m.poster, m.status, m.created_at`,
  );
  return result;
}

async function GetidMovies(id) {
  const [result] = await db.query(
    `SELECT 
      m.movie_id,
      m.title,
      m.duration,
      m.release_date,
      m.poster,
      m.status,
      m.created_at,
      GROUP_CONCAT(DISTINCT g.genre_name ORDER BY g.genre_name SEPARATOR ', ') AS genres,
      GROUP_CONCAT(DISTINCT g.genre_id ORDER BY g.genre_id) AS genre_ids
    FROM Movies m
    LEFT JOIN MovieGenres mg ON m.movie_id = mg.movie_id
    LEFT JOIN Genres g ON g.genre_id = mg.genre_id
    WHERE m.movie_id = ?
    GROUP BY m.movie_id, m.title, m.duration, m.release_date, m.poster, m.status, m.created_at`,
    [id],
  );
  return result;
}

async function GetnameMovies(name) {
  const [result] = await db.query(
    `SELECT 
      m.movie_id,
      m.title,
      m.duration,
      m.release_date,
      m.poster,
      m.status,
      m.created_at,
      GROUP_CONCAT(DISTINCT g.genre_name ORDER BY g.genre_name SEPARATOR ', ') AS genres,
      GROUP_CONCAT(DISTINCT g.genre_id ORDER BY g.genre_id) AS genre_ids
    FROM Movies m
    LEFT JOIN MovieGenres mg ON m.movie_id = mg.movie_id
    LEFT JOIN Genres g ON g.genre_id = mg.genre_id
    WHERE m.title LIKE ?
    GROUP BY m.movie_id, m.title, m.duration, m.release_date, m.poster, m.status, m.created_at`,
    [`%${name}%`],
  );
  return result;
}

async function GetMoviesByStatus(status) {
  const [result] = await db.query(
    `SELECT 
      m.movie_id,
      m.title,
      m.duration,
      m.release_date,
      m.poster,
      m.status,
      m.created_at,
      GROUP_CONCAT(DISTINCT g.genre_name ORDER BY g.genre_name SEPARATOR ', ') AS genres,
      GROUP_CONCAT(DISTINCT g.genre_id ORDER BY g.genre_id) AS genre_ids
    FROM Movies m
    LEFT JOIN MovieGenres mg ON m.movie_id = mg.movie_id
    LEFT JOIN Genres g ON g.genre_id = mg.genre_id
    WHERE m.status = ?
    GROUP BY m.movie_id, m.title, m.duration, m.release_date, m.poster, m.status, m.created_at`,
    [status],
  );
  return result;
}

async function InsertMovies(
  Title,
  Duration,
  Release_date,
  Poster,
  Genre_ids,
  Status,
) {
  const [movie] = await db.query(
    `INSERT INTO Movies 
    (title, duration, release_date, poster,  status) 
    VALUES (?,?,?,?,?)`,
    [Title, Duration, Release_date, Poster, Status],
  );

  const movieId = movie.insertId;

  // insert nhiều genre
  for (let gid of Genre_ids) {
    await db.query(
      "INSERT INTO MovieGenres (movie_id, genre_id) VALUES (?,?)",
      [movieId, gid],
    );
  }

  return movie;
}

async function UpdatetMovies(
  id,
  Title,
  Duration,
  Release_date,
  Poster,
  Genre_ids,
  Status,
) {
  // update bảng Movies
  await db.query(
    `UPDATE Movies 
     SET title=?,  duration=?, release_date=?, poster=?,  status=? 
     WHERE movie_id=?`,
    [Title, Duration, Release_date, Poster, Status, id],
  );

  // xóa genre cũ
  await db.query("DELETE FROM MovieGenres WHERE movie_id=?", [id]);

  // thêm lại
  for (let gid of Genre_ids) {
    await db.query(
      "INSERT INTO MovieGenres (movie_id, genre_id) VALUES (?,?)",
      [id, gid],
    );
  }

  return { success: true };
}

async function deleteMovei(id) {
  const [showtimes] = await db.query(
    "SELECT show_date, start_time FROM Showtimes WHERE movie_id=?",
    [id],
  );

  const now = new Date();

  for (let st of showtimes) {
    const showDateTime = new Date(
      `${st.show_date.toISOString().split("T")[0]}T${st.start_time}`,
    );
    if (showDateTime > now) {
      throw new Error("Phim có suất chiếu trong tương lai, không thể xóa!");
    }
  }

  await db.query("DELETE FROM MovieGenres WHERE movie_id=?", [id]);

  await db.query("DELETE FROM Showtimes WHERE movie_id=?", [id]);

  const [result] = await db.query("DELETE FROM Movies WHERE movie_id=?", [id]);

  return result;
}

async function CheckMovieByTitle(title) {
  const [result] = await db.query(
    "SELECT movie_id FROM Movies WHERE title = ?",
    [title],
  );
  return result;
}
async function CheckMovieByTitleUpdate(title, id) {
  const [result] = await db.query(
    "SELECT movie_id FROM Movies WHERE title = ? AND movie_id != ?",
    [title, id],
  );

  return result;
}

module.exports = {
  GetallMovies,
  GetidMovies,
  GetnameMovies,
  GetMoviesByStatus,
  InsertMovies,
  UpdatetMovies,
  deleteMovei,
  CheckMovieByTitle,
  CheckMovieByTitleUpdate,
};
