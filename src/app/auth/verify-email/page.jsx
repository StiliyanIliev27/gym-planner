"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { verifyConfirmationCodeAsync } from "@/app/api/auth/index"; 
import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated";
import { useAuthStore } from "@/stores/useAuthStore";

export default function VerifyEmailPage() {
  useRedirectIfAuthenticated();

  const { user, isLoading } = useAuthStore();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  if(user || isLoading){
    return null; //or spinner etc... 
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error, success } = await verifyConfirmationCodeAsync(code);

    if (success) {
      toast.success("Email verified! You can now log in.");
      router.push("/auth/login");
    } else {
      toast.error(error || "Invalid or expired code.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
      <form onSubmit={handleVerify} className="flex flex-col gap-4 w-full max-w-sm">
        <input
          type="text"
          placeholder="Enter 6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border p-2 rounded text-center"
          required
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}
