"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  FileText,
  Printer,
  Download,
  MessageCircle,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  X,
  AlertCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/order";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";
import GoldButton from "@/components/ui/GoldButton";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Status Update modal state
  const [newStatus, setNewStatus] = useState("PENDING");
  const [statusNotes, setStatusNotes] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    let url = "/api/orders";
    const params = new URLSearchParams();
    if (statusFilter !== "ALL") params.append("status", statusFilter);
    if (search) params.append("search", search);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const openStatusModal = (ord: any) => {
    setSelectedOrder(ord);
    setNewStatus(ord.orderStatus);
    setStatusNotes("");
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus: newStatus,
          notes: statusNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update order status");
      }
      setSelectedOrder(null);
      fetchOrders();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-shyvon-gold/20 pb-4">
        <div>
          <span className="text-xs uppercase font-cinzel text-shyvon-gold tracking-widest">
            Fulfillment & Operations
          </span>
          <h1 className="font-cinzel text-2xl font-extrabold text-white">
            Order <span className="text-gold-gradient">Management</span>
          </h1>
          <p className="text-xs text-shyvon-muted mt-0.5">
            Process orders, generate invoices, track status histories, and contact clients.
          </p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search order #, customer name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded py-2 pl-3.5 pr-10 text-white placeholder-shyvon-muted/50 focus:outline-none focus:border-shyvon-gold"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-shyvon-gold">
            <Search className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-shyvon-muted">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#080D19] border border-shyvon-gold/30 rounded p-2 text-white font-sans focus:outline-none focus:border-shyvon-gold"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-xs text-shyvon-gold">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-xs text-shyvon-muted">
            No orders found matching the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-shyvon-gold/30 bg-black/40 text-shyvon-goldLight font-cinzel font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 text-left">Order #</th>
                  <th className="py-3 px-2 text-left">Customer</th>
                  <th className="py-3 px-2 text-left">City</th>
                  <th className="py-3 px-2 text-left">Date</th>
                  <th className="py-3 px-2 text-left">Method</th>
                  <th className="py-3 px-2 text-right">Total</th>
                  <th className="py-3 px-2 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => {
                  const customerWhatsAppUrl = `https://wa.me/${(order.customerWhatsapp || order.customerPhone).replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(order.customerName)}%2C%20regarding%20your%20SHYVON%20Order%20${order.orderNumber}`;
                  return (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-shyvon-goldLight">
                        {order.orderNumber}
                      </td>
                      <td className="py-3.5 px-2">
                        <span className="font-semibold text-white block">{order.customerName}</span>
                        <span className="text-[11px] text-shyvon-muted font-mono block">
                          {order.customerPhone}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-gray-300">{order.city}</td>
                      <td className="py-3.5 px-2 text-shyvon-muted">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-2">
                        <span className="text-gray-300 font-sans">
                          {order.paymentMethod === "COD" ? "Cash on Delivery" : "Bank Transfer"}
                        </span>
                        {order.paymentProofUrl && (
                          <a
                            href={order.paymentProofUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-[10px] text-shyvon-gold hover:underline"
                          >
                            [View Slip]
                          </a>
                        )}
                      </td>
                      <td className="py-3.5 px-2 text-right font-mono font-bold text-white">
                        {formatPrice(order.finalTotal)}
                      </td>
                      <td className="py-3.5 px-2 text-center">
                        <button
                          onClick={() => openStatusModal(order)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition-transform hover:scale-105 cursor-pointer ${
                            order.orderStatus === "DELIVERED"
                              ? "bg-green-500/20 text-green-300 border border-green-500/40"
                              : order.orderStatus === "PENDING"
                              ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
                              : order.orderStatus === "CANCELLED"
                              ? "bg-red-500/20 text-red-300 border border-red-500/40"
                              : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                          }`}
                          title="Click to update status"
                        >
                          {order.orderStatus}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/order-confirmation/${order.orderNumber}`}
                            target="_blank"
                            className="p-1 text-shyvon-goldLight hover:text-white"
                            title="View / Print Invoice"
                          >
                            <FileText className="w-4 h-4" />
                          </Link>
                          <a
                            href={customerWhatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-[#25D366] hover:text-green-300"
                            title="Chat with Customer on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0A101D] border border-shyvon-gold/40 rounded p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] text-shyvon-muted uppercase">Update Status</span>
                <h3 className="font-cinzel text-sm font-bold text-shyvon-goldLight">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="block text-shyvon-muted mb-1 font-medium">Order Status *</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2 text-white font-sans focus:outline-none focus:border-shyvon-gold"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block text-shyvon-muted mb-1 font-medium">Status Update Note</label>
                <textarea
                  rows={2}
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="e.g. Package dispatched via Domex tracking #123456"
                  className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2 text-white focus:outline-none focus:border-shyvon-gold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded bg-shyvon-surface text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <GoldButton type="submit" size="sm" loading={updatingStatus}>
                  Save Status
                </GoldButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
