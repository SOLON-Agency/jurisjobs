"use client";

import MuiButton, { type ButtonProps as MuiButtonProps } from "@mui/material/Button";
import type { SxProps, Theme } from "@mui/material/styles";

export type JJButtonAppearance = "primary" | "secondary";

export interface JJButtonProps extends MuiButtonProps {
  /** Shared pill shape with primary or secondary visual treatment. */
  appearance?: JJButtonAppearance;
  /** Download attribute supported when this button renders as an anchor. */
  download?: boolean | string;
}

/**
 * App-wide text/action button. Preserves MUI Button props, link composition,
 * submit behavior, loading states, and `sx` customization while standardizing shape.
 * Uses a consistent pill shape for primary and secondary actions. Defaults
 * contained buttons to primary and outlined/text buttons to secondary; use
 * `appearance` to override.
 */
export function JJButton({ appearance, variant = "contained", sx, ...props }: JJButtonProps) {
  const resolvedAppearance = appearance ?? (variant === "contained" ? "primary" : "secondary");
  const shapeSx: SxProps<Theme> = {
    borderRadius: 999,
    minHeight: 44,
    ...(resolvedAppearance === "primary" ? { px: 4, py: 1.6 } : {}),
  };

  return (
    <MuiButton
      variant={variant}
      data-appearance={resolvedAppearance}
      sx={[shapeSx, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    />
  );
}
