const express = require("express");
const router = express.Router();

const {
  listClientLogos,
  createClientLogo,
  updateClientLogo,
  deleteClientLogo,
  uploadClientLogoImage
} = require("../controllers/clientLogos");

router.post("/upload", uploadClientLogoImage);
router.route("/").get(listClientLogos).post(createClientLogo);
router.route("/:id").put(updateClientLogo).delete(deleteClientLogo);

module.exports = router;