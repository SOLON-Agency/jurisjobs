"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PasskeyListItem } from "@supabase/supabase-js";
import { JJButton } from "@/components/common/JJButton";
import { JJIconButton } from "@/components/common/JJIconButton";
import { passkeyNameSchema, type PasskeyNameFormData } from "@/components/forms/validations/passkey.schema";
import { ConfirmDialog } from "@/components/layout/ConfirmDialog";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import { browserSupportsPasskeys, classifyPasskeyError } from "@/lib/passkeys";

function formatPasskeyDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("ro-RO", { day: "numeric", month: "short", year: "numeric" });
}

export function JJPasskeySettings() {
  const { user, listPasskeys, registerPasskey, renamePasskey, deletePasskey } = useAuth();
  const { showToast } = useToast();
  const [passkeys, setPasskeys] = useState<PasskeyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [supported, setSupported] = useState(false);
  const [adding, setAdding] = useState(false);
  const [sectionError, setSectionError] = useState<string | null>(null);
  const [editing, setEditing] = useState<PasskeyListItem | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PasskeyListItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasskeyNameFormData>({
    resolver: zodResolver(passkeyNameSchema),
    defaultValues: { friendlyName: "" },
  });

  const loadPasskeys = useCallback(async () => {
    setLoading(true);
    const { data, error } = await listPasskeys();
    setLoading(false);
    if (error) {
      const failure = classifyPasskeyError(error);
      setSectionError(failure.kind === "message" ? failure.text : "Nu am putut încărca cheile de acces.");
      setPasskeys([]);
      return;
    }
    setSectionError(null);
    setPasskeys(data ?? []);
  }, [listPasskeys]);

  useEffect(() => {
    setSupported(browserSupportsPasskeys());
  }, []);

  useEffect(() => {
    if (!user) return;
    void loadPasskeys();
  }, [user, loadPasskeys]);

  const emailConfirmed = Boolean(user?.email_confirmed_at ?? user?.confirmed_at);
  const canRegister = supported && emailConfirmed && user?.is_anonymous !== true;

  const onAdd = async () => {
    setAdding(true);
    const { data, error } = await registerPasskey();
    if (error) {
      setAdding(false);
      const failure = classifyPasskeyError(error);
      if (failure.kind === "cancelled") return;
      if (failure.kind === "unconfirmed") {
        showToast("Confirmă adresa de e-mail înainte să adaugi o cheie de acces.", "warning");
        return;
      }
      showToast(failure.text, "error", 5000);
      return;
    }
    if (data?.id && !data.friendly_name) {
      const renamed = await renamePasskey(data.id, "Cheie de acces");
      if (renamed.error) {
        setAdding(false);
        showToast("Cheia a fost adăugată, dar numele implicit nu a putut fi salvat.", "warning");
        await loadPasskeys();
        return;
      }
    }
    setAdding(false);
    showToast("Cheia de acces a fost adăugată.");
    await loadPasskeys();
  };

  const openRename = (item: PasskeyListItem) => {
    setEditing(item);
    reset({ friendlyName: item.friendly_name ?? "" });
  };

  const onRename = async (values: PasskeyNameFormData) => {
    if (!editing) return;
    const { error } = await renamePasskey(editing.id, values.friendlyName);
    if (error) {
      showToast("Nu am putut redenumi cheia de acces.", "error", 5000);
      return;
    }
    setEditing(null);
    showToast("Numele cheii de acces a fost actualizat.");
    await loadPasskeys();
  };

  const onDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    const { error } = await deletePasskey(pendingDelete.id);
    setDeleting(false);
    if (error) {
      showToast("Nu am putut șterge cheia de acces.", "error", 5000);
      return;
    }
    setPendingDelete(null);
    showToast("Cheia de acces a fost ștearsă.", "info");
    await loadPasskeys();
  };

  if (!user) return null;

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, border: "1px solid", borderColor: "divider" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ justifyContent: "space-between", alignItems: { sm: "center" }, mb: 2 }}
      >
        <Box>
          <Typography variant="h6" component="h2">
            Chei de acces
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Conectează-te cu Face ID, amprenta sau cheia dispozitivului, fără parolă.
          </Typography>
        </Box>
        {canRegister && (
          <JJButton
            type="button"
            appearance="secondary"
            variant="outlined"
            onClick={() => void onAdd()}
            disabled={adding}
            aria-busy={adding}
            startIcon={adding ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {adding ? "Se salvează…" : "Adaugă o cheie de acces"}
          </JJButton>
        )}
      </Stack>

      {!emailConfirmed && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Confirmă adresa de e-mail înainte să adaugi o cheie de acces.
        </Alert>
      )}
      {emailConfirmed && !supported && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Acest browser nu poate crea chei de acces. Poți vedea cheile salvate pe alte dispozitive.
        </Alert>
      )}
      {sectionError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {sectionError}
        </Alert>
      )}

      {loading ? (
        <Typography variant="body2" color="text.secondary">
          Se încarcă cheile de acces…
        </Typography>
      ) : passkeys.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Nu ai nicio cheie de acces.
        </Typography>
      ) : (
        <Stack component="ul" spacing={1} sx={{ listStyle: "none", m: 0, p: 0 }}>
          {passkeys.map((item) => {
            const label = item.friendly_name || "Cheie de acces";
            const created = formatPasskeyDate(item.created_at);
            return (
              <Stack
                key={item.id}
                component="li"
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                sx={{
                  alignItems: { sm: "center" },
                  justifyContent: "space-between",
                  py: 1,
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box>
                  <Typography variant="body1">{label}</Typography>
                  {created && (
                    <Typography variant="caption" color="text.secondary">
                      Adăugată la {created}
                    </Typography>
                  )}
                </Box>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <JJButton type="button" appearance="secondary" variant="outlined" onClick={() => openRename(item)}>
                    Redenumește
                  </JJButton>
                  <JJIconButton
                    aria-label={`Șterge cheia de acces ${label}`}
                    onClick={() => setPendingDelete(item)}
                  >
                    <DeleteOutlineIcon />
                  </JJIconButton>
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      )}

      <Dialog
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        aria-labelledby="passkey-rename-title"
        fullWidth
        maxWidth="xs"
      >
        <Box component="form" noValidate onSubmit={handleSubmit(onRename)}>
          <DialogTitle id="passkey-rename-title">Redenumește cheia de acces</DialogTitle>
          <DialogContent>
            <TextField
              {...register("friendlyName")}
              label="Nume"
              fullWidth
              required
              autoFocus
              error={!!errors.friendlyName}
              helperText={errors.friendlyName?.message ?? "Maxim 120 de caractere."}
              inputProps={{
                "aria-required": "true",
                "aria-describedby": "passkey-name-help",
              }}
              FormHelperTextProps={{ id: "passkey-name-help" }}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <JJButton type="button" appearance="secondary" variant="text" onClick={() => setEditing(null)}>
              Anulează
            </JJButton>
            <JJButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Se salvează…" : "Salvează"}
            </JJButton>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Șterge cheia de acces"
        body={`Ești sigur că vrei să ștergi „${pendingDelete?.friendly_name || "Cheie de acces"}”? Nu te vei mai putea conecta cu ea.`}
        confirmLabel="Șterge"
        loading={deleting}
        onConfirm={() => void onDelete()}
        onCancel={() => setPendingDelete(null)}
      />
    </Paper>
  );
}
