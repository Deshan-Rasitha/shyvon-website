import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ArrowRight, Sparkles } from "lucide-react";

export const revalidate = 0;

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  return (
    <div className="min-h-screen bg-shyvon-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-shyvon-surface border border-shyvon-gold/30 text-shyvon-goldLight text-xs uppercase tracking-widest font-cinzel">
            <Sparkles className="w-3.5 h-3.5 text-shyvon-gold" />
            <span>Botanical Collections</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-white">
            Explore <span className="text-gold-gradient">Categories</span>
          </h1>
          <p className="text-sm text-shyvon-muted">
            Curated collections of authentic Sri Lankan herbal teas, dried flowers, and wellness
            remedies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative bg-shyvon-card border border-shyvon-gold/25 hover:border-shyvon-gold/60 rounded-sm overflow-hidden p-8 flex flex-col justify-between min-h-[260px] transition-all duration-500 hover:shadow-gold hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-shyvon-gold/5 rounded-bl-full pointer-events-none group-hover:bg-shyvon-gold/15 transition-all" />

              <div className="space-y-3 relative z-10">
                <span className="text-[11px] font-mono text-shyvon-gold uppercase tracking-wider block">
                  {cat._count.products} {cat._count.products === 1 ? "Product" : "Products"}
                </span>
                <h3 className="font-cinzel text-xl font-bold text-white group-hover:text-shyvon-goldLight transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-shyvon-muted leading-relaxed">{cat.description}</p>
              </div>

              <div className="pt-6 flex items-center gap-2 text-xs font-cinzel font-bold text-shyvon-goldLight group-hover:text-white transition-colors relative z-10">
                <span>Browse Collection</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
