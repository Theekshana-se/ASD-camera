const prisma = require("../utills/db");
const { asyncHandler, AppError } = require("../utills/errorHandler");

const listSliderItems = asyncHandler(async (req, res) => {
  const items = await prisma.sliderItem.findMany({ orderBy: { order: "asc" } });
  res.json(items);
});

const createSliderItem = asyncHandler(async (req, res) => {
  const { title, subtitle, imageUrl, ctaText, ctaHref, order, active } = req.body || {};
  if (!imageUrl) throw new AppError("imageUrl is required", 400);
  const item = await prisma.sliderItem.create({
    data: {
      title: title || null,
      subtitle: subtitle || null,
      imageUrl,
      ctaText: ctaText || null,
      ctaHref: ctaHref || null,
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
      ctaHref: ctaHref ?? undefined,
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

module.exports = { listSliderItems, createSliderItem, updateSliderItem, deleteSliderItem };