const Userprofilesmodule = require("../models/UserProfiles.models");

async function GetallUserprofiles(req, res) {
  try {
    const Userprofiles = await Userprofilesmodule.GetallUserprofiles();
    res.json(Userprofiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function GetidUserprofiles(req, res) {
  try {
    const id = req.params.id;
    const Userprofiles = await Userprofilesmodule.GetidUserprofiles(id);
    if (!Userprofiles || Userprofiles.length === 0)
      return res.status(404).json({ message: "Không tìm thấy" });
    else {
      res.json(Userprofiles);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function GetnameUserprofiles(req, res) {
  try {
    const name = req.query.name;
    const Userprofiles = await Userprofilesmodule.GetnameUserprofiles(name);
    if (!Userprofiles || name.trim() === "") {
      return res.json([]);
    } else {
      res.json(Userprofiles);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function InsertUserprofiles(req, res) {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "Thiếu user_id" });
    }

    const result = await Userprofilesmodule.InsertUserprofiles(user_id);

    res.status(201).json({
      message: "Tạo profile thành công",
      profile_id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function UpdateUserprofiles(req, res) {
  try {
    const id = req.params.id; // ✅ lấy từ URL

    const { full_name, phone, email, date_of_birth, gender } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Thiếu id",
      });
    }

    const result = await Userprofilesmodule.UpdateUserprofiles(
      id,
      full_name,
      phone,
      email,
      date_of_birth,
      gender,
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Không tìm thấy profile",
      });
    }

    res.json({
      message: "Cập nhật profile thành công",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function DeleteUserprofiles(req, res) {
  try {
    const id = req.params.id;
    const Userprofiles = await Userprofilesmodule.DeleteUserprofiles(id);
    if (!Userprofiles || Userprofiles.affectedRows === 0) {
      return res.status(404).json({
        message: "Không tìm thấy User Profile để xóa",
      });
    } else {
      res.json({ message: "Xóa thành công", Userprofiles });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  GetallUserprofiles,
  GetidUserprofiles,
  GetnameUserprofiles,
  InsertUserprofiles,
  UpdateUserprofiles,
  DeleteUserprofiles,
};
