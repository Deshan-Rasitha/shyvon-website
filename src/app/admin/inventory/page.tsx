"use client";

import React, { useState, useEffect } from "react";
import { Archive, AlertTriangle, Plus, Minus, History, X } from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Stock Adjustment Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [adjustQuantity, setAdjustQuantity] = useState("10");
  const [adjustReason, setAdjustReason] = useState("RESTOCK");
  const [adjustNotes, setAdjustNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchInventory = () => {
    setLoading(true);
    fetch("/api/inventory")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
          setTransactions(data.recentTransactions);
          setLowStockCount(data.lowStockCount);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const openAdjustModal = (product: any, mode: "RESTOCK" | "ADJUSTMENT") => {
    setSelectedProduct(product);
    setAdjustReason(mode);
    setAdjustQuantity(mode === "RESTOCK" ? "25" : "1");
    setAdjustNotes("");
    setIsModalOpen(true);
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.id,
          changeQuantity: parseInt(adjustQuantity),
          reason: adjustReason,
          notes: adjustNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to adjust stock");
      }
      setIsModalOpen(false);
      fetchInventory();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-shyvon-gold/20 pb-4">
        <div>
          <span className="text-xs uppercase font-cinzel text-shyvon-gold tracking-widest">
            Stock Management
          </span>
          <h1 className="font-cinzel text-2xl font-extrabold text-white">
            Inventory <span className="text-gold-gradient">Control</span>
          </h1>
          <p className="text-xs text-shyvon-muted mt-0.5">
            Monitor real-time stock levels, record restock shipments, and review audit logs.
          </p>
        </div>

        {lowStockCount > 0 && (
          <div className="px-4 py-2 rounded bg-red-950/60 border border-red-500/50 flex items-center gap-2 text-xs text-red-200">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>
              <strong>{lowStockCount}</strong> product(s) low in stock!
            </span>
          </div>
        )}
      </div>

      {/* Stock Overview Table */}
      <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 bg-black/40">
          <h3 className="font-cinzel text-sm font-bold text-shyvon-goldLight uppercase tracking-wider">
            Current Stock Levels
          </h3>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-shyvon-gold">Loading inventory...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-shyvon-muted font-cinzel uppercase tracking-wider">
                  <th className="py-3 px-4 text-left">Product Name</th>
                  <th className="py-3 px-2 text-left">SKU</th>
                  <th className="py-3 px-2 text-left">Net Weight</th>
                  <th className="py-3 px-2 text-center">Available Stock</th>
                  <th className="py-3 px-2 text-center">Alert Status</th>
                  <th className="py-3 px-4 text-center">Quick Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-cinzel font-bold text-white">{p.name}</td>
                    <td className="py-3.5 px-2 font-mono text-shyvon-muted">{p.sku}</td>
                    <td className="py-3.5 px-2 text-gray-300">{p.netWeight}</td>
                    <td className="py-3.5 px-2 text-center">
                      <span className="font-mono font-bold text-base text-gold-gradient">
                        {p.stock}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      {p.stock <= 10 ? (
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold uppercase text-[10px]">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-300 font-bold uppercase text-[10px]">
                          Healthy
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openAdjustModal(p, "RESTOCK")}
                          className="px-2.5 py-1 rounded bg-green-950/60 hover:bg-green-900 border border-green-500/40 text-green-300 font-semibold text-[11px] transition-colors"
                        >
                          + Restock
                        </button>
                        <button
                          onClick={() => openAdjustModal(p, "ADJUSTMENT")}
                          className="px-2.5 py-1 rounded bg-shyvon-surface hover:bg-white/10 border border-shyvon-gold/30 text-shyvon-goldLight text-[11px] transition-colors"
                        >
                          Adjust
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inventory Transaction Logs */}
      <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 bg-black/40 flex items-center gap-2">
          <History className="w-4 h-4 text-shyvon-gold" />
          <h3 className="font-cinzel text-sm font-bold text-shyvon-goldLight uppercase tracking-wider">
            Audit Trail / Stock Transaction History
          </h3>
        </div>

        {transactions.length === 0 ? (
          <div className="p-8 text-center text-xs text-shyvon-muted">
            No stock adjustments recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-shyvon-muted font-cinzel uppercase tracking-wider">
                  <th className="py-2.5 px-4 text-left">Date & Time</th>
                  <th className="py-2.5 px-2 text-left">Product</th>
                  <th className="py-2.5 px-2 text-center">Change</th>
                  <th className="py-2.5 px-2 text-center">Previous → New</th>
                  <th className="py-2.5 px-2 text-left">Reason</th>
                  <th className="py-2.5 px-4 text-left">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/5">
                    <td className="py-2.5 px-4 text-shyvon-muted font-mono">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2 font-medium text-white">{tx.product?.name}</td>
                    <td className="py-2.5 px-2 text-center font-mono font-bold">
                      <span className={tx.changeQuantity > 0 ? "text-green-400" : "text-red-400"}>
                        {tx.changeQuantity > 0 ? `+${tx.changeQuantity}` : tx.changeQuantity}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono text-gray-300">
                      {tx.previousStock} → {tx.newStock}
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="px-2 py-0.5 rounded bg-shyvon-surface font-mono text-[10px] text-shyvon-goldLight">
                        {tx.reason}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-gray-400 max-w-xs truncate">
                      {tx.notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Adjust Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0A101D] border border-shyvon-gold/40 rounded p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] text-shyvon-muted uppercase">Stock Adjustment</span>
                <h3 className="font-cinzel text-sm font-bold text-shyvon-goldLight">
                  {selectedProduct.name}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-black/40 rounded border border-white/10 flex justify-between">
                <span className="text-shyvon-muted">Current Stock:</span>
                <span className="font-mono font-bold text-white">{selectedProduct.stock} units</span>
              </div>

              <div>
                <label className="block text-shyvon-muted mb-1 font-medium">
                  Quantity Change (+ to add, - to deduct) *
                </label>
                <input
                  type="number"
                  required
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(e.target.value)}
                  className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2 text-white font-mono focus:outline-none focus:border-shyvon-gold"
                />
              </div>

              <div>
                <label className="block text-shyvon-muted mb-1 font-medium">Reason *</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2 text-white font-sans focus:outline-none focus:border-shyvon-gold"
                >
                  <option value="RESTOCK">RESTOCK (New shipment received)</option>
                  <option value="ADJUSTMENT">ADJUSTMENT (Count correction / shrinkage)</option>
                  <option value="RETURN">RETURN (Customer return)</option>
                  <option value="DAMAGE">DAMAGE (Expired or damaged stock)</option>
                </select>
              </div>

              <div>
                <label className="block text-shyvon-muted mb-1 font-medium">Audit Notes</label>
                <textarea
                  rows={2}
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  placeholder="e.g. Received new 50-pack batch from Shylie Global facility"
                  className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2 text-white focus:outline-none focus:border-shyvon-gold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-shyvon-surface text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <GoldButton type="submit" size="sm" loading={submitting}>
                  Save Stock Adjustment
                </GoldButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
