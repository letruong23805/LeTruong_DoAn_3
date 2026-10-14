const movies = require("../models/Movies.models");

async function GetallMovies(req, res) {
  try {
    const result = await movies.GetallMovies();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function GetidMovies(req, res) {
  try {
    const id = req.params.id;
    const result = await movies.GetidMovies(id);
    if (result.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy phim" });
    }
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function GetnameMovies(req, res) {
  try {
    const name = req.query.name;
    if (!name || name.trim() === "") {
      return res.json([]);
    }
    const result = await movies.GetnameMovies(name);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function GetMoviesByStatus(req, res) {
  try {
    const { status } = req.params;
    const validStatuses = ["showing", "coming", "ended"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Trạng thái không hợp lệ (showing | coming | ended)",
      });
    }
    const result = await movies.GetMoviesByStatus(status);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function InsertMovies(req, res) {
  try {
    const {
      Title,
      Duration,
      Release_date,
      Genre_ids, // <-- đổi thành mảng
      Status,
    } = req.body;
    const checkMovie = await movies.CheckMovieByTitle(Title);

    if (checkMovie.length > 0) {
      return res.status(400).json({
        message: "Tên phim đã tồn tại",
      });
    }
    const Poster = req.file ? `/uploads/${req.file.filename}` : null;
    const Movies = await movies.InsertMovies(
      Title,
      Duration,
      Release_date,
      Poster,
      Genre_ids,
      Status,
    );
    res.status(201).json({
      message: "Thêm phim thành công",
      movieId: Movies.insertId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function UpdateMovies(req, res) {
  try {
    const id = req.params.id;

    const { Title, Duration, Release_date, Genre_ids, Status } = req.body;

    const Poster = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await movies.UpdatetMovies(
      id,
      Title,
      Duration,
      Release_date,
      Poster,
      Genre_ids,
      Status,
    );
    const checkMovie = await movies.CheckMovieByTitleUpdate(Title, id);

    if (checkMovie.length > 0) {
      return res.status(400).json({
        message: "Tên phim đã tồn tại",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Không tìm thấy phim để cập nhật",
      });
    }

    res.json({
      message: "Cập nhật phim thành công",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function deleteMovei(req, res) {
  try {
    const id = req.params.id;
    const result = await movies.deleteMovei(id);
    if (result.affectedRows === 0) {
      res.status(400).json({ message: "Không tìm thấy phim để xóa" });
    } else {
      res.status(200).json({ message: "Xóa phim thành công" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}
module.exports = {
  GetallMovies,
  GetidMovies,
  GetnameMovies,
  GetMoviesByStatus,
  InsertMovies,
  UpdateMovies,
  deleteMovei,
};
