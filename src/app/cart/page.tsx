"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/order";
import GoldButton from "@/components/ui/GoldButton";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    itemCount,
    deliveryFee,
    finalTotal,
    freeShippingThreshold,
  } = useCart();

  const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  return (
    <div className="min-h-screen bg-shyvon-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border-b border-shyvon-gold/20 pb-4">
          <h1 className="font-cinzel text-3xl font-extrabold text-white">
            Shopping <span className="text-gold-gradient">Cart</span>
          </h1>
          <p className="text-xs text-shyvon-muted mt-1">
            Review your selected Sri Lankan organic herbal products before proceeding.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="glass-panel p-16 rounded text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-shyvon-surface border border-shyvon-gold/20 flex items-center justify-center mx-auto text-shyvon-gold">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-cinzel text-xl font-bold text-white">Your Cart is Empty</h2>
            <p className="text-xs text-shyvon-muted max-w-sm mx-auto">
              You have not added any botanicals to your bag yet. Discover our pure blue lotus petals
              and herbal wellness infusions.
            </p>
            <GoldButton href="/shop" size="md">
              Start Shopping
            </GoldButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Items List */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free delivery notice */}
              <div className="p-4 bg-shyvon-surface/70 border border-shyvon-gold/20 rounded flex items-center gap-3 text-xs text-shyvon-goldLight">
                <Sparkles className="w-4 h-4 text-shyvon-gold shrink-0" />
                <span>
                  {remainingForFreeShipping > 0
                    ? `Add ${formatPrice(remainingForFreeShipping)} more to receive COMPLIMENTARY island-wide shipping!`
                    : "Congratulations! You have unlocked COMPLIMENTARY island-wide delivery."}
                </span>
              </div>

              <div className="bg-shyvon-card border border-shyvon-gold/25 rounded overflow-hidden divide-y divide-white/5">
                {items.map((item) => {
                  const effectivePrice =
                    item.discountPrice !== null && item.discountPrice !== undefined
                      ? item.discountPrice
                      : item.price;
                  return (
                    <div
                      key={item.id}
                      className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded overflow-hidden bg-black/40 border border-shyvon-gold/20 shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <Link href={`/products/${item.slug}`}>
                            <h3 className="font-cinzel text-sm font-bold text-white hover:text-shyvon-gold transition-colors">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-[11px] text-shyvon-muted">
                            Weight: {item.netWeight} • Brand: {item.brand}
                          </p>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-xs font-bold text-shyvon-goldLight">
                              {formatPrice(effectivePrice)}
                            </span>
                            {item.discountPrice && (
                              <span className="text-[10px] text-gray-500 line-through">
                                {formatPrice(item.price)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                        {/* Quantity */}
                        <div className="flex items-center border border-shyvon-gold/30 rounded bg-shyvon-surface">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-white/5 text-shyvon-gold transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-mono font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-white/5 text-shyvon-gold transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Total line price */}
                        <span className="font-cinzel font-bold text-sm text-gold-gradient min-w-[90px] text-right">
                          {formatPrice(effectivePrice * item.quantity)}
                        </span>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary & Checkout Column */}
            <div className="lg:col-span-4">
              <div className="bg-shyvon-card border border-shyvon-gold/30 rounded p-6 space-y-6 shadow-2xl sticky top-28">
                <h3 className="font-cinzel text-base font-bold text-shyvon-goldLight border-b border-shyvon-gold/20 pb-3">
                  Order Summary
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-shyvon-muted">
                    <span>Total Items</span>
                    <span className="text-white font-mono">{itemCount}</span>
                  </div>
                  <div className="flex justify-between text-shyvon-muted">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-shyvon-muted">
                    <span>Delivery Charge</span>
                    <span className="text-white font-medium">
                      {deliveryFee === 0 ? (
                        <span className="text-green-400 font-bold uppercase tracking-wider text-[11px]">
                          COMPLIMENTARY
                        </span>
                      ) : (
                        formatPrice(deliveryFee)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-cinzel font-bold text-shyvon-goldLight pt-3 border-t border-white/10">
                    <span>Estimated Total</span>
                    <span className="text-gold-gradient">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                <GoldButton
                  href="/checkout"
                  size="lg"
                  className="w-full"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Proceed to Checkout
                </GoldButton>

                <p className="text-[11px] text-center text-shyvon-muted">
                  Safe & Secure Checkout • Island-wide Doorstep Delivery
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
