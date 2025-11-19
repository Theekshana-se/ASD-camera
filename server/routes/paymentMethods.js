const express = require("express");
const router = express.Router();
const { uploadPaymentMethodImages } = require("../controllers/paymentMethods");

router.post("/upload", uploadPaymentMethodImages);

module.exports = router;