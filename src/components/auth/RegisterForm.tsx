"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { JJButton } from "@/components/common/JJButton";
import { JJLink } from "@/components/common/JJLink";
import { JJPasswordField } from "@/components/common/JJPasswordField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/components/forms/validations/register.schema";
import { useAuth } from "@/hooks/useAuth";
import { authErrorMessage } from "@/lib/auth-errors";
import { safeInternalPath } from "@/lib/auth-redirect";
import appSettings from "@/config/app.settings.json";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const { user, signUp } = useAuth();

  // ?email= pre-fills the email field (e.g. when coming from the claim flow)
  const prefillEmail = searchParams.get("email") ?? "";
  // ?redirect= is where to send the user after successful registration
  const redirectAfter = safeInternalPath(searchParams.get("redirect"));

  useEffect(() => {
    if (user) router.replace(redirectAfter);
  }, [user, router, redirectAfter]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: prefillEmail, fullName: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    const { data: authData, error: authError } = await signUp(data.email, data.password, {
      fullName: data.fullName,
      redirectTo: redirectAfter,
    });
    if (authError) {
      setError(authErrorMessage(authError));
      return;
    }

    // When email confirmation is required, Supabase returns a user but no
    // session, and user_metadata.email_verified is false (or absent).
    const emailVerified =
      authData?.user?.user_metadata?.email_verified === true ||
      authData?.user?.email_confirmed_at != null;

    if (!emailVerified) {
      // Preserve the redirect param so that after verification they go to the claim page
      const verifyQuery = redirectAfter && redirectAfter !== "/dashboard"
        ? `?email=${encodeURIComponent(data.email)}&redirect=${encodeURIComponent(redirectAfter)}`
        : `?email=${encodeURIComponent(data.email)}`;
      router.push(`/verify-email${verifyQuery}`);
      return;
    }

    router.push(redirectAfter);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        sx={{
          p: 4,
          border: "1px solid rgba(3, 23, 12, 0.1)",
          borderRadius: 3,
        }}
      >
        <Typography variant="h3" component="h1" sx={{ mb: 3, textAlign: "center" }}>
          Creează cont {appSettings.name}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* <SocialButtons /> */}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            {...register("fullName")}
            label="Nume complet"
            fullWidth
            required
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
            inputProps={{ "aria-required": "true", "aria-describedby": errors.fullName ? "register-fullname-error" : undefined }}
            FormHelperTextProps={{ id: "register-fullname-error" }}
            sx={{ mb: 2 }}
          />
          <TextField
            {...register("email")}
            label="E-mail"
            type="email"
            fullWidth
            required
            error={!!errors.email}
            helperText={errors.email?.message}
            inputProps={{ "aria-required": "true", "aria-describedby": errors.email ? "register-email-error" : undefined }}
            FormHelperTextProps={{ id: "register-email-error" }}
            sx={{ mb: 2 }}
          />
          <JJPasswordField
            {...register("password")}
            label="Parolă"
            fullWidth
            required
            error={!!errors.password}
            helperText={errors.password?.message}
            inputProps={{ "aria-required": "true", "aria-describedby": errors.password ? "register-password-error" : undefined }}
            FormHelperTextProps={{ id: "register-password-error" }}
            sx={{ mb: 2 }}
          />
          <JJPasswordField
            {...register("confirmPassword")}
            label="Confirmă parola"
            fullWidth
            required
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            inputProps={{ "aria-required": "true", "aria-describedby": errors.confirmPassword ? "register-confirm-password-error" : undefined }}
            FormHelperTextProps={{ id: "register-confirm-password-error" }}
            sx={{ mb: 3 }}
          />
          <JJButton
            type="submit"
            appearance="primary"
            fullWidth
            size="large"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? <CircularProgress size={18} color="inherit" /> : null
            }
            sx={{ py: 1.5 }}
          >
            {isSubmitting ? "Se creează contul..." : "Creează cont"}
          </JJButton>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: "center" }}>
          Ai deja un cont?{" "}
          <JJLink
            href={redirectAfter === "/dashboard" ? "/login" : `/login?redirect=${encodeURIComponent(redirectAfter)}`}
            variant="body2"
            sx={{ color: "primary.main" }}
          >
            Conectează-te
          </JJLink>
        </Typography>
      </Paper>
    </Container>
  );
};
