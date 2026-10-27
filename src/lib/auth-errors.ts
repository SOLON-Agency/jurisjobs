export type AuthErrorLike = {
  code?: string;
  message?: string;
};

export function authErrorMessage(error: AuthErrorLike): string {
  const code = error.code ?? "";
  const message = (error.message ?? "").toLowerCase();

  if (code === "invalid_credentials" || message.includes("invalid login credentials")) {
    return "E-mail sau parolă incorectă.";
  }

  if (code === "email_not_confirmed" || message === "email not confirmed") {
    return "Confirmă adresa de e-mail înainte de conectare.";
  }

  if (
    code === "user_already_exists" ||
    message.includes("already registered") ||
    message.includes("already been registered")
  ) {
    return "Există deja un cont cu acest e-mail. Conectează-te sau resetează parola.";
  }

  if (code === "weak_password" || message.includes("password should be at least")) {
    return "Parola este prea slabă. Folosește cel puțin 6 caractere.";
  }

  if (code === "same_password" || message.includes("same as the old password") || message.includes("different from the old")) {
    return "Alege o parolă diferită de cea actuală.";
  }

  if (
    code === "over_request_rate_limit" ||
    code === "over_email_send_rate_limit" ||
    message.includes("rate limit")
  ) {
    return "Prea multe încercări. Așteaptă câteva minute și încearcă din nou.";
  }

  if (
    code === "otp_expired" ||
    code === "flow_state_expired" ||
    message.includes("expired") ||
    message.includes("invalid or has expired")
  ) {
    return "Link-ul a expirat sau a fost deja folosit. Solicită unul nou.";
  }

  if (message.includes("redirect")) {
    return "Adresa de revenire nu este permisă pentru acest site. Încearcă din nou de pe domeniul JurisJobs.";
  }

  return "Nu am putut finaliza autentificarea. Încearcă din nou.";
}

export function isEmailNotConfirmed(error: AuthErrorLike): boolean {
  const code = error.code ?? "";
  const message = (error.message ?? "").toLowerCase();
  return code === "email_not_confirmed" || message === "email not confirmed";
}

export function isUnknownAccount(error: AuthErrorLike): boolean {
  const code = error.code ?? "";
  const message = (error.message ?? "").toLowerCase();
  return code === "user_not_found" || message.includes("user not found");
}
