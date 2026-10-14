"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { motion, useReducedMotion } from "framer-motion";
import {
  brandColors,
  brandCssVars,
  brandFontFamily,
  brandGradientGold,
} from "@/theme/tokens";

const paletteCards = [
  {
    name: "Verde pădure",
    key: "forest",
    role: "Culoarea principală. Oferă identității un ton calm, stabil și distinctiv.",
    use: "Fundaluri principale și zone de accent",
    foreground: brandColors.cream,
  },
  {
    name: "Crem",
    key: "cream",
    role: "Ton cald pentru suprafețe și text pe fundaluri închise.",
    use: "Suprafețe secundare și text pe verde",
    foreground: brandColors.forest,
  },
  {
    name: "Auriu",
    key: "gold",
    role: "Accent vizual care adaugă căldură și evidențiază acțiunile importante.",
    use: "Accente și gradienturi",
    foreground: brandColors.forest,
  },
  {
    name: "Alb cald",
    key: "nearWhite",
    role: "Fundal luminos și neutru, cu un contrast blând față de crem.",
    use: "Fundaluri de pagină și secțiuni",
    foreground: brandColors.forest,
  },
  {
    name: "Verde de pădure",
    key: "green",
    role: "Verde secundar pentru confirmări și accente complementare.",
    use: "Stări pozitive și elemente secundare",
    foreground: brandColors.cream,
  },
] as const;

const fontWeights = [400, 600, 800] as const;

