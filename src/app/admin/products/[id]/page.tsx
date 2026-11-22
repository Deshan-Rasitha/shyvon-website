import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const revalidate = 0;

interface EditProductPageProps {
  params: { id: string };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const product = await prisma.product.findFirst({
    where: {
      OR: [{ id: params.id }, { slug: params.id }],
    },
    include: {
      images: { orderBy: { displayOrder: "asc" } },
      categories: { include: { category: true } },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto">
      <ProductForm initialData={product} isEdit={true} />
    </div>
  );
}
