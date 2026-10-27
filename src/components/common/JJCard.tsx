"use client";

import { keyframes } from "@emotion/react";
import Paper, { type PaperProps } from "@mui/material/Paper";
import type { SxProps, Theme } from "@mui/material/styles";

export interface JJCardProps extends Omit<PaperProps, "variant"> {
  /** Inner padding in MUI spacing units. Defaults to 3; `sx` can override it. */
  padding?: number | string;
  /** Accent color for the animated border trace. */
  hoverColor?: string;
  /** Turn off the animated border for cards that need a static presentation. */
  hoverEffect?: boolean;
}

const orbitBorder = keyframes({
  to: { transform: "rotate(1turn)" },
});

/**
 * Flexible outlined card surface. Content, semantics, color, and layout stay with
 * the caller; `PaperProps` and `sx` remain available for use-case-specific styling.
 */
export function JJCard({
  padding = 3,
  hoverColor = "rgba(195,174,97,0.95)",
  hoverEffect = true,
  sx,
  children,
  ...paperProps
}: JJCardProps) {
  const cardSx: SxProps<Theme> = {
    p: padding,
    position: "relative",
    isolation: "isolate",
    ...(hoverEffect && {
      "&::after": {
        content: '""',
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        padding: "1px",
        pointerEvents: "none",
        opacity: 0,
        willChange: "transform, opacity",
        background: `conic-gradient(from 0deg, transparent 0deg 245deg, ${hoverColor} 300deg, transparent 350deg)`,
        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        maskComposite: "exclude",
        WebkitMaskComposite: "xor",
        transition: "opacity 180ms ease",
      },
      "&:hover::after, &:focus-within::after": {
        opacity: 1,
        animation: `${orbitBorder} 1.4s linear infinite`,
      },
      "@media (prefers-reduced-motion: reduce)": {
        "&:hover::after, &:focus-within::after": { animation: "none" },
      },
    }),
  };

  const mergedSx: SxProps<Theme> = [
    cardSx,
    ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
  ];

  return (
    <Paper variant="outlined" sx={mergedSx} {...paperProps}>
      {children}
    </Paper>
  );
}
