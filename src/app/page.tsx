import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Heart,
  Award,
  Clock,
  CheckCircle,
  MessageCircle,
  Star,
} from "lucide-react";
import Hero3DCanvas from "@/components/3d/Hero3DCanvas";
import GoldButton from "@/components/ui/GoldButton";
import ProductCard from "@/components/product/ProductCard";
import { prisma } from "@/lib/prisma";

export const revalidate = 0; // Dynamic server component

export default async function HomePage() {
  // Fetch products and categories dynamically from database
  const products = await prisma.product.findMany({
    where: { isActive: true },
    take: 8,
    orderBy: { isFeatured: "desc" },
    include: {
      images: { orderBy: { displayOrder: "asc" } },
      categories: { include: { category: true } },
    },
  });

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  return (
    <div className="relative min-h-screen bg-shyvon-dark overflow-hidden">
      {/* ===================================================
          1. HERO SECTION
          =================================================== */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-8 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Three.js 3D Particles & Floating Botanical Canvas */}
        <Hero3DCanvas />

        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-shyvon-gold/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-shyvon-lotus/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-shyvon-surface/80 border border-shyvon-gold/30 text-shyvon-goldLight text-xs tracking-widest uppercase font-cinzel">
              <Sparkles className="w-3.5 h-3.5 text-shyvon-gold animate-pulse" />
              <span>Sri Lankan Organic Heritage</span>
            </div>

            <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-wide leading-[1.15] text-white">
              Discover the <br className="hidden sm:inline" />
              <span className="text-gold-gradient">Pure Goodness</span> of Nature
            </h1>

            <p className="text-base sm:text-lg text-shyvon-muted font-light max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Premium Organic Herbal Products, Naturally Crafted for Your Well-being. Pure by Nature,
              for a Healthier You.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <GoldButton
                href="/shop"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Products
              </GoldButton>
              <GoldButton href="/about" variant="outline" size="lg">
                Discover SHYVON
              </GoldButton>
            </div>

            {/* Value Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-shyvon-gold/20 max-w-md mx-auto lg:mx-0">
              <div>
                <p className="font-cinzel text-xl sm:text-2xl font-bold text-gold-gradient">100%</p>
                <p className="text-[11px] text-shyvon-muted uppercase tracking-wider">Certified Organic</p>
              </div>
              <div>
                <p className="font-cinzel text-xl sm:text-2xl font-bold text-gold-gradient">Native</p>
                <p className="text-[11px] text-shyvon-muted uppercase tracking-wider">Sri Lankan Herbs</p>
              </div>
              <div>
                <p className="font-cinzel text-xl sm:text-2xl font-bold text-gold-gradient">Zero</p>
                <p className="text-[11px] text-shyvon-muted uppercase tracking-wider">Additives or Preservatives</p>
              </div>
            </div>
          </div>

          {/* Right Visual Column (Cinematic Product Showcase) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-md w-full">
              {/* Gold Ornamental Outer Frame */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-shyvon-gold/40 via-shyvon-goldLight/20 to-shyvon-gold/40 rounded-xl blur-sm group-hover:blur-md transition-all duration-700 opacity-75" />

              <div className="relative bg-shyvon-card rounded-lg overflow-hidden border border-shyvon-gold/40 shadow-2xl">
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src="/images/products/blue-lotus-petals.jpg"
                    alt="SHYVON Organic Dried Blue Lotus Petals"
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Subtle Gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-shyvon-dark via-transparent to-black/20" />
                </div>

                {/* Floating Ribbon Card Info */}
                <div className="p-5 bg-gradient-to-b from-shyvon-card to-[#0A101D] border-t border-shyvon-gold/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-cinzel tracking-widest text-shyvon-gold">
                        Signature Botanical
                      </span>
                      <h3 className="font-cinzel text-base font-bold text-white">
                        Organic Dried Blue Lotus Petals
                      </h3>
                      <p className="text-xs text-shyvon-muted">Net Weight: 50g • Packed by Shylie Global</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400 line-through block">Rs. 1,850</span>
                      <span className="text-base font-bold text-gold-gradient font-cinzel">Rs. 1,650</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs text-green-400 font-medium">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                      In Stock & Ready to Ship
                    </span>
                    <Link
                      href="/products/organic-dried-blue-lotus-petals-50g"
                      className="text-xs font-cinzel font-bold text-shyvon-goldLight hover:underline flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          2. FEATURED PRODUCTS (Database Driven)
          =================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-shyvon-gold/20 bg-gradient-to-b from-shyvon-dark via-shyvon-card/40 to-shyvon-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] font-cinzel text-shyvon-gold">
              Hand-Harvested Selection
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white">
              Featured <span className="text-gold-gradient">Herbal Creations</span>
            </h2>
            <div className="ornate-divider my-2">
              <span className="w-2 h-2 rounded-full bg-shyvon-gold" />
            </div>
            <p className="text-sm text-shyvon-muted">
              Every botanical is sustainably sourced from Sri Lanka’s lush reserves, sun-cured with
              meticulous precision to retain optimal freshness and potent bioactive nutrients.
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <GoldButton href="/shop" variant="outline" size="md">
              View All Products
            </GoldButton>
          </div>
        </div>
      </section>

      {/* ===================================================
          3. BOTANICAL SECTION: "NATURE'S HEALING TOUCH"
          =================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-shyvon-gold/20 bg-[#060913] relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-shyvon-gold/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] font-cinzel text-shyvon-gold">
              Holistic Botanical Wellness
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white">
              Nature’s <span className="text-gold-gradient">Healing Touch</span>
            </h2>
            <div className="ornate-divider my-2">
              <span className="w-2 h-2 rounded-full bg-shyvon-gold" />
            </div>
            <p className="text-sm text-shyvon-muted">
              Rooted in centuries of Sri Lankan herbal wisdom, our blue lotus flowers nurture mind,
              spirit, and body with gentle restorative power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              {
                icon: <Leaf className="w-6 h-6 text-shyvon-gold" />,
                title: "Promotes Relaxation",
                desc: "Gently soothes nervous tension and calms an overactive mind after demanding days.",
              },
              {
                icon: <Clock className="w-6 h-6 text-shyvon-gold" />,
                title: "Supports Better Sleep",
                desc: "Prepares your circadian rhythm for restful, deep, and uninterrupted slumber.",
              },
              {
                icon: <Heart className="w-6 h-6 text-shyvon-gold" />,
                title: "Helps Reduce Stress",
                desc: "Natural phytochemicals assist in melting away daily anxiety and physical strain.",
              },
              {
                icon: <Award className="w-6 h-6 text-shyvon-gold" />,
                title: "Rich in Antioxidants",
                desc: "Abundant bioflavonoids safeguard cells and support vitality and radiant health.",
              },
              {
                icon: <Sparkles className="w-6 h-6 text-shyvon-gold" />,
                title: "Supports Well-Being",
                desc: "Restores harmonious internal balance, clarity, and uplifted spirit naturally.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="glass-panel p-6 rounded-sm text-center space-y-3 hover:border-shyvon-gold/40 transition-all duration-300"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-shyvon-surface border border-shyvon-gold/30 flex items-center justify-center">
                  {item.icon}
                </div>
                <h4 className="font-cinzel text-sm font-bold text-shyvon-goldLight">
                  {item.title}
                </h4>
                <p className="text-xs text-shyvon-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          4. ABOUT SHYVON & WHY CHOOSE US
          =================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-shyvon-gold/20 bg-shyvon-card/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative aspect-square max-w-lg mx-auto w-full rounded-lg overflow-hidden border border-shyvon-gold/30 shadow-2xl">
            <Image
              src="/images/branding/packaging-reference.jpg"
              alt="About SHYVON Organic Packaging"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
              <div className="space-y-1">
                <span className="text-xs font-cinzel text-shyvon-gold uppercase tracking-widest">
                  Authentic Sri Lankan Heritage
                </span>
                <p className="text-white font-cinzel text-lg font-bold">
                  Manufactured & Packed by Shylie Global Pvt Ltd.
                </p>
                <p className="text-xs text-shyvon-muted">Gampaha, Sri Lanka</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] font-cinzel text-shyvon-gold">
              The Essence of SHYVON
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white">
              Pure by Nature, <br />
              <span className="text-gold-gradient">for a Healthier You.</span>
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              SHYVON is founded on a singular commitment: delivering unadulterated, sustainably
              harvested botanicals directly from the fertile soils of Sri Lanka to your cup. We
              honor ancient organic wisdom while ensuring rigorous contemporary quality standards.
            </p>

            {/* Why Choose SHYVON bullet points */}
            <div className="space-y-3.5 pt-2">
              {[
                "Naturally Inspired Products — Untouched by artificial synthetics, dyes, or GMOs.",
                "Quality-Focused Selection — Meticulously hand-screened and cured for peak potency.",
                "Authentic Sri Lankan Herbal Products — Sourced from traditional local growers.",
                "Carefully Packed Products — Sealed in airtight gold-foil packaging for long-lasting aroma.",
                "Customer-Focused Service — Doorstep island-wide delivery with personalized support.",
              ].map((point, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-shyvon-gold shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-gray-200">{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center gap-4">
              <GoldButton href="/about">Learn Our Full Story</GoldButton>
              <a
                href="https://wa.me/94714770176?text=Hello%20SHYVON%2C%20I%20would%20like%20to%20learn%20more%20about%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-cinzel font-bold text-shyvon-goldLight hover:text-white transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-green-400" />
                <span>Chat with an Herbal Specialist</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          5. WHATSAPP DIRECT ORDER BANNER
          =================================================== */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 border-t border-shyvon-gold/20 bg-gradient-to-r from-[#071E1C] via-[#0C2D2A] to-[#071E1C]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#25D366] text-xs font-semibold">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Instant Personal Assistance</span>
            </span>
            <h3 className="font-cinzel text-2xl font-bold text-white">
              Prefer to Order Directly on WhatsApp?
            </h3>
            <p className="text-xs text-gray-300 max-w-lg">
              Send our team a message on WhatsApp for customized quantities, bank payment proofs, or
              inquiries. We respond promptly!
            </p>
          </div>

          <a
            href="https://wa.me/94714770176?text=Hello%20SHYVON%2C%20I%20would%20like%20to%20place%20an%20order%20for%20Organic%20Dried%20Blue%20Lotus%20Petals."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded bg-[#25D366] hover:bg-[#1EBE5D] text-shyvon-dark font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-[#25D366]/20 font-sans"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Chat & Order on WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
}
