import { brandCssVars, brandGradient } from "@/theme/tokens";
import type { Components, Theme } from "@mui/material/styles";

export const components: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarWidth: "thin",
        backgroundColor: brandCssVars.white,
        color: brandCssVars.forest,
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        minHeight: 44,
        textTransform: "none",
        fontWeight: 600,
        letterSpacing: "0.02em",
        "&.Mui-disabled": {
          color: "#ffffff",
          // Re-enable pointer events so the cursor style is visible.
          // The underlying <button disabled> attribute still blocks clicks.
          pointerEvents: "auto",
          cursor: "not-allowed",
          background: "rgba(0, 0, 0, 0.12)",
        },
        ".Mui-disabled&:hover": {
          background: "rgba(0, 0, 0, 0.12)",
          boxShadow: "none",
        },
      },
      contained: {
        borderRadius: 999,
        "&:hover:not(.Mui-disabled)": {
          backgroundColor: brandGradient,
        },
      },
      containedPrimary: {
        background: brandGradient,
        boxShadow: "0 2px 8px rgba(3, 23, 12, 0.3)",
        color: brandCssVars.cream,
        "&:hover": {
          background: brandGradient,
          boxShadow: "0 4px 16px rgba(3, 23, 12, 0.4)",
        },
      },
      containedSecondary: {
        background: brandCssVars.gold,
        color: brandCssVars.forest,
        "&:hover": {
          background: brandCssVars.gold,
        },
      },
      outlined: {
        borderRadius: 8,
        borderColor: "rgba(3, 23, 12, 0.22)",
        "&:hover": {
          borderColor: brandCssVars.green,
          backgroundColor: "color-mix(in srgb, var(--brand-green) 5%, transparent)",
        },
      },
      text: {
        borderRadius: 8,
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        minWidth: 44,
        minHeight: 44,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        border: "1px solid rgba(3, 23, 12, 0.1)",
        backgroundImage: "none",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          borderColor: brandCssVars.green,
          boxShadow: "0 4px 20px rgba(3, 23, 12, 0.08)",
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        fontWeight: 500,
        fontSize: "0.75rem",
      },
      outlined: {
        borderColor: "color-mix(in srgb, var(--brand-green) 30%, transparent)",
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      input: {
        color: "primary.main",
      },
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: {
        color: "primary.main",
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          borderRadius: 8,
          "& fieldset": {
            borderColor: "rgba(3, 23, 12, 0.15)",
          },
          "&:hover fieldset": {
            borderColor: brandCssVars.green,
          },
          "&.Mui-focused fieldset": {
            borderColor: brandCssVars.green,
          },
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: "none",
      },
      // `variant="outlined"` → shared bordered card appearance used throughout dashboard
      outlined: {
        border: "1px solid rgba(3, 23, 12, 0.1)",
        borderRadius: 16,
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: brandCssVars.forest,
        backdropFilter: "none",
        borderBottom: "1px solid rgba(240, 235, 216, 0.08)",
        boxShadow: "0 1px 6px rgba(0,0,0,0.3)",
        color: brandCssVars.cream,
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: "1px solid rgba(3, 23, 12, 0.08)",
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: "rgba(3, 23, 12, 0.1)",
      },
    },
  },
  MuiSelect: {
    styleOverrides: {
      outlined: {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(3, 23, 12, 0.15)",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: brandCssVars.green,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: brandCssVars.green,
        },
      },
    },
  },
};
