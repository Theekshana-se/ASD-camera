const express = require("express");
const router = express.Router();

const { getBrands } = require("../controllers/brands");

router.route("/").get(getBrands);

module.exports = router;



