import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface Profile { id: string; display_name: string; avatar: string }
interface AuthState { user: User | null; profile: Profile | null; ready: boolean; refreshProfile: () => Promise<void> }

const Ctx = createContext<AuthState>({ user: null, profile: null, ready: false, refreshProfile: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);

  const loadProfile = useCallback(async (u: User | null) => {
    if (!u) { setProfile(null); return; }
    const { data } = await supabase.from("profiles").select("id, display_name, avatar").eq("id", u.id).maybeSingle();
    setProfile(data);
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED" && event !== "INITIAL_SESSION") return;
      const u = session?.user ?? null;
      setUser(u);
      setReady(true);
      setTimeout(() => void loadProfile(u), 0);
    });
    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  return <Ctx.Provider value={{ user, profile, ready, refreshProfile: () => loadProfile(user) }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
