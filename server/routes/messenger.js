const express = require("express");
const router = express.Router();

const { sendOrderMessage } = require("../controllers/messenger");

router.post("/order-notify", sendOrderMessage);

module.exports = router;