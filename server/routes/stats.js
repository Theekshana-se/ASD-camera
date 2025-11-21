const express = require("express");
const router = express.Router();

const { getCounts, getTrends } = require("../controllers/stats");

router.get("/counts", getCounts);
router.get("/trends", getTrends);

module.exports = router;