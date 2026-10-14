const room = require("../models/Room.models");

async function GetallRom(req, res) {
  try {
    const Roms = await room.GetallRoom();
    res.json(Roms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function GetidRoom(req, res) {
  try {
    const id = req.params.id;
    const Roms = await room.GetidRoom(id);
    if (!Roms) {
      res.status(400).json({ message: "ID không tồn tại" });
    } else {
      res.json(Roms);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function GetnameRoom(req, res) {
  try {
    const name = req.query.name;
    const Roms = await room.GetnameRoom(name);
    if (Roms.length === 0) {
      return res.json([]);
    } else {
      res.json(Roms);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function InsertRoom(req, res) {
  try {
    const { Theater_id, Room_name, Total_seats } = req.body;

    if (!Theater_id || !Room_name || !Total_seats) {
      return res.status(400).json({
        message: "Id rạp, tên phòng và số ghế không được để trống",
      });
    }

    const checkRoom = await room.CheckRoomName(Room_name);

    if (checkRoom.length > 0) {
      return res.status(400).json({
        message: "Tên phòng đã tồn tại",
      });
    }

    const Roms = await room.InsertRoom(Theater_id, Room_name, Total_seats);

    res.status(201).json({
      message: "Thêm phòng thành công",
      Roms,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function UpdateRoom(req, res) {
  try {
    const id = req.params.id;
    const { Theater_id, Room_name, Total_seats } = req.body;
    if (!Theater_id || !Room_name || !Total_seats) {
      return res
        .status(400)
        .json({ message: "Id,tên phòng và chỗ ngồi ko được để trống", Roms });
    }
    const checkRoom = await room.CheckRoomNameUpdate(Room_name, id);

    if (checkRoom.length > 0) {
      return res.status(400).json({
        message: "Tên phòng đã tồn tại",
      });
    }

    const Roms = await room.UpdateRoom(id, Theater_id, Room_name, Total_seats);

    res.json({ message: "Cập nhật phòng thành công", Roms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function DeleteRoom(req, res) {
  try {
    const id = req.params.id;
    const Roms = await room.DeleteRoom(id);
    res.status(200).json({ message: "Xóa thành công", Roms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  GetallRom,
  GetidRoom,
  GetnameRoom,
  InsertRoom,
  UpdateRoom,
  DeleteRoom,
};
