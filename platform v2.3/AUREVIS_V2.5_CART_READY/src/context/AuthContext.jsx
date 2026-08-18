import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [profileError, setProfileError] = useState("");

  const loadProfile = useCallback(async (userId) => {
    if (!supabase || !userId) {
      setProfile(null);
      return null;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      setProfileError(error.message);
      setProfile(null);
      return null;
    }

    setProfileError("");
    setProfile(data);
    return data;
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return undefined;
    }

    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      const nextSession = data.session ?? null;
      setSession(nextSession);
      if (nextSession?.user) await loadProfile(nextSession.user.id);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        setLoading(true);
        setTimeout(async () => {
          await loadProfile(nextSession.user.id);
          setLoading(false);
        }, 0);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const value = useMemo(() => ({
    configured: Boolean(supabase),
    session,
    user: session?.user ?? null,
    profile,
    profileError,
    loading,
    isAdmin: profile?.role === "admin",
    refreshProfile: () => loadProfile(session?.user?.id),
    signIn: async (email, password) => {
      const result = await supabase.auth.signInWithPassword({ email, password });
      if (!result.error && result.data.session?.user) {
        setSession(result.data.session);
        await loadProfile(result.data.session.user.id);
      }
      return result;
    },
    signUp: (email, password, metadata) => supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    }),
    signOut: () => supabase.auth.signOut(),
  }), [session, profile, profileError, loading, loadProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
