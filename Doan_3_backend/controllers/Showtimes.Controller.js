const Show = require("../models/Showtimes.models");

async function GetallShowtimes(req, res) {
  try {
    const showtimes = await Show.GetallShowtimes();
    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function GetidShowtimes(req, res) {
  try {
    const id = req.params.id;
    const showtimes = await Show.GetidShowtimes(id);
    if (showtimes.length === 0) {
      return res.json([]);
    }
    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function InsertShowtimes(req, res) {
  try {
    const {
      Movie_id,
      Room_id,
      Show_date,
      Start_time,
      End_time,
      Format,
      Price,
    } = req.body;
    if (
      !Movie_id ||
      !Room_id ||
      !Show_date ||
      !Start_time ||
      !End_time ||
      !Format ||
      !Price
    ) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ dữ liệu" });
    }
    const showtimes = await Show.InsertShowtimes(
      Movie_id,
      Room_id,
      Show_date,
      Start_time,
      End_time,
      Format,
      Price,
    );
    res.status(201).json({ message: "Thêm thành công", showtimes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function UpdateShowtimes(req, res) {
  try {
    const id = req.params.id;
    const {
      Movie_id,
      Room_id,
      Show_date,
      Start_time,
      End_time,
      Format,
      Price,
    } = req.body;
    if (
      !Movie_id ||
      !Room_id ||
      !Show_date ||
      !Start_time ||
      !End_time ||
      !Format ||
      !Price
    ) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ dữ liệu" });
    }
    const showtimes = await Show.UpdateShowtimes(
      id,
      Movie_id,
      Room_id,
      Show_date,
      Start_time,
      End_time,
      Format,
      Price,
    );
    if (showtimes.affectedRows === 0) {
      return res.status(404).json({ message: "Id không tồn tại" });
    }

    res.status(200).json({ message: "Cập nhật thành công", showtimes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function DeleteShowtimes(req, res) {
  try {
    const id = req.params.id;
    const showtimes = await Show.DeleteShowtimes(id);
    if (showtimes.affectedRows === 0) {
      return res.status(404).json({ message: "Id không tồn tại" });
    }
    res.status(200).json({ message: "Xóa thành công", showtimes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
module.exports = {
  GetallShowtimes,
  GetidShowtimes,
  InsertShowtimes,
  UpdateShowtimes,
  DeleteShowtimes,
};
