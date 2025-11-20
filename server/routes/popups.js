const express = require("express");
const router = express.Router();

const {
  listPopups,
  createPopup,
  updatePopup,
  deletePopup,
  activatePopup,
  getActivePopup,
} = require("../controllers/popups");

router.route("/").get(listPopups).post(createPopup);
router.route("/active").get(getActivePopup);
router.route("/:id").put(updatePopup).delete(deletePopup);
router.route("/:id/activate").put(activatePopup);

module.exports = router;