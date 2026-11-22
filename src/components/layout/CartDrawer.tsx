"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/order";
import GoldButton from "../ui/GoldButton";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    itemCount,
    deliveryFee,
    finalTotal,
    freeShippingThreshold,
  } = useCart();

  if (!isOpen) return null;

  const freeShippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fadeIn"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-shyvon-dark border-l border-shyvon-gold/30 shadow-2xl flex flex-col animate-slideLeft">
          {/* Header */}
          <div className="p-5 border-b border-shyvon-gold/20 flex items-center justify-between bg-shyvon-card">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-shyvon-gold" />
              <h2 className="font-cinzel text-lg font-bold tracking-wider text-shyvon-goldLight">
                Shopping Cart
              </h2>
              <span className="text-xs bg-shyvon-gold/20 text-shyvon-gold px-2 py-0.5 rounded-full font-mono">
                {itemCount}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-shyvon-muted hover:text-white transition-colors rounded-sm hover:bg-white/5"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="p-3.5 bg-shyvon-surface/80 border-b border-shyvon-gold/15 text-xs">
            <div className="flex items-center justify-between mb-1.5 text-shyvon-goldLight">
              <span className="flex items-center gap-1 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-shyvon-gold" />
                {remainingForFreeShipping > 0
                  ? `Add ${formatPrice(remainingForFreeShipping)} more for FREE delivery!`
                  : "You've unlocked FREE Island-wide Delivery!"}
              </span>
            </div>
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-gradient transition-all duration-500 rounded-full shadow-gold"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-shyvon-surface border border-shyvon-gold/20 flex items-center justify-center mb-4 text-shyvon-gold/60">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-cinzel text-base font-bold text-gray-200 mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs text-shyvon-muted max-w-xs mb-6">
                  Explore our pure Sri Lankan organic herbal selections and indulge in nature’s goodness.
                </p>
                <GoldButton onClick={closeCart} href="/shop" size="sm">
                  Explore Products
                </GoldButton>
              </div>
            ) : (
              items.map((item) => {
                const effectivePrice =
                  item.discountPrice !== null && item.discountPrice !== undefined
                    ? item.discountPrice
                    : item.price;
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-shyvon-card/70 border border-shyvon-gold/15 rounded-sm hover:border-shyvon-gold/30 transition-all"
                  >
                    <div className="relative w-20 h-20 rounded bg-black/40 overflow-hidden shrink-0 border border-shyvon-gold/20">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-cinzel text-xs font-bold text-gray-100 line-clamp-1">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-500 hover:text-red-400 p-0.5 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-shyvon-muted">Net Weight: {item.netWeight}</p>
                        <div className="flex items-baseline gap-1.5 mt-1">
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

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                        <div className="flex items-center border border-shyvon-gold/30 rounded bg-shyvon-surface">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-white/5 text-shyvon-gold transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-medium text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-white/5 text-shyvon-gold transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs font-bold text-gray-200">
                          {formatPrice(effectivePrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-5 bg-shyvon-card border-t border-shyvon-gold/20 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-shyvon-muted">
                  <span>Subtotal</span>
                  <span className="text-gray-200 font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-shyvon-muted">
                  <span>Delivery Fee</span>
                  <span className="text-gray-200 font-medium">
                    {deliveryFee === 0 ? (
                      <span className="text-green-400 font-bold uppercase tracking-wider text-[11px]">
                        FREE
                      </span>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-cinzel font-bold text-shyvon-goldLight pt-2 border-t border-white/10">
                  <span>Estimated Total</span>
                  <span className="text-base text-gold-gradient">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <GoldButton
                  href="/checkout"
                  onClick={closeCart}
                  size="md"
                  className="w-full"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Proceed to Checkout
                </GoldButton>
                <button
                  onClick={closeCart}
                  className="text-xs text-shyvon-muted hover:text-white transition-colors text-center py-1 uppercase tracking-wider"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
