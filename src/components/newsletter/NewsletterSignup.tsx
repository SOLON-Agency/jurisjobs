"use client";

import { brandCssVars } from "@/theme/tokens";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, CircularProgress, InputAdornment, TextField, Typography } from "@mui/material";
import { JJButton } from "@/components/common/JJButton";
import { newsletterSchema, type NewsletterFormData } from "@/components/forms/validations/newsletter.schema";
import { subscribeToNewsletter } from "@/app/newsletter/actions";
import { useToast } from "@/contexts/ToastContext";

interface NewsletterSignupProps {
  source?: string;
}

export function NewsletterSignup({ source = "homepage" }: NewsletterSignupProps) {
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "", source },
  });

  const onSubmit = async (data: NewsletterFormData) => {
    const result = await subscribeToNewsletter({ email: data.email, source });
    if (result.status === "subscribed" || result.status === "already") {
      showToast("Te-ai abonat cu succes! Vei primi fiecare articol nou pe email.", "success");
      reset();
    } else {
      showToast(result.message ?? "A apărut o eroare. Încearcă din nou.", "error", 5000);
    }
  };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      sx={{ width: "100%" }}
    >
      <TextField
        {...register("email")}
        type="email"
        autoComplete="email"
        required
        placeholder="nume@avocat.ro"
        fullWidth
        size="medium"
        error={!!errors.email}
        helperText={errors.email?.message}
        inputProps={{
          "aria-describedby": errors.email
            ? "newsletter-email-error"
            : "newsletter-hint",
          "aria-required": "true",
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <JJButton
                  appearance="secondary"
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={16} /> : undefined}
                  sx={{
                    minHeight: 44,
                    minWidth: 120,
                    whiteSpace: "nowrap",
                    bgcolor: brandCssVars.gold,
                    transition: "background-color 180ms ease, box-shadow 180ms ease, transform 180ms ease",
                    "&:hover": {
                      bgcolor: brandCssVars.gold,
                      boxShadow: "0 8px 18px rgba(3, 23, 12, 0.2)",
                    },
                    "&:active": {
                      boxShadow: "0 3px 8px rgba(3, 23, 12, 0.16)",
                    },
                    "@media (prefers-reduced-motion: reduce)": {
                      transition: "none",
                      "&:hover, &:active": { transform: "none" },
                    },
                    "&.Mui-disabled": { bgcolor: brandCssVars.gold, color: brandCssVars.forest },
                  }}
                >
                  {isSubmitting ? "Se trimite…" : "Mă abonez"}
                </JJButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{
          bgcolor: "#FFFFFF",
          borderRadius: 10,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: brandCssVars.forest },
          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: brandCssVars.forest },
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: brandCssVars.forest, borderWidth: 2 },
        }}
      />
      <Typography
        id="newsletter-hint"
        variant="caption"
        sx={{ mt: 0.75, display: "block", color: brandCssVars.cream }}
      >
        Te poți dezabona oricând. Nu trimitem spam.
      </Typography>
    </Box>
  );
}
