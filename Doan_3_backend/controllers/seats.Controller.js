const seatmodels = require("../models/seats.models");

async function GetallSeats(req, res) {
  try {
    const seats = await seatmodels.GetallSeats();
    res.json(seats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function GetidSeats(req, res) {
  try {
    const id = req.params.id;
    const seats = await seatmodels.GetidSeats(id);
    if (seats.length === 0) {
      return res.json([]);
    } else {
      res.json(seats);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function Getseatnumber(req, res) {
  try {
    const id = req.params.id;
    const seats = await seatmodels.Getseatnumber(id);

    if (seats.length === 0) {
      return res.json([]);
    } else {
      res.json(seats);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function Getseattype(req, res) {
  try {
    const id = req.params.id;
    const seats = await seatmodels.Getseattype(id);
    if (seats.length === 0) {
      return res.status(400).json({ message: "Loại ghế không tồn tại" });
    } else {
      res.json(seats);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function InsertSeats(req, res) {
  try {
    const { Room_id, Seat_number, Seat_type } = req.body;
    if (!Room_id || !Seat_number || !Seat_type) {
      return res.json({ message: "Dữ liệu không được để trống" });
    }
    const seats = await seatmodels.InsertSeats(Room_id, Seat_number, Seat_type);

    res.status(201).json({ message: "Thêm thành công", seats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function UpdateSeats(req, res) {
  try {
    const id = req.params.id;
    const { Room_id, Seat_number, Seat_type } = req.body;
    if (!Room_id || !Seat_number || !Seat_type) {
      return res.status(400).json({ message: "DỮ liệu không được để trống" });
    }
    const seats = await seatmodels.UpdateSeats(
      id,
      Room_id,
      Seat_number,
      Seat_type,
    );

    res.status(200).json({ message: "Sửa thành công", seats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function DeleteSeats(req, res) {
  try {
    const id = req.params.id;
    const seats = await seatmodels.DeleteSeats(id);
    res.status(200).json({ message: "Xóa thành công", seats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function CreateRoomSeats(req, res) {
  try {
    const { room_id, Total_seats } = req.body;

    if (!room_id || !Total_seats) {
      return res.status(400).json({
        message: "room_id và Total_seats không được để trống",
      });
    }

    await seatmodels.CreateSeats(room_id, Total_seats);

    res.status(201).json({
      message: "Tạo ghế thành công",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  GetallSeats,
  GetidSeats,
  Getseatnumber,
  Getseattype,
  InsertSeats,
  UpdateSeats,
  DeleteSeats,
  CreateRoomSeats,
};
