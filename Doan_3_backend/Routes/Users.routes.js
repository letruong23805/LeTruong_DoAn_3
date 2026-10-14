const express = require("express");
const router = express.Router();

const Users = require("../controllers/Users.Controller");
// const { GetidUserprofiles } = require("../models/UserProfiles.models");
const authenticateToken = require("../middlewares/auth.middleware");

router.get("/all", Users.Getallusers);
router.get("/id/:id", Users.Getidusers);
router.get("/name", authenticateToken, Users.Getnamusers);
router.post("/insert", Users.Insertusers);
router.put("/update/:id", authenticateToken, Users.Upadteusers);
router.delete("/delete/:id", authenticateToken, Users.Deleteusers);
router.post("/login", Users.Loginusers);

module.exports = router;
