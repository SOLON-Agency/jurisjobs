"use client";

import NextLink from "next/link";
import MuiLink, { type LinkProps as MuiLinkProps } from "@mui/material/Link";

export interface JJLinkProps extends Omit<MuiLinkProps, "href" | "component" | "underline"> {
  href: string;
}

function isHttpUrl(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function isInternalPath(href: string): boolean {
  return href.startsWith("/") || href.startsWith("#");
}

function isMailOrTel(href: string): boolean {
  return href.startsWith("mailto:") || href.startsWith("tel:");
}

function mergeClassName(...parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * App-wide textual link with a consistent animated underline on hover and focus.
 * Use for inline / text links only — not buttons, logos, or card hit targets.
 */
export function JJLink({ href, children, className, sx, ...props }: JJLinkProps) {
  const linkClass = mergeClassName("jj-link", className);

  if (isInternalPath(href)) {
    return (
      <MuiLink
        component={NextLink}
        href={href}
        underline="none"
        className={linkClass}
        sx={sx}
        {...props}
      >
        {children}
      </MuiLink>
    );
  }

  if (isHttpUrl(href)) {
    const hasAriaLabel = props["aria-label"] != null;
    return (
      <MuiLink
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        underline="none"
        className={linkClass}
        sx={sx}
        {...props}
      >
        {children}
        {!hasAriaLabel ? <span className="sr-only"> (se deschide în tab nou)</span> : null}
      </MuiLink>
    );
  }

  if (isMailOrTel(href)) {
    return (
      <MuiLink href={href} underline="none" className={linkClass} sx={sx} {...props}>
        {children}
      </MuiLink>
    );
  }

  return (
    <MuiLink href={href} underline="none" className={linkClass} sx={sx} {...props}>
      {children}
    </MuiLink>
  );
}
