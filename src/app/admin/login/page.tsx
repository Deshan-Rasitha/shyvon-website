"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, Key, Sparkles, AlertCircle, Info } from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("deshanrasithachandrasena@gmail.com");
  const [password, setPassword] = useState("deshan1234");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDevLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed");
      }

      window.location.href = "/admin";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignInPlaceholder = () => {
    setError(
      "Google OAuth Production Notice: To use live Google Sign-In, configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env. For local development, use the secure passkey login below!"
    );
  };

  return (
    <div className="min-h-screen bg-[#070B14] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0A101D] border border-shyvon-gold/30 rounded p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="text-center space-y-1.5">
          <Link href="/" className="inline-block mb-1">
            <span className="font-cinzel text-2xl font-extrabold tracking-[0.2em] text-gold-gradient">
              SHYVON
            </span>
          </Link>
          <div className="flex items-center justify-center gap-1.5 text-xs font-cinzel text-shyvon-gold">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrator Access Portal</span>
          </div>
          <p className="text-xs text-shyvon-muted">
            Authorized management console for Shylie Global Pvt Ltd.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-500/50 rounded flex items-start gap-2 text-red-200 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Sign-In Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignInPlaceholder}
            className="w-full py-2.5 px-4 rounded bg-white hover:bg-gray-100 text-gray-800 text-xs font-semibold flex items-center justify-center gap-3 transition-colors shadow"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <div className="flex items-center gap-3 my-2 text-shyvon-muted text-[11px]">
            <div className="h-[1px] flex-1 bg-white/10" />
            <span>or use Secure Passkey</span>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>
        </div>

        {/* Dev / Email Login Form */}
        <form onSubmit={handleDevLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-shyvon-muted mb-1 font-medium">Authorized Email *</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded py-2 pl-9 pr-3 text-white focus:outline-none focus:border-shyvon-gold"
              />
              <Mail className="w-4 h-4 text-shyvon-gold/60 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-shyvon-muted mb-1 font-medium">Passkey / Password *</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded py-2 pl-9 pr-3 text-white focus:outline-none focus:border-shyvon-gold"
              />
              <Key className="w-4 h-4 text-shyvon-gold/60 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <GoldButton type="submit" size="md" loading={loading} className="w-full">
            Authorize & Enter Console
          </GoldButton>
        </form>

        {/* Local Dev Helper Card */}
        <div className="p-3 bg-shyvon-surface/70 border border-shyvon-gold/20 rounded text-[11px] text-shyvon-muted space-y-1">
          <div className="flex items-center gap-1.5 text-shyvon-goldLight font-bold">
            <Info className="w-3.5 h-3.5 text-shyvon-gold" />
            <span>Local Development Credentials:</span>
          </div>
          <p>
            Default Email: <strong className="text-white">admin@shyvon.com</strong>
          </p>
          <p>
            Default Passkey: <strong className="text-white font-mono">shyvon2026</strong>
          </p>
          <p className="text-[10px] text-shyvon-muted/80 pt-1">
            (Authorized admin emails are configured in <code className="text-yellow-300">.env</code>{" "}
            via <code className="text-yellow-300">ADMIN_EMAILS</code>)
          </p>
        </div>
      </div>
    </div>
  );
}
