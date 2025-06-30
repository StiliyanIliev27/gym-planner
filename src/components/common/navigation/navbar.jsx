"use client";
import Link from "next/link";
import { ModeToggle } from "@/components/common/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import SignOutButton from "@/components/features/auth/components/sign-out-button";

export default function Navbar() {
  const { user } = useAuthStore();

  return (
    <div className={`sticky top-0 justify-between items-center p-3 ${user ? 'hidden' : 'flex'}`}>
      <div className="left-side">
        <Link href="/" className="text-3xl">
          Gym Planner
        </Link>
      </div>
      <div className="right-side flex gap-2 none">
        {!user ? (
          <Button>
            <Link href="/auth/login">Get started</Link>
          </Button>
        ) : (
          <>
            <Button variant="outline" size="sm">
              <Link href="/test-db">Test DB</Link>
            </Button>
            <SignOutButton />
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
}
