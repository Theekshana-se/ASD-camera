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
    let fullDoc = null;
    try {
      const raw = await prisma.$runCommandRaw({ find: "SiteSettings", filter: {} });
      const first = Array.isArray(raw?.cursor?.firstBatch) ? raw.cursor.firstBatch[0] : null;
      fullDoc = first || null;
    } catch {}
    const merged = fullDoc ? { ...settings, ...fullDoc } : settings;
    return res.status(200).json(merged || {});
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
    noticeBarText,
    noticeBarEnabled,
    showPopupEnabled,
    footerSale,
    footerAbout,
    footerBuy,
    footerHelp,
    asdCameraTitle,
    asdCameraDescription,
    asdCameraLocations,
    socialLinks,
    paymentMethods,
    whatsappNumber,
    whatsappEnabled,
    messengerEnabled,
    adminMessengerPsid,
  } = req.body || {};

  const data = {
    logoUrl: logoUrl || null,
    contactPhone: contactPhone || null,
    contactEmail: contactEmail || null,
    heroTitle: heroTitle || null,
    heroSubtitle: heroSubtitle || null,
    heroImageUrl: heroImageUrl || null,
    noticeBarText: noticeBarText || null,
    noticeBarEnabled: Boolean(noticeBarEnabled) || false,
    showPopupEnabled: showPopupEnabled !== undefined ? !!showPopupEnabled : undefined,
    footerSale: sanitizeArray(footerSale),
    footerAbout: sanitizeArray(footerAbout),
    footerBuy: sanitizeArray(footerBuy),
    footerHelp: sanitizeArray(footerHelp),
    asdCameraTitle: asdCameraTitle || null,
    asdCameraDescription: asdCameraDescription || null,
    asdCameraLocations: Array.isArray(asdCameraLocations) || (asdCameraLocations && typeof asdCameraLocations === 'object') ? asdCameraLocations : null,
    socialLinks: socialLinks && typeof socialLinks === 'object' ? socialLinks : null,
    paymentMethods: Array.isArray(paymentMethods) ? paymentMethods.map((p)=>({ name: String(p?.name || ''), imageUrl: String(p?.imageUrl || '') })) : null,
    whatsappNumber: whatsappNumber || null,
    whatsappEnabled: whatsappEnabled !== undefined ? !!whatsappEnabled : false,
    messengerEnabled: messengerEnabled !== undefined ? !!messengerEnabled : false,
    adminMessengerPsid: adminMessengerPsid || null,
  };

  const existing = await prisma.siteSettings.findFirst({});
  let saved;
  try {
    if (existing) {
      saved = await prisma.siteSettings.update({
        where: { id: existing.id },
        data,
      });
    } else {
      saved = await prisma.siteSettings.create({ data });
    }
    const updateDoc = {
      $set: {
        logoUrl: data.logoUrl,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        heroImageUrl: data.heroImageUrl,
        footerSale: data.footerSale,
        footerAbout: data.footerAbout,
        footerBuy: data.footerBuy,
        footerHelp: data.footerHelp,
        noticeBarText: data.noticeBarText,
        noticeBarEnabled: data.noticeBarEnabled,
        showPopupEnabled: data.showPopupEnabled === undefined ? false : data.showPopupEnabled,
        asdCameraTitle: data.asdCameraTitle,
        asdCameraDescription: data.asdCameraDescription,
        asdCameraLocations: data.asdCameraLocations,
        socialLinks: data.socialLinks,
        paymentMethods: data.paymentMethods,
        whatsappNumber: data.whatsappNumber,
        whatsappEnabled: data.whatsappEnabled,
        messengerEnabled: data.messengerEnabled,
        adminMessengerPsid: data.adminMessengerPsid,
      },
    };
    await prisma.$runCommandRaw({
      update: "SiteSettings",
      updates: [
        {
          q: {},
          u: updateDoc,
          upsert: true,
          multi: true,
        },
      ],
    });
    try {
      const raw = await prisma.$runCommandRaw({ find: "SiteSettings", filter: {} });
      const first = Array.isArray(raw?.cursor?.firstBatch) ? raw.cursor.firstBatch[0] : null;
      saved = first || saved;
    } catch {}
  } catch (e) {
    const updateDoc = {
      $set: {
        logoUrl: data.logoUrl,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        heroImageUrl: data.heroImageUrl,
        footerSale: data.footerSale,
        footerAbout: data.footerAbout,
        footerBuy: data.footerBuy,
        footerHelp: data.footerHelp,
        noticeBarText: data.noticeBarText,
        noticeBarEnabled: data.noticeBarEnabled,
        showPopupEnabled: data.showPopupEnabled === undefined ? false : data.showPopupEnabled,
        asdCameraTitle: data.asdCameraTitle,
        asdCameraDescription: data.asdCameraDescription,
        asdCameraLocations: data.asdCameraLocations,
        socialLinks: data.socialLinks,
        paymentMethods: data.paymentMethods,
        whatsappNumber: data.whatsappNumber,
        whatsappEnabled: data.whatsappEnabled,
        messengerEnabled: data.messengerEnabled,
        adminMessengerPsid: data.adminMessengerPsid,
      },
    };
    await prisma.$runCommandRaw({
      update: "SiteSettings",
      updates: [
        {
          q: {},
          u: updateDoc,
          upsert: true,
          multi: true,
        },
      ],
    });
    try {
      const raw = await prisma.$runCommandRaw({ find: "SiteSettings", filter: {} });
      const first = Array.isArray(raw?.cursor?.firstBatch) ? raw.cursor.firstBatch[0] : null;
      saved = first || {};
    } catch {
      saved = existing || {};
    }
  }
  return res.status(200).json(saved);
});

module.exports = { getSettings, upsertSettings };