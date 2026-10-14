const theat = require("../models/Theaters.models");

async function GetallTheaters(req, res) {
  try {
    const Theaters = await theat.GetallTheaters();
    res.json(Theaters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function GetidTheaters(req, res) {
  try {
    const id = req.params.id;
    const Theaters = await theat.GetidTheaters(id);
    if (Theaters.length === 0) {
      return res.status(404).json({ message: error.message });
    } else {
      res.json(Theaters);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function GetnameTheaters(req, res) {
  try {
    const Name = req.query.Name;
    if (!Name || Name.trim() === "") {
      return res.json([]);
    }
    const Theaters = await theat.GetnameTheaters(Name);
    res.json(Theaters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function InsertTheaters(req, res) {
  try {
    const { Name, Address, Phone } = req.body;
    if (!Name || !Address || !Phone) {
      return res.status(400).json({
        message: "Tên, địa chỉ và số điện thoại không được để trống",
      });
    }
    const existTheater = await theat.CheckTheaterName(Name.trim());

    if (existTheater) {
      return res.status(400).json({
        message: "Tên rạp đã tồn tại",
      });
    }
    const Theaters = await theat.InsertTheaters(Name, Address, Phone);
    res.status(201).json({ message: "Thêm thành công ", Theaters });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function UpdateTheaters(req, res) {
  try {
    const id = req.params.id;
    const { Name, Address, Phone } = req.body;
    if (Name == "" || Address == "" || Phone == "") {
      return res
        .status(400)
        .json({ message: "Tên , địa chỉ và số điện thoại ko được để rỗng" });
    }
    const existTheater = await theat.CheckTheaterNameUpdate(id, Name.trim());

    if (existTheater) {
      return res.status(400).json({
        message: "Tên rạp đã tồn tại",
      });
    }
    const Theaters = await theat.UpdateTheaters(id, Name, Address, Phone);
    res.status(200).json({ message: "Cập Nhật thành công: ", Theaters });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function DeletetTheaters(req, res) {
  try {
    const id = req.params.id;
    const Theaters = await theat.DeleteTheaters(id);
    res.status(200).json({ message: "Xóa thành công", Theaters });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
module.exports = {
  GetallTheaters,
  GetidTheaters,
  GetnameTheaters,
  InsertTheaters,
  UpdateTheaters,
  DeletetTheaters,
};
