export function cleanText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function displayName({
  profileName,
  metadataName,
  email,
  userId,
}: {
  profileName?: unknown;
  metadataName?: unknown;
  email?: string | null;
  userId: string;
}) {
  const explicitName = cleanText(profileName) ?? cleanText(metadataName);
  if (explicitName) return explicitName;

  const emailName = email?.split("@")[0]?.replace(/[._-]+/g, " ").trim();
  if (emailName) {
    return emailName.replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  return `User ${userId.slice(0, 6)}`;
}

export function displayInitials(value: string, fallback = "NA") {
  const result = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return result || fallback;
}

export function safeAvatarUrl(value: unknown) {
  const text = cleanText(value);
  if (!text) return null;
  try {
    const url = new URL(text);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}
