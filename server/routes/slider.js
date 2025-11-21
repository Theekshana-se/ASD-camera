const express = require("express");
const router = express.Router();

const {
  listSliderItems,
  createSliderItem,
  updateSliderItem,
  deleteSliderItem,
  uploadSliderImage,
} = require("../controllers/slider");

router.route("/").get(listSliderItems).post(createSliderItem);
router.route("/:id").put(updateSliderItem).delete(deleteSliderItem);
router.post("/upload", uploadSliderImage);

module.exports = router;