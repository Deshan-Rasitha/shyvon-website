"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Layers, Check, X } from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.categories);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
    setDisplayOrder("0");
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setDisplayOrder(String(cat.displayOrder || 0));
    setIsActive(cat.isActive);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description,
        displayOrder,
        isActive,
      };

      const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save category");
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete");
      }
      fetchCategories();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-shyvon-gold/20 pb-4">
        <div>
          <span className="text-xs uppercase font-cinzel text-shyvon-gold tracking-widest">
            Catalog Organization
          </span>
          <h1 className="font-cinzel text-2xl font-extrabold text-white">
            Category <span className="text-gold-gradient">Management</span>
          </h1>
          <p className="text-xs text-shyvon-muted mt-0.5">
            Organize products into herbal teas, dried petals, and wellness collections.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gold-gradient text-shyvon-dark font-cinzel font-bold text-xs uppercase tracking-wider rounded shadow hover:brightness-110 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-xs text-shyvon-gold">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-xs text-shyvon-muted space-y-3">
            <Layers className="w-8 h-8 text-shyvon-gold mx-auto" />
            <p>No categories found. Create your first category!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-shyvon-gold/30 bg-black/40 text-shyvon-goldLight font-cinzel font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 text-left">Category Name</th>
                  <th className="py-3 px-2 text-left">Slug</th>
                  <th className="py-3 px-2 text-left">Description</th>
                  <th className="py-3 px-2 text-center">Order</th>
                  <th className="py-3 px-2 text-center">Products</th>
                  <th className="py-3 px-2 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-cinzel font-bold text-white">{cat.name}</td>
                    <td className="py-3.5 px-2 font-mono text-shyvon-muted">{cat.slug}</td>
                    <td className="py-3.5 px-2 text-gray-300 max-w-xs truncate">
                      {cat.description || "—"}
                    </td>
                    <td className="py-3.5 px-2 text-center font-mono">{cat.displayOrder}</td>
                    <td className="py-3.5 px-2 text-center">
                      <span className="px-2 py-0.5 rounded bg-shyvon-surface border border-shyvon-gold/20 font-mono text-[11px] text-shyvon-goldLight">
                        {cat._count?.products || 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          cat.isActive
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {cat.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1 text-shyvon-gold hover:text-yellow-300"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="p-1 text-gray-500 hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0A101D] border border-shyvon-gold/40 rounded p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-cinzel text-base font-bold text-shyvon-goldLight">
                {editingId ? "Edit Category" : "Add New Category"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-shyvon-muted mb-1 font-medium">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingId) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }
                  }}
                  className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2 text-white focus:outline-none focus:border-shyvon-gold"
                />
              </div>

              <div>
                <label className="block text-shyvon-muted mb-1 font-medium">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2 text-white font-mono text-xs focus:outline-none focus:border-shyvon-gold"
                />
              </div>

              <div>
                <label className="block text-shyvon-muted mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2 text-white focus:outline-none focus:border-shyvon-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-shyvon-muted mb-1 font-medium">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2 text-white font-mono focus:outline-none focus:border-shyvon-gold"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="accent-shyvon-gold"
                    />
                    <span className="text-white">Active</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-shyvon-surface text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <GoldButton type="submit" size="sm" loading={saving}>
                  Save Category
                </GoldButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
