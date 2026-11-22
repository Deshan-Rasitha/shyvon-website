import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = getCustomerSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Not logged in" }, { status: 401 });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: session.id },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          include: {
            items: true,
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ success: false, error: "Account not found" }, { status: 404 });
    }

    const { passwordHash, ...safeCustomer } = customer;

    return NextResponse.json({ success: true, customer: safeCustomer });
  } catch (error: any) {
    console.error("Customer me error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
