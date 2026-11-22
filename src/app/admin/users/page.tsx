"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Plus, UserPlus, Mail, AlertCircle } from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = () => {
    setLoading(true);
    fetch("/api/auth/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.users);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to add admin");
      }
      setEmail("");
      setName("");
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-shyvon-gold/20 pb-4">
        <span className="text-xs uppercase font-cinzel text-shyvon-gold tracking-widest">
          Access Control
        </span>
        <h1 className="font-cinzel text-2xl font-extrabold text-white">
          Authorized <span className="text-gold-gradient">Administrators</span>
        </h1>
        <p className="text-xs text-shyvon-muted mt-0.5">
          Manage authorized Gmail and administrative accounts permitted to access this console.
        </p>
      </div>

      {/* Add Admin Form */}
      <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded p-6 space-y-4 shadow-xl text-xs">
        <h3 className="font-cinzel text-sm font-bold text-shyvon-goldLight uppercase tracking-wider border-b border-white/10 pb-2">
          Grant Administrator Access
        </h3>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-500 rounded text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-shyvon-muted mb-1 font-medium">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Deshan"
              className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2 text-white focus:outline-none focus:border-shyvon-gold"
            />
          </div>

          <div>
            <label className="block text-shyvon-muted mb-1 font-medium">Google / Gmail Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. owner@gmail.com"
              className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2 text-white focus:outline-none focus:border-shyvon-gold"
            />
          </div>

          <div className="flex items-end">
            <GoldButton type="submit" size="sm" loading={submitting} className="w-full">
              Authorize Account
            </GoldButton>
          </div>
        </form>
      </div>

      {/* Admin Users Table */}
      <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 bg-black/40">
          <h3 className="font-cinzel text-sm font-bold text-shyvon-goldLight uppercase tracking-wider">
            Active System Administrators
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-shyvon-muted font-cinzel uppercase tracking-wider">
                <th className="py-3 px-4 text-left">Admin Name</th>
                <th className="py-3 px-2 text-left">Email Address</th>
                <th className="py-3 px-2 text-left">Role</th>
                <th className="py-3 px-2 text-left">Last Login</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">{u.name}</td>
                  <td className="py-3.5 px-2 text-shyvon-goldLight font-mono">{u.email}</td>
                  <td className="py-3.5 px-2">
                    <span className="px-2 py-0.5 rounded bg-shyvon-surface border border-shyvon-gold/20 font-mono text-[10px] text-shyvon-gold">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-shyvon-muted">
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never logged in"}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-300 font-bold uppercase text-[10px]">
                      Authorized
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
