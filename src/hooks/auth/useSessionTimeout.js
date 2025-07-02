import { useEffect, useRef, useCallback, useState } from 'react';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { signOutAsync } from '@/lib/supabase/auth';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

/**
 * Custom hook for managing user session timeouts and activity tracking
 * 
 * Features:
 * - Tracks user activity (mouse, keyboard, touch)
 * - Warns user before session expires
 * - Auto-logout on inactivity
 * - Token refresh management
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.inactivityTimeout - Minutes before logout (default: 30)
 * @param {number} options.warningTime - Minutes before showing warning (default: 5)
 * @param {boolean} options.enabled - Enable/disable timeout (default: true)
 */
export const useSessionTimeout = (options = {}) => {
  const {
    inactivityTimeout = 30, // 30 minutes
    warningTime = 5, // 5 minutes warning
    enabled = true
  } = options;

  const { user, clearUser } = useAuthStore();
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Refs for timers
  const inactivityTimer = useRef(null);
  const warningTimer = useRef(null);
  const countdownTimer = useRef(null);
  const lastActivity = useRef(Date.now());

  // Convert minutes to milliseconds
  const INACTIVITY_TIMEOUT = inactivityTimeout * 60 * 1000;
  const WARNING_TIME = warningTime * 60 * 1000;

  /**
   * Reset all timers and start fresh
   */
  const resetTimers = useCallback(() => {
    // Clear existing timers
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    if (warningTimer.current) {
      clearTimeout(warningTimer.current);
    }
    if (countdownTimer.current) {
      clearInterval(countdownTimer.current);
    }

    // Hide warning if showing
    setShowWarning(false);
    
    // Update last activity
    lastActivity.current = Date.now();

    if (!enabled || !user) return;

    // Set warning timer (5 minutes before logout)
    warningTimer.current = setTimeout(() => {
      setShowWarning(true);
      setTimeRemaining(WARNING_TIME / 1000); // Convert to seconds
      
      // Start countdown
      countdownTimer.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleAutoLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast.warning(
        `Your session will expire in ${warningTime} minutes due to inactivity. Click to stay logged in.`,
        {
          duration: WARNING_TIME,
          action: {
            label: "Stay Logged In",
            onClick: () => {
              resetTimers();
              toast.success("Session renewed!");
            }
          }
        }
      );
    }, INACTIVITY_TIMEOUT - WARNING_TIME);

    // Set auto-logout timer
    inactivityTimer.current = setTimeout(() => {
      handleAutoLogout();
    }, INACTIVITY_TIMEOUT);
  }, [enabled, user, inactivityTimeout, warningTime]);

  /**
   * Handle automatic logout
   */
  const handleAutoLogout = useCallback(async () => {
    if (!user) return;

    try {
      await signOutAsync();
      clearUser();
      setShowWarning(false);
      
      toast.error(
        "You have been automatically logged out due to inactivity for more than 30 minutes.",
        { duration: 5000 }
      );
      
      // Redirect to login
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Error during auto logout:', error);
    }
  }, [user, clearUser]);

  /**
   * Track user activity events
   */
  const trackActivity = useCallback(() => {
    if (!enabled || !user) return;
    
    const now = Date.now();
    // Only reset if it's been more than 1 minute since last activity
    // This prevents too frequent timer resets
    if (now - lastActivity.current > 60000) {
      resetTimers();
    }
  }, [enabled, user, resetTimers]);

  /**
   * Check if current session is still valid
   */
  const checkSessionValidity = useCallback(async () => {
    if (!user) return;

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        console.log('Session invalid, logging out...');
        await handleAutoLogout();
      }
    } catch (error) {
      console.error('Error checking session validity:', error);
    }
  }, [user, handleAutoLogout]);

  /**
   * Manually extend session
   */
  const extendSession = useCallback(() => {
    if (!user) return;
    
    resetTimers();
    toast.success("Session extended by 30 minutes!");
  }, [user, resetTimers]);

  /**
   * Get session info
   */
  const getSessionInfo = useCallback(() => {
    const timeSinceLastActivity = Date.now() - lastActivity.current;
    const timeUntilWarning = Math.max(0, INACTIVITY_TIMEOUT - WARNING_TIME - timeSinceLastActivity);
    const timeUntilLogout = Math.max(0, INACTIVITY_TIMEOUT - timeSinceLastActivity);

    return {
      timeSinceLastActivity: Math.floor(timeSinceLastActivity / 1000),
      timeUntilWarning: Math.floor(timeUntilWarning / 1000),
      timeUntilLogout: Math.floor(timeUntilLogout / 1000),
      isWarningActive: showWarning,
      timeRemaining
    };
  }, [INACTIVITY_TIMEOUT, WARNING_TIME, showWarning, timeRemaining]);

  // Set up activity listeners
  useEffect(() => {
    if (!enabled || !user) return;

    const events = [
      'mousedown',
      'mousemove', 
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, trackActivity, true);
    });

    // Initial timer setup
    resetTimers();

    // Check session validity every 5 minutes
    const sessionCheckInterval = setInterval(checkSessionValidity, 5 * 60 * 1000);

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, trackActivity, true);
      });
      
      clearInterval(sessionCheckInterval);
      
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      if (warningTimer.current) {
        clearTimeout(warningTimer.current);
      }
      if (countdownTimer.current) {
        clearInterval(countdownTimer.current);
      }
    };
  }, [enabled, user, trackActivity, resetTimers, checkSessionValidity]);

  // Reset timers when user changes
  useEffect(() => {
    if (user) {
      resetTimers();
    } else {
      // Clear all timers when user logs out
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (warningTimer.current) clearTimeout(warningTimer.current);
      if (countdownTimer.current) clearInterval(countdownTimer.current);
      setShowWarning(false);
    }
  }, [user, resetTimers]);

  return {
    isWarningActive: showWarning,
    timeRemaining,
    extendSession,
    getSessionInfo,
    resetTimers: trackActivity, // Expose as resetTimers for manual calls
  };
}; 