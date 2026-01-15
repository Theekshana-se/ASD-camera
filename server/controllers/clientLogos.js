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

const listClientLogos = asyncHandler(async (req, res) => {
  try {
    const items = await prisma.clientLogo.findMany({ orderBy: { order: "asc" } });
    const validItems = items.filter(i => i.imageUrl && i.imageUrl.length > 5);
    res.json(validItems);
  } catch (error) {
    console.error("List client logos failed (likely data corruption):", error);
    // Return empty array to prevent 500 error
    res.json([]);
  }
});

const createClientLogo = asyncHandler(async (req, res) => {
  const { imageUrl, alt, href, order, active } = req.body || {};
  if (!imageUrl) throw new AppError("imageUrl is required", 400);
  const item = await prisma.clientLogo.create({
    data: {
      imageUrl,
      alt: alt || null,
      href: href || null,
      order: Number(order) || 0,
      active: active !== undefined ? !!active : true,
    },
  });
  res.status(201).json(item);
});

const updateClientLogo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { imageUrl, alt, href, order, active } = req.body || {};
  if (!id) throw new AppError("id is required", 400);
  const item = await prisma.clientLogo.update({
    where: { id },
    data: {
      imageUrl: imageUrl ?? undefined,
      alt: alt ?? undefined,
      href: href ?? undefined,
      order: order !== undefined ? Number(order) : undefined,
      active: active !== undefined ? !!active : undefined,
    },
  });
  res.json(item);
});

const deleteClientLogo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new AppError("id is required", 400);
  await prisma.clientLogo.delete({ where: { id } });
  res.status(204).send();
});

const uploadClientLogoImage = asyncHandler(async (req, res) => {
  const file = req.files?.files || req.files?.file || null;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  // If multiple files, handle array
  const filesArr = Array.isArray(file) ? file : [file];
  const urls = [];

  const targetDir = path.join(__dirname, "..", "..", "public", "client-logos");
  ensureDir(targetDir);

  for (const f of filesArr) {
    if (!isAllowedMime(f.mimetype) || f.size > 5 * 1024 * 1024) {
      // Skip invalid files or throw error? For now, we'll error out if any is invalid to be safe
      return res.status(400).json({ error: "Invalid image. Allowed: jpeg, png, webp; max 5MB" });
    }
    const safeName = Date.now() + "-" + String(f.name || "logo.jpg").replace(/[^a-zA-Z0-9._-]/g, "_");
    const dest = path.join(targetDir, safeName);
    await f.mv(dest);
    urls.push(`/client-logos/${safeName}`);
  }

  res.status(200).json({ urls });
});

module.exports = { listClientLogos, createClientLogo, updateClientLogo, deleteClientLogo, uploadClientLogoImage };