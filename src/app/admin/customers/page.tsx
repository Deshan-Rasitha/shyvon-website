import React from "react";
import { prisma } from "@/lib/prisma";
import { Users, Phone, Mail, MapPin, ShoppingBag } from "lucide-react";

export const revalidate = 0;

export default async function AdminCustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      orders: {
        select: { id: true, finalTotal: true, createdAt: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-shyvon-gold/20 pb-4">
        <span className="text-xs uppercase font-cinzel text-shyvon-gold tracking-widest">
          CRM & Accounts
        </span>
        <h1 className="font-cinzel text-2xl font-extrabold text-white">
          Customer <span className="text-gold-gradient">Directory</span>
        </h1>
        <p className="text-xs text-shyvon-muted mt-0.5">
          Registered customer accounts, contact details, and lifetime order histories.
        </p>
      </div>

      <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded overflow-hidden shadow-xl">
        {customers.length === 0 ? (
          <div className="p-12 text-center text-xs text-shyvon-muted space-y-2">
            <Users className="w-8 h-8 text-shyvon-gold mx-auto" />
            <p>No customer accounts created yet. Guests can register during checkout or login.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-shyvon-gold/30 bg-black/40 text-shyvon-goldLight font-cinzel font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 text-left">Customer Name</th>
                  <th className="py-3 px-2 text-left">Email</th>
                  <th className="py-3 px-2 text-left">Phone / WhatsApp</th>
                  <th className="py-3 px-2 text-left">Location</th>
                  <th className="py-3 px-2 text-center">Orders</th>
                  <th className="py-3 px-4 text-right">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">{c.name}</td>
                    <td className="py-3.5 px-2 text-shyvon-muted">{c.email}</td>
                    <td className="py-3.5 px-2 font-mono text-gray-300">
                      {c.phone || c.whatsapp || "—"}
                    </td>
                    <td className="py-3.5 px-2 text-gray-300">{c.city || c.address || "—"}</td>
                    <td className="py-3.5 px-2 text-center">
                      <span className="px-2 py-0.5 rounded bg-shyvon-surface border border-shyvon-gold/20 font-mono font-bold text-shyvon-goldLight">
                        {c.orders.length}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-shyvon-muted">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
