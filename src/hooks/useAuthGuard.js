"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

export function useAuthGuard() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [readyToRender, setReadyToRender] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
    } else {
      setReadyToRender(true);
    }
  }, [user, router]);

  return readyToRender;
}
