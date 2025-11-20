const prisma = require("../utills/db");
const { asyncHandler, AppError } = require("../utills/errorHandler");

const listPopups = asyncHandler(async (req, res) => {
  const items = await prisma.popup.findMany({ orderBy: { createdAt: "desc" } });
  res.json(items);
});

const createPopup = asyncHandler(async (req, res) => {
  const { name, imageUrl, enabled } = req.body || {};
  if (!name) throw new AppError("name is required", 400);
  if (!imageUrl) throw new AppError("imageUrl is required", 400);
  const item = await prisma.popup.create({
    data: {
      name: String(name),
      imageUrl: String(imageUrl),
      enabled: enabled !== undefined ? !!enabled : true,
      isActive: false,
    },
  });
  res.status(201).json(item);
});

const updatePopup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, imageUrl, enabled, isActive } = req.body || {};
  if (!id) throw new AppError("id is required", 400);
  const updated = await prisma.popup.update({
    where: { id },
    data: {
      name: name ?? undefined,
      imageUrl: imageUrl ?? undefined,
      enabled: enabled !== undefined ? !!enabled : undefined,
      isActive: isActive !== undefined ? !!isActive : undefined,
    },
  });
  res.json(updated);
});

const deletePopup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new AppError("id is required", 400);
  await prisma.popup.delete({ where: { id } });
  res.status(204).send();
});

const activatePopup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new AppError("id is required", 400);
  await prisma.popup.updateMany({ data: { isActive: false }, where: {} });
  const active = await prisma.popup.update({ where: { id }, data: { isActive: true, enabled: true } });
  res.json(active);
});

const getActivePopup = asyncHandler(async (req, res) => {
  const settings = await prisma.siteSettings.findFirst({});
  const showEnabled = settings?.showPopupEnabled === undefined ? true : !!settings?.showPopupEnabled;
  if (!showEnabled) return res.json(null);
  const active = await prisma.popup.findFirst({ where: { isActive: true, enabled: true } });
  res.json(active || null);
});

module.exports = { listPopups, createPopup, updatePopup, deletePopup, activatePopup, getActivePopup };