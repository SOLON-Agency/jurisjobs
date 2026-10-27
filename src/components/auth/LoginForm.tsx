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
import { loginSchema, type LoginFormData } from "@/components/forms/validations/login.schema";


import { useAuth } from "@/hooks/useAuth";
import { authErrorMessage, isEmailNotConfirmed } from "@/lib/auth-errors";
import { safeInternalPath } from "@/lib/auth-redirect";
import { browserSupportsPasskeys, classifyPasskeyError } from "@/lib/passkeys";
import appSettings from "@/config/app.settings.json";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = safeInternalPath(searchParams.get("redirect"));
  const [error, setError] = useState<string | null>(
    searchParams.get("error") ? "Autentificare eșuată. Te rugăm să încerci din nou." : null
  );
  const [passkeyBusy, setPasskeyBusy] = useState(false);
  const [passkeysAvailable, setPasskeysAvailable] = useState(false);
  const { user, signIn, signInWithPasskey } = useAuth();

  useEffect(() => {
    if (user) router.replace(redirect);
  }, [user, router, redirect]);

  useEffect(() => {
    setPasskeysAvailable(browserSupportsPasskeys());
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: searchParams.get("email") ?? "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    const { error: authError } = await signIn(data.email, data.password);
    if (authError) {
      if (isEmailNotConfirmed(authError)) {
        const verifyRedirect = redirect === "/dashboard" ? "" : `&redirect=${encodeURIComponent(redirect)}`;
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}${verifyRedirect}`);
        return;
      }
      setError(authErrorMessage(authError));
    } else {
      router.push(redirect);
      router.refresh();
    }
  };

  const onPasskey = async () => {
    setError(null);
    setPasskeyBusy(true);
    const { error: authError } = await signInWithPasskey();
    setPasskeyBusy(false);
    if (!authError) {
      router.push(redirect);
      router.refresh();
      return;
    }
    const failure = classifyPasskeyError(authError);
    if (failure.kind === "cancelled") return;
    if (failure.kind === "unconfirmed") {
      router.push("/verify-email");
      return;
    }
    setError(failure.text);
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
        <Typography variant="h3" component="h1" sx={{ mb: 1, textAlign: "center" }}>
          Bine ai revenit
        </Typography>
        <Typography
          variant="body2"
          
          sx={{ mb: 4, textAlign: "center" }}
        >
          Conectează-te la contul tău {appSettings.name}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* <SocialButtons /> */}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            {...register("email")}
            label="E-mail"
            type="email"
            fullWidth
            required
            autoComplete="username webauthn"
            error={!!errors.email}
            helperText={errors.email?.message}
            inputProps={{ "aria-required": "true", "aria-describedby": errors.email ? "login-email-error" : undefined }}
            FormHelperTextProps={{ id: "login-email-error" }}
            sx={{ mb: 2 }}
          />
          <JJPasswordField
            {...register("password")}
            label="Parolă"
            fullWidth
            required
            error={!!errors.password}
            helperText={errors.password?.message}
            inputProps={{ "aria-required": "true", "aria-describedby": errors.password ? "login-password-error" : undefined }}
            FormHelperTextProps={{ id: "login-password-error" }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <JJLink href="/forgot-password" variant="body2" sx={{ color: "primary.main" }}>
              Ai uitat parola?
            </JJLink>
          </Box>
          <JJButton
            type="submit"
            appearance="primary"
            fullWidth
            size="large"
            disabled={isSubmitting || passkeyBusy}
            startIcon={
              isSubmitting ? <CircularProgress size={18} color="inherit" /> : null
            }
            sx={{ py: 1.5 }}
          >
            {isSubmitting ? "Se conectează..." : "Conectare"}
          </JJButton>
        </Box>

        {passkeysAvailable && (
          <JJButton
            type="button"
            appearance="secondary"
            variant="outlined"
            fullWidth
            size="large"
            disabled={passkeyBusy || isSubmitting}
            aria-busy={passkeyBusy}
            onClick={() => void onPasskey()}
            sx={{ mt: 2 }}
            startIcon={passkeyBusy ? <CircularProgress size={18} color="inherit" /> : null}
          >
            {passkeyBusy ? "Se conectează..." : "Conectează-te cu o cheie de acces"}
          </JJButton>
        )}

        <Typography variant="body2"  sx={{ mt: 3, textAlign: "center" }}>
          Nu ai cont?{" "}
          <JJLink href="/register" variant="body2" sx={{ color: "primary.main" }}>
            Creează un cont {appSettings.name}
          </JJLink>
        </Typography>
      </Paper>
    </Container>
  );
};
