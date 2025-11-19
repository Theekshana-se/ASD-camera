const prisma = require("../utills/db");
const { asyncHandler, AppError } = require("../utills/errorHandler");

const listClientLogos = asyncHandler(async (req, res) => {
  const items = await prisma.clientLogo.findMany({ orderBy: { order: "asc" } });
  res.json(items);
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

module.exports = { listClientLogos, createClientLogo, updateClientLogo, deleteClientLogo };