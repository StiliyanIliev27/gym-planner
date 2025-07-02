import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Activity, AlertTriangle, Shield, RefreshCw } from 'lucide-react';
import { useSessionTimeout } from '@/hooks/auth/useSessionTimeout';
import { useAuthStore } from '@/stores/auth/useAuthStore';

/**
 * LiveSessionTimer - Real-time session countdown for testing
 * Updates every second to show exact time remaining
 */
export const LiveSessionTimer = () => {
  const { user } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  const {
    isWarningActive,
    timeRemaining,
    extendSession,
    getSessionInfo
  } = useSessionTimeout({
    inactivityTimeout: 2, // 2 minutes for testing
    warningTime: 0.5,     // 30 seconds warning
    enabled: !!user
  });

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Don't render if no user
  if (!user) return null;

  const sessionInfo = getSessionInfo();

  // Format time as MM:SS with color coding
  const formatTime = (seconds, isUrgent = false) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const timeStr = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    
    if (isUrgent && seconds <= 60) {
      return <span className="text-red-500 font-bold animate-pulse">{timeStr}</span>;
    } else if (isUrgent && seconds <= 120) {
      return <span className="text-orange-500 font-semibold">{timeStr}</span>;
    } else if (seconds < 300) {
      return <span className="text-yellow-600">{timeStr}</span>;
    }
    return <span className="text-green-600">{timeStr}</span>;
  };

  // Get status based on time remaining
  const getStatus = () => {
    if (isWarningActive) {
      return {
        label: 'WARNING ACTIVE',
        color: 'destructive',
        icon: AlertTriangle
      };
    } else if (sessionInfo.timeUntilWarning <= 60) {
      return {
        label: 'EXPIRES SOON',
        color: 'secondary',
        icon: Clock
      };
    } else {
      return {
        label: 'ACTIVE',
        color: 'default',
        icon: Shield
      };
    }
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <StatusIcon className={`h-4 w-4 ${
            status.color === 'destructive' ? 'text-red-500' : 
            status.color === 'secondary' ? 'text-yellow-500' : 
            'text-green-500'
          }`} />
          Session Timer (TEST MODE)
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Status Badge */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Status:</span>
          <Badge 
            variant={status.color}
            className="text-xs"
          >
            {status.label}
          </Badge>
        </div>

        {/* Time until warning */}
        {!isWarningActive && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Until warning:</span>
            <div className="font-mono text-sm">
              {formatTime(sessionInfo.timeUntilWarning)}
            </div>
          </div>
        )}

        {/* Time until logout */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Until logout:</span>
          <div className="font-mono text-sm">
            {isWarningActive 
              ? formatTime(timeRemaining, true) 
              : formatTime(sessionInfo.timeUntilLogout)
            }
          </div>
        </div>

        {/* Last activity */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Last activity:</span>
          <div className="font-mono text-xs text-muted-foreground">
            {Math.floor(sessionInfo.timeSinceLastActivity)}s ago
          </div>
        </div>

        {/* Current time (for reference) */}
        <div className="flex justify-between items-center border-t pt-2 mt-2">
          <span className="text-xs text-muted-foreground">Current time:</span>
          <div className="font-mono text-xs">
            {new Date(currentTime).toLocaleTimeString()}
          </div>
        </div>

        {/* Test info */}
        <div className="bg-blue-50 dark:bg-blue-950/20 p-2 rounded text-xs space-y-1">
          <div className="font-medium text-blue-700 dark:text-blue-300">Test Settings:</div>
          <div className="text-blue-600 dark:text-blue-400">
            • Inactivity timeout: 2 minutes
          </div>
          <div className="text-blue-600 dark:text-blue-400">
            • Warning time: 30 seconds
          </div>
        </div>

        {/* Extend session button */}
        <Button 
          onClick={extendSession}
          size="sm"
          variant="outline"
          className="w-full text-xs"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Extend Session (+2 min)
        </Button>

        {/* Warning indicator */}
        {isWarningActive && (
          <div className="bg-red-50 dark:bg-red-950/20 p-2 rounded border border-red-200 dark:border-red-800">
            <div className="text-red-700 dark:text-red-300 text-xs font-medium">
              ⚠️ SESSION EXPIRING!
            </div>
            <div className="text-red-600 dark:text-red-400 text-xs mt-1">
              You will be logged out in {formatTime(timeRemaining, true)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 