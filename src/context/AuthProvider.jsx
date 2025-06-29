"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { client } from "@/app/api/client";

export function AuthProvider({ session, children }) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    } else {
      clearUser();
    }
    setIsLoading(false);

    const { data: listener } = client.auth.onAuthStateChange(
      (_event, newSession) => {
        if (newSession?.user) {
          setUser(newSession.user);
        } else {
          clearUser();
        }
        setIsLoading(false);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [session, setUser, clearUser, setIsLoading]);

  return children;
}