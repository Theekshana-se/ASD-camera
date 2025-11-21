const prisma = require("../utills/db");
const { asyncHandler, AppError } = require("../utills/errorHandler");

const getBrands = asyncHandler(async (request, response) => {
  try {
    const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
    response.json(brands);
  } catch (e) {
    response.json([]);
  }
});

function isSafeUrl(u) {
  return typeof u === "string" && /^https:\/\//i.test(u);
}

const createBrand = asyncHandler(async (request, response) => {
  const { name, imageUrl } = request.body;
  if (!name || !name.trim()) {
    throw new AppError("Brand name is required", 400);
  }
  const brand = await prisma.brand.create({ data: { name: name.trim(), imageUrl: imageUrl && isSafeUrl(imageUrl) ? imageUrl : null } });
  response.status(201).json(brand);
});

const updateBrand = asyncHandler(async (request, response) => {
  const { id } = request.params;
  const { name, imageUrl } = request.body;
  if (!id) throw new AppError("Brand ID is required", 400);
  const brand = await prisma.brand.update({
    where: { id },
    data: { name: name?.trim() || undefined, imageUrl: imageUrl === undefined ? undefined : (imageUrl && isSafeUrl(imageUrl) ? imageUrl : null) },
  });
  response.json(brand);
});

const deleteBrand = asyncHandler(async (request, response) => {
  const { id } = request.params;
  if (!id) throw new AppError("Brand ID is required", 400);
  await prisma.brand.delete({ where: { id } });
  response.status(204).send();
});

module.exports = {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
};

