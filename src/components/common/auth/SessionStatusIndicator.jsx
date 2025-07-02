import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Clock, Shield, Activity, RefreshCw } from 'lucide-react';
import { useSessionTimeout } from '@/hooks/auth/useSessionTimeout';
import { useAuthStore } from '@/stores/auth/useAuthStore';

/**
 * SessionStatusIndicator - Shows current session status and allows session management
 * 
 * @param {boolean} showDetails - Whether to show detailed info (default: false)
 * @param {string} variant - Display variant: 'minimal', 'badge', 'full' (default: 'minimal')
 */
export const SessionStatusIndicator = ({ 
  showDetails = false, 
  variant = 'minimal' 
}) => {
  const { user } = useAuthStore();
  const [refreshKey, setRefreshKey] = useState(0);
  
  const {
    isWarningActive,
    timeRemaining,
    extendSession,
    getSessionInfo
  } = useSessionTimeout({
    inactivityTimeout: 30,
    warningTime: 5,
    enabled: !!user
  });

  // Get real-time session info
  const sessionInfo = getSessionInfo();

  // Format time in readable format
  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // Refresh session info periodically
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  // Don't render if no user
  if (!user) return null;

  // Get status info
  const getSessionStatus = () => {
    if (isWarningActive) {
      return {
        label: 'Expiring',
        color: 'destructive',
        icon: Clock,
        description: `Session expires in ${formatTime(timeRemaining)}`
      };
    }

    if (sessionInfo.timeUntilWarning < 600) { // Less than 10 minutes
      return {
        label: 'Expiring Soon',
        color: 'warning',
        icon: Clock,
        description: `Warning in ${formatTime(sessionInfo.timeUntilWarning)}`
      };
    }

    return {
      label: 'Active',
      color: 'success',
      icon: Shield,
      description: `Active session - ${formatTime(sessionInfo.timeUntilWarning)} until warning`
    };
  };

  const status = getSessionStatus();
  const StatusIcon = status.icon;

  // Minimal variant - just a small indicator
  if (variant === 'minimal') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                status.color === 'destructive' ? 'bg-red-500' :
                status.color === 'warning' ? 'bg-yellow-500' :
                'bg-green-500'
              } animate-pulse`} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">{status.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Badge variant - shows status as a badge
  if (variant === 'badge') {
    return (
      <Badge 
        variant={status.color === 'destructive' ? 'destructive' : 'secondary'}
        className="text-xs"
      >
        <StatusIcon className="w-3 h-3 mr-1" />
        {status.label}
      </Badge>
    );
  }

  // Full variant - detailed popover with session management
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-xs"
        >
          <StatusIcon className={`w-3 h-3 mr-1 ${
            status.color === 'destructive' ? 'text-red-500' :
            status.color === 'warning' ? 'text-yellow-500' :
            'text-green-500'
          }`} />
          {status.label}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <StatusIcon className={`w-4 h-4 ${
              status.color === 'destructive' ? 'text-red-500' :
              status.color === 'warning' ? 'text-yellow-500' :
              'text-green-500'
            }`} />
            <h4 className="font-medium">Session Status</h4>
          </div>

          <div className="space-y-3">
            {/* Current Status */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge variant={status.color === 'destructive' ? 'destructive' : 'secondary'}>
                {status.label}
              </Badge>
            </div>

            {/* Time until warning */}
            {!isWarningActive && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Until warning:</span>
                <span className="text-sm font-mono">
                  {formatTime(sessionInfo.timeUntilWarning)}
                </span>
              </div>
            )}

            {/* Time until logout */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Until logout:</span>
              <span className={`text-sm font-mono ${
                isWarningActive ? 'text-red-500 font-bold' : ''
              }`}>
                {isWarningActive ? formatTime(timeRemaining) : formatTime(sessionInfo.timeUntilLogout)}
              </span>
            </div>

            {/* Last activity */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Last activity:</span>
              <span className="text-sm font-mono">
                {formatTime(sessionInfo.timeSinceLastActivity)} ago
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t space-y-2">
            <Button 
              onClick={extendSession} 
              size="sm" 
              className="w-full"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Extend Session (+30 min)
            </Button>
            
            {showDetails && (
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Auto logout after 30 min of inactivity</p>
                <p>• Warning 5 min before logout</p>
                <p>• Maximum duration: 24 hours</p>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}; 