import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AUTH_NEXT_COOKIE, readAuthNextCookie, safeInternalPath } from "@/lib/auth-redirect";
import { dispatchNotification } from "@/lib/notifications/dispatch";
import { NOTIFICATION_TYPES } from "@/lib/notifications/types";
import type { EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const queryRedirect = searchParams.get("redirect");
  const cookieRedirect = readAuthNextCookie(request.headers.get("cookie"));
  const useRecoveryCookie = !queryRedirect && cookieRedirect === "/reset-password" && type !== "signup";
  const requested = safeInternalPath(queryRedirect ?? (useRecoveryCookie ? cookieRedirect : null));
  const next = type === "recovery" ? "/reset-password" : requested;

  const supabase = await createClient();

  // PKCE flow — used by OAuth and magic-link sign-ins
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      await maybeNotifyAccountCreated(supabase, type);
      return redirectAfterAuth(origin, next);
    }
  }

  // OTP / token-hash flow — used by email confirmation, password reset,
  // email change, and invite links
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (!error) {
      await maybeNotifyAccountCreated(supabase, type);
      return redirectAfterAuth(origin, next);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}

function redirectAfterAuth(origin: string, next: string) {
  const response = NextResponse.redirect(`${origin}${next}`);
  response.cookies.set(AUTH_NEXT_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}

// deno-lint-ignore no-explicit-any — this is Next.js server code, not Deno
async function maybeNotifyAccountCreated(supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>, type: EmailOtpType | null | string) {
  if (type !== "signup") return;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) return;
    await dispatchNotification(supabase, {
      type: NOTIFICATION_TYPES.ACCOUNT_CREATED,
      recipients: [user.id],
      idempotencyKey: `account-created/${user.id}`,
    });
  } catch (e) {
    console.warn("auth/callback: account_created notify failed:", e);
  }
}

