"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, CircularProgress, Container, Paper, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JJButton } from "@/components/common/JJButton";
import { JJLink } from "@/components/common/JJLink";
import { JJPasswordField } from "@/components/common/JJPasswordField";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/components/forms/validations/password.schema";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import { useSupabase } from "@/hooks/useSupabase";
import { authErrorMessage } from "@/lib/auth-errors";
import { dispatchNotification } from "@/lib/notifications/dispatch";
import { NOTIFICATION_TYPES } from "@/lib/notifications/types";

export function JJResetPasswordForm() {
  const router = useRouter();
  const supabase = useSupabase();
  const { showToast } = useToast();
  const { user, loading, updatePassword } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null);
    const { data: updated, error: updateError } = await updatePassword(data.password);
    if (updateError) {
      setError(authErrorMessage(updateError));
      return;
    }

    if (user?.id) {
      void dispatchNotification(supabase, {
        type: NOTIFICATION_TYPES.PASSWORD_RESET_OK,
        recipients: [user.id],
        idempotencyKey: `password-reset/${user.id}/${updated.user?.updated_at ?? user.id}`,
      }).catch((err: unknown) => console.warn("password_reset_ok:", err));
    }

    showToast("Parola a fost schimbată.");
    router.push("/dashboard");
    router.refresh();
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box role="status" aria-label="Se încarcă..." sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 8 } }}>
      <Paper sx={{ p: { xs: 3, sm: 4 }, border: "1px solid rgba(3, 23, 12, 0.1)", borderRadius: 3 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 1, textAlign: "center" }}>
          Parolă nouă
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: "center" }}>
          Alege o parolă pe care o poți reține. După salvare rămâi conectat.
        </Typography>

        {!user ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Link-ul de resetare lipsește, a expirat sau a fost deja folosit. Solicită unul nou, apoi deschide-l în
            același browser.
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {error && (
              <Alert severity="error" role="alert" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            <JJPasswordField
              {...register("password")}
              label="Parolă nouă"
              fullWidth
              required
              autoComplete="new-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              inputProps={{
                "aria-required": "true",
                "aria-describedby": errors.password ? "reset-password-error" : undefined,
              }}
              FormHelperTextProps={{ id: "reset-password-error" }}
              sx={{ mb: 2 }}
            />
            <JJPasswordField
              {...register("confirmPassword")}
              label="Confirmă parola"
              fullWidth
              required
              autoComplete="new-password"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              inputProps={{
                "aria-required": "true",
                "aria-describedby": errors.confirmPassword ? "reset-confirm-error" : undefined,
              }}
              FormHelperTextProps={{ id: "reset-confirm-error" }}
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
              {isSubmitting ? "Se salvează…" : "Salvează parola"}
            </JJButton>
          </Box>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: "center" }}>
          {!user && (
            <>
              <JJLink href="/forgot-password" variant="body2" sx={{ color: "primary.main" }}>
                Trimite un link nou
              </JJLink>
              {" · "}
            </>
          )}
          <JJLink href="/login" variant="body2" sx={{ color: "primary.main" }}>
            Înapoi la conectare
          </JJLink>
        </Typography>
      </Paper>
    </Container>
  );
}
