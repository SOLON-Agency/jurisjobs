import type { Metadata } from "next";
import { JJForgotPasswordForm } from "@/components/auth/JJForgotPasswordForm";
import appSettings from "@/config/app.settings.json";

export const metadata: Metadata = {
  title: "Resetare parolă",
  description: `Primește un link ca să îți resetezi parola pe ${appSettings.name}.`,
  robots: { index: false, follow: false },
};

export default function JJForgotPasswordPage() {
  return <JJForgotPasswordForm />;
}
