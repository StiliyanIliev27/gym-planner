"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { supabase } from "@/lib/supabase/client";
import { useSessionTimeout } from "@/hooks/auth/useSessionTimeout";
import { SessionWarningDialog } from "@/components/common/auth/SessionWarningDialog";
import { signOutAsync } from "@/lib/supabase/auth";

export function AuthProvider({ children }) {
  const { user, setUser, clearUser, setIsLoading } = useAuthStore();

  // Initialize session timeout management
  const {
    isWarningActive,
    timeRemaining,
    extendSession,
    getSessionInfo
  } = useSessionTimeout({
    inactivityTimeout: 30, // 30 minutes
    warningTime: 5, // 5 minutes warning
    enabled: true
  });

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
        
        // Log session events for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('Auth event:', event, session?.user?.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [setUser, setIsLoading]);

  // Handle manual logout
  const handleLogoutNow = async () => {
    try {
      await signOutAsync();
      clearUser();
    } catch (error) {
      console.error('Error during manual logout:', error);
      // Force clear user state even if logout fails
      clearUser();
    }
  };

  return (
    <>
      {children}
      
      {/* Session Warning Dialog */}
      <SessionWarningDialog
        isOpen={isWarningActive}
        timeRemaining={timeRemaining}
        onExtendSession={extendSession}
        onLogoutNow={handleLogoutNow}
      />
    </>
  );
}