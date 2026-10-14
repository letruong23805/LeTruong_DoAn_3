const express = require("express");
const router = express.Router();

const Payments = require("../controllers/Payments.Controller");

router.get("/all", Payments.Getallpayments);
router.get("/id/:id", Payments.Getidpayments);
router.post("/insert", Payments.Insertpayments);
router.put("/update/:id", Payments.Updatepayments);
router.delete("/delete/:id", Payments.Deletepayments);

module.exports = router;
