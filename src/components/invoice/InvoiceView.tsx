"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Printer, Download, MessageCircle, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { OrderDetail } from "@/lib/types";
import { formatPrice } from "@/lib/order";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";
import GoldButton from "../ui/GoldButton";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function InvoiceView({
  order,
  showActions = true,
}: {
  order: OrderDetail;
  showActions?: boolean;
}) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!invoiceRef.current) return;
    try {
      setIsGeneratingPdf(true);
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#080D19",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`SHYVON-Invoice-${order.orderNumber}.pdf`);
    } catch (e) {
      console.error("PDF generation failed:", e);
      alert("Failed to generate PDF. You can also use the 'Print' button to Save as PDF.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const whatsappUrl = buildWhatsAppOrderUrl({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerAddress: `${order.deliveryAddress}, ${order.city}`,
    items: order.items.map((i) => ({
      productName: i.productName,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    })),
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    finalTotal: order.finalTotal,
    paymentMethod: order.paymentMethod,
    targetPhone: "94714770176",
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Action Bar */}
      {showActions && (
        <div className="no-print flex flex-wrap items-center justify-between gap-3 p-4 bg-shyvon-card border border-shyvon-gold/30 rounded-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="text-sm font-semibold text-gray-200">
              Order Confirmed: <strong className="text-shyvon-goldLight">{order.orderNumber}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-cinzel font-semibold bg-shyvon-surface hover:bg-shyvon-gold/20 text-shyvon-goldLight border border-shyvon-gold/40 rounded transition-all disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Download PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-cinzel font-semibold bg-shyvon-surface hover:bg-white/10 text-gray-200 border border-white/20 rounded transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#128C7E] hover:bg-[#075E54] text-white rounded transition-all shadow"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Send via WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* Printable Luxury Invoice Sheet */}
      <div
        ref={invoiceRef}
        className="invoice-container bg-[#080D19] border border-shyvon-gold/40 rounded p-8 sm:p-12 text-white relative shadow-2xl overflow-hidden"
      >
        {/* Subtle Luxury Watermark Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <span className="font-cinzel text-9xl font-black text-shyvon-gold">SHYVON</span>
        </div>

        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b border-shyvon-gold/30 gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-3xl font-extrabold tracking-[0.2em] text-gold-gradient">
                SHYVON
              </span>
            </div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-shyvon-goldLight mt-0.5">
              Natural Foods
            </p>
            <p className="text-xs text-shyvon-muted italic font-playfair mt-1">
              Pure • Healthy • Delicious
            </p>
            <div className="mt-3 text-xs text-shyvon-muted space-y-0.5">
              <p>Shylie Global Pvt Ltd.</p>
              <p>Gampaha, Sri Lanka</p>
              <p>Hotline: +94 71 477 0176 | info@shyvon.com</p>
            </div>
          </div>

          <div className="text-left sm:text-right space-y-1.5">
            <span className="inline-block px-3 py-1 bg-shyvon-gold/20 text-shyvon-gold text-xs font-cinzel font-bold tracking-widest uppercase rounded border border-shyvon-gold/40">
              Tax Invoice
            </span>
            <h3 className="font-cinzel text-lg font-bold text-gray-100">
              {order.orderNumber}
            </h3>
            <p className="text-xs text-shyvon-muted">
              Date: {new Date(order.createdAt).toLocaleDateString("en-LK", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <div className="pt-1">
              <span className="text-[11px] text-shyvon-muted uppercase tracking-wider block">
                Order Status
              </span>
              <span className="text-xs font-bold font-mono uppercase text-shyvon-goldLight">
                {order.orderStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Customer & Billing Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-shyvon-gold/20 text-xs">
          <div className="space-y-1.5">
            <h4 className="font-cinzel font-bold uppercase tracking-wider text-shyvon-goldLight text-xs">
              Billed To
            </h4>
            <p className="font-semibold text-gray-100 text-sm">{order.customerName}</p>
            <p className="text-gray-300">Phone: {order.customerPhone}</p>
            {order.customerWhatsapp && (
              <p className="text-gray-300">WhatsApp: {order.customerWhatsapp}</p>
            )}
            {order.customerEmail && (
              <p className="text-gray-300">Email: {order.customerEmail}</p>
            )}
          </div>

          <div className="space-y-1.5 sm:text-right">
            <h4 className="font-cinzel font-bold uppercase tracking-wider text-shyvon-goldLight text-xs">
              Delivery Address
            </h4>
            <p className="text-gray-200">{order.deliveryAddress}</p>
            <p className="text-gray-200">{order.city}, Sri Lanka</p>
            <p className="text-shyvon-muted mt-2">
              Payment Method:{" "}
              <strong className="text-gray-100 font-sans">
                {order.paymentMethod === "COD" ? "Cash on Delivery" : "Bank Transfer"}
              </strong>
            </p>
            <p className="text-shyvon-muted">
              Payment Status:{" "}
              <strong className="text-shyvon-goldLight font-mono">
                {order.paymentStatus}
              </strong>
            </p>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="py-8 border-b border-shyvon-gold/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-shyvon-gold/30 text-shyvon-goldLight font-cinzel font-bold tracking-wider">
                  <th className="pb-3 text-left">Item Description</th>
                  <th className="pb-3 text-center">Weight</th>
                  <th className="pb-3 text-right">Unit Price</th>
                  <th className="pb-3 text-center">Qty</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {order.items.map((item) => (
                  <tr key={item.id} className="text-gray-200">
                    <td className="py-3.5 pr-2 font-medium">{item.productName}</td>
                    <td className="py-3.5 px-2 text-center text-shyvon-muted">
                      {item.productWeight}
                    </td>
                    <td className="py-3.5 px-2 text-right">{formatPrice(item.unitPrice)}</td>
                    <td className="py-3.5 px-2 text-center font-mono font-bold">
                      {item.quantity}
                    </td>
                    <td className="py-3.5 pl-2 text-right font-bold text-gray-100">
                      {formatPrice(item.itemTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-xs space-y-2 text-xs">
              <div className="flex justify-between text-shyvon-muted">
                <span>Subtotal</span>
                <span className="text-gray-200 font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-shyvon-muted">
                <span>Delivery Fee</span>
                <span className="text-gray-200 font-medium">
                  {order.deliveryFee === 0 ? "FREE" : formatPrice(order.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-cinzel font-bold text-shyvon-goldLight pt-2 border-t border-shyvon-gold/40">
                <span>Total Amount</span>
                <span className="text-gold-gradient">{formatPrice(order.finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Footer & Bank Transfer note */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-shyvon-muted gap-4">
          <div className="space-y-1 max-w-md">
            <p className="font-semibold text-gray-300">Thank you for choosing SHYVON!</p>
            <p className="text-[11px] leading-relaxed">
              For any questions regarding this invoice, please reach out via WhatsApp at +94 71 477
              0176 or email info@shyvon.com with your Order Number {order.orderNumber}.
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-shyvon-gold">
              Authentic Sri Lankan Botanicals
            </p>
            <p className="text-[11px] font-playfair italic text-gray-400">Pure by Nature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
