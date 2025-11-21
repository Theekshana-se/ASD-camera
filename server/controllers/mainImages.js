const prisma = require("../utills/db");
function isAllowedMime(m) {
  return ["image/jpeg", "image/png", "image/webp"].includes(String(m).toLowerCase());
}

async function uploadMainImage(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Nema otpremljenih fajlova" });
    }
  
    // Get file from a request
    const uploadedFile = req.files.uploadedFile;
  
    if (!uploadedFile || !isAllowedMime(uploadedFile.mimetype) || uploadedFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: "Invalid image. Allowed types: jpeg, png, webp; max 5MB" });
    }

    uploadedFile.mv('../public/' + uploadedFile.name, (err) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.status(200).json({ message: "Fajl je uspešno otpremljen" });
    });
  }

  module.exports = {
    uploadMainImage
};