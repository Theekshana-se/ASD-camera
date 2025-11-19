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

const createBrand = asyncHandler(async (request, response) => {
  const { name } = request.body;
  if (!name || !name.trim()) {
    throw new AppError("Brand name is required", 400);
  }
  const brand = await prisma.brand.create({ data: { name: name.trim() } });
  response.status(201).json(brand);
});

const updateBrand = asyncHandler(async (request, response) => {
  const { id } = request.params;
  const { name } = request.body;
  if (!id) throw new AppError("Brand ID is required", 400);
  const brand = await prisma.brand.update({
    where: { id },
    data: { name: name?.trim() || undefined },
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

