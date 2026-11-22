import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession, getCustomerSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const adminMode = searchParams.get("admin") === "true";

    const where: any = {};
    if (productId) {
      where.productId = productId;
    }

    if (!adminMode) {
      where.isApproved = true;
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { name: true, slug: true } },
      },
    });

    return NextResponse.json({ success: true, reviews });
  } catch (error: any) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, rating, title, comment, customerName, customerEmail } = body;

    if (!productId || !rating || !title || !comment || !customerName) {
      return NextResponse.json(
        { success: false, error: "Please fill in all review fields." },
        { status: 400 }
      );
    }

    const customer = getCustomerSession();

    const review = await prisma.review.create({
      data: {
        productId,
        customerId: customer ? customer.id : null,
        customerName: customerName.trim(),
        customerEmail: customerEmail ? customerEmail.trim() : null,
        rating: Math.min(5, Math.max(1, parseInt(rating) || 5)),
        title: title.trim(),
        comment: comment.trim(),
        isApproved: false, // Requires admin moderation
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your review has been submitted for approval. Thank you!",
      review,
    });
  } catch (error: any) {
    console.error("Failed to submit review:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit review" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, isApproved } = await req.json();

    const review = await prisma.review.update({
      where: { id },
      data: { isApproved },
    });

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    console.error("Failed to moderate review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to moderate review" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });
    }

    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Review deleted" });
  } catch (error: any) {
    console.error("Failed to delete review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
