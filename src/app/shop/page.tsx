import React from "react";
import Link from "next/link";
import { Filter, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

interface ShopPageProps {
  searchParams: {
    category?: string;
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, search, sort = "newest", minPrice, maxPrice } = searchParams;

  const where: any = { isActive: true };

  if (category) {
    where.categories = {
      some: {
        category: {
          slug: category,
        },
      },
    };
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { shortDescription: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };
  if (sort === "name-asc") orderBy = { name: "asc" };
  if (sort === "name-desc") orderBy = { name: "desc" };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        categories: { include: { category: true } },
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      include: { _count: { select: { products: true } } },
    }),
  ]);

  return (
    <div className="min-h-screen bg-shyvon-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-shyvon-surface border border-shyvon-gold/30 text-shyvon-goldLight text-xs uppercase tracking-widest font-cinzel">
            <Sparkles className="w-3.5 h-3.5 text-shyvon-gold" />
            <span>Pure Botanical Selections</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-white">
            Shop <span className="text-gold-gradient">SHYVON Collections</span>
          </h1>
          <p className="text-sm text-shyvon-muted">
            Explore authentic Sri Lankan organic herbal products, meticulously hand-crafted to
            elevate wellness and restore peace.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-shyvon-card border border-shyvon-gold/25 rounded-sm p-4 sm:p-6 shadow-xl">
          <form method="GET" action="/shop" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  defaultValue={search}
                  placeholder="Search botanical name..."
                  className="w-full bg-shyvon-surface border border-shyvon-gold/30 rounded py-2 pl-3.5 pr-10 text-xs text-white placeholder-shyvon-muted/60 focus:outline-none focus:border-shyvon-gold"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-shyvon-gold"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Category Dropdown */}
              <div>
                <select
                  name="category"
                  defaultValue={category || ""}
                  className="w-full bg-shyvon-surface border border-shyvon-gold/30 rounded py-2 px-3 text-xs text-white focus:outline-none focus:border-shyvon-gold font-sans"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name} ({c._count.products})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Dropdown */}
              <div>
                <select
                  name="sort"
                  defaultValue={sort}
                  className="w-full bg-shyvon-surface border border-shyvon-gold/30 rounded py-2 px-3 text-xs text-white focus:outline-none focus:border-shyvon-gold font-sans"
                >
                  <option value="newest">Sort by: Newest Arrivals</option>
                  <option value="price-asc">Sort by: Price: Low to High</option>
                  <option value="price-desc">Sort by: Price: High to Low</option>
                  <option value="name-asc">Sort by: Name: A to Z</option>
                </select>
              </div>

              {/* Apply / Reset Buttons */}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-gold-gradient text-shyvon-dark font-cinzel font-bold text-xs uppercase tracking-wider py-2 rounded hover:brightness-110 transition-all shadow"
                >
                  Filter
                </button>
                <Link
                  href="/shop"
                  className="px-3 py-2 bg-shyvon-surface hover:bg-white/10 text-shyvon-muted text-xs rounded transition-colors text-center font-sans"
                >
                  Reset
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Categories Quick Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-shyvon-muted font-cinzel uppercase tracking-wider mr-2">
            Categories:
          </span>
          <Link
            href="/shop"
            className={`px-3 py-1 rounded-full text-xs font-cinzel transition-all ${
              !category
                ? "bg-shyvon-gold text-shyvon-dark font-bold shadow"
                : "bg-shyvon-surface text-gray-300 hover:text-white border border-shyvon-gold/20"
            }`}
          >
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className={`px-3 py-1 rounded-full text-xs font-cinzel transition-all ${
                category === cat.slug
                  ? "bg-shyvon-gold text-shyvon-dark font-bold shadow"
                  : "bg-shyvon-surface text-gray-300 hover:text-white border border-shyvon-gold/20"
              }`}
            >
              {cat.name} ({cat._count.products})
            </Link>
          ))}
        </div>

        {/* Product Listing */}
        {products.length === 0 ? (
          <div className="py-20 text-center glass-panel rounded-sm space-y-4">
            <h3 className="font-cinzel text-xl font-bold text-gray-300">
              No products found matching your criteria.
            </h3>
            <p className="text-xs text-shyvon-muted">
              Try adjusting your category or search term, or view our complete catalog.
            </p>
            <Link
              href="/shop"
              className="inline-block mt-2 px-5 py-2 text-xs font-cinzel font-bold uppercase bg-gold-gradient text-shyvon-dark rounded"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
