import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const admin = getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
        price: true,
        isActive: true,
        netWeight: true,
      },
      orderBy: { stock: "asc" },
    });

    const lowStockThreshold = 10;
    const lowStockCount = products.filter((p) => p.stock <= lowStockThreshold).length;

    const recentTransactions = await prisma.inventoryTransaction.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: { name: true, sku: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      products,
      lowStockCount,
      lowStockThreshold,
      recentTransactions,
    });
  } catch (error: any) {
    console.error("Failed to fetch inventory:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch inventory" },
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

    const { productId, changeQuantity, reason, notes } = await req.json();

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const change = parseInt(changeQuantity);
    if (isNaN(change) || change === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid quantity change" },
        { status: 400 }
      );
    }

    const newStock = Math.max(0, product.stock + change);

    const [updatedProduct, transaction] = await prisma.$transaction([
      prisma.product.update({
        where: { id: product.id },
        data: { stock: newStock },
      }),
      prisma.inventoryTransaction.create({
        data: {
          productId: product.id,
          changeQuantity: change,
          previousStock: product.stock,
          newStock,
          reason: reason || "ADJUSTMENT",
          notes: notes || `Adjusted by ${admin.name}`,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      transaction,
    });
  } catch (error: any) {
    console.error("Failed to adjust inventory:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to adjust inventory" },
      { status: 500 }
    );
  }
}
