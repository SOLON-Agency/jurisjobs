import type { Metadata } from "next";
import appSettings from "@/config/app.settings.json";
import { BrandGuide } from "./BrandGuide";

export const metadata: Metadata = {
  title: "Identitate de brand",
  description: `Descoperă culorile și fontul Saira care definesc identitatea vizuală ${appSettings.name}.`,
  alternates: { canonical: "/brand" },
  openGraph: {
    title: `Identitate de brand | ${appSettings.name}`,
    description: `Paleta oficială și tipografia ${appSettings.name}.`,
    url: "/brand",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `Identitate de brand | ${appSettings.name}`,
    description: `Paleta oficială și tipografia ${appSettings.name}.`,
  },
};

export default function BrandPage() {
  return <BrandGuide />;
}
