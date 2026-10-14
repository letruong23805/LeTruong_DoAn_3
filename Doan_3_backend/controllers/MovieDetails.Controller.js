const moviesdetail = require("../models/MovieDetails.models");

async function GetallMoviedetails(req, res) {
  try {
    const Moviesdetail = await moviesdetail.GetallMoviedetails();
    res.json(Moviesdetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function GetidMoviedetails(req, res) {
  try {
    const id = req.params.id;
    const Moviesdetail = await moviesdetail.GetidMoviedetails(id);
    if (!Moviesdetail) {
      return res.json([]);
    }
    res.json(Moviesdetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function InsertMoviedetails(req, res) {
  try {
    const { Movie_id, Description, Trailer_url, Country, Director, Actors } =
      req.body;
    if (
      !Movie_id ||
      !Description ||
      !Trailer_url ||
      !Country ||
      !Director ||
      !Actors
    ) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ dữ liệu" });
    }
    const Moviesdetail = await moviesdetail.InsertMoviedetails(
      Movie_id,
      Description,
      Trailer_url,
      Country,
      Director,
      Actors,
    );
    res.json({ message: "Thêm thành công", Moviesdetail });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function UpdateMoviedetails(req, res) {
  try {
    const { Movie_id, Description, Trailer_url, Country, Director, Actors } =
      req.body;
    const id = req.params.id;
    if (
      !Movie_id ||
      !Description ||
      !Trailer_url ||
      !Country ||
      !Director ||
      !Actors
    ) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ dữ liệu" });
    }
    const Moviesdetail = await moviesdetail.UpdateMoviedetails(
      id,
      Movie_id,
      Description,
      Trailer_url,
      Country,
      Director,
      Actors,
    );
    res.json({ message: "Sửa thành công", Moviesdetail });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function DeleteMovieDetails(req, res) {
  try {
    const id = req.params.id;
    const Moviesdetail = await moviesdetail.DeleteMovieDetails(id);
    if (Moviesdetail.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy để xóa" });
    }
    res.status(200).json({ message: "Xóa thành công", Moviesdetail });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function GetidMovies(req, res) {
  try {
    const id = req.params.id;
    const Moviesdetail = await moviesdetail.GetidMovies(id);
    if (Moviesdetail.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy phim" });
    }
    res.status(200).json(Moviesdetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
module.exports = {
  GetallMoviedetails,
  GetidMoviedetails,
  InsertMoviedetails,
  UpdateMoviedetails,
  DeleteMovieDetails,
  GetidMovies,
};
