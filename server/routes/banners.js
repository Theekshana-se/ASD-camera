const express = require("express");
const router = express.Router();

const {
  listBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadBannerImage,
} = require("../controllers/banners");

router.post("/upload", uploadBannerImage);
router.route("/").get(listBanners).post(createBanner);
router.route("/:id").put(updateBanner).delete(deleteBanner);

module.exports = router;