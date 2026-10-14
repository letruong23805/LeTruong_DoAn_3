const db = require("../common/ketnoimysql");

async function Getallpayments() {
  const [result] = await db.query(
    "SELECT payment_id,booking_id,payment_method,payment_status,transaction_code,payment_date FROM Payments",
  );
  return result;
}

async function Getidpayments(id) {
  const [result] = await db.query(
    "SELECT payment_id,booking_id,payment_method,payment_status,transaction_code,payment_date FROM Payments WHERE payment_id = ?",
    [id],
  );
  return result;
}

async function Insertpayments(
  Booking_id,
  Payment_method,
  Payment_status,
  Transaction_code,
  Payment_date,
) {
  const [result] = await db.query(
    "INSERT INTO Payments (booking_id,payment_method,payment_status,transaction_code,payment_date) VALUES(?,?,?,?,?)",
    [
      Booking_id,
      Payment_method,
      Payment_status,
      Transaction_code,
      Payment_date,
    ],
  );
  return result;
}

async function Updatepayments(
  payment_id,
  Booking_id,
  Payment_method,
  Payment_status,
  Transaction_code,
  Payment_date,
) {
  const [result] = await db.query(
    "Update Payments set booking_id=?,payment_method=?,payment_status=?,transaction_code=?,payment_date=? Where payment_id =?",
    [
      Booking_id,
      Payment_method,
      Payment_status,
      Transaction_code,
      Payment_date,
      payment_id,
    ],
  );
  return result;
}

async function Deletepayments(id) {
  const [result] = await db.query("DELETE FROM Payments WHERE payment_id =?", [
    id,
  ]);
  return result;
}

module.exports = {
  Getallpayments,
  Getidpayments,
  Insertpayments,
  Updatepayments,
  Deletepayments,
};
