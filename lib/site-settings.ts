import config from "@/lib/config";

export async function getSiteSettings() {
  const res = await fetch(`${config.apiBaseUrl}/api/settings`, {
    cache: "no-store",
  });
  try {
    const data = await res.json();
    return data || {};
  } catch {
    return {} as any;
  }
}
