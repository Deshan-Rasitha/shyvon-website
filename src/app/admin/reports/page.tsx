import React from "react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/order";
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, CreditCard } from "lucide-react";

export const revalidate = 0;

export default async function AdminReportsPage() {
  const [orders, products] = await Promise.all([
    prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      select: { id: true, name: true, sku: true, price: true },
    }),
  ]);

  const totalRevenue = orders.reduce((acc, o) => acc + o.finalTotal, 0);
  const codCount = orders.filter((o) => o.paymentMethod === "COD").length;
  const bankCount = orders.filter((o) => o.paymentMethod === "BANK_TRANSFER").length;

  // Item sales tally
  const salesMap: Record<string, { name: string; qty: number; revenue: number }> = {};
  for (const ord of orders) {
    for (const item of ord.items) {
      if (!salesMap[item.productId]) {
        salesMap[item.productId] = { name: item.productName, qty: 0, revenue: 0 };
      }
      salesMap[item.productId].qty += item.quantity;
      salesMap[item.productId].revenue += item.itemTotal;
    }
  }

  const topItems = Object.values(salesMap).sort((a, b) => b.qty - a.qty);

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="border-b border-shyvon-gold/20 pb-4">
        <span className="text-xs uppercase font-cinzel text-shyvon-gold tracking-widest">
          Business Intelligence
        </span>
        <h1 className="font-cinzel text-2xl font-extrabold text-white">
          Reports & <span className="text-gold-gradient">Analytics</span>
        </h1>
        <p className="text-xs text-shyvon-muted mt-0.5">
          Real database revenue metrics, payment method distributions, and top selling products.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded p-5 space-y-2">
          <span className="text-xs text-shyvon-muted">Net Cumulative Revenue</span>
          <p className="font-cinzel text-2xl font-bold text-gold-gradient">
            {formatPrice(totalRevenue)}
          </p>
        </div>

        <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded p-5 space-y-2">
          <span className="text-xs text-shyvon-muted">Cash on Delivery Orders</span>
          <p className="font-mono text-2xl font-bold text-white">
            {codCount} ({orders.length > 0 ? Math.round((codCount / orders.length) * 100) : 0}%)
          </p>
        </div>

        <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded p-5 space-y-2">
          <span className="text-xs text-shyvon-muted">Bank Transfer Orders</span>
          <p className="font-mono text-2xl font-bold text-shyvon-goldLight">
            {bankCount} ({orders.length > 0 ? Math.round((bankCount / orders.length) * 100) : 0}%)
          </p>
        </div>
      </div>

      {/* Best Selling Products */}
      <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 bg-black/40">
          <h3 className="font-cinzel text-sm font-bold text-shyvon-goldLight uppercase tracking-wider">
            Top Performing Botanical Products
          </h3>
        </div>

        {topItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-shyvon-muted">
            Sales data will automatically accumulate as customers place orders.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-shyvon-muted font-cinzel uppercase tracking-wider">
                  <th className="py-3 px-4 text-left">Product</th>
                  <th className="py-3 px-2 text-center">Units Sold</th>
                  <th className="py-3 px-4 text-right">Cumulative Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {topItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/5">
                    <td className="py-3.5 px-4 font-semibold text-white">{item.name}</td>
                    <td className="py-3.5 px-2 text-center font-mono font-bold text-shyvon-goldLight">
                      {item.qty}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                      {formatPrice(item.revenue)}
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
