import { describe, expect, it } from "vitest";
import { classifyPasskeyError } from "@/lib/passkeys";

describe("classifyPasskeyError", () => {
  it("treats a cancelled ceremony as silent", () => {
    expect(classifyPasskeyError({ code: "ERROR_CEREMONY_ABORTED" })).toEqual({ kind: "cancelled" });
    expect(classifyPasskeyError({ name: "NotAllowedError", message: "The operation was not allowed." })).toEqual({
      kind: "cancelled",
    });
  });

  it("sends unconfirmed accounts to email verification", () => {
    expect(classifyPasskeyError({ code: "email_not_confirmed" })).toEqual({ kind: "unconfirmed" });
  });

  it("explains a missing credential and a disabled project", () => {
    expect(classifyPasskeyError({ code: "webauthn_credential_not_found" }).kind).toBe("message");
    expect(classifyPasskeyError({ code: "passkey_disabled" })).toEqual({
      kind: "message",
      text: "Cheile de acces nu sunt disponibile momentan.",
    });
  });
});
