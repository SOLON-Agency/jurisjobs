"use client";

import React, { useState } from "react";
import { Button, CircularProgress, Collapse } from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { JJBanner } from "@/components/common/JJBanner";
import { useAuth } from "@/hooks/useAuth";

export function JJEmailVerificationBanner() {
  const { user, resendVerification } = useAuth();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isUnverified =
    user !== null && !user.email_confirmed_at && !user.confirmed_at;

  const handleResend = async () => {
    if (!user?.email) return;
    setSending(true);
    setError(null);
    const { error: resendErr } = await resendVerification(user.email);
    setSending(false);
    if (resendErr) {
      setError(resendErr.message);
    } else {
      setSent(true);
    }
  };

  return (
    <Collapse in={isUnverified} unmountOnExit>
      <JJBanner
        variant="notice"
        severity={sent ? "success" : "warning"}
        role={sent ? "status" : "alert"}
        icon={sent ? <MarkEmailReadIcon fontSize="inherit" /> : undefined}
        action={
          !sent ? (
            <Button
              color="inherit"
              size="medium"
              disabled={sending}
              sx={{ minHeight: 44, minWidth: 44 }}
              startIcon={
                sending ? <CircularProgress size={14} color="inherit" /> : null
              }
              onClick={handleResend}
            >
              {sending ? "Se trimite..." : "Retrimite email"}
            </Button>
          ) : null
        }
      >
        {sent
          ? "Email de verificare trimis! Verifică-ți căsuța de e-mail."
          : error
            ? `Eroare: ${error}`
            : "Adresa ta de e-mail nu este verificată. Verifică-ți căsuța de e-mail sau retrimite linkul de confirmare."}
      </JJBanner>
    </Collapse>
  );
}
