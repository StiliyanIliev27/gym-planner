"use client";
import { AuthenticatedLayout } from "@/components/common/layout/authenticated-layout";
import { useAuthGuard } from "@/hooks/auth/useAuthGuard";

export default function AuthenticatedRootLayout({ children }) {
  const ready = useAuthGuard();
  
  if (!ready) return null;
  
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}