import config from "@/lib/config";
import { unstable_cache } from "next/cache";

export const getSiteSettings = unstable_cache(async () => {
  const res = await fetch(`${config.apiBaseUrl}/api/settings`, {
    next: { revalidate: 300 },
  });
  try {
    const data = await res.json();
    return data || {};
  } catch {
    return {} as any;
  }
}, ["site-settings"], { revalidate: 300 });
