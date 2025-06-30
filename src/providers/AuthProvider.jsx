"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { supabase } from "@/lib/supabase/client";

export function AuthProvider({ children }) {
  const setUser = useAuthStore((state) => state.setUser);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [setUser, setIsLoading]);

  return <>{children}</>;
}