const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export function getAuthOrigin(currentOrigin: string) {
  const fallback = normalizeOrigin(currentOrigin);
  return normalizeOrigin(configuredSiteUrl) ?? fallback;
}

function normalizeOrigin(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.origin
      : null;
  } catch {
    return null;
  }
}
