const prisma = require("../utills/db");
const { asyncHandler, AppError } = require("../utills/errorHandler");
const path = require("path");
const fs = require("fs");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function isAllowedMime(m) {
  return ["image/jpeg", "image/png", "image/webp"].includes(String(m).toLowerCase());
}

const listBanners = asyncHandler(async (req, res) => {
  const items = await prisma.banner.findMany({ orderBy: { order: "asc" } });
  res.json(items);
});

const createBanner = asyncHandler(async (req, res) => {
  const { imageUrl, title, href, position, order, active } = req.body || {};
  if (!imageUrl) throw new AppError("imageUrl is required", 400);
  const item = await prisma.banner.create({
    data: {
      imageUrl,
      title: title || null,
      href: href || null,
      position: position || "home",
      order: Number(order) || 0,
      active: active !== undefined ? !!active : true,
    },
  });
  res.status(201).json(item);
});

const updateBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { imageUrl, title, href, position, order, active } = req.body || {};
  if (!id) throw new AppError("id is required", 400);
  const item = await prisma.banner.update({
    where: { id },
    data: {
      imageUrl: imageUrl ?? undefined,
      title: title ?? undefined,
      href: href ?? undefined,
      position: position ?? undefined,
      order: order !== undefined ? Number(order) : undefined,
      active: active !== undefined ? !!active : undefined,
    },
  });
  res.json(item);
});

const deleteBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new AppError("id is required", 400);
  await prisma.banner.delete({ where: { id } });
  res.status(204).send();
});

const uploadBannerImage = asyncHandler(async (req, res) => {
  const file = req.files?.files || req.files?.file || null;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  const filesArr = Array.isArray(file) ? file : [file];
  const urls = [];

  const targetDir = path.join(__dirname, "..", "..", "public", "banners");
  ensureDir(targetDir);

  for (const f of filesArr) {
    if (!isAllowedMime(f.mimetype) || f.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: "Invalid image. Allowed: jpeg, png, webp; max 5MB" });
    }
    const safeName = Date.now() + "-" + String(f.name || "banner.jpg").replace(/[^a-zA-Z0-9._-]/g, "_");
    const dest = path.join(targetDir, safeName);
    await f.mv(dest);
    urls.push(`/banners/${safeName}`);
  }

  res.status(200).json({ urls });
});

module.exports = { listBanners, createBanner, updateBanner, deleteBanner, uploadBannerImage };