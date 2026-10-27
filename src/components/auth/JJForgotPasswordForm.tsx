"use client";

import React, { useState } from "react";
import { Alert, Box, CircularProgress, Container, Paper, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JJButton } from "@/components/common/JJButton";
import { JJLink } from "@/components/common/JJLink";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/components/forms/validations/password.schema";
import { useAuth } from "@/hooks/useAuth";
import { authErrorMessage, isUnknownAccount } from "@/lib/auth-errors";
import appSettings from "@/config/app.settings.json";

export function JJForgotPasswordForm() {
  const { requestPasswordReset } = useAuth();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);
    const { error: resetError } = await requestPasswordReset(data.email);
    if (resetError && !isUnknownAccount(resetError)) {
      setError(authErrorMessage(resetError));
      return;
    }
    setSent(true);
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 8 } }}>
      <Paper sx={{ p: { xs: 3, sm: 4 }, border: "1px solid rgba(3, 23, 12, 0.1)", borderRadius: 3 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 1, textAlign: "center" }}>
          Resetează parola
        </Typography>
        <Typography variant="body2"  sx={{ mb: 4, textAlign: "center" }}>
          Îți trimitem un link pe e-mail ca să alegi o parolă nouă pentru {appSettings.name}.
        </Typography>

        {sent ? (
          <Alert severity="success" role="status" sx={{ mb: 3 }}>
            Dacă există un cont pentru această adresă, am trimis un link de resetare. Verifică și dosarul Spam.
            Link-ul expiră într-o oră.
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {error && (
              <Alert severity="error" role="alert" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            <TextField
              {...register("email")}
              label="E-mail"
              type="email"
              fullWidth
              required
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              inputProps={{
                "aria-required": "true",
                "aria-describedby": errors.email ? "forgot-email-error" : undefined,
              }}
              FormHelperTextProps={{ id: "forgot-email-error" }}
              sx={{ mb: 2 }}
            />
            <JJButton
              type="submit"
              appearance="primary"
              fullWidth
              size="large"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {isSubmitting ? "Se trimite…" : "Trimite link-ul"}
            </JJButton>
          </Box>
        )}

        <Typography variant="body2"  sx={{ mt: 3, textAlign: "center" }}>
          <JJLink href="/login" variant="body2" sx={{ color: "primary.main" }}>
            Înapoi la conectare
          </JJLink>
        </Typography>
      </Paper>
    </Container>
  );
}
