import { unstable_cache } from "next/cache";
import prisma from "@/utils/db";

export const getSiteSettings = unstable_cache(async () => {
  try {
    const settings = await prisma.siteSettings.findFirst();
    return settings || {};
  } catch (error) {
    // console.error("Error fetching site settings:", error);
    return {};
  }
}, ["site-settings"], { revalidate: 1 });
