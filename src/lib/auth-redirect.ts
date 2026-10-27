const BLOCKED_PREFIXES = ["/login", "/register", "/forgot-password", "/auth/"];

/** Keep post-auth navigation inside this app. */
export function safeInternalPath(value: string | null | undefined, fallback = "/dashboard"): string {
  if (!value) return fallback;

  let decoded = value.trim();
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    return fallback;
  }

  if (!decoded.startsWith("/") || decoded.startsWith("//") || decoded.startsWith("/\\")) return fallback;
  if (decoded.includes("\\") || decoded.includes("://") || /[\u0000\r\n]/.test(decoded)) return fallback;

  const pathname = decoded.split(/[?#]/)[0] ?? "";
  if (BLOCKED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix))) {
    return fallback;
  }

  return decoded;
}

export function authCallbackUrl(origin: string, nextPath: string): string {
  const next = safeInternalPath(nextPath);
  return `${origin}/auth/callback?redirect=${encodeURIComponent(next)}`;
}

export const AUTH_NEXT_COOKIE = "jj-auth-next";

export function readAuthNextCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const entry = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${AUTH_NEXT_COOKIE}=`));
  if (!entry) return null;
  const value = entry.slice(AUTH_NEXT_COOKIE.length + 1);
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}
