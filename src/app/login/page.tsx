"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Shield, AlertCircle, Loader2 } from "lucide-react";
import { signInWithGoogle } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect already-authenticated users
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  async function handleGoogleSignIn() {
    setError(null);
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
      router.replace("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Sign-in failed. Please try again.";
      setError(message);
    } finally {
      setIsSigningIn(false);
    }
  }

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-60 -right-60 h-[500px] w-[500px] rounded-full bg-teal-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-slate-700/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg mb-5 overflow-hidden">
              <Image src="/edlight-logo-white.png" alt="EdLight logo" width={56} height={56} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 text-center">
              EdLight Security Training
            </h1>
            <p className="text-sm text-slate-500 mt-1.5 text-center">
              Internal employee training portal
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 mb-7" />

          {/* Message */}
          <div className="mb-6 text-center">
            <p className="text-[15px] font-medium text-slate-800">
              Sign in with your EdLight account
            </p>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
              Use your company Google account to access the training platform.
            </p>
          </div>

          {/* Error state */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 bg-red-50 rounded-xl border border-red-100 p-3.5">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-600 leading-relaxed">{error}</p>
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-[15px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSigningIn ? (
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            ) : (
              <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            {isSigningIn ? "Signing in…" : "Continue with Google"}
          </button>

          {/* Domain notice */}
          <div className="mt-5 flex items-start gap-2.5 bg-slate-50 rounded-xl border border-slate-100 p-3.5">
            <AlertCircle className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed">
              Access is restricted to{" "}
              <strong className="text-slate-600">@edlight.org</strong> accounts.
              Personal Google accounts will not be granted access.
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            &larr; Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
