"use client";

import type { ReactNode } from "react";
import { useId } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Container,
  Stack,
  Typography,
  type AlertProps,
  type TypographyProps,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { brandCssVars } from "@/theme/tokens";
import { JJButton } from "@/components/common/JJButton";

export interface JJBannerAction {
  label: string;
  href: string;
  variant?: "contained" | "outlined";
  endIcon?: ReactNode;
}

export interface JJCtaBannerProps {
  /** Default variant: a branded, responsive section banner with optional actions. */
  variant?: "cta";
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: readonly JJBannerAction[];
  titleVariant?: TypographyProps["variant"];
}

export interface JJNoticeBannerProps {
  /** Compact status/notice banner. Use for contextual feedback, not section CTAs. */
  variant: "notice";
  severity: AlertProps["severity"];
  children: ReactNode;
  icon?: AlertProps["icon"];
  action?: ReactNode;
  role?: AlertProps["role"];
}

export type JJBannerProps = JJCtaBannerProps | JJNoticeBannerProps;

/**
 * Shared banner presentation for section-level calls to action and compact notices.
 * Keep interactive behaviour in the caller and pass it through `actions` / `action`.
 */
export function JJBanner(props: JJBannerProps) {
  if (props.variant === "notice") {
    return (
      <Alert
        severity={props.severity}
        icon={props.icon}
        action={props.action}
        role={props.role}
        sx={{ alignItems: "center", borderRadius: 2 }}
      >
        {props.children}
      </Alert>
    );
  }

  return <JJCtaBanner {...props} />;
}

function JJCtaBanner({
  eyebrow,
  title,
  description,
  actions = [],
  titleVariant = "h3",
}: JJCtaBannerProps) {
  const headingId = useId();
  const reducedMotion = useReducedMotion();

  return (
    <Box
      component="section"
      aria-labelledby={headingId}
      sx={{ py: { xs: 6, md: 10 }, position: "relative", overflow: "hidden" }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(rgba(195,174,97,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />
      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <motion.div
          variants={fadeUp}
          initial={reducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Box
            sx={{
              borderRadius: 4,
              bgcolor: brandCssVars.forest,
              border: "1px solid rgba(195,174,97,0.35)",
              p: { xs: 3, sm: 4, md: 6 },
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "stretch", md: "center" },
              justifyContent: "space-between",
              gap: { xs: 3, md: 4 },
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              {eyebrow ? (
                <Typography
                  component="p"
                  variant="overline"
                  sx={{ color: brandCssVars.gold, fontWeight: 700, letterSpacing: "0.12em" }}
                >
                  {eyebrow}
                </Typography>
              ) : null}
              <Typography
                id={headingId}
                variant={titleVariant}
                component="h2"
                sx={{ color: brandCssVars.cream, mb: description ? 0.75 : 0 }}
              >
                {title}
              </Typography>
              {description ? (
                <Typography component="div" sx={{ color: brandCssVars.cream, lineHeight: 1.6 }}>
                  {description}
                </Typography>
              ) : null}
            </Box>

            {actions.length > 0 ? (
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ flexShrink: 0, "& > *": { minHeight: 44 } }}
              >
                {actions.map((action, index) => {
                  const variant = action.variant ?? (index === 0 ? "contained" : "outlined");
                  const endIcon =
                    action.endIcon === undefined
                      ? index === 0 ? <ArrowForwardIcon /> : undefined
                      : action.endIcon;

                  return (
                    <JJButton
                      key={`${action.href}-${action.label}`}
                      component={Link}
                      href={action.href}
                      variant={variant}
                      size="large"
                      endIcon={endIcon}
                      appearance={variant === "contained" ? "primary" : "secondary"}
                      aria-describedby={headingId}
                      sx={
                        variant === "contained"
                          ? {
                              px: 3,
                              py: 1.5,
                              fontWeight: 700,
                              bgcolor: brandCssVars.gold,
                              "&:hover": { bgcolor: brandCssVars.cream },
                            }
                          : {
                              px: 3,
                              py: 1.5,
                              fontWeight: 600,
                              borderColor: brandCssVars.cream,
                              color: brandCssVars.cream,
                              "&:hover": {
                                borderColor: brandCssVars.gold,
                                bgcolor: "rgba(240,235,216,0.08)",
                              },
                            }
                      }
                    >
                      {action.label}
                    </JJButton>
                  );
                })}
              </Stack>
            ) : null}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
