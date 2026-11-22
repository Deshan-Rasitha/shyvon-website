import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: params.id }, { orderNumber: params.id }],
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                slug: true,
                images: {
                  take: 1,
                  select: { url: true },
                },
              },
            },
          },
        },
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Failed to fetch order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { orderStatus, paymentStatus, notes } = await req.json();

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: params.id }, { orderNumber: params.id }],
      },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    // If order is being cancelled, restore inventory
    if (orderStatus === "CANCELLED" && order.orderStatus !== "CANCELLED") {
      for (const item of order.items) {
        const prod = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (prod) {
          await prisma.product.update({
            where: { id: prod.id },
            data: { stock: prod.stock + item.quantity },
          });
          await prisma.inventoryTransaction.create({
            data: {
              productId: prod.id,
              changeQuantity: item.quantity,
              previousStock: prod.stock,
              newStock: prod.stock + item.quantity,
              reason: "RETURN",
              referenceId: order.orderNumber,
              notes: `Order cancellation stock restock`,
            },
          });
        }
      }
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        orderStatus: orderStatus || order.orderStatus,
        paymentStatus: paymentStatus || order.paymentStatus,
        statusHistory: {
          create: {
            status: orderStatus || order.orderStatus,
            notes: notes || `Status updated to ${orderStatus || order.orderStatus}`,
            changedBy: admin.name || "Admin",
          },
        },
      },
      include: {
        items: true,
        statusHistory: { orderBy: { createdAt: "desc" } },
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    console.error("Failed to update order:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update order" },
      { status: 500 }
    );
  }
}
