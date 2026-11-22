import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetailView from "@/components/product/ProductDetailView";
import ProductCard from "@/components/product/ProductCard";

export const revalidate = 0;

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { images: true },
  });

  if (!product) {
    return { title: "Product Not Found | SHYVON" };
  }

  return {
    title: `${product.name} (${product.netWeight}) | SHYVON Sri Lanka`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | SHYVON Natural Foods`,
      description: product.shortDescription,
      images: product.images?.[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      images: { orderBy: { displayOrder: "asc" } },
      categories: { include: { category: true } },
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  // Related products
  const categoryIds = product.categories.map((c) => c.categoryId);
  const relatedProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: product.id },
      categories: {
        some: {
          categoryId: { in: categoryIds },
        },
      },
    },
    take: 4,
    include: {
      images: { orderBy: { displayOrder: "asc" } },
      categories: { include: { category: true } },
    },
  });

  return (
    <div className="min-h-screen bg-shyvon-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        <ProductDetailView product={product} relatedProducts={relatedProducts} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-12 border-t border-shyvon-gold/20">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] font-cinzel text-shyvon-gold">
                Complementary Selections
              </span>
              <h2 className="font-cinzel text-2xl font-bold text-white">
                You May Also <span className="text-gold-gradient">Cherish</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
