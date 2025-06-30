
import { signOutAsync } from "@/lib/supabase/auth"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth/useAuthStore";

export default function SignOutButton() {
  const setUser = useAuthStore.getState().setUser;
  const router = useRouter();
  
  async function handleSignOut(){
    const { error } = await signOutAsync();

    if (error) {
      toast.error("Error signing out. Please try again.");
      console.error(error);
      return;
    }

    setUser(null);
    toast.success("Signed out successfully!");
    router.push("/auth/login");
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Sign Out</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
          <AlertDialogDescription>
            You will need to log in again to access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSignOut}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
