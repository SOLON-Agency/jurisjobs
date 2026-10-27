"use client";

import MuiIconButton, { type IconButtonProps as MuiIconButtonProps } from "@mui/material/IconButton";

export interface JJIconButtonProps extends MuiIconButtonProps {
  /** Required accessible name for the icon-only control. */
  "aria-label": string;
}

/** Icon-only action button with a consistent 44px minimum touch target. */
export function JJIconButton({ sx, ...props }: JJIconButtonProps) {
  return (
    <MuiIconButton
      sx={[{ minWidth: 44, minHeight: 44 }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    />
  );
}
