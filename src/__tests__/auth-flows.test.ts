import { describe, expect, it } from "vitest";
import { authCallbackUrl, readAuthNextCookie, safeInternalPath } from "@/lib/auth-redirect";
import { authErrorMessage, isUnknownAccount } from "@/lib/auth-errors";

describe("safeInternalPath", () => {
  it("keeps in-app paths and falls back for external targets", () => {
    expect(safeInternalPath("/dashboard/jobs")).toBe("/dashboard/jobs");
    expect(safeInternalPath("/reset-password")).toBe("/reset-password");
    expect(safeInternalPath("//evil.example")).toBe("/dashboard");
    expect(safeInternalPath("https://evil.example")).toBe("/dashboard");
    expect(safeInternalPath("/login")).toBe("/dashboard");
    expect(safeInternalPath("/claim?token=abc")).toBe("/claim?token=abc");
    expect(safeInternalPath(null)).toBe("/dashboard");
    expect(readAuthNextCookie("other=1; jj-auth-next=%2Freset-password")).toBe("/reset-password");
  });

  it("builds the callback used by password recovery", () => {
    expect(authCallbackUrl("http://localhost:3000", "/reset-password")).toBe(
      "http://localhost:3000/auth/callback?redirect=%2Freset-password"
    );
  });
});

describe("authErrorMessage", () => {
  it("translates the common sign-in failures", () => {
    expect(authErrorMessage({ code: "invalid_credentials" })).toBe("E-mail sau parolă incorectă.");
    expect(authErrorMessage({ code: "over_email_send_rate_limit" })).toContain("Așteaptă");
    expect(isUnknownAccount({ code: "user_not_found" })).toBe(true);
  });
});
