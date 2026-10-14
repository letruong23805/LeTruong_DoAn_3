const express = require("express");
const router = express.Router();
const ControlleruserProfile = require("../controllers/UserProfiles.Controller");
const authenticateToken = require("../middlewares/auth.middleware");

router.get("/all", authenticateToken, ControlleruserProfile.GetallUserprofiles);
router.get(
  "/id/:id",
  authenticateToken,
  ControlleruserProfile.GetidUserprofiles,
);
router.get(
  "/name",
  authenticateToken,
  ControlleruserProfile.GetnameUserprofiles,
);
router.post(
  "/insert",
  authenticateToken,
  ControlleruserProfile.InsertUserprofiles,
);
router.put(
  "/update/:id",
  authenticateToken,
  ControlleruserProfile.UpdateUserprofiles,
);
router.delete(
  "/delete/:id",
  authenticateToken,
  ControlleruserProfile.DeleteUserprofiles,
);

module.exports = router;
