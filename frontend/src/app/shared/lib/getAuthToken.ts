let cachedToken: string | null = null;
let cachedAt = 0;

const CACHE_TTL_MS = 60 * 1000;

export async function getAuthToken(options?: { force?: boolean }) {
  const force = options?.force ?? false;

  if (!force && cachedToken && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedToken;
  }

  try {
    const response = await fetch("/api/auth/token", {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      cachedToken = null;
      cachedAt = Date.now();
      return null;
    }

    const payload = await response.json();
    cachedToken = payload?.token ?? null;
    cachedAt = Date.now();
    return cachedToken;
  } catch {
    cachedToken = null;
    cachedAt = Date.now();
    return null;
  }
}

export async function getAuthHeader(): Promise<Record<string, string>> {
  const token = await getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
