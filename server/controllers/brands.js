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

  // Check if brand exists
  const brand = await prisma.brand.findUnique({ where: { id } });
  if (!brand) throw new AppError("Brand not found", 404);

  // Check for associated products
  const productCount = await prisma.product.count({
    where: { brandId: id },
  });

  if (productCount > 0) {
    return response.status(400).json({
      error: `Cannot delete brand. It is used in ${productCount} product(s).`
    });
  }

  try {
    await prisma.brand.delete({ where: { id } });
    response.status(204).send();
  } catch (error) {
    if (error.code === 'P2003') {
      return response.status(400).json({ error: "Cannot delete brand because it is referenced by other records." });
    }
    throw error;
  }
});

module.exports = {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
};

