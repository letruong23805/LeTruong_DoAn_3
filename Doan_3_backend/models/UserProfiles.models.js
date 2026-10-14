const db = require("../common/ketnoimysql");

async function GetallUserprofiles() {
  const [result] = await db.query(
    "Select profile_id,user_id,full_name,phone,email,date_of_birth,gender from UserProfiles",
  );
  return result;
}

async function GetidUserprofiles(id) {
  const [result] = await db.query(
    "Select profile_id,user_id,full_name,phone,email,date_of_birth,gender from UserProfiles where profile_id =?",
    [id],
  );
  return result;
}

async function GetnameUserprofiles(name) {
  const [result] = await db.query(
    "Select profile_id,user_id,full_name,phone,email,date_of_birth,gender from UserProfiles where full_name like ? ",
    [`%${name}%`],
  );
  return result;
}

async function InsertUserprofiles(User_id) {
  const [result] = await db.query(
    "Insert into UserProfiles (user_id) Values (?) ",
    [User_id],
  );
  return result;
}
async function UpdateUserprofiles(
  id,
  Full_name,
  Phone,
  Email,
  Date_of_birth,
  Gender,
) {
  const [result] = await db.query(
    "Update UserProfiles set full_name=?,phone=?,email=?,date_of_birth=?,gender=? where user_id =? ",
    [Full_name, Phone, Email, Date_of_birth, Gender, id],
  );
  return result;
}
async function DeleteUserprofiles(id) {
  const [result] = await db.query(
    "Delete from UserProfiles where user_id = ?",
    [id],
  );
  return result;
}

module.exports = {
  GetallUserprofiles,
  GetidUserprofiles,
  GetnameUserprofiles,
  InsertUserprofiles,
  UpdateUserprofiles,
  DeleteUserprofiles,
};
