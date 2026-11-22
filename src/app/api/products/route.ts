import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const sort = searchParams.get("sort") || "newest";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const adminMode = searchParams.get("admin") === "true";

    const where: any = {};

    // Only active products for customers
    if (!adminMode) {
      where.isActive = true;
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (categorySlug) {
      where.categories = {
        some: {
          category: {
            slug: categorySlug,
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

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        images: {
          orderBy: { displayOrder: "asc" },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      brand,
      netWeight,
      price,
      discountPrice,
      stock,
      sku,
      isActive,
      isFeatured,
      shortDescription,
      description,
      ingredients,
      benefits,
      usageInstructions,
      storageInstructions,
      manufacturingInfo,
      metaTitle,
      metaDescription,
      categoryIds,
      images,
    } = body;

    // Check SKU or Slug unique
    const existing = await prisma.product.findFirst({
      where: {
        OR: [{ slug }, { sku }],
      },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A product with this slug or SKU already exists" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        brand: brand || "SHYVON",
        netWeight: netWeight || "50g",
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        stock: parseInt(stock) || 0,
        sku: sku || `SHY-${Date.now().toString().slice(-6)}`,
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured !== undefined ? isFeatured : false,
        shortDescription: shortDescription || "",
        description: description || "",
        ingredients: ingredients || "",
        benefits: typeof benefits === "object" ? JSON.stringify(benefits) : benefits || "[]",
        usageInstructions:
          typeof usageInstructions === "object"
            ? JSON.stringify(usageInstructions)
            : usageInstructions || "[]",
        storageInstructions: storageInstructions || "Keep in a cool, dry place.",
        manufacturingInfo:
          manufacturingInfo || "Manufactured & Packed by: Shylie Global Pvt Ltd. Gampaha, Sri Lanka.",
        metaTitle,
        metaDescription,
        categories: {
          create: (categoryIds || []).map((catId: string) => ({
            categoryId: catId,
          })),
        },
        images: {
          create: (images || []).map((img: any, idx: number) => ({
            url: img.url,
            alt: img.alt || name,
            displayOrder: idx,
            isPrimary: idx === 0,
          })),
        },
        inventoryAdjustments: {
          create: {
            changeQuantity: parseInt(stock) || 0,
            previousStock: 0,
            newStock: parseInt(stock) || 0,
            reason: "RESTOCK",
            notes: "Initial product creation inventory",
          },
        },
      },
      include: {
        images: true,
        categories: { include: { category: true } },
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
