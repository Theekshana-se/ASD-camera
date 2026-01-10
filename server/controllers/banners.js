const prisma = require("../utills/db");
const { asyncHandler, AppError } = require("../utills/errorHandler");

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

module.exports = { listBanners, createBanner, updateBanner, deleteBanner, uploadBannerImage };