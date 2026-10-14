const db = require("../common/ketnoimysql");

async function GetallMoviedetails() {
  const [result] = await db.query(
    "SELECT movie_detail_id,movie_id,description,trailer_url,country,director,actors FROM MovieDetails",
  );
  return result;
}
async function GetidMoviedetails(id) {
  const [result] = await db.query(
    "SELECT movie_detail_id,movie_id,description,trailer_url,country,director,actors FROM MovieDetails where movie_id=?",
    [id],
  );
  return result;
}
async function InsertMoviedetails(
  Movie_id,
  Description,
  Trailer_url,
  Country,
  Director,
  Actors,
) {
  const [result] = await db.query(
    "INSERT INTO MovieDetails (movie_id,description,trailer_url,country,director,actors) VALUES(?,?,?,?,?,?)",
    [Movie_id, Description, Trailer_url, Country, Director, Actors],
  );
  return result;
}
async function UpdateMoviedetails(
  id,
  Movie_id,
  Description,
  Trailer_url,
  Country,
  Director,
  Actors,
) {
  const [result] = await db.query(
    "UPDATE MovieDetails SET movie_id=?,description=?,trailer_url=?,country=?,director=?,actors=? Where movie_detail_id=? ",
    [Movie_id, Description, Trailer_url, Country, Director, Actors, id],
  );
  return result;
}
async function DeleteMovieDetails(id) {
  const [result] = await db.query(
    "DELETE FROM MovieDetails WHERE movie_detail_id=?",
    [id],
  );
  return result;
}
async function GetidMovies(id) {
  const [result] = await db.query(
    `
    SELECT 
        m.movie_id,
        m.title,
        m.duration,
        m.release_date,
        m.poster,
        m.status,
        m.created_at,

        MAX(md.description) AS description,
        MAX(md.trailer_url) AS trailer_url,
        MAX(md.country) AS country,
        MAX(md.director) AS director,
        MAX(md.actors) AS actors,

        GROUP_CONCAT(g.genre_name) AS genres,
        GROUP_CONCAT(g.genre_id) AS genre_ids

    FROM Movies m

    LEFT JOIN MovieDetails md
        ON m.movie_id = md.movie_id

    LEFT JOIN MovieGenres mg
        ON m.movie_id = mg.movie_id

    LEFT JOIN Genres g
        ON mg.genre_id = g.genre_id

    WHERE m.movie_id = ?

    GROUP BY 
        m.movie_id,
        m.title,
        m.duration,
        m.release_date,
        m.poster,
        m.status,
        m.created_at
    `,
    [id],
  );

  return result;
}
module.exports = {
  GetallMoviedetails,
  GetidMoviedetails,
  InsertMoviedetails,
  UpdateMoviedetails,
  DeleteMovieDetails,
  GetidMovies,
};
