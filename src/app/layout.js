import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/common/theme/theme-provider";
import Navbar from "@/components/common/navigation/navbar";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "../providers/AuthProvider";
import { supabaseServer } from "../lib/supabase/server"; // Use server client
import EnvironmentInitializer from "@/components/common/EnvironmentInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Fitness Planner Dashboard",
  description: "Your personal fitness planning companion",
};

export default async function RootLayout({
  children,
}) {
  // Get session server-side with error handling
  let session = null;
  try {
    const {
      data: { session: fetchedSession },
    } = await supabaseServer.auth.getSession();
    session = fetchedSession;
  } catch (error) {
    console.error("Error fetching session:", error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <EnvironmentInitializer />
        <AuthProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <Navbar />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
