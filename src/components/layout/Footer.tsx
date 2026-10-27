"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Box, Container, Stack, Typography } from "@mui/material";
import appSettings from "@/config/app.settings.json";
import { brandCssVars } from "@/theme/tokens";
import { JJLink } from "@/components/common/JJLink";

const footerLinks = [
  // { label: "Anunțuri", href: "/jobs" },
  { label: "Cum funcționează", href: "/how-it-works" },
  { label: "Politică de confidențialitate", href: "/policy" },
];

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: brandCssVars.white,
        mb: { xs: "10px", sm: 0 },
      }}
    >
      <Container maxWidth="lg" sx={{ paddingBottom: 2, paddingTop: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={3}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              component={Link}
              href="/"
              aria-label={`${appSettings.name} — pagina principală`}
              sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}
            >
              <Image
                src="/footer-logo.png"
                alt={`${appSettings.name} logo`}
                width={480}
                height={160}
                priority={false}
                style={{ width: "auto", height: 44, objectFit: "contain" }}
              />
            </Box>
            <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
              un proiect{" "}
              <JJLink
                href="https://solon.agency"
                variant="caption"
                sx={{ color: "inherit", fontWeight: 700 }}
              >
                SOLON, agenția digitală pentru avocați
              </JJLink>
            </Typography>
          </Stack>

          <Box component="nav" aria-label="Linkuri utile">
            <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" spacing={{ xs: 1, sm: 3 }}>
              {footerLinks.map((link) => (
                <JJLink
                  key={link.href}
                  href={link.href}
                  variant="body2"
                  sx={{
                    color: "text.primary",
                    transition: "color 0.2s ease",
                    "&:hover": { color: "primary.main" },
                    "&:focus-visible": { color: "primary.main" },
                  }}
                >
                  {link.label}
                </JJLink>
              ))}
            </Stack>
          </Box>
        </Stack>

      </Container>
    </Box>
  );
};
