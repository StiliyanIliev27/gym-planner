"use client"
import { RegisterForm } from "@/components/auth/register-form"
import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated";
import { useAuthStore } from "@/stores/useAuthStore";

export default function RegisterPage() {
  useRedirectIfAuthenticated();
  const { user, isLoading } = useAuthStore();
  
  if(user || isLoading){
    return null; //or spinner etc... 
  }

  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <RegisterForm />
      </div>
    </div>
  );
}