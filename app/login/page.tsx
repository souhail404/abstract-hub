"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { ArrowRight, Loader2, Twitter, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn("twitter", { callbackUrl: "/" });
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 abstract-grid">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-teal-600/6 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/30 mb-4">
            <Zap className="h-7 w-7 text-white" fill="white" />
          </div>
          <h1 className="text-2xl font-bold">Welcome to Abstract Events</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Sign in to submit events, set reminders, and manage your creator profile
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 space-y-4">
          <Button
            variant="outline"
            className="w-full h-12 gap-3 font-medium text-sm border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Twitter className="h-4 w-4" />
            )}
            Continue with X (Twitter)
            {!loading && <ArrowRight className="h-4 w-4 ml-auto opacity-40" />}
          </Button>

          <p className="text-xs text-center text-muted-foreground pt-2">
            By signing in you agree to our{" "}
            <Link href="#" className="text-primary hover:underline">Terms</Link>{" "}
            and{" "}
            <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </div>

        {/* Guest note */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            No account needed to browse events.{" "}
            <Link href="/events" className="text-primary hover:underline">
              Browse as guest →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
