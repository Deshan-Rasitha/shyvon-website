import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession, getCustomerSession } from "@/lib/auth";
import { generateUniqueOrderNumber } from "@/lib/order";
import { sendOrderNotificationEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminSession();
    const customer = getCustomerSession();

    if (!admin && !customer) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};

    // If customer, only show their orders
    if (!admin && customer) {
      where.customerId = customer.id;
    }

    if (status && status !== "ALL") {
      where.orderStatus = status;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { customerName: { contains: search } },
        { customerPhone: { contains: search } },
        { customerEmail: { contains: search } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        statusHistory: { orderBy: { createdAt: "desc" } },
      },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerWhatsapp,
      customerEmail,
      deliveryAddress,
      city,
      orderNotes,
      paymentMethod,
      paymentProofUrl,
      items, // array of { productId, quantity }
    } = body;

    // 1. Validation
    if (!customerName || !customerPhone || !deliveryAddress || !city) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required customer details." },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Your cart is empty. Please select products to order." },
        { status: 400 }
      );
    }

    // 2. Fetch Website Settings for Delivery Fees
    const settings = await prisma.websiteSettings.findUnique({
      where: { id: "default" },
    });
    const standardFee = settings?.deliveryFeeStandard ?? 350;
    const freeThreshold = settings?.deliveryFeeFreeThreshold ?? 5000;

    // Check payment method allowed
    if (paymentMethod === "COD" && settings?.isCodEnabled === false) {
      return NextResponse.json(
        { success: false, error: "Cash on delivery is currently disabled." },
        { status: 400 }
      );
    }
    if (paymentMethod === "BANK_TRANSFER" && settings?.isBankTransferEnabled === false) {
      return NextResponse.json(
        { success: false, error: "Bank transfer is currently disabled." },
        { status: 400 }
      );
    }

    // 3. Database transaction: Validate stock, recalculate subtotal server-side, create order, deduct inventory
    const result = await prisma.$transaction(async (tx) => {
      let calculatedSubtotal = 0;
      const orderItemsToCreate: {
        productId: string;
        productName: string;
        productWeight: string;
        unitPrice: number;
        quantity: number;
        itemTotal: number;
      }[] = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || !product.isActive) {
          throw new Error(`Product "${item.productId}" is currently unavailable.`);
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for "${product.name}". Only ${product.stock} available.`
          );
        }

        const effectivePrice =
          product.discountPrice !== null && product.discountPrice !== undefined
            ? product.discountPrice
            : product.price;

        const lineTotal = effectivePrice * item.quantity;
        calculatedSubtotal += lineTotal;

        orderItemsToCreate.push({
          productId: product.id,
          productName: product.name,
          productWeight: product.netWeight,
          unitPrice: effectivePrice,
          quantity: item.quantity,
          itemTotal: lineTotal,
        });

        // Deduct stock safely
        const updatedProduct = await tx.product.update({
          where: { id: product.id },
          data: {
            stock: product.stock - item.quantity,
          },
        });

        // Record inventory audit transaction
        await tx.inventoryTransaction.create({
          data: {
            productId: product.id,
            changeQuantity: -item.quantity,
            previousStock: product.stock,
            newStock: updatedProduct.stock,
            reason: "ORDER",
            notes: `Customer Order checkout`,
          },
        });
      }

      // Calculate Delivery & Final Total
      const calculatedDeliveryFee =
        calculatedSubtotal >= freeThreshold ? 0 : standardFee;
      const calculatedFinalTotal = calculatedSubtotal + calculatedDeliveryFee;

      // Unique Order Number
      const orderNumber = await generateUniqueOrderNumber();

      // Check customer session if logged in
      const customerSession = getCustomerSession();

      // Create Order Record
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: customerSession ? customerSession.id : null,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerWhatsapp: (customerWhatsapp || customerPhone).trim(),
          customerEmail: customerEmail ? customerEmail.trim() : null,
          deliveryAddress: deliveryAddress.trim(),
          city: city.trim(),
          orderNotes: orderNotes ? orderNotes.trim() : null,
          subtotal: calculatedSubtotal,
          deliveryFee: calculatedDeliveryFee,
          finalTotal: calculatedFinalTotal,
          paymentMethod: paymentMethod || "COD",
          paymentStatus: paymentMethod === "BANK_TRANSFER" ? "VERIFYING" : "PENDING",
          orderStatus: "PENDING",
          paymentProofUrl: paymentProofUrl || null,
          items: {
            create: orderItemsToCreate,
          },
          statusHistory: {
            create: {
              status: "PENDING",
              notes: "Order placed successfully by customer",
              changedBy: "Customer",
            },
          },
        },
        include: {
          items: true,
        },
      });

      return newOrder;
    });

    // Send order notification email to administrator / owner
    sendOrderNotificationEmail(result).catch((e) =>
      console.error("Order notification email dispatch error:", e)
    );

    return NextResponse.json({
      success: true,
      order: result,
      orderNumber: result.orderNumber,
    });
  } catch (error: any) {
    console.error("Order processing error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process order" },
      { status: 400 }
    );
  }
}
