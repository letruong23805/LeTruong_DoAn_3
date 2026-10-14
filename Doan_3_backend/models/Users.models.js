const db = require("../common/ketnoimysql");
const Userprofiles = require("./UserProfiles.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function Getallusers() {
  const [result] = await db.query(
    "SELECT user_id,role_id,username,email,password,status,created_at from Users",
  );
  return result;
}
async function Getidusers(id) {
  const [result] = await db.query(
    "SELECT user_id,role_id,username,email,password,status,created_at from Users where user_id=?",
    [id],
  );
  return result;
}
async function Getnamusers(name) {
  const [result] = await db.query(
    "SELECT user_id,role_id,username,email,password,status,created_at from Users where username like ?",
    [`%${name}%`],
  );
  return result;
}
async function Insertusers(Username, Email, Password, Status) {
  const role_id = 3;

  const hashedPassword = await bcrypt.hash(Password, 10);

  const [result] = await db.query(
    "INSERT INTO Users (role_id, username, email, password, status) VALUES(?,?,?,?,?)",
    [role_id, Username, Email, hashedPassword, Status],
  );

  await Userprofiles.InsertUserprofiles(result.insertId);

  const token = jwt.sign(
    {
      user_id: result.insertId,
      role_id: role_id,
    },
    "SECRET_KEY",
    { expiresIn: "1d" },
  );

  return {
    insertId: result.insertId,
    token,
  };
}
// async function Upadteusers(User_id, Username, Email, Password, Status) {
//   const [result] = await db.query(
//     "Update Users set   username=?, email=?, password=?, status=? WHERE user_id =?",
//     [Username, Email, Password, Status, User_id],
//   );
//   return result;
// }
async function Upadteusers(User_id, Username, Email, Password, Status) {
  let query = "UPDATE Users SET username=?, email=?, status=?";
  let params = [Username, Email, Status];

  if (Password) {
    const hashedPassword = await bcrypt.hash(Password, 10);
    query += ", password=?";
    params.push(hashedPassword);
  }

  query += " WHERE user_id=?";
  params.push(User_id);

  const [result] = await db.query(query, params);
  return result;
}
async function Deleteusers(id) {
  await db.query("DELETE FROM UserProfiles WHERE user_id=?", [id]);

  const [result] = await db.query("DELETE FROM Users WHERE user_id=?", [id]);

  return result;
}
async function Loginusers(Username, Password) {
  const [result] = await db.query("SELECT * FROM Users WHERE username=?", [
    Username,
  ]);
  if (result.length === 0) {
    return null;
  }
  const user = result[0];
  const isMatch = await bcrypt.compare(Password, user.password);

  if (!isMatch) {
    return null; // sai mật khẩu
  }
  const token = jwt.sign(
    {
      user_id: user.user_id,
      role_id: user.role_id,
    },
    "SECRET_KEY",
    { expiresIn: "1d" },
  );
  return {
    token,
    user: {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      role_id: user.role_id,
    },
  };
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
