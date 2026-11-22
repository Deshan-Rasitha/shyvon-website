"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit, Trash2, Eye, Package, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/order";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = () => {
    setLoading(true);
    fetch("/api/products?admin=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/products/${slug}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete");
      }
      fetchProducts();
    } catch (err: any) {
      alert(`Error deleting product: ${err.message}`);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-shyvon-gold/20 pb-4">
        <div>
          <span className="text-xs uppercase font-cinzel text-shyvon-gold tracking-widest">
            Inventory & Catalog
          </span>
          <h1 className="font-cinzel text-2xl font-extrabold text-white">
            Product <span className="text-gold-gradient">Management</span>
          </h1>
          <p className="text-xs text-shyvon-muted mt-0.5">
            Manage your dynamic product catalog, inventory counts, descriptions, and packaging.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gold-gradient text-shyvon-dark font-cinzel font-bold text-xs uppercase tracking-wider rounded shadow hover:brightness-110 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0A101D] border border-shyvon-gold/30 rounded py-2 pl-3.5 pr-10 text-xs text-white placeholder-shyvon-muted/60 focus:outline-none focus:border-shyvon-gold"
          />
          <Search className="w-4 h-4 text-shyvon-gold absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        <span className="text-xs text-shyvon-muted font-mono">
          Showing {filtered.length} of {products.length} products
        </span>
      </div>

      {/* Products Table */}
      <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-xs text-shyvon-gold">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-shyvon-muted space-y-3">
            <Package className="w-8 h-8 text-shyvon-gold mx-auto" />
            <p>No products found matching your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-shyvon-gold/30 bg-black/40 text-shyvon-goldLight font-cinzel font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 text-left">Product</th>
                  <th className="py-3 px-2 text-left">SKU</th>
                  <th className="py-3 px-2 text-left">Weight</th>
                  <th className="py-3 px-2 text-right">Price</th>
                  <th className="py-3 px-2 text-center">Stock</th>
                  <th className="py-3 px-2 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((product) => {
                  const image =
                    product.images?.[0]?.url || "/images/products/blue-lotus-petals.jpg";
                  return (
                    <tr key={product.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded overflow-hidden bg-black/50 border border-shyvon-gold/20 shrink-0">
                            <Image
                              src={image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-cinzel font-bold text-white block">
                              {product.name}
                            </span>
                            <span className="text-[11px] text-shyvon-muted">
                              {product.brand}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-2 font-mono text-shyvon-muted">{product.sku}</td>
                      <td className="py-3.5 px-2 text-gray-300">{product.netWeight}</td>
                      <td className="py-3.5 px-2 text-right">
                        <span className="font-bold text-white">
                          {formatPrice(product.discountPrice || product.price)}
                        </span>
                        {product.discountPrice && (
                          <span className="block text-[10px] text-gray-500 line-through">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-2 text-center">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                            product.stock <= 10
                              ? "bg-red-500/20 text-red-300"
                              : "bg-green-500/20 text-green-300"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            product.isActive
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                            title="View on site"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/products/${product.slug}`}
                            className="p-1 text-shyvon-gold hover:text-yellow-300 transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.slug, product.name)}
                            className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
    </div>
  );
}
