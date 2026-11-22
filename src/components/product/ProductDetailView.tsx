"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  MessageCircle,
  ShieldCheck,
  Truck,
  Leaf,
  CheckCircle,
  Star,
  Clock,
  Award,
  Zap,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/order";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";
import GoldButton from "../ui/GoldButton";

export default function ProductDetailView({
  product,
  relatedProducts,
}: {
  product: any;
  relatedProducts: any[];
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "ingredients" | "benefits" | "usage" | "reviews">("desc");

  // Review submission form state
  const [reviewName, setReviewName] = useState("");
  const [reviewEmail, setReviewEmail] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ id: "def", url: "/images/products/blue-lotus-petals.jpg", alt: product.name }];

  const currentImage = images[activeImageIndex] || images[0];

  const effectivePrice =
    product.discountPrice !== null && product.discountPrice !== undefined
      ? product.discountPrice
      : product.price;

  const hasDiscount =
    product.discountPrice !== null &&
    product.discountPrice !== undefined &&
    product.discountPrice < product.price;

  const isFavorited = isInWishlist(product.id);

  // Parse benefits and usage if stored as JSON
  let benefitsList: string[] = [];
  try {
    benefitsList = JSON.parse(product.benefits);
    if (!Array.isArray(benefitsList)) benefitsList = [product.benefits];
  } catch {
    benefitsList = product.benefits ? product.benefits.split("\n").filter(Boolean) : [];
  }

  let usageList: string[] = [];
  try {
    usageList = JSON.parse(product.usageInstructions);
    if (!Array.isArray(usageList)) usageList = [product.usageInstructions];
  } catch {
    usageList = product.usageInstructions ? product.usageInstructions.split("\n").filter(Boolean) : [];
  }

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        netWeight: product.netWeight,
        price: product.price,
        discountPrice: product.discountPrice,
        image: currentImage.url,
        stock: product.stock,
      },
      quantity
    );
  };

  const handleBuyNow = () => {
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        netWeight: product.netWeight,
        price: product.price,
        discountPrice: product.discountPrice,
        image: currentImage.url,
        stock: product.stock,
      },
      quantity
    );
    router.push("/checkout");
  };

  const handleWhatsAppOrder = () => {
    const text = `Hello SHYVON, I would like to order:
Product: ${product.name} (${product.netWeight})
Quantity: ${quantity}
Price: ${formatPrice(effectivePrice * quantity)}

Please share the payment and delivery procedure.`;
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94714770176";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitting(true);
    setReviewError("");
    setReviewSuccess(false);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          customerName: reviewName,
          customerEmail: reviewEmail,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit review");
      }
      setReviewSuccess(true);
      setReviewName("");
      setReviewEmail("");
      setReviewTitle("");
      setReviewComment("");
    } catch (err: any) {
      setReviewError(err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="space-y-16">
      {/* Product Primary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Gallery Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-sm overflow-hidden bg-black/60 border border-shyvon-gold/30 shadow-2xl group">
            <Image
              src={currentImage.url}
              alt={currentImage.alt || product.name}
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-zoom-in"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded bg-shyvon-gold text-shyvon-dark text-xs font-cinzel font-extrabold uppercase shadow">
                Special Offer
              </span>
            )}
            <button
              onClick={() =>
                toggleWishlist({
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  discountPrice: product.discountPrice,
                  image: currentImage.url,
                  netWeight: product.netWeight,
                })
              }
              className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all ${
                isFavorited
                  ? "bg-red-500/20 text-red-400 border border-red-500/40"
                  : "bg-black/60 text-gray-300 hover:text-white border border-white/10"
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? "fill-red-400" : ""}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img: any, idx: number) => (
                <button
                  key={img.id || idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIndex === idx
                      ? "border-shyvon-gold shadow-gold"
                      : "border-white/10 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img.url} alt={img.alt || product.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-cinzel text-shyvon-gold">
              <span className="tracking-widest uppercase">{product.brand || "SHYVON"}</span>
              <span className="text-shyvon-muted font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center text-shyvon-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-shyvon-gold text-shyvon-gold" />
                ))}
              </div>
              <span className="text-xs text-shyvon-muted font-sans">
                (Authentic Pure Organic Grade)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-shyvon-card/80 border border-shyvon-gold/20 rounded-sm flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-cinzel text-2xl sm:text-3xl font-bold text-gold-gradient">
                {formatPrice(effectivePrice)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <span className="text-xs font-medium text-shyvon-goldLight bg-shyvon-surface px-2.5 py-1 rounded border border-shyvon-gold/30">
              Net Weight: {product.netWeight}
            </span>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
            {product.shortDescription}
          </p>

          {/* Stock availability */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-shyvon-muted">Availability:</span>
            {product.stock > 0 ? (
              <span className="text-green-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                In Stock ({product.stock} units available)
              </span>
            ) : (
              <span className="text-red-400 font-semibold">Out of Stock</span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 pt-2">
            <span className="text-xs text-shyvon-muted font-cinzel uppercase tracking-wider">
              Quantity:
            </span>
            <div className="flex items-center border border-shyvon-gold/30 rounded bg-shyvon-surface">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-white/5 text-shyvon-gold transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-mono font-bold text-white">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                className="p-2 hover:bg-white/5 text-shyvon-gold transition-colors"
                disabled={quantity >= product.stock}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons: Add to Cart, Buy Now, WhatsApp */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <GoldButton
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                icon={<ShoppingBag className="w-4 h-4" />}
                className="w-full"
              >
                Add to Cart
              </GoldButton>
              <GoldButton
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                variant="outline"
                icon={<Zap className="w-4 h-4" />}
                className="w-full"
              >
                Buy Now
              </GoldButton>
            </div>

            <button
              onClick={handleWhatsAppOrder}
              type="button"
              className="w-full py-3 px-4 rounded bg-[#128C7E] hover:bg-[#075E54] text-white font-medium text-xs font-sans flex items-center justify-center gap-2 transition-all shadow"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Order Instantly via WhatsApp</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="p-4 bg-shyvon-surface/60 border border-shyvon-gold/15 rounded-sm space-y-2 text-xs text-shyvon-muted">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-shyvon-gold" />
              <span>Complimentary Island-wide shipping on orders over Rs. 5,000</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-shyvon-gold" />
              <span>100% Authentic Organic Sri Lankan Product Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-shyvon-gold" />
              <span>Harvested by Shylie Global Pvt Ltd. Gampaha, Sri Lanka</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="bg-shyvon-card border border-shyvon-gold/25 rounded-sm overflow-hidden shadow-xl">
        <div className="flex flex-wrap border-b border-shyvon-gold/20 bg-shyvon-surface/80">
          {[
            { id: "desc", label: "Description" },
            { id: "ingredients", label: "Ingredients" },
            { id: "benefits", label: "Health Benefits" },
            { id: "usage", label: "Brewing & Usage" },
            { id: "reviews", label: `Reviews (${product.reviews?.length || 0})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-6 font-cinzel text-xs uppercase tracking-wider font-bold transition-all relative ${
                activeTab === tab.id
                  ? "text-shyvon-goldLight bg-shyvon-card"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-gradient" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8 text-xs sm:text-sm text-gray-300 leading-relaxed">
          {activeTab === "desc" && (
            <div className="space-y-4">
              <h3 className="font-cinzel text-base font-bold text-shyvon-goldLight">
                Pure Sri Lankan Blue Lotus Botanical Heritage
              </h3>
              <p className="font-light leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
              <div className="pt-4 border-t border-white/10 space-y-1 text-xs">
                <p>
                  <strong className="text-shyvon-goldLight">Storage Instructions: </strong>
                  {product.storageInstructions}
                </p>
                <p>
                  <strong className="text-shyvon-goldLight">Manufacturing Details: </strong>
                  {product.manufacturingInfo}
                </p>
              </div>
            </div>
          )}

          {activeTab === "ingredients" && (
            <div className="space-y-4">
              <h3 className="font-cinzel text-base font-bold text-shyvon-goldLight">
                100% Pure Botanical Purity
              </h3>
              <p className="font-light">{product.ingredients}</p>
              <div className="mt-4 p-4 rounded bg-shyvon-surface/70 border border-shyvon-gold/20 max-w-md">
                <h4 className="font-cinzel text-xs font-bold text-white mb-2 uppercase tracking-wider">
                  Quality Standards:
                </h4>
                <ul className="space-y-1.5 text-xs text-shyvon-muted">
                  <li>• Non-GMO, 100% Plant-Based</li>
                  <li>• Naturally Caffeine-Free</li>
                  <li>• Free from Artificial Flavors, Fragrances, or Colors</li>
                  <li>• Sustainable Sri Lankan Wetland Harvest</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "benefits" && (
            <div className="space-y-4">
              <h3 className="font-cinzel text-base font-bold text-shyvon-goldLight">
                Traditional Wellness & Healing Attributes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {benefitsList.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded bg-shyvon-surface/50 border border-shyvon-gold/15"
                  >
                    <CheckCircle className="w-4 h-4 text-shyvon-gold shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-200">{benefit}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-shyvon-muted/80 italic pt-2">
                *Statements regarding herbal remedies reflect traditional Sri Lankan Ayurvedic
                practices and natural wellness traditions.
              </p>
            </div>
          )}

          {activeTab === "usage" && (
            <div className="space-y-4">
              <h3 className="font-cinzel text-base font-bold text-shyvon-goldLight">
                Recommended Brewing & Preparation
              </h3>
              <div className="space-y-3">
                {usageList.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-shyvon-gold/20 text-shyvon-gold font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs text-gray-200">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-8">
              {/* Review Submission Form */}
              <div className="p-6 bg-shyvon-surface border border-shyvon-gold/20 rounded-sm">
                <h4 className="font-cinzel text-sm font-bold text-shyvon-goldLight mb-3 uppercase tracking-wider">
                  Write a Customer Review
                </h4>

                {reviewSuccess && (
                  <div className="mb-4 p-3 bg-green-900/40 border border-green-500/50 rounded text-green-300 text-xs">
                    Thank you! Your review has been submitted for verification and will appear after
                    approval.
                  </div>
                )}

                {reviewError && (
                  <div className="mb-4 p-3 bg-red-900/40 border border-red-500/50 rounded text-red-300 text-xs">
                    {reviewError}
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-shyvon-muted mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        className="w-full bg-shyvon-dark border border-shyvon-gold/30 rounded p-2 text-xs text-white"
                        placeholder="e.g. Dilshan Perera"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-shyvon-muted mb-1">Your Email</label>
                      <input
                        type="email"
                        value={reviewEmail}
                        onChange={(e) => setReviewEmail(e.target.value)}
                        className="w-full bg-shyvon-dark border border-shyvon-gold/30 rounded p-2 text-xs text-white"
                        placeholder="e.g. dilshan@gmail.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-shyvon-muted mb-1">Rating *</label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(parseInt(e.target.value))}
                        className="w-full bg-shyvon-dark border border-shyvon-gold/30 rounded p-2 text-xs text-white font-sans"
                      >
                        <option value="5">★★★★★ (5 Stars - Outstanding)</option>
                        <option value="4">★★★★☆ (4 Stars - Very Good)</option>
                        <option value="3">★★★☆☆ (3 Stars - Average)</option>
                        <option value="2">★★☆☆☆ (2 Stars - Poor)</option>
                        <option value="1">★☆☆☆☆ (1 Star - Disappointed)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-shyvon-muted mb-1">Review Title *</label>
                    <input
                      type="text"
                      required
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full bg-shyvon-dark border border-shyvon-gold/30 rounded p-2 text-xs text-white"
                      placeholder="e.g. Exquisite aroma and deeply calming tea"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-shyvon-muted mb-1">Your Feedback *</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full bg-shyvon-dark border border-shyvon-gold/30 rounded p-2 text-xs text-white"
                      placeholder="Share your personal experience with this product..."
                    />
                  </div>

                  <GoldButton type="submit" size="sm" loading={reviewSubmitting}>
                    Submit Review
                  </GoldButton>
                </form>
              </div>

              {/* Existing Reviews List */}
              <div className="space-y-4">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev: any) => (
                    <div
                      key={rev.id}
                      className="p-4 bg-shyvon-surface/50 border border-white/5 rounded-sm space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white text-xs">{rev.customerName}</span>
                        <div className="flex text-shyvon-gold">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-shyvon-gold" />
                          ))}
                        </div>
                      </div>
                      <h5 className="font-cinzel text-xs font-bold text-shyvon-goldLight">
                        {rev.title}
                      </h5>
                      <p className="text-xs text-gray-300 font-light">{rev.comment}</p>
                      <span className="text-[10px] text-shyvon-muted block pt-1">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-shyvon-muted text-center py-4">
                    No approved customer reviews yet. Be the first to review this organic creation!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
