import type { CSSProperties } from "react";

/** Official JurisJobs visual identity tokens. Keep brand values centralized here. */
export const brandColors = {
  forest: "#03170c",
  cream: "#f0ebd8",
  gold: "#c3ae61",
  nearWhite: "#f1f1f1",
  green: "#2d6a4f",
  /** Darker gold for readable text on light surfaces. */
  goldText: "#7a6420",
} as const;

export const brandFontFamily = 'var(--font-saira), sans-serif';

/** CSS variable references for use in component styles and global CSS. */
export const brandCssVars = {
  forest: "var(--brand-forest)",
  cream: "var(--brand-cream)",
  gold: "var(--brand-gold)",
  nearWhite: "var(--brand-near-white)",
  green: "var(--brand-green)",
  goldText: "var(--brand-gold-text)",
} as const;

/** Inline declaration keeps global CSS values sourced from this module. */
export const brandCssProperties = {
  "--brand-forest": brandColors.forest,
  "--brand-cream": brandColors.cream,
  "--brand-gold": brandColors.gold,
  "--brand-near-white": brandColors.nearWhite,
  "--brand-green": brandColors.green,
  "--brand-gold-text": brandColors.goldText,
} as CSSProperties;

export const brandGradient = `linear-gradient(135deg, ${brandColors.forest} 0%, ${brandColors.green} 100%)`;
export const brandGradientGold = `linear-gradient(135deg, ${brandColors.forest} 0%, ${brandColors.gold} 100%)`;
