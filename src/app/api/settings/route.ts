import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    let settings = await prisma.websiteSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.websiteSettings.create({
        data: {
          id: "default",
          brandName: "SHYVON",
          brandTagline: "Pure • Healthy • Delicious",
          brandDescription:
            "SHYVON brings you the goodness of nature with pure and authentic Sri Lankan herbs. Pure by Nature, for a Healthier You.",
          contactPhone: "+94 77 123 4567",
          whatsappNumber: "+94 77 123 4567",
          businessEmail: "info@shyvon.com",
          businessAddress: "Shylie Global Pvt Ltd, Gampaha, Sri Lanka",
        },
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const settings = await prisma.websiteSettings.upsert({
      where: { id: "default" },
      update: {
        brandName: body.brandName,
        brandTagline: body.brandTagline,
        brandDescription: body.brandDescription,
        logoUrl: body.logoUrl,
        contactPhone: body.contactPhone,
        whatsappNumber: body.whatsappNumber,
        businessEmail: body.businessEmail,
        businessAddress: body.businessAddress,
        bankName: body.bankName,
        bankAccountName: body.bankAccountName,
        bankAccountNumber: body.bankAccountNumber,
        bankBranch: body.bankBranch,
        bankInstructions: body.bankInstructions,
        isBankTransferEnabled: body.isBankTransferEnabled,
        isCodEnabled: body.isCodEnabled,
        deliveryFeeStandard: parseFloat(body.deliveryFeeStandard) || 0,
        deliveryFeeFreeThreshold: parseFloat(body.deliveryFeeFreeThreshold) || 0,
        announcementText: body.announcementText,
        announcementActive: body.announcementActive,
        facebookUrl: body.facebookUrl,
        instagramUrl: body.instagramUrl,
        youtubeUrl: body.youtubeUrl,
        qrTargetUrl: body.qrTargetUrl,
      },
      create: {
        id: "default",
        ...body,
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error("Failed to update settings:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
