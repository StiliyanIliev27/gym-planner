"use client"

import { useAuthGuard } from "@/hooks/auth/useAuthGuard";

export default function Home() {
  const ready = useAuthGuard();

  if (!ready) return;

  return (
    <>
      <h1>hello from home</h1>
    </>
  );
}
