"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AUTH_NEXT_COOKIE, authCallbackUrl, safeInternalPath } from "@/lib/auth-redirect";
import type { Provider, Session, User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signUp = useCallback(
    async (email: string, password: string, options?: { fullName?: string; redirectTo?: string }) => {
      const next = safeInternalPath(options?.redirectTo);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: authCallbackUrl(window.location.origin, next),
          data: options?.fullName ? { full_name: options.fullName } : undefined,
        },
      });
      return { data, error };
    },
    [supabase.auth]
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    },
    [supabase.auth]
  );

  const signInWithProvider = useCallback(
    async (provider: Provider) => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      return { error };
    },
    [supabase.auth]
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  }, [supabase.auth]);

  const signInAnonymously = useCallback(async () => {
    const { data, error } = await supabase.auth.signInAnonymously();
    return { data, error };
  }, [supabase.auth]);

  const signInWithPasskey = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithPasskey();
    return { data, error };
  }, [supabase.auth]);

  const registerPasskey = useCallback(async () => {
    const { data, error } = await supabase.auth.registerPasskey();
    return { data, error };
  }, [supabase.auth]);

  const listPasskeys = useCallback(async () => supabase.auth.passkey.list(), [supabase.auth]);

  const renamePasskey = useCallback(
    async (passkeyId: string, friendlyName: string) =>
      supabase.auth.passkey.update({ passkeyId, friendlyName }),
    [supabase.auth]
  );

  const deletePasskey = useCallback(
    async (passkeyId: string) => supabase.auth.passkey.delete({ passkeyId }),
    [supabase.auth]
  );

  const resendVerification = useCallback(
    async (email: string, redirectTo?: string | null) => {
      const next = safeInternalPath(redirectTo);
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: authCallbackUrl(window.location.origin, next),
        },
      });
      return { error };
    },
    [supabase.auth]
  );

  const requestPasswordReset = useCallback(async (email: string) => {
    document.cookie = `${AUTH_NEXT_COOKIE}=${encodeURIComponent("/reset-password")}; Path=/; Max-Age=3600; SameSite=Lax`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: authCallbackUrl(window.location.origin, "/reset-password"),
    });
    return { error };
  }, [supabase.auth]);

  const updatePassword = useCallback(async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({ password });
    return { data, error };
  }, [supabase.auth]);

  return {
    ...state,
    signUp,
    signIn,
    signInAnonymously,
    signInWithProvider,
    signInWithPasskey,
    registerPasskey,
    listPasskeys,
    renamePasskey,
    deletePasskey,
    signOut,
    resendVerification,
    requestPasswordReset,
    updatePassword,
  };
};
