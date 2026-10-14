const user = require("../models/Users.models");
async function Getallusers(req, res) {
  try {
    const users = await user.Getallusers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function Getidusers(req, res) {
  try {
    const id = req.params.id;
    const users = await user.Getidusers(id);
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "không tìm thấy" });
    } else {
      res.json(users);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function Getnamusers(req, res) {
  try {
    const name = req.query.name;

    if (!name || name.trim() === "") {
      return res.json([]);
    }

    const users = await user.Getnamusers(name);

    if (!users || users.length === 0) {
      return res.json([]);
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function Insertusers(req, res) {
  try {
    const { Username, Email, Password } = req.body;

    if (!Username || !Email || !Password) {
      return res.status(400).json({
        message: "Không được để trống dữ liệu",
      });
    }

    const result = await user.Insertusers(Username, Email, Password, "active");

    res.status(201).json({
      message: "Đăng ký thành công",
      token: result.token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function Upadteusers(req, res) {
  try {
    const User_id = req.params.id;
    const { Username, Email, Password, Status } = req.body;
    if (!User_id || !Username || !Email || !Password || !Status) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }
    const result = await user.Upadteusers(
      User_id,
      Username,
      Email,
      Password,
      Status,
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Không tìm thấy user để cập nhật",
      });
    }

    return res.status(200).json({
      message: "Cập nhật user thành công",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function Deleteusers(req, res) {
  try {
    const id = req.params.id;
    const result = await user.Deleteusers(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Không tìm thấy user để xóa",
      });
    }

    res.json({
      message: "Xóa user thành công",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function Loginusers(req, res) {
  try {
    const { Username, Password } = req.body;

    if (!Username || !Password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    const result = await user.Loginusers(Username, Password);

    if (!result) {
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }

    return res.status(200).json({
      message: "Đăng nhập thành công",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
module.exports = {
  Getallusers,
  Getidusers,
  Getnamusers,
  Insertusers,
  Upadteusers,
  Deleteusers,
  Loginusers,
};