export function BrandGuide() {
  const prefersReducedMotion = useReducedMotion();
  const [fontWeight, setFontWeight] = useState<number>(600);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState("");

  const copyColor = async (name: string, color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(name);
      setCopyStatus(`Codul ${color} pentru ${name} a fost copiat.`);
      window.setTimeout(() => setCopiedColor(null), 1800);
    } catch {
      setCopyStatus("Copierea nu a reușit. Selectează codul și copiază-l manual.");
    }
  };

  const enterMotion = prefersReducedMotion
    ? { initial: false as const }
    : {
        initial: { opacity: 0, y: 22 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.55, ease: "easeOut" as const },
      };

  return (
    <Box component="article">
      <Box
        component="header"
        sx={{
          position: "relative",
          overflow: "hidden",
          color: brandCssVars.cream,
          backgroundColor: brandCssVars.forest,
          py: { xs: 9, sm: 12, md: 16 },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <motion.div {...enterMotion}>
            <Stack spacing={3} maxWidth={820}>
              <Typography
                component="p"
                variant="overline"
                sx={{ color: brandCssVars.gold, fontWeight: 700, letterSpacing: "0.16em" }}
              >
                Ghid vizual JurisJobs
              </Typography>
              <Typography
                component="h1"
                sx={{
                  fontFamily: brandFontFamily,
                  fontSize: { xs: "3.25rem", sm: "5rem", md: "7rem" },
                  fontWeight: 800,
                  letterSpacing: "-0.055em",
                  lineHeight: 0.98,
                }}
              >
                O identitate
                <Box component="span" sx={{ display: "block", color: brandCssVars.gold }}>
                  cu rădăcini.
                </Box>
              </Typography>
              <Typography sx={{ maxWidth: 620, color: brandCssVars.cream, fontSize: { xs: "1.05rem", md: "1.2rem" }, lineHeight: 1.7 }}>
                Verde profund, accente aurii și o tipografie cu personalitate. Descoperă elementele care dau formă brandului JurisJobs.
              </Typography>
              <Button
                component="a"
                href="#culori"
                variant="outlined"
                endIcon={<ArrowDownwardIcon aria-hidden="true" />}
                sx={{
                  alignSelf: "flex-start",
                  minHeight: 48,
                  px: 2.5,
                  color: brandCssVars.cream,
                  borderColor: brandCssVars.cream,
                  transition: prefersReducedMotion ? "none" : "transform 180ms ease, background-color 180ms ease",
                  "&:hover": { color: brandCssVars.forest, backgroundColor: brandCssVars.cream, borderColor: brandCssVars.cream, transform: prefersReducedMotion ? "none" : "translateY(-2px)" },
                }}
              >
                Explorează paleta
              </Button>
            </Stack>
          </motion.div>
          <Typography
            aria-hidden="true"
            sx={{
              position: "absolute",
              right: { xs: -12, md: 12 },
              bottom: { xs: -44, md: -80 },
              color: "rgba(240,235,216,0.08)",
              fontFamily: brandFontFamily,
              fontSize: { xs: 220, md: 420 },
              fontWeight: 800,
              lineHeight: 0.8,
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            J
          </Typography>
        </Container>
      </Box>

      <Box component="section" id="culori" sx={{ backgroundColor: brandCssVars.nearWhite, py: { xs: 7, md: 11 }, scrollMarginTop: 80 }}>
        <Container maxWidth="lg">
          <motion.div {...enterMotion}>
            <Stack spacing={1} sx={{ mb: 4 }}>
              <Typography component="p" variant="overline" sx={{ color: brandCssVars.forest, fontWeight: 700, letterSpacing: "0.14em" }}>
                Paleta oficială
              </Typography>
              <Typography component="h2" variant="h2" sx={{ fontWeight: 700 }}>
                Cinci culori. O singură voce.
              </Typography>
              <Typography color={brandCssVars.forest} sx={{ maxWidth: 660 }}>
                Fiecare nuanță are un rol clar în interfață. Apasă pe cod pentru a-l copia.
              </Typography>
            </Stack>
          </motion.div>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" }, gap: { xs: 2, md: 2.5 } }}>
            {paletteCards.map((color, index) => {
              const hex = brandColors[color.key];
              const isCopied = copiedColor === color.name;

              return (
                <motion.div
                  key={color.key}
                  {...(prefersReducedMotion
                    ? { initial: false }
                    : {
                        initial: { opacity: 0, y: 18 },
                        whileInView: { opacity: 1, y: 0 },
                        viewport: { once: true, amount: 0.15 },
                        transition: { duration: 0.4, delay: index * 0.06 },
                      })}
                  whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      height: "100%",
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 3,
                      transition: prefersReducedMotion ? "none" : "box-shadow 180ms ease, border-color 180ms ease",
                      "&:hover": { borderColor: brandCssVars.green, boxShadow: "0 16px 36px rgba(3,23,12,0.1)" },
                    }}
                  >
                    <Box
                      sx={{
                        minHeight: { xs: 118, md: 136 },
                        display: "flex",
                        alignItems: "flex-end",
                        p: 2.5,
                        backgroundColor: hex,
                        color: color.foreground,
                        borderBottom: color.key === "nearWhite" ? "1px solid" : 0,
                        borderColor: "divider",
                      }}
                    >
                      <Typography sx={{ fontFamily: brandFontFamily, fontSize: "1.5rem", fontWeight: 700 }}>
                        Aa Bb 123
                      </Typography>
                    </Box>
                    <Stack spacing={1.5} sx={{ p: 2.5 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                        <Typography component="h3" variant="h6" sx={{ fontWeight: 700 }}>{color.name}</Typography>
                        <Button
                          onClick={() => void copyColor(color.name, hex)}
                          aria-label={`Copiază codul ${hex} pentru ${color.name}`}
                          startIcon={isCopied ? <CheckIcon aria-hidden="true" /> : <ContentCopyIcon aria-hidden="true" />}
                          sx={{ minWidth: 44, minHeight: 44, px: 1, color: brandCssVars.forest, textTransform: "none" }}
                        >
                          <Box component="span" sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{hex}</Box>
                        </Button>
                      </Stack>
                      <Typography variant="body2" color={brandCssVars.forest} sx={{ minHeight: { sm: 68 } }}>{color.role}</Typography>
                      <Typography variant="caption" sx={{ color: brandCssVars.forest, fontWeight: 700, letterSpacing: "0.03em" }}>
                        {color.use}
                      </Typography>
                    </Stack>
                  </Paper>
                </motion.div>
              );
            })}
          </Box>
          <Typography role="status" aria-live="polite" sx={{ mt: 2, minHeight: 24, color: brandCssVars.forest }}>
            {copyStatus}
          </Typography>
          <Paper variant="outlined" sx={{ mt: 3, p: { xs: 2, md: 2.5 }, borderRadius: 2, backgroundColor: brandCssVars.white }}>
            <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 700, color: brandCssVars.forest }}>
              Auriu pentru text
            </Typography>
            <Typography variant="body2" color={brandCssVars.forest}>
              Pentru text auriu pe suprafețe deschise, folosim tokenul derivat <Box component="code" sx={{ fontFamily: "monospace", color: brandCssVars.forest }}>goldText</Box> ({brandColors.goldText}). Nuanța păstrează caracterul auriu și oferă un contrast mai bun.
            </Typography>
          </Paper>
        </Container>
      </Box>

      <Box component="section" aria-labelledby="font-heading" sx={{ backgroundColor: brandCssVars.cream, py: { xs: 7, md: 11 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "0.8fr 1.2fr" }, gap: { xs: 4, md: 8 }, alignItems: "center" }}>
            <motion.div {...enterMotion}>
              <Stack spacing={2}>
                <Typography component="p" variant="overline" sx={{ color: brandCssVars.forest, fontWeight: 700, letterSpacing: "0.14em" }}>
                  Tipografie
                </Typography>
                <Typography id="font-heading" component="h2" variant="h2" sx={{ fontWeight: 700 }}>
                  Saira, cu caracter.
                </Typography>
                <Typography color={brandCssVars.forest} sx={{ lineHeight: 1.8 }}>
                  Saira este fontul folosit în întreaga platformă. Formele sale clare păstrează lizibilitatea în interfață și adaugă personalitate titlurilor.
                </Typography>
                <Typography variant="body2" color={brandCssVars.forest}>
                  Familia variabilă permite ajustarea greutății pentru ierarhii vizuale consistente, de la text curent la titluri puternice.
                </Typography>
              </Stack>
            </motion.div>

            <Paper
              elevation={0}
              sx={{ p: { xs: 2.5, sm: 4, md: 5 }, borderRadius: 4, color: brandCssVars.cream, backgroundColor: brandCssVars.forest, overflow: "hidden" }}
            >
              <Typography variant="overline" sx={{ color: brandCssVars.gold, letterSpacing: "0.14em", fontWeight: 700 }}>
                Specimen Saira
              </Typography>
              <Typography
                aria-live="polite"
                sx={{
                  mt: 2,
                  fontFamily: brandFontFamily,
                  fontSize: { xs: "2.6rem", sm: "4rem", md: "5.2rem" },
                  lineHeight: 1,
                  fontWeight,
                  letterSpacing: "-0.04em",
                  overflowWrap: "anywhere",
                }}
              >
                Avocați. Idei. Viitor.
              </Typography>
              <Typography sx={{ mt: 2, color: brandCssVars.cream, fontFamily: brandFontFamily, fontSize: { xs: "0.72rem", sm: "0.95rem", md: "1.15rem" }, fontWeight, overflowWrap: "anywhere" }}>
                ABCDEFGHIJKLMNOPQRSTUVWXYZ
                <br />
                abcdefghijklmnopqrstuvwxyz 0123456789
                <br />
                Ă Â Î Ș Ț ă â î ș ț
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 3 }} aria-label="Alege grosimea fontului">
                {fontWeights.map((weight) => (
                  <Button
                    key={weight}
                    type="button"
                    aria-pressed={fontWeight === weight}
                    onClick={() => setFontWeight(weight)}
                    sx={{
                      minWidth: 64,
                      minHeight: 44,
                      border: "1px solid",
                      borderColor: fontWeight === weight ? brandCssVars.gold : "rgba(240,235,216,0.45)",
                      backgroundColor: fontWeight === weight ? brandCssVars.gold : "transparent",
                      color: fontWeight === weight ? brandCssVars.forest : brandCssVars.cream,
                      fontWeight: weight,
                      transition: prefersReducedMotion ? "none" : "background-color 160ms ease, transform 160ms ease",
                      "&:hover": {
                        backgroundColor: fontWeight === weight ? brandCssVars.gold : "rgba(240,235,216,0.12)",
                        transform: prefersReducedMotion ? "none" : "translateY(-2px)",
                      },
                    }}
                  >
                    {weight}
                  </Button>
                ))}
              </Stack>
              <Typography variant="caption" sx={{ display: "block", mt: 1.5, color: brandCssVars.cream }}>
                Selectează greutatea fontului
              </Typography>
            </Paper>
          </Box>
        </Container>
      </Box>

      <Box component="section" aria-labelledby="preview-heading" sx={{ backgroundColor: brandCssVars.nearWhite, py: { xs: 7, md: 10 } }}>
        <Container maxWidth="md">
          <motion.div {...enterMotion}>
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Typography component="p" variant="overline" sx={{ color: brandCssVars.forest, fontWeight: 700, letterSpacing: "0.14em" }}>
                În practică
              </Typography>
              <Typography id="preview-heading" component="h2" variant="h2" sx={{ fontWeight: 700 }}>
                Claritate, dintr-o privire.
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  width: "100%",
                  maxWidth: 560,
                  p: { xs: 2.5, sm: 3.5 },
                  textAlign: "left",
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: brandCssVars.white,
                  transition: prefersReducedMotion ? "none" : "transform 180ms ease, box-shadow 180ms ease",
                  "&:hover": { transform: prefersReducedMotion ? "none" : "translateY(-3px)", boxShadow: "0 16px 36px rgba(3,23,12,0.1)" },
                }}
              >
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
                    <Typography variant="overline" sx={{ color: brandCssVars.forest, fontWeight: 700 }}>Oportunitate juridică</Typography>
                    <Box sx={{ width: 12, height: 12, flexShrink: 0, borderRadius: "50%", backgroundColor: brandCssVars.gold }} />
                  </Stack>
                  <Typography component="h3" variant="h5" sx={{ fontWeight: 700 }}>Avocat litigii comerciale</Typography>
                  <Typography variant="body2" color={brandCssVars.forest}>București · Hibrid · Experiență medie</Typography>
                  <Box sx={{ height: 2, borderRadius: 2, background: brandGradientGold }} />
                  <Button variant="contained" sx={{ alignSelf: "flex-start", minHeight: 44, px: 2.5 }}>
                    Descoperă oportunitățile
                  </Button>
                </Stack>
              </Paper>
            </Stack>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}
