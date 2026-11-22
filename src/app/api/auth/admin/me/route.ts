import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
      },
    });

    if (!admin || !admin.isActive) {
      return NextResponse.json({ success: false, error: "Invalid account" }, { status: 401 });
    }

    return NextResponse.json({ success: true, user: admin });
  } catch (error: any) {
    console.error("Admin me error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
