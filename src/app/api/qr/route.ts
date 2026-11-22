import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "png"; // "png" | "svg"
    let url = searchParams.get("url");

    if (!url) {
      const settings = await prisma.websiteSettings.findUnique({
        where: { id: "default" },
      });
      url = settings?.qrTargetUrl || "https://shyvon.com";
    }

    // High quality QR Code with luxury black and gold colors
    const qrOptions: any = {
      errorCorrectionLevel: "H",
      margin: 2,
      color: {
        dark: "#D9AD45", // Gold dark
        light: "#080D19", // Midnight black
      },
      width: 512,
    };

    if (format === "svg") {
      const svgString = (await (QRCode as any).toString(url, {
        ...qrOptions,
        type: "svg",
      })) as string;
      return new NextResponse(svgString, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Content-Disposition": 'attachment; filename="shyvon-qr-code.svg"',
        },
      });
    }

    // Default PNG data URL
    const dataUrl = await QRCode.toDataURL(url, qrOptions);
    return NextResponse.json({
      success: true,
      targetUrl: url,
      dataUrl,
    });
  } catch (error: any) {
    console.error("Failed to generate QR code:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}
