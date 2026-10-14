const express = require("express");
const router = express.Router();
const controllertheaters = require("../controllers/theaters.Controller");
const authenticateToken = require("../middlewares/auth.middleware");

router.get("/All", controllertheaters.GetallTheaters);
router.get("/id/:id", controllertheaters.GetidTheaters);
router.get("/Name", controllertheaters.GetnameTheaters);
router.post("/Insert", authenticateToken, controllertheaters.InsertTheaters);
router.put("/update/:id", authenticateToken, controllertheaters.UpdateTheaters);
router.delete(
  "/delete/:id",
  authenticateToken,
  controllertheaters.DeletetTheaters,
);

module.exports = router;
