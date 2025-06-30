"use client"
import { LoginForm } from "@/components/features/auth/forms/login-form"
import { useRedirectIfAuthenticated } from "@/hooks/auth/useRedirectIfAuthenticated";
import { useAuthStore } from "@/stores/auth/useAuthStore";

export default function LoginPage() {
  useRedirectIfAuthenticated();
  const { user, isLoading } = useAuthStore();

  if(user || isLoading){
    return null; //or spinner etc... 
  }

  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
