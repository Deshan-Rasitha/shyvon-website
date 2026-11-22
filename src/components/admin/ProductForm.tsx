"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Upload,
  Plus,
  Trash2,
  Check,
  Star,
  Sparkles,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import GoldButton from "../ui/GoldButton";

interface ProductFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();

  // Basic Information
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [brand, setBrand] = useState(initialData?.brand || "SHYVON");
  const [netWeight, setNetWeight] = useState(initialData?.netWeight || "50g");
  const [sku, setSku] = useState(initialData?.sku || "");
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : "");
  const [discountPrice, setDiscountPrice] = useState(
    initialData?.discountPrice ? String(initialData.discountPrice) : ""
  );
  const [stock, setStock] = useState(initialData?.stock !== undefined ? String(initialData.stock) : "50");
  const [isActive, setIsActive] = useState(initialData?.isActive !== undefined ? initialData.isActive : true);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);

  // Descriptions
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [ingredients, setIngredients] = useState(initialData?.ingredients || "");
  const [storageInstructions, setStorageInstructions] = useState(
    initialData?.storageInstructions || "Keep in a cool, dry place, away from direct sunlight."
  );
  const [manufacturingInfo, setManufacturingInfo] = useState(
    initialData?.manufacturingInfo ||
      "Manufactured & Packed by: Shylie Global Pvt Ltd. Gampaha, Sri Lanka. Made in Sri Lanka."
  );

  // Benefits & Usage dynamic bullet arrays
  const [benefits, setBenefits] = useState<string[]>(() => {
    if (initialData?.benefits) {
      try {
        const parsed = JSON.parse(initialData.benefits);
        return Array.isArray(parsed) ? parsed : [initialData.benefits];
      } catch {
        return initialData.benefits.split("\n").filter(Boolean);
      }
    }
    return [
      "Promotes Relaxation",
      "Supports Better Sleep",
      "Helps Reduce Stress & Anxiety",
      "Rich in Natural Antioxidants",
      "Supports Overall Well-being",
    ];
  });

  const [usage, setUsage] = useState<string[]>(() => {
    if (initialData?.usageInstructions) {
      try {
        const parsed = JSON.parse(initialData.usageInstructions);
        return Array.isArray(parsed) ? parsed : [initialData.usageInstructions];
      } catch {
        return initialData.usageInstructions.split("\n").filter(Boolean);
      }
    }
    return [
      "Prepare a calming herbal tea: Place 3-5 dried petals into a cup or teapot.",
      "Pour 200ml of freshly boiled water (approx. 85°C - 90°C).",
      "Steep for 5 to 7 minutes until fragrant and deeply infused.",
      "Enjoy warm as a peaceful evening ritual or blend into your favorite organic tea.",
    ];
  });

  // Categories
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(() => {
    if (initialData?.categories) {
      return initialData.categories.map((c: any) => c.categoryId || c.category?.id);
    }
    return [];
  });

  // Images
  const [images, setImages] = useState<{ url: string; alt?: string }[]>(() => {
    if (initialData?.images && initialData.images.length > 0) {
      return initialData.images.map((img: any) => ({ url: img.url, alt: img.alt }));
    }
    return [{ url: "/images/products/blue-lotus-petals.jpg", alt: "Packaging" }];
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.categories) {
          setAllCategories(data.categories);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit && !slug) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.url) {
          setImages((prev) => [...prev, { url: data.url, alt: name }]);
        }
      }
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !price || !netWeight) {
      setError("Please fill in the product name, price, and net weight.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        newSlug: slug,
        brand,
        netWeight,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        stock: parseInt(stock) || 0,
        sku: sku || `SHY-${Date.now().toString().slice(-6)}`,
        isActive,
        isFeatured,
        shortDescription,
        description,
        ingredients,
        benefits,
        usageInstructions: usage,
        storageInstructions,
        manufacturingInfo,
        categoryIds: selectedCategoryIds,
        images,
      };

      const url = isEdit ? `/api/products/${initialData.slug}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save product");
      }

      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-shyvon-gold/20 pb-4">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 text-xs text-shyvon-muted hover:text-white mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </button>
          <h1 className="font-cinzel text-2xl font-extrabold text-white">
            {isEdit ? "Edit Product" : "Create New Product"}
          </h1>
        </div>

        <GoldButton type="submit" size="md" loading={isSubmitting}>
          {isEdit ? "Update Product" : "Save & Publish"}
        </GoldButton>
      </div>

      {error && (
        <div className="p-3 bg-red-950/60 border border-red-500 rounded flex items-center gap-2 text-xs text-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Info Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Basic Details */}
          <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded p-6 space-y-4 shadow-xl">
            <h3 className="font-cinzel text-sm font-bold text-shyvon-goldLight uppercase tracking-wider border-b border-white/10 pb-2">
              General Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-shyvon-muted mb-1 font-medium">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Organic Dried Blue Lotus Petals"
                  className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white focus:outline-none focus:border-shyvon-gold"
                />
              </div>

              <div>
                <label className="block text-shyvon-muted mb-1 font-medium">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="organic-dried-blue-lotus-petals-50g"
                  className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white font-mono text-xs focus:outline-none focus:border-shyvon-gold"
                />
              </div>

              <div>
                <label className="block text-shyvon-muted mb-1 font-medium">SKU / Item Code</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. SHY-BLP-050"
                  className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white font-mono text-xs focus:outline-none focus:border-shyvon-gold"
                />
              </div>

              <div>
                <label className="block text-shyvon-muted mb-1 font-medium">Brand</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white focus:outline-none focus:border-shyvon-gold"
                />
              </div>

              <div>
                <label className="block text-shyvon-muted mb-1 font-medium">Net Weight *</label>
                <input
                  type="text"
                  required
                  value={netWeight}
                  onChange={(e) => setNetWeight(e.target.value)}
                  placeholder="e.g. 50g, 100g"
                  className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white focus:outline-none focus:border-shyvon-gold"
                />
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-4 pt-2 text-xs">
              <div>
                <label className="block text-shyvon-muted mb-1 font-medium">
                  Short Summary (Display on Cards)
                </label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Brief 1-2 sentence highlight for catalog cards"
                  className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white focus:outline-none focus:border-shyvon-gold"
                />
              </div>

              <div>
                <label className="block text-shyvon-muted mb-1 font-medium">
                  Full Description & Story
                </label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive description of origins, harvesting, and botanical essence..."
                  className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white focus:outline-none focus:border-shyvon-gold"
                />
              </div>

              <div>
                <label className="block text-shyvon-muted mb-1 font-medium">Ingredients</label>
                <input
                  type="text"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="e.g. 100% Pure Organic Dried Blue Lotus Petals (Nymphaea caerulea)."
                  className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white focus:outline-none focus:border-shyvon-gold"
                />
              </div>
            </div>
          </div>

          {/* Benefits & Usage Bullet Array Builder */}
          <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded p-6 space-y-4 shadow-xl">
            <h3 className="font-cinzel text-sm font-bold text-shyvon-goldLight uppercase tracking-wider border-b border-white/10 pb-2">
              Botanical Benefits & Usage Instructions
            </h3>

            {/* Benefits */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <label className="text-shyvon-muted font-medium">Key Benefits (Cards)</label>
                <button
                  type="button"
                  onClick={() => setBenefits([...benefits, ""])}
                  className="text-shyvon-gold hover:underline text-[11px] flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Benefit
                </button>
              </div>
              {benefits.map((b, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={b}
                    onChange={(e) => {
                      const updated = [...benefits];
                      updated[idx] = e.target.value;
                      setBenefits(updated);
                    }}
                    placeholder={`Benefit #${idx + 1}`}
                    className="flex-1 bg-[#080D19] border border-shyvon-gold/30 rounded p-2 text-white text-xs focus:outline-none focus:border-shyvon-gold"
                  />
                  <button
                    type="button"
                    onClick={() => setBenefits(benefits.filter((_, i) => i !== idx))}
                    className="p-2 text-gray-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Usage */}
            <div className="space-y-2 pt-4 border-t border-white/5 text-xs">
              <div className="flex justify-between items-center">
                <label className="text-shyvon-muted font-medium">
                  Preparation & Brewing Instructions
                </label>
                <button
                  type="button"
                  onClick={() => setUsage([...usage, ""])}
                  className="text-shyvon-gold hover:underline text-[11px] flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Step
                </button>
              </div>
              {usage.map((u, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={u}
                    onChange={(e) => {
                      const updated = [...usage];
                      updated[idx] = e.target.value;
                      setUsage(updated);
                    }}
                    placeholder={`Step #${idx + 1}`}
                    className="flex-1 bg-[#080D19] border border-shyvon-gold/30 rounded p-2 text-white text-xs focus:outline-none focus:border-shyvon-gold"
                  />
                  <button
                    type="button"
                    onClick={() => setUsage(usage.filter((_, i) => i !== idx))}
                    className="p-2 text-gray-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Packaging & Corporate Details */}
          <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded p-6 space-y-4 shadow-xl text-xs">
            <h3 className="font-cinzel text-sm font-bold text-shyvon-goldLight uppercase tracking-wider border-b border-white/10 pb-2">
              Packaging & Origin Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-shyvon-muted mb-1 font-medium">
                  Storage Instructions
                </label>
                <input
                  type="text"
                  value={storageInstructions}
                  onChange={(e) => setStorageInstructions(e.target.value)}
                  className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white focus:outline-none focus:border-shyvon-gold"
                />
              </div>

              <div>
                <label className="block text-shyvon-muted mb-1 font-medium">
                  Manufacturing & Packing Info
                </label>
                <input
                  type="text"
                  value={manufacturingInfo}
                  onChange={(e) => setManufacturingInfo(e.target.value)}
                  className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white focus:outline-none focus:border-shyvon-gold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Column: Pricing, Inventory, Images, Categories */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Pricing */}
          <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded p-6 space-y-4 shadow-xl text-xs">
            <h3 className="font-cinzel text-sm font-bold text-shyvon-goldLight uppercase tracking-wider border-b border-white/10 pb-2">
              Pricing & Stock
            </h3>

            <div>
              <label className="block text-shyvon-muted mb-1 font-medium">Regular Price (LKR) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1850"
                className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white font-mono focus:outline-none focus:border-shyvon-gold"
              />
            </div>

            <div>
              <label className="block text-shyvon-muted mb-1 font-medium">
                Discount Price (LKR)
              </label>
              <input
                type="number"
                step="0.01"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="1650 (Optional)"
                className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white font-mono focus:outline-none focus:border-shyvon-gold"
              />
            </div>

            <div>
              <label className="block text-shyvon-muted mb-1 font-medium">
                Inventory Stock Units *
              </label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="50"
                className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white font-mono focus:outline-none focus:border-shyvon-gold"
              />
            </div>

            <div className="pt-2 border-t border-white/5 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="accent-shyvon-gold"
                />
                <span className="text-white">Active (Visible in Store)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="accent-shyvon-gold"
                />
                <span className="text-white">Featured (Show in Hero & Signature)</span>
              </label>
            </div>
          </div>

          {/* Categories Selector */}
          <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded p-6 space-y-3 shadow-xl text-xs">
            <h3 className="font-cinzel text-sm font-bold text-shyvon-goldLight uppercase tracking-wider border-b border-white/10 pb-2">
              Categories
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {allCategories.map((cat) => {
                const isSelected = selectedCategoryIds.includes(cat.id);
                return (
                  <label
                    key={cat.id}
                    className="flex items-center gap-2 p-1.5 rounded hover:bg-white/5 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        if (isSelected) {
                          setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== cat.id));
                        } else {
                          setSelectedCategoryIds([...selectedCategoryIds, cat.id]);
                        }
                      }}
                      className="accent-shyvon-gold"
                    />
                    <span className="text-gray-200">{cat.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Product Gallery & Image Upload */}
          <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded p-6 space-y-3 shadow-xl text-xs">
            <h3 className="font-cinzel text-sm font-bold text-shyvon-goldLight uppercase tracking-wider border-b border-white/10 pb-2">
              Product Images
            </h3>

            {/* Existing images list */}
            <div className="grid grid-cols-2 gap-2">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded overflow-hidden bg-black/50 border border-shyvon-gold/30 group"
                >
                  <Image src={img.url} alt={`Product ${idx}`} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="p-1 rounded bg-red-600/80 text-white hover:bg-red-600"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-shyvon-gold text-shyvon-dark text-[9px] font-bold uppercase font-cinzel">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Upload Button */}
            <div className="pt-2">
              <label className="block p-3 border-2 border-dashed border-shyvon-gold/40 hover:border-shyvon-gold rounded text-center cursor-pointer bg-[#080D19] transition-all">
                <Upload className="w-5 h-5 text-shyvon-gold mx-auto mb-1" />
                <span className="text-[11px] text-shyvon-goldLight block font-medium">
                  {isUploading ? "Uploading..." : "Upload Images"}
                </span>
                <span className="text-[10px] text-shyvon-muted block">JPG, PNG, WEBP</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
