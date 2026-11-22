"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Eye, Check, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/order";

export default function ProductCard({ product }: { product: any }) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAdded, setIsAdded] = useState(false);

  const primaryImage =
    product.images?.find((img: any) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "/images/products/blue-lotus-petals.jpg";

  const isFavorited = isInWishlist(product.id);
  const effectivePrice =
    product.discountPrice !== null && product.discountPrice !== undefined
      ? product.discountPrice
      : product.price;

  const hasDiscount =
    product.discountPrice !== null &&
    product.discountPrice !== undefined &&
    product.discountPrice < product.price;

  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand || "SHYVON",
        netWeight: product.netWeight || "50g",
        price: product.price,
        discountPrice: product.discountPrice,
        image: primaryImage,
        stock: product.stock,
      },
      1
    );

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      image: primaryImage,
      netWeight: product.netWeight || "50g",
    });
  };

  return (
    <div className="group relative bg-shyvon-card border border-shyvon-gold/20 hover:border-shyvon-gold/50 rounded-sm overflow-hidden flex flex-col transition-all duration-500 hover:shadow-gold hover:-translate-y-1">
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
        {hasDiscount && (
          <span className="px-2.5 py-0.5 rounded-sm bg-shyvon-gold text-shyvon-dark text-[10px] font-extrabold uppercase font-cinzel tracking-wider shadow">
            Save {discountPercentage}%
          </span>
        )}
        {product.isFeatured && (
          <span className="px-2.5 py-0.5 rounded-sm bg-shyvon-surface/90 border border-shyvon-gold/30 text-shyvon-goldLight text-[10px] font-bold uppercase font-cinzel tracking-wider">
            Signature
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
          isFavorited
            ? "bg-red-500/20 text-red-400 border border-red-500/40"
            : "bg-black/50 text-gray-300 hover:text-white hover:bg-black/80 border border-white/10"
        }`}
        aria-label="Toggle Wishlist"
      >
        <Heart className={`w-4 h-4 ${isFavorited ? "fill-red-400" : ""}`} />
      </button>

      {/* Image Container with Link */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square w-full overflow-hidden bg-black/40 block"
      >
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-shyvon-card/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-shyvon-gold font-cinzel">
            <span className="tracking-widest uppercase">{product.brand || "SHYVON"}</span>
            <span className="text-shyvon-muted font-sans font-medium">
              Net: {product.netWeight || "50g"}
            </span>
          </div>

          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-cinzel text-base font-bold text-white group-hover:text-shyvon-goldLight transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-shyvon-muted line-clamp-2 leading-relaxed">
            {product.shortDescription || product.description}
          </p>
        </div>

        {/* Pricing and Stock */}
        <div className="pt-2 border-t border-white/5 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-cinzel text-lg font-bold text-gold-gradient">
                {formatPrice(effectivePrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <span
              className={`text-[11px] font-medium ${
                product.stock > 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-cinzel font-semibold uppercase tracking-wider text-shyvon-goldLight bg-shyvon-surface/80 hover:bg-shyvon-gold/20 border border-shyvon-gold/30 rounded-sm transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </Link>

            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-cinzel font-bold uppercase tracking-wider rounded-sm transition-all shadow-sm ${
                isAdded
                  ? "bg-green-600 text-white"
                  : "bg-gold-gradient text-shyvon-dark hover:brightness-110 active:scale-95 border border-yellow-200/40"
              } disabled:opacity-50 disabled:pointer-events-none`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
