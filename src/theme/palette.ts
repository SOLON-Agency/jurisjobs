import { brandColors, brandGradient, brandGradientGold } from "./tokens";

export const lightPalette = {
  primary: {
    main: brandColors.forest,
    light: brandColors.green,
    dark: "#010c07",
    contrastText: brandColors.cream,
  },
  secondary: {
    main: brandColors.gold,
    light: brandColors.gold,
    dark: brandColors.forest,
    contrastText: brandColors.forest,
  },
  error: { main: "#c0392b", contrastText: "#ffffff" },
  warning: { main: "#a0882a", contrastText: "#ffffff" },
  success: { main: brandColors.green, contrastText: "#ffffff" },
  info: { main: brandColors.green, contrastText: brandColors.cream },
  background: {
    default: brandColors.white,
    paper: brandColors.white,
  },
  text: {
    primary: brandColors.forest,
    secondary: brandColors.green,
    disabled: "#647067",
  },
  divider: "rgba(3, 23, 12, 0.1)",
} as const;

/** Shared brand gradients for styles that need a gradient value. */
export { brandGradient, brandGradientGold };
export const brandGradientDark = brandGradientGold;
export const accentGold = brandColors.gold;
export const accentGoldLight = brandColors.gold;
export const cream = brandColors.cream;
