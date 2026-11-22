"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, Sparkles, User, Lock, Mail, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import GoldButton from "../ui/GoldButton";

export default function CustomerWelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if customer already has a session
    fetch("/api/auth/customer/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.customer) {
          setIsLoggedIn(true);
        } else {
          // Check if previously dismissed in this session
          const dismissed = sessionStorage.getItem("shyvon_auth_dismissed");
          if (!dismissed) {
            const timer = setTimeout(() => {
              setIsOpen(true);
            }, 1800);
            return () => clearTimeout(timer);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("shyvon_auth_dismissed", "true");
    setIsOpen(false);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isRegister
        ? "/api/auth/customer/register"
        : "/api/auth/customer/login";

      const payload = isRegister
        ? { name: name || email.split("@")[0], email, password, phone }
        : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed");
      }

      setSuccess(true);
      setIsLoggedIn(true);
      setTimeout(() => {
        setIsOpen(false);
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || isLoggedIn) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0A101D] border border-shyvon-gold/40 rounded-lg p-6 sm:p-8 space-y-5 shadow-2xl overflow-hidden">
        {/* Glow Corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-shyvon-gold/10 rounded-bl-full pointer-events-none blur-xl" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-shyvon-muted hover:text-white p-1 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-shyvon-surface border border-shyvon-gold/30 text-shyvon-goldLight text-[10px] uppercase tracking-widest font-cinzel">
            <Sparkles className="w-3 h-3 text-shyvon-gold animate-pulse" />
            <span>Member Exclusive Access</span>
          </div>

          <h2 className="font-cinzel text-2xl font-extrabold text-white">
            Welcome to <span className="text-gold-gradient">SHYVON</span>
          </h2>

          <p className="text-xs text-shyvon-muted leading-relaxed max-w-xs mx-auto">
            Sign in with your Gmail to place orders, track shipments, and receive priority herbal
            consultations.
          </p>
        </div>

        {error && (
          <div className="p-2.5 bg-red-950/70 border border-red-500/50 rounded text-red-200 text-xs text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="p-2.5 bg-green-950/70 border border-green-500/50 rounded text-green-300 text-xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span>Welcome! Signing you in...</span>
          </div>
        )}

        {/* Tab switch */}
        <div className="flex border-b border-shyvon-gold/20 text-xs font-cinzel">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError("");
            }}
            className={`flex-1 pb-2 font-bold uppercase tracking-wider transition-colors relative ${
              !isRegister ? "text-shyvon-goldLight" : "text-gray-400 hover:text-white"
            }`}
          >
            Sign In
            {!isRegister && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-gradient" />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError("");
            }}
            className={`flex-1 pb-2 font-bold uppercase tracking-wider transition-colors relative ${
              isRegister ? "text-shyvon-goldLight" : "text-gray-400 hover:text-white"
            }`}
          >
            Create Account
            {isRegister && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-gradient" />
            )}
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-3.5 text-xs">
          {isRegister && (
            <div>
              <label className="block text-shyvon-muted mb-1 font-medium">Your Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kasun Fernando"
                  className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded py-2 pl-8 pr-3 text-white focus:outline-none focus:border-shyvon-gold"
                />
                <User className="w-3.5 h-3.5 text-shyvon-gold/60 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-shyvon-muted mb-1 font-medium">Gmail / Email Address *</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. yourname@gmail.com"
                className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded py-2 pl-8 pr-3 text-white focus:outline-none focus:border-shyvon-gold"
              />
              <Mail className="w-3.5 h-3.5 text-shyvon-gold/60 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-shyvon-muted mb-1 font-medium">Password *</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded py-2 pl-8 pr-3 text-white focus:outline-none focus:border-shyvon-gold"
              />
              <Lock className="w-3.5 h-3.5 text-shyvon-gold/60 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-shyvon-muted mb-1 font-medium">Phone Number (Optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 077 123 4567"
                className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded py-2 px-3 text-white focus:outline-none focus:border-shyvon-gold"
              />
            </div>
          )}

          <GoldButton type="submit" size="md" loading={loading} className="w-full">
            {isRegister ? "Register & Enter Store" : "Sign In & Continue"}
          </GoldButton>
        </form>

        <div className="text-center pt-1 border-t border-white/5 flex items-center justify-between text-[11px]">
          <button
            type="button"
            onClick={handleClose}
            className="text-shyvon-muted hover:text-white transition-colors"
          >
            Browse Store First →
          </button>
          <span className="text-shyvon-goldLight/80">Pure • Healthy • Delicious</span>
        </div>
      </div>
    </div>
  );
}
