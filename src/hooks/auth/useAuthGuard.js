"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth/useAuthStore";

export function useAuthGuard() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const router = useRouter();
  const [readyToRender, setReadyToRender] = useState(false);

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading) {
      return;
    }

    if (!user) {
      router.replace("/auth/login");
    } else {
      setReadyToRender(true);
    }
  }, [user, isLoading, router]);

  // Don't render anything while loading or if no user
  if (isLoading || !user) {
    return false;
  }

  return readyToRender;
}