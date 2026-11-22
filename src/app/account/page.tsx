"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, Package, MapPin, LogOut, Download, FileText, CheckCircle2 } from "lucide-react";
import { formatPrice } from "@/lib/order";
import GoldButton from "@/components/ui/GoldButton";

export default function CustomerAccountPage() {
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");

  useEffect(() => {
    fetch("/api/auth/customer/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.customer) {
          setCustomer(data.customer);
        } else {
          window.location.href = "/account/login";
        }
      })
      .catch(() => {
        window.location.href = "/account/login";
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/customer/logout", { method: "POST" });
    window.location.href = "/account/login";
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-shyvon-dark">
        <div className="w-8 h-8 border-2 border-shyvon-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div className="min-h-screen bg-shyvon-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-shyvon-gold/20 gap-4">
          <div>
            <span className="text-xs font-cinzel text-shyvon-gold uppercase tracking-wider">
              Customer Portal
            </span>
            <h1 className="font-cinzel text-3xl font-extrabold text-white">
              Welcome, <span className="text-gold-gradient">{customer.name}</span>
            </h1>
            <p className="text-xs text-shyvon-muted mt-0.5">{customer.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-shyvon-card border border-white/10 hover:border-red-500/40 text-xs font-semibold text-gray-300 hover:text-red-400 transition-colors w-fit"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-shyvon-gold/20">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 font-cinzel text-xs uppercase tracking-wider font-bold transition-all relative ${
              activeTab === "orders" ? "text-shyvon-goldLight" : "text-gray-400 hover:text-white"
            }`}
          >
            My Orders ({customer.orders?.length || 0})
            {activeTab === "orders" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-gradient" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 font-cinzel text-xs uppercase tracking-wider font-bold transition-all relative ${
              activeTab === "profile" ? "text-shyvon-goldLight" : "text-gray-400 hover:text-white"
            }`}
          >
            Profile & Address
            {activeTab === "profile" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-gradient" />
            )}
          </button>
        </div>

        {/* Orders Tab Content */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {customer.orders && customer.orders.length > 0 ? (
              customer.orders.map((order: any) => (
                <div
                  key={order.id}
                  className="bg-shyvon-card border border-shyvon-gold/20 rounded p-6 space-y-4 shadow-lg hover:border-shyvon-gold/40 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/5 gap-2">
                    <div>
                      <span className="text-[11px] text-shyvon-muted uppercase tracking-wider block">
                        Order Number
                      </span>
                      <h3 className="font-cinzel text-sm font-bold text-white">
                        {order.orderNumber}
                      </h3>
                      <p className="text-[11px] text-gray-400">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] text-shyvon-muted uppercase tracking-wider block">
                          Status
                        </span>
                        <span className="text-xs font-mono font-bold text-shyvon-goldLight uppercase">
                          {order.orderStatus}
                        </span>
                      </div>
                      <Link
                        href={`/order-confirmation/${order.orderNumber}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-shyvon-surface border border-shyvon-gold/30 text-xs font-cinzel font-semibold text-shyvon-goldLight hover:bg-shyvon-gold/20 transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Invoice</span>
                      </Link>
                    </div>
                  </div>

                  {/* Order items preview */}
                  <div className="space-y-1 text-xs">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-gray-300">
                        <span>
                          {item.productName} ({item.productWeight}) × {item.quantity}
                        </span>
                        <span className="font-mono">{formatPrice(item.itemTotal)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/5 flex justify-between items-center text-xs">
                    <span className="text-shyvon-muted">
                      Payment: {order.paymentMethod === "COD" ? "Cash on Delivery" : "Bank Transfer"}
                    </span>
                    <span className="font-cinzel font-bold text-sm text-gold-gradient">
                      Total: {formatPrice(order.finalTotal)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-panel p-12 text-center rounded space-y-3">
                <Package className="w-10 h-10 text-shyvon-gold mx-auto" />
                <h3 className="font-cinzel text-base font-bold text-white">No Orders Found</h3>
                <p className="text-xs text-shyvon-muted max-w-sm mx-auto">
                  You have not placed any orders yet. Explore our handcrafted herbal selections!
                </p>
                <GoldButton href="/shop" size="sm">
                  Start Shopping
                </GoldButton>
              </div>
            )}
          </div>
        )}

        {/* Profile Tab Content */}
        {activeTab === "profile" && (
          <div className="bg-shyvon-card border border-shyvon-gold/20 rounded p-8 space-y-4 max-w-xl shadow-xl text-xs">
            <h3 className="font-cinzel text-base font-bold text-shyvon-goldLight border-b border-shyvon-gold/20 pb-3">
              Account Information
            </h3>
            <div className="space-y-2 text-gray-300">
              <p>
                <strong className="text-white">Name: </strong> {customer.name}
              </p>
              <p>
                <strong className="text-white">Email: </strong> {customer.email}
              </p>
              <p>
                <strong className="text-white">Phone: </strong> {customer.phone || "Not set"}
              </p>
              <p>
                <strong className="text-white">WhatsApp: </strong> {customer.whatsapp || "Not set"}
              </p>
              <p>
                <strong className="text-white">Saved Delivery Address: </strong>{" "}
                {customer.address ? `${customer.address}, ${customer.city}` : "Not set"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
