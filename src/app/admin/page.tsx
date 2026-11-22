import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/order";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  Package,
  Users,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileText,
} from "lucide-react";

export const revalidate = 0;

export default async function AdminOverviewPage() {
  // Real database metrics
  const [
    totalOrders,
    pendingOrders,
    completedOrders,
    totalProducts,
    totalCustomers,
    allOrders,
    products,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { orderStatus: "PENDING" } }),
    prisma.order.count({ where: { orderStatus: "DELIVERED" } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.customer.count(),
    prisma.order.findMany({ select: { finalTotal: true, createdAt: true } }),
    prisma.product.findMany({ select: { id: true, name: true, stock: true } }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
  ]);

  const totalRevenue = allOrders.reduce((sum, o) => sum + o.finalTotal, 0);
  const lowStockProducts = products.filter((p) => p.stock <= 10);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-shyvon-gold/20 pb-6">
        <div>
          <span className="text-xs uppercase font-cinzel text-shyvon-gold tracking-widest">
            Executive Summary
          </span>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white">
            Dashboard <span className="text-gold-gradient">Overview</span>
          </h1>
          <p className="text-xs text-shyvon-muted mt-0.5">
            Live database statistics, inventory health, and recent customer activity.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-gold-gradient text-shyvon-dark font-cinzel font-bold text-xs uppercase tracking-wider rounded shadow hover:brightness-110 transition-all"
          >
            + Add Product
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2 bg-shyvon-card border border-shyvon-gold/30 text-shyvon-goldLight font-cinzel font-semibold text-xs uppercase tracking-wider rounded hover:bg-white/5 transition-all"
          >
            View Orders
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded p-5 space-y-2 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-shyvon-gold">
            <span className="text-[11px] font-cinzel uppercase tracking-wider text-shyvon-muted">
              Total Revenue
            </span>
            <DollarSign className="w-5 h-5 text-shyvon-gold" />
          </div>
          <p className="font-cinzel text-2xl font-bold text-gold-gradient">
            {formatPrice(totalRevenue)}
          </p>
          <p className="text-[10px] text-green-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Verified database transactions</span>
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded p-5 space-y-2 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-shyvon-gold">
            <span className="text-[11px] font-cinzel uppercase tracking-wider text-shyvon-muted">
              Total Orders
            </span>
            <ShoppingBag className="w-5 h-5 text-shyvon-gold" />
          </div>
          <p className="font-mono text-2xl font-bold text-white">{totalOrders}</p>
          <p className="text-[10px] text-shyvon-muted">Lifetime orders received</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded p-5 space-y-2 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-yellow-400">
            <span className="text-[11px] font-cinzel uppercase tracking-wider text-shyvon-muted">
              Pending Orders
            </span>
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="font-mono text-2xl font-bold text-yellow-300">{pendingOrders}</p>
          <p className="text-[10px] text-shyvon-muted">Require dispatch / confirmation</p>
        </div>

        {/* Completed Orders */}
        <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded p-5 space-y-2 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-green-400">
            <span className="text-[11px] font-cinzel uppercase tracking-wider text-shyvon-muted">
              Delivered Orders
            </span>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <p className="font-mono text-2xl font-bold text-green-400">{completedOrders}</p>
          <p className="text-[10px] text-shyvon-muted">Successfully fulfilled</p>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#0A101D] border border-shyvon-gold/20 rounded p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-shyvon-gold/15 text-shyvon-gold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-shyvon-muted">Active Products</p>
              <p className="font-mono text-lg font-bold text-white">{totalProducts}</p>
            </div>
          </div>
          <Link href="/admin/products" className="text-xs text-shyvon-goldLight hover:underline">
            Manage →
          </Link>
        </div>

        <div className="bg-[#0A101D] border border-shyvon-gold/20 rounded p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-blue-500/15 text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-shyvon-muted">Registered Customers</p>
              <p className="font-mono text-lg font-bold text-white">{totalCustomers}</p>
            </div>
          </div>
          <Link href="/admin/customers" className="text-xs text-blue-400 hover:underline">
            View →
          </Link>
        </div>

        <div className="bg-[#0A101D] border border-shyvon-gold/20 rounded p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-red-500/15 text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-shyvon-muted">Low Stock Alerts</p>
              <p className="font-mono text-lg font-bold text-red-300">
                {lowStockProducts.length}
              </p>
            </div>
          </div>
          <Link href="/admin/inventory" className="text-xs text-red-400 hover:underline">
            Restock →
          </Link>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="font-cinzel text-base font-bold text-shyvon-goldLight">
            Recent Customer Orders
          </h3>
          <Link
            href="/admin/orders"
            className="text-xs text-shyvon-gold hover:text-white flex items-center gap-1"
          >
            <span>All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-8 text-center text-xs text-shyvon-muted">
            No customer orders placed yet. Place a test order from the customer website to view live
            real-time tracking!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-shyvon-muted font-cinzel uppercase tracking-wider">
                  <th className="pb-3 text-left">Order #</th>
                  <th className="pb-3 text-left">Customer</th>
                  <th className="pb-3 text-left">Date</th>
                  <th className="pb-3 text-left">Method</th>
                  <th className="pb-3 text-left">Status</th>
                  <th className="pb-3 text-right">Total</th>
                  <th className="pb-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 font-mono font-bold text-shyvon-goldLight">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 text-white">
                      {ord.customerName}
                      <span className="block text-[11px] text-shyvon-muted font-mono">
                        {ord.customerPhone}
                      </span>
                    </td>
                    <td className="py-3 text-shyvon-muted">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-gray-300">
                      {ord.paymentMethod === "COD" ? "Cash on Delivery" : "Bank Transfer"}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          ord.orderStatus === "DELIVERED"
                            ? "bg-green-500/20 text-green-300"
                            : ord.orderStatus === "PENDING"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-blue-500/20 text-blue-300"
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-white">
                      {formatPrice(ord.finalTotal)}
                    </td>
                    <td className="py-3 text-center">
                      <Link
                        href={`/order-confirmation/${ord.orderNumber}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-[11px] text-shyvon-gold hover:underline"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Invoice</span>
                      </Link>
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
