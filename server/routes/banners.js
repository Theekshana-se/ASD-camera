const express = require("express");
const router = express.Router();

const {
  listBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} = require("../controllers/banners");

router.route("/").get(listBanners).post(createBanner);
router.route("/:id").put(updateBanner).delete(deleteBanner);

module.exports = router;