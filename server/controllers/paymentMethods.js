const path = require("path");
const fs = require("fs");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

const uploadPaymentMethodImages = async (req, res) => {
  try {
    const files = req.files?.files || req.files?.file || null;
    if (!files) return res.status(400).json({ error: "No files uploaded" });

    const arr = Array.isArray(files) ? files : [files];
    const targetDir = path.join(__dirname, "..", "..", "public", "payment-methods");
    ensureDir(targetDir);

    const urls = [];
    for (const f of arr) {
      const safeName = Date.now() + "-" + sanitizeFileName(f.name || "logo.png");
      const dest = path.join(targetDir, safeName);
      await f.mv(dest);
      const url = `/payment-methods/${safeName}`;
      urls.push(url);
    }

    return res.status(200).json({ urls });
  } catch (e) {
    return res.status(500).json({ error: "Upload failed" });
  }
};

module.exports = { uploadPaymentMethodImages };