const express = require("express");
const router = express.Router();

const {
  listClientLogos,
  createClientLogo,
  updateClientLogo,
  deleteClientLogo,
} = require("../controllers/clientLogos");

router.route("/").get(listClientLogos).post(createClientLogo);
router.route("/:id").put(updateClientLogo).delete(deleteClientLogo);

module.exports = router;