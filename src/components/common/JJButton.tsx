"use client";

import MuiButton, { type ButtonProps as MuiButtonProps } from "@mui/material/Button";
import type { SxProps, Theme } from "@mui/material/styles";

export type JJButtonAppearance = "primary" | "secondary";

export interface JJButtonProps extends MuiButtonProps {
  /** Full-pill primary CTA or less-rounded secondary action. */
  appearance?: JJButtonAppearance;
}

/**
 * App-wide text/action button. Preserves MUI Button props, link composition,
 * submit behavior, loading states, and `sx` customization while standardizing shape.
 * Defaults contained buttons to the pill-shaped primary style and outlined/text
 * buttons to the less-rounded secondary style. Use `appearance` to override.
 */
export function JJButton({ appearance, variant = "contained", sx, ...props }: JJButtonProps) {
  const resolvedAppearance = appearance ?? (variant === "contained" ? "primary" : "secondary");
  const shapeSx: SxProps<Theme> = {
    borderRadius: resolvedAppearance === "primary" ? 999 : 1,
    minHeight: 44,
  };

  return <MuiButton variant={variant} sx={[shapeSx, ...(Array.isArray(sx) ? sx : [sx])]} {...props} />;
}
