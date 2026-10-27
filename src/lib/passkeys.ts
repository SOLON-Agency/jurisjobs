export type PasskeyErrorLike = {
  code?: string;
  message?: string;
  name?: string;
};

export type PasskeyFailure =
  | { kind: "cancelled" }
  | { kind: "unconfirmed" }
  | { kind: "message"; text: string };

const CANCELLED_CODES = new Set([
  "ERROR_CEREMONY_ABORTED",
]);

export function browserSupportsPasskeys(): boolean {
  return typeof window !== "undefined" && typeof window.PublicKeyCredential === "function";
}

export function classifyPasskeyError(error: PasskeyErrorLike): PasskeyFailure {
  const code = error.code ?? "";
  const message = error.message ?? "";

  if (
    CANCELLED_CODES.has(code) ||
    error.name === "AbortError" ||
    error.name === "NotAllowedError" ||
    /the operation either timed out or was not allowed/i.test(message)
  ) {
    return { kind: "cancelled" };
  }

  if (code === "email_not_confirmed" || message === "Email not confirmed") {
    return { kind: "unconfirmed" };
  }

  if (code === "passkey_disabled") {
    return { kind: "message", text: "Cheile de acces nu sunt disponibile momentan." };
  }

  if (code === "webauthn_credential_not_found") {
    return { kind: "message", text: "Acest dispozitiv nu are o cheie de acces JurisJobs." };
  }

  if (code === "webauthn_credential_exists" || code === "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED") {
    return { kind: "message", text: "Această cheie de acces este deja salvată în cont." };
  }

  if (code === "too_many_passkeys") {
    return { kind: "message", text: "Ai atins numărul maxim de chei de acces." };
  }

  if (code === "ERROR_INVALID_DOMAIN" || code === "ERROR_INVALID_RP_ID") {
    return {
      kind: "message",
      text: "Cheile de acces funcționează doar pe domeniul de producție JurisJobs.",
    };
  }

  if (code === "webauthn_verification_failed" || code === "webauthn_challenge_expired") {
    return { kind: "message", text: "Verificarea a expirat. Încearcă din nou." };
  }

  return { kind: "message", text: "Nu am putut folosi cheia de acces. Încearcă din nou." };
}
