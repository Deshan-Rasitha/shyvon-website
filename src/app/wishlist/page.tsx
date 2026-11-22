"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/order";
import GoldButton from "@/components/ui/GoldButton";

export default function WishlistPage() {
  const { items, toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  return (
    <div className="min-h-screen bg-shyvon-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="border-b border-shyvon-gold/20 pb-4">
          <h1 className="font-cinzel text-3xl font-extrabold text-white">
            My <span className="text-gold-gradient">Wishlist</span>
          </h1>
          <p className="text-xs text-shyvon-muted mt-1">
            Your saved organic herbal products and favorite botanicals.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="glass-panel p-16 rounded text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-shyvon-surface border border-shyvon-gold/20 flex items-center justify-center mx-auto text-shyvon-gold">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="font-cinzel text-xl font-bold text-white">Your Wishlist is Empty</h2>
            <p className="text-xs text-shyvon-muted max-w-sm mx-auto">
              Save your favorite herbal infusions and dried blue lotus petals to easily access them
              later.
            </p>
            <GoldButton href="/shop" size="md">
              Explore Products
            </GoldButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-shyvon-card border border-shyvon-gold/20 rounded-sm overflow-hidden flex flex-col justify-between p-5 space-y-4 hover:border-shyvon-gold/40 transition-all"
              >
                <div className="relative aspect-square w-full rounded overflow-hidden bg-black/40 border border-shyvon-gold/15">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-cinzel text-sm font-bold text-white line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-shyvon-muted">Net Weight: {item.netWeight}</p>
                  <p className="font-cinzel text-sm font-bold text-gold-gradient">
                    {formatPrice(item.discountPrice || item.price)}
                  </p>
                </div>

                <div className="flex gap-2 pt-2 border-t border-white/5">
                  <GoldButton
                    onClick={() =>
                      addItem({
                        id: item.id,
                        slug: item.slug,
                        name: item.name,
                        brand: "SHYVON",
                        netWeight: item.netWeight,
                        price: item.price,
                        discountPrice: item.discountPrice,
                        image: item.image,
                        stock: 50,
                      })
                    }
                    size="sm"
                    className="flex-1"
                    icon={<ShoppingBag className="w-3.5 h-3.5" />}
                  >
                    Add to Cart
                  </GoldButton>

                  <button
                    onClick={() => toggleWishlist(item)}
                    className="p-2 border border-white/10 rounded hover:bg-red-500/10 hover:text-red-400 text-gray-400 transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
