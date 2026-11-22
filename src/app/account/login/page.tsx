"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Lock, Mail, Phone, ShieldCheck, ArrowRight } from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";

export default function CustomerLoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isRegister
        ? "/api/auth/customer/register"
        : "/api/auth/customer/login";

      const payload = isRegister
        ? { name, email, password, phone, address, city }
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

      window.location.href = "/account";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-shyvon-dark py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md bg-shyvon-card border border-shyvon-gold/30 rounded p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-shyvon-gold/10 rounded-bl-full pointer-events-none blur-xl" />

        <div className="text-center space-y-1">
          <Link href="/" className="inline-block mb-1">
            <span className="font-cinzel text-2xl font-extrabold tracking-[0.2em] text-gold-gradient">
              SHYVON
            </span>
          </Link>
          <h2 className="font-cinzel text-xl font-bold text-white">
            {isRegister ? "Create Customer Account" : "Customer Sign In"}
          </h2>
          <p className="text-xs text-shyvon-muted">
            {isRegister
              ? "Register to track your orders and save delivery addresses."
              : "Sign in to access your order history and invoices."}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-500/50 rounded text-red-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div>
              <label className="block text-shyvon-muted mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kasun Jayawardena"
                className="w-full bg-shyvon-surface border border-shyvon-gold/30 rounded p-2.5 text-white focus:outline-none focus:border-shyvon-gold"
              />
            </div>
          )}

          <div>
            <label className="block text-shyvon-muted mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. kasun@gmail.com"
              className="w-full bg-shyvon-surface border border-shyvon-gold/30 rounded p-2.5 text-white focus:outline-none focus:border-shyvon-gold"
            />
          </div>

          <div>
            <label className="block text-shyvon-muted mb-1">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-shyvon-surface border border-shyvon-gold/30 rounded p-2.5 text-white focus:outline-none focus:border-shyvon-gold"
            />
          </div>

          {isRegister && (
            <>
              <div>
                <label className="block text-shyvon-muted mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 077 123 4567"
                  className="w-full bg-shyvon-surface border border-shyvon-gold/30 rounded p-2.5 text-white focus:outline-none focus:border-shyvon-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-shyvon-muted mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Colombo"
                    className="w-full bg-shyvon-surface border border-shyvon-gold/30 rounded p-2.5 text-white focus:outline-none focus:border-shyvon-gold"
                  />
                </div>
                <div>
                  <label className="block text-shyvon-muted mb-1">Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street / Area"
                    className="w-full bg-shyvon-surface border border-shyvon-gold/30 rounded p-2.5 text-white focus:outline-none focus:border-shyvon-gold"
                  />
                </div>
              </div>
            </>
          )}

          <GoldButton type="submit" size="md" loading={loading} className="w-full">
            {isRegister ? "Create Account" : "Sign In"}
          </GoldButton>
        </form>

        <div className="text-center pt-2 border-t border-white/5">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-xs text-shyvon-goldLight hover:underline font-cinzel"
          >
            {isRegister
              ? "Already have an account? Sign in here"
              : "Don't have an account yet? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
}
