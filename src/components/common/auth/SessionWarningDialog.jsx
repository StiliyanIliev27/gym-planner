import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Clock, Coffee } from "lucide-react";

/**
 * SessionWarningDialog - Simple friendly warning when user session is about to expire
 */
export const SessionWarningDialog = ({
  isOpen,
  timeRemaining,
  onExtendSession,
  onLogoutNow
}) => {
  const [localTimeRemaining, setLocalTimeRemaining] = useState(timeRemaining);

  // Sync with parent component
  useEffect(() => {
    setLocalTimeRemaining(timeRemaining);
  }, [timeRemaining]);

  // Format time remaining as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-lg">
            <Coffee className="h-5 w-5 text-blue-500" />
            Time for a break?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-3">
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatTime(localTimeRemaining)}
              </div>
              <p className="text-sm text-muted-foreground">
                You'll be automatically logged out for security
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg text-sm">
              <p className="text-blue-700 dark:text-blue-300">
                We automatically log you out after being inactive to keep your account secure.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel 
            onClick={onLogoutNow}
            className="w-full sm:w-auto"
            variant="outline"
          >
            Log Out
          </AlertDialogCancel>
          
          <AlertDialogAction 
            onClick={onExtendSession}
            className="w-full sm:w-auto"
          >
            Continue Session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}; 