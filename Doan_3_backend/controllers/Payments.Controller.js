const paymen = require("../models/Payments.models");
async function Getallpayments(req, res) {
  try {
    const Payments = await paymen.Getallpayments();
    res.json(Payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function Getidpayments(req, res) {
  try {
    const id = req.params.id;
    const Payments = await paymen.Getidpayments(id);
    if (Payments.length === 0) {
      return res.status(404).json({ message: "Id không tồn tại" });
    }
    res.json(Payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function Insertpayments(req, res) {
  try {
    const {
      Booking_id,
      Payment_method,
      Payment_status,
      Transaction_code,
      Payment_date,
    } = req.body;
    if (
      !Booking_id ||
      !Payment_method ||
      !Payment_status ||
      !Transaction_code ||
      !Payment_date
    ) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }
    const Payments = await paymen.Insertpayments(
      Booking_id,
      Payment_method,
      Payment_status,
      Transaction_code,
      Payment_date,
    );
    res.status(201).json({ message: "Thêm thành công", Payments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function Updatepayments(req, res) {
  try {
    const id = req.params.id;
    const {
      Booking_id,
      Payment_method,
      Payment_status,
      Transaction_code,
      Payment_date,
    } = req.body;
    if (
      !Booking_id ||
      !Payment_method ||
      !Payment_status ||
      !Transaction_code ||
      !Payment_date
    ) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }
    const Payments = await paymen.Updatepayments(
      id,
      Booking_id,
      Payment_method,
      Payment_status,
      Transaction_code,
      Payment_date,
    );
    if (Payments.affectedRows === 0) {
      return res.status(404).json({ message: "ID không tồn tại" });
    }
    res.status(200).json({ message: "Cập nhật thành công", Payments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function Deletepayments(req, res) {
  try {
    const id = req.params.id;
    const Payments = await paymen.Deletepayments(id);
    if (Payments.affectedRows === 0) {
      return res.status(404).json({ message: "ID không tồn tại" });
    }
    res.status(200).json({ message: "Xóa thành công ", Payments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  Getallpayments,
  Getidpayments,
  Insertpayments,
  Updatepayments,
  Deletepayments,
};
