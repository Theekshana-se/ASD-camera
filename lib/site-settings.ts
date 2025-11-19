import config from "@/lib/config";
import { unstable_cache } from "next/cache";

async function fetchSettings() {
  const res = await fetch(`${config.apiBaseUrl}/api/settings`, {
    next: { revalidate: 600 },
  });
  try {
    const data = await res.json();
    return data || {};
  } catch {
    return {} as any;
  }
}

export const getSiteSettings = unstable_cache(fetchSettings, ["site-settings"], {
  revalidate: 600,
});