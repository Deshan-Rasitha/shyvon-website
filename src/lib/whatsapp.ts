import { formatPrice } from "./order";

export interface WhatsAppOrderDetails {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  finalTotal: number;
  paymentMethod: string;
  targetPhone?: string;
}

/**
 * Generates the WhatsApp Click-to-Chat URL according to exact project requirements:
 *
 * SHYVON – NEW CUSTOMER ORDER
 * Order Number: [ORDER NUMBER]
 * Customer Name: [CUSTOMER NAME]
 * Phone: [PHONE]
 * Delivery Address: [ADDRESS]
 *
 * ORDER ITEMS:
 * [PRODUCT NAME] × [QUANTITY] – [PRICE]
 *
 * Subtotal: [SUBTOTAL]
 * Delivery Fee: [DELIVERY]
 * TOTAL: [FINAL TOTAL]
 *
 * Payment Method: [PAYMENT METHOD]
 *
 * Thank you for shopping with SHYVON!
 */
export function buildWhatsAppOrderUrl(details: WhatsAppOrderDetails): string {
  const itemsText = details.items
    .map(
      (item) =>
        `${item.productName} × ${item.quantity} – ${formatPrice(
          item.unitPrice * item.quantity
        )}`
    )
    .join("\n");

  const message = `SHYVON – NEW CUSTOMER ORDER

Order Number: ${details.orderNumber}

Customer Name: ${details.customerName}

Phone: ${details.customerPhone}

Delivery Address: ${details.customerAddress}

ORDER ITEMS:
${itemsText}

Subtotal: ${formatPrice(details.subtotal)}

Delivery Fee: ${formatPrice(details.deliveryFee)}

TOTAL: ${formatPrice(details.finalTotal)}

Payment Method: ${details.paymentMethod === "COD" ? "Cash on Delivery" : "Bank Transfer"}

Thank you for shopping with SHYVON!`;

  // Clean phone number (remove spaces, plus, dashes)
  const defaultPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94714770176";
  const phone = (details.targetPhone || defaultPhone).replace(/[^0-9]/g, "");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
