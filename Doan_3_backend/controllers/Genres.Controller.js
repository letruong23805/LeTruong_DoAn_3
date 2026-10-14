const genre = require("../models/Genres.models");

async function GetallGenres(req, res) {
  try {
    const Genre = await genre.GetallGenres();
    res.json(Genre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function GetidGenres(req, res) {
  try {
    const id = req.params.id;
    const Genre = await genre.GetidGenres(id);
    if (!Genre) {
      return res.status(400).json({ message: "Id không tồn tại" });
    } else {
      res.json(Genre);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function GetnameGenres(req, res) {
  try {
    const name = req.query.name;
    const Genre = await genre.GetnameGenres(name);
    if (name == "") {
      return res.json([]);
    } else {
      res.json(Genre);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function InsertGenres(req, res) {
  try {
    const { name } = req.body;
    if (name == "") {
      return res.status(400).json({ message: "Tên không được để trống" });
    }
    const existGenre = await genre.CheckGenreName(name.trim());
    if (existGenre) {
      return res.status(400).json({ message: "Tên thể loại đã tồn tại" });
    }
    const Genre = await genre.InsertGenres(name);
    res.status(201).json({ message: "Thêm thành công", Genre });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function UpdateGenres(req, res) {
  try {
    const id = req.params.id;
    const { name } = req.body;
    if (name == "") {
      return res.status(400).json({ message: "Tên không được để trống" });
    }
    const existGenre = await genre.CheckGenreNameUpdate(id, name.trim());

    if (existGenre) {
      return res.status(400).json({ message: "Tên thể loại đã tồn tại" });
    }

    const Genre = await genre.UpdateGenres(id, name);
    res.status(200).json({ message: "Sửa thành công", Genre });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function DeleteGenres(req, res) {
  try {
    const id = req.params.id;
    const Genre = await genre.DeleteGenres(id);
    res.status(200).json({ message: "xóa thành công", Genre });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  GetallGenres,
  GetidGenres,
  GetnameGenres,
  InsertGenres,
  UpdateGenres,
  DeleteGenres,
};
