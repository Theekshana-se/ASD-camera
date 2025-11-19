const prisma = require("../utills/db");
const { asyncHandler, AppError } = require("../utills/errorHandler");

function sanitizeArray(arr) {
  if (!Array.isArray(arr)) return null;
  return arr
    .filter((i) => i && typeof i === "object")
    .map((i) => ({ name: String(i.name || ""), href: String(i.href || "#") }));
}

const getSettings = asyncHandler(async (req, res) => {
  try {
    const settings = await prisma.siteSettings.findFirst({});
    return res.status(200).json(settings || {});
  } catch (e) {
    return res.status(200).json({});
  }
});

const upsertSettings = asyncHandler(async (req, res) => {
  const {
    logoUrl,
    contactPhone,
    contactEmail,
    heroTitle,
    heroSubtitle,
    heroImageUrl,
    footerSale,
    footerAbout,
    footerBuy,
    footerHelp,
  } = req.body || {};

  const data = {
    logoUrl: logoUrl || null,
    contactPhone: contactPhone || null,
    contactEmail: contactEmail || null,
    heroTitle: heroTitle || null,
    heroSubtitle: heroSubtitle || null,
    heroImageUrl: heroImageUrl || null,
    footerSale: sanitizeArray(footerSale),
    footerAbout: sanitizeArray(footerAbout),
    footerBuy: sanitizeArray(footerBuy),
    footerHelp: sanitizeArray(footerHelp),
  };

  const existing = await prisma.siteSettings.findFirst({});
  let saved;
  if (existing) {
    saved = await prisma.siteSettings.update({
      where: { id: existing.id },
      data,
    });
  } else {
    saved = await prisma.siteSettings.create({ data });
  }
  return res.status(200).json(saved);
});

module.exports = { getSettings, upsertSettings };