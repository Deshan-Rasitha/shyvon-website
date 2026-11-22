import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        images: {
          orderBy: { displayOrder: "asc" },
        },
        categories: {
          include: { category: true },
        },
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const admin = getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const existing = await prisma.product.findUnique({
      where: { slug: params.slug },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const {
      name,
      newSlug,
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

    // Handle stock difference inventory audit
    const newStockNum = parseInt(stock);
    if (!isNaN(newStockNum) && newStockNum !== existing.stock) {
      await prisma.inventoryTransaction.create({
        data: {
          productId: existing.id,
          changeQuantity: newStockNum - existing.stock,
          previousStock: existing.stock,
          newStock: newStockNum,
          reason: "ADJUSTMENT",
          notes: `Admin manual update by ${admin.name}`,
        },
      });
    }

    // Update categories and images if supplied
    if (categoryIds) {
      await prisma.productCategory.deleteMany({
        where: { productId: existing.id },
      });
      await prisma.productCategory.createMany({
        data: categoryIds.map((catId: string) => ({
          productId: existing.id,
          categoryId: catId,
        })),
      });
    }

    if (images) {
      await prisma.productImage.deleteMany({
        where: { productId: existing.id },
      });
      await prisma.productImage.createMany({
        data: images.map((img: any, idx: number) => ({
          productId: existing.id,
          url: img.url,
          alt: img.alt || name || existing.name,
          displayOrder: idx,
          isPrimary: idx === 0,
        })),
      });
    }

    const updated = await prisma.product.update({
      where: { id: existing.id },
      data: {
        name: name !== undefined ? name : existing.name,
        slug: newSlug || existing.slug,
        brand: brand !== undefined ? brand : existing.brand,
        netWeight: netWeight !== undefined ? netWeight : existing.netWeight,
        price: price !== undefined ? parseFloat(price) : existing.price,
        discountPrice:
          discountPrice !== undefined
            ? discountPrice === null || discountPrice === ""
              ? null
              : parseFloat(discountPrice)
            : existing.discountPrice,
        stock: !isNaN(newStockNum) ? newStockNum : existing.stock,
        sku: sku !== undefined ? sku : existing.sku,
        isActive: isActive !== undefined ? isActive : existing.isActive,
        isFeatured: isFeatured !== undefined ? isFeatured : existing.isFeatured,
        shortDescription: shortDescription !== undefined ? shortDescription : existing.shortDescription,
        description: description !== undefined ? description : existing.description,
        ingredients: ingredients !== undefined ? ingredients : existing.ingredients,
        benefits:
          benefits !== undefined
            ? typeof benefits === "object"
              ? JSON.stringify(benefits)
              : benefits
            : existing.benefits,
        usageInstructions:
          usageInstructions !== undefined
            ? typeof usageInstructions === "object"
              ? JSON.stringify(usageInstructions)
              : usageInstructions
            : existing.usageInstructions,
        storageInstructions:
          storageInstructions !== undefined ? storageInstructions : existing.storageInstructions,
        manufacturingInfo:
          manufacturingInfo !== undefined ? manufacturingInfo : existing.manufacturingInfo,
        metaTitle: metaTitle !== undefined ? metaTitle : existing.metaTitle,
        metaDescription: metaDescription !== undefined ? metaDescription : existing.metaDescription,
      },
      include: {
        images: true,
        categories: { include: { category: true } },
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const admin = getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await prisma.product.delete({
      where: { slug: params.slug },
    });

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
