"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Building,
  Upload,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/order";
import GoldButton from "@/components/ui/GoldButton";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, deliveryFee, finalTotal, clearCart } = useCart();

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [email, setEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "BANK_TRANSFER">("COD");

  // Bank transfer proof upload
  const [paymentSlipUrl, setPaymentSlipUrl] = useState<string | null>(null);
  const [isUploadingProof, setIsUploadingProof] = useState(false);

  // Settings
  const [settings, setSettings] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch settings for bank details and customer session
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch((err) => console.error(err));

    fetch("/api/auth/customer/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.customer) {
          if (data.customer.name) setFullName(data.customer.name);
          if (data.customer.email) setEmail(data.customer.email);
          if (data.customer.phone) setMobileNumber(data.customer.phone);
          if (data.customer.whatsapp) setWhatsappNumber(data.customer.whatsapp);
          if (data.customer.address) setDeliveryAddress(data.customer.address);
          if (data.customer.city) setCity(data.customer.city);
        }
      })
      .catch(() => {});
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingProof(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload slip");
      }
      setPaymentSlipUrl(data.url);
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setIsUploadingProof(false);
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (items.length === 0) {
      setErrorMessage("Your cart is empty. Please add items before checking out.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        customerName: fullName,
        customerPhone: mobileNumber,
        customerWhatsapp: whatsappNumber || mobileNumber,
        customerEmail: email || null,
        deliveryAddress,
        city,
        orderNotes: notes || null,
        paymentMethod,
        paymentProofUrl: paymentSlipUrl,
        items: items.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to place order.");
      }

      // Clear the local cart
      clearCart();

      // Redirect to unique order confirmation page
      router.push(`/order-confirmation/${data.orderNumber}`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 bg-shyvon-dark">
        <h2 className="font-cinzel text-2xl font-bold text-white mb-2">Your Cart is Empty</h2>
        <p className="text-xs text-shyvon-muted mb-6">
          Add some products to your cart before proceeding to checkout.
        </p>
        <GoldButton href="/shop">Browse Catalog</GoldButton>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-shyvon-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border-b border-shyvon-gold/20 pb-4">
          <div className="flex items-center gap-2 text-xs font-cinzel text-shyvon-gold mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure 256-Bit Encrypted Checkout</span>
          </div>
          <h1 className="font-cinzel text-3xl font-extrabold text-white">
            Customer <span className="text-gold-gradient">Checkout</span>
          </h1>
        </div>

        {errorMessage && (
          <div className="p-4 bg-red-950/70 border border-red-500 rounded flex items-start gap-3 text-red-200 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleOrderSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Customer Information Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Shipping Details */}
              <div className="bg-shyvon-card border border-shyvon-gold/25 rounded p-6 space-y-4 shadow-xl">
                <h3 className="font-cinzel text-base font-bold text-shyvon-goldLight border-b border-shyvon-gold/20 pb-2">
                  1. Delivery Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-shyvon-muted mb-1 font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Kasun Jayawardena"
                      className="w-full bg-shyvon-surface border border-shyvon-gold/30 rounded p-2.5 text-white placeholder-shyvon-muted/50 focus:outline-none focus:border-shyvon-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-shyvon-muted mb-1 font-medium">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="e.g. 077 123 4567"
                      className="w-full bg-shyvon-surface border border-shyvon-gold/30 rounded p-2.5 text-white placeholder-shyvon-muted/50 focus:outline-none focus:border-shyvon-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-shyvon-muted mb-1 font-medium">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="Optional (if different from mobile)"
                      className="w-full bg-shyvon-surface border border-shyvon-gold/30 rounded p-2.5 text-white placeholder-shyvon-muted/50 focus:outline-none focus:border-shyvon-gold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-shyvon-muted mb-1 font-medium">
                      Gmail / Email Address * (Required for Order Updates & Invoicing)
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. yourname@gmail.com"
                      className="w-full bg-shyvon-surface border border-shyvon-gold/30 rounded p-2.5 text-white placeholder-shyvon-muted/50 focus:outline-none focus:border-shyvon-gold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-shyvon-muted mb-1 font-medium">
                      Delivery Address *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="House/Building No, Street, Area"
                      className="w-full bg-shyvon-surface border border-shyvon-gold/30 rounded p-2.5 text-white placeholder-shyvon-muted/50 focus:outline-none focus:border-shyvon-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-shyvon-muted mb-1 font-medium">
                      City / District *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Colombo, Gampaha, Kandy"
                      className="w-full bg-shyvon-surface border border-shyvon-gold/30 rounded p-2.5 text-white placeholder-shyvon-muted/50 focus:outline-none focus:border-shyvon-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-shyvon-muted mb-1 font-medium">
                      Special Order Notes
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Leave with security, call before arrival"
                      className="w-full bg-shyvon-surface border border-shyvon-gold/30 rounded p-2.5 text-white placeholder-shyvon-muted/50 focus:outline-none focus:border-shyvon-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-shyvon-card border border-shyvon-gold/25 rounded p-6 space-y-4 shadow-xl">
                <h3 className="font-cinzel text-base font-bold text-shyvon-goldLight border-b border-shyvon-gold/20 pb-2">
                  2. Payment Method
                </h3>

                <div className="space-y-3">
                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded border cursor-pointer transition-all ${
                      paymentMethod === "COD"
                        ? "bg-shyvon-surface border-shyvon-gold shadow-gold"
                        : "bg-shyvon-dark/60 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="mt-1 accent-shyvon-gold"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-shyvon-gold" />
                        <span className="font-cinzel text-xs font-bold text-white">
                          Cash on Delivery (COD)
                        </span>
                      </div>
                      <p className="text-[11px] text-shyvon-muted mt-1">
                        Pay in cash when our courier delivers the package to your doorstep.
                      </p>
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded border cursor-pointer transition-all ${
                      paymentMethod === "BANK_TRANSFER"
                        ? "bg-shyvon-surface border-shyvon-gold shadow-gold"
                        : "bg-shyvon-dark/60 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="BANK_TRANSFER"
                      checked={paymentMethod === "BANK_TRANSFER"}
                      onChange={() => setPaymentMethod("BANK_TRANSFER")}
                      className="mt-1 accent-shyvon-gold"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-shyvon-gold" />
                        <span className="font-cinzel text-xs font-bold text-white">
                          Direct Bank Transfer
                        </span>
                      </div>
                      <p className="text-[11px] text-shyvon-muted mt-1">
                        Deposit directly to our verified corporate bank account.
                      </p>

                      {/* Bank Details Display */}
                      {paymentMethod === "BANK_TRANSFER" && (
                        <div className="mt-4 p-4 rounded bg-black/40 border border-shyvon-gold/30 space-y-2 text-xs">
                          <p className="text-shyvon-gold font-bold">
                            Bank: {settings?.bankName || "Commercial Bank of Ceylon"}
                          </p>
                          <p className="text-white">
                            Account Name:{" "}
                            <strong>{settings?.bankAccountName || "Shylie Global Pvt Ltd"}</strong>
                          </p>
                          <p className="text-white">
                            Account Number:{" "}
                            <strong className="font-mono text-shyvon-goldLight text-sm">
                              {settings?.bankAccountNumber || "100012345678"}
                            </strong>
                          </p>
                          <p className="text-shyvon-muted">
                            Branch: {settings?.bankBranch || "Gampaha Branch"}
                          </p>
                          <p className="text-[11px] text-shyvon-muted/80 italic pt-1">
                            {settings?.bankInstructions ||
                              "Please deposit the final order total and upload the receipt slip below."}
                          </p>

                          {/* Slip Upload */}
                          <div className="pt-2">
                            <label className="block text-[11px] text-shyvon-goldLight mb-1 font-medium">
                              Upload Deposit Slip (Optional)
                            </label>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={handleFileUpload}
                              className="text-xs text-shyvon-muted file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-shyvon-gold file:text-shyvon-dark hover:file:bg-yellow-400 cursor-pointer"
                            />
                            {isUploadingProof && (
                              <p className="text-[11px] text-yellow-300 mt-1">Uploading slip...</p>
                            )}
                            {paymentSlipUrl && (
                              <p className="text-[11px] text-green-400 mt-1">
                                ✓ Deposit receipt uploaded successfully!
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary & Final Submit Column */}
            <div className="lg:col-span-5">
              <div className="bg-shyvon-card border border-shyvon-gold/30 rounded p-6 space-y-6 shadow-2xl sticky top-28">
                <h3 className="font-cinzel text-base font-bold text-shyvon-goldLight border-b border-shyvon-gold/20 pb-3">
                  Order Summary
                </h3>

                {/* Items preview list */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-white/5">
                  {items.map((item) => {
                    const price =
                      item.discountPrice !== null && item.discountPrice !== undefined
                        ? item.discountPrice
                        : item.price;
                    return (
                      <div key={item.id} className="pt-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded overflow-hidden bg-black/40 border border-shyvon-gold/20 shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-cinzel font-bold text-white line-clamp-1">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-shyvon-muted">
                              {item.netWeight} × {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-gray-200">
                          {formatPrice(price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="space-y-2 text-xs border-t border-white/10 pt-4">
                  <div className="flex justify-between text-shyvon-muted">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-shyvon-muted">
                    <span>Delivery Charge</span>
                    <span className="text-white font-medium">
                      {deliveryFee === 0 ? (
                        <span className="text-green-400 font-bold uppercase text-[11px]">
                          COMPLIMENTARY
                        </span>
                      ) : (
                        formatPrice(deliveryFee)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-cinzel font-bold text-shyvon-goldLight pt-3 border-t border-shyvon-gold/30">
                    <span>Final Total</span>
                    <span className="text-gold-gradient">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                <GoldButton
                  type="submit"
                  size="lg"
                  loading={isSubmitting}
                  className="w-full"
                  icon={<ShieldCheck className="w-4 h-4" />}
                >
                  Place Order Now
                </GoldButton>

                <div className="space-y-1.5 text-[11px] text-center text-shyvon-muted border-t border-white/5 pt-3">
                  <p>A unique order number will be generated automatically.</p>
                  <p>You can immediately download your PDF invoice & share on WhatsApp.</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
