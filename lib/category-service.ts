import prisma from "@/utils/db";

export const getCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
