import type { Metadata } from "next";
import { JJResetPasswordForm } from "@/components/auth/JJResetPasswordForm";
import appSettings from "@/config/app.settings.json";

export const metadata: Metadata = {
  title: "Parolă nouă",
  description: `Alege o parolă nouă pentru contul tău ${appSettings.name}.`,
  robots: { index: false, follow: false },
};

export default function JJResetPasswordPage() {
  return <JJResetPasswordForm />;
}
