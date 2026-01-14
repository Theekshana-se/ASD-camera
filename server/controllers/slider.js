const prisma = require("../utills/db");
const { asyncHandler, AppError } = require("../utills/errorHandler");
const path = require("path");
const fs = require("fs");

const listSliderItems = asyncHandler(async (req, res) => {
  const onlyActive = String(req.query.active || "").toLowerCase() === "true";
  const items = await prisma.sliderItem.findMany({ where: onlyActive ? { active: true } : {}, orderBy: { order: "asc" } });
  res.json(items);
});

function isSafeUrl(u) {
  // Accept relative URLs (starting with /) or absolute HTTPS URLs
  return typeof u === "string" && (u.startsWith("/") || /^https?:\/\//i.test(u));
}

const createSliderItem = asyncHandler(async (req, res) => {
  const { title, subtitle, imageUrl, ctaText, ctaHref, order, active } = req.body || {};
  if (!imageUrl) throw new AppError("imageUrl is required", 400);

  // Validate that imageUrl is either a base64 data URL or a regular URL
  const isBase64 = imageUrl.startsWith('data:image/');
  const isValidUrl = imageUrl.startsWith('/') || imageUrl.startsWith('http');

  if (!isBase64 && !isValidUrl) {
    throw new AppError("imageUrl must be a valid URL or base64 data URL", 400);
  }

  const item = await prisma.sliderItem.create({
    data: {
      title: title || null,
      subtitle: subtitle || null,
      imageUrl,
      ctaText: ctaText || null,
      ctaHref: ctaHref || null, // Accept any URL format
      order: Number(order) || 0,
      active: active !== undefined ? !!active : true,
    },
  });
  res.status(201).json(item);
});

const updateSliderItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, imageUrl, ctaText, ctaHref, order, active } = req.body || {};
  if (!id) throw new AppError("id is required", 400);
  const item = await prisma.sliderItem.update({
    where: { id },
    data: {
      title: title ?? undefined,
      subtitle: subtitle ?? undefined,
      imageUrl: imageUrl ?? undefined,
      ctaText: ctaText ?? undefined,
      ctaHref: ctaHref ?? undefined, // Accept any URL format
      order: order !== undefined ? Number(order) : undefined,
      active: active !== undefined ? !!active : undefined,
    },
  });
  res.json(item);
});

const deleteSliderItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new AppError("id is required", 400);
  await prisma.sliderItem.delete({ where: { id } });
  res.status(204).send();
});

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function isAllowedMime(m) {
  return ["image/jpeg", "image/png", "image/webp"].includes(String(m).toLowerCase());
}

const uploadSliderImage = asyncHandler(async (req, res) => {
  const file = req.files?.file || req.files?.files || null;
  if (!file) return res.status(400).json({ error: "No file uploaded" });
  const f = Array.isArray(file) ? file[0] : file;
  if (!isAllowedMime(f.mimetype) || f.size > 5 * 1024 * 1024) {
    return res.status(400).json({ error: "Invalid image. Allowed: jpeg, png, webp; max 5MB" });
  }
  const targetDir = path.join(__dirname, "..", "..", "public", "slider");
  ensureDir(targetDir);
  const safeName = Date.now() + "-" + String(f.name || "slide.jpg").replace(/[^a-zA-Z0-9._-]/g, "_");
  const dest = path.join(targetDir, safeName);
  await f.mv(dest);
  const url = `/slider/${safeName}`;
  res.status(200).json({ url });
});

module.exports = { listSliderItems, createSliderItem, updateSliderItem, deleteSliderItem, uploadSliderImage };