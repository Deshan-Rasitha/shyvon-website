import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import InvoiceView from "@/components/invoice/InvoiceView";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";

export const revalidate = 0;

interface OrderConfirmationPageProps {
  params: { orderNumber: string };
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-shyvon-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-950/60 border border-green-500/50 text-green-400 mb-2">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h1 className="font-cinzel text-3xl font-extrabold text-white">
            Order <span className="text-gold-gradient">Successfully Placed!</span>
          </h1>
          <p className="text-sm text-shyvon-muted max-w-md mx-auto">
            Thank you for shopping with SHYVON. Your order has been registered in our system and is
            being processed.
          </p>
        </div>

        {/* Invoice Component with PDF Download & Print & WhatsApp */}
        <InvoiceView order={order as any} showActions={true} />

        {/* Bottom Actions */}
        <div className="flex justify-center gap-4 pt-6">
          <GoldButton href="/shop" variant="outline" size="md">
            Continue Shopping
          </GoldButton>
          <GoldButton href="/" size="md">
            Return to Homepage
          </GoldButton>
        </div>
      </div>
    </div>
  );
}
