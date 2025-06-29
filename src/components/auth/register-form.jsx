"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpAsync } from "@/app/api/auth"; // must include code + save logic here

export function RegisterForm({ className, ...props }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  function checkInputs({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  }) {
    if (!firstName?.trim()) return toast.error("First name is required!");
    if (!lastName?.trim()) return toast.error("Last name is required!");
    if (!email?.trim()) return toast.error("Email is required!");
    if (!password || !confirmPassword)
      return toast.error("Password is required!");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match!");
    return true;
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setIsLoading(true);

    const form = e.target;
    const firstName = form["first-name"]?.value;
    const lastName = form["last-name"]?.value;
    const email = form["email"]?.value;
    const password = form["password"]?.value;
    const confirmPassword = form["confirm-password"]?.value;

    const isValid = checkInputs({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });

    if (!isValid) {
      setIsLoading(false);
      return;
    }

    const { error, user } = await signUpAsync({
      email,
      password,
      firstName,
      lastName,
    });

    if (error) {
      console.error("Sign-up error:", error);
      toast.error("Unable to sign up. Please try again.");
      setIsLoading(false);
      return;
    }

    if (user) {
      form.reset();
      toast.success("Confirmation code sent to your email.");
      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
    }

    setIsLoading(false);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSignUp} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create Your Account</h1>
                <p className="text-muted-foreground text-balance">
                  Train Smart. Live Strong.
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  type="text"
                  placeholder="John"
                  required
                />
                <Label htmlFor="last-name">Last Name</Label>
                <Input id="last-name" type="text" placeholder="Doe" required />
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing up..." : "Sign up"}
              </Button>
              <p className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/login-page-image.webp"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
