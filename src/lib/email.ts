import nodemailer from "nodemailer";
import { prisma } from "./prisma";
import { formatPrice } from "./order";

export interface OrderNotificationData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerWhatsapp: string;
  customerEmail?: string | null;
  deliveryAddress: string;
  city: string;
  orderNotes?: string | null;
  subtotal: number;
  deliveryFee: number;
  finalTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentProofUrl?: string | null;
  createdAt: Date | string;
  items: {
    productName: string;
    productWeight: string;
    unitPrice: number;
    quantity: number;
    itemTotal: number;
  }[];
}

/**
 * Sends a rich, luxury HTML order notification email to the administrator / owner.
 */
export async function sendOrderNotificationEmail(order: OrderNotificationData): Promise<boolean> {
  try {
    // 1. Determine recipient email from Website Settings or ENV
    const settings = await prisma.websiteSettings.findUnique({
      where: { id: "default" },
    });

    const recipientEmail =
      process.env.ADMIN_NOTIFICATION_EMAIL ||
      settings?.businessEmail ||
      "admin@shyvon.com";

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "465");

    // Formatted items rows
    const itemsHtml = order.items
      .map(
        (item) => `
        <tr style="border-bottom: 1px solid rgba(217, 173, 69, 0.2);">
          <td style="padding: 12px 8px; color: #FFFFFF; font-weight: 500;">
            ${item.productName}
            <div style="font-size: 11px; color: #B9B9B9; margin-top: 2px;">Net Weight: ${item.productWeight}</div>
          </td>
          <td style="padding: 12px 8px; text-align: center; color: #D9AD45; font-family: monospace; font-size: 13px;">
            ${item.quantity}
          </td>
          <td style="padding: 12px 8px; text-align: right; color: #E5BE58; font-family: monospace;">
            ${formatPrice(item.unitPrice)}
          </td>
          <td style="padding: 12px 8px; text-align: right; color: #FFFFFF; font-weight: bold; font-family: monospace;">
            ${formatPrice(item.itemTotal)}
          </td>
        </tr>
      `
      )
      .join("");

    const customerWhatsAppDigits = (order.customerWhatsapp || order.customerPhone).replace(/[^0-9]/g, "");
    const customerWhatsAppLink = `https://wa.me/${customerWhatsAppDigits}?text=Hello%20${encodeURIComponent(order.customerName)}%2C%20regarding%20your%20SHYVON%20Order%20${order.orderNumber}`;
    const adminPortalLink = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/orders`;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>SHYVON - New Customer Order</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #080D19; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #E0E0E0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #080D19; padding: 30px 15px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #101827; border: 1px solid #D9AD45; border-radius: 6px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
              
              <!-- Brand Header -->
              <tr>
                <td align="center" style="padding: 30px 20px; background: linear-gradient(180deg, #141E33 0%, #101827 100%); border-bottom: 1px solid rgba(217, 173, 69, 0.3);">
                  <div style="font-size: 26px; font-weight: bold; letter-spacing: 5px; color: #D9AD45; font-family: Georgia, serif;">SHYVON</div>
                  <div style="font-size: 10px; letter-spacing: 3px; color: #F6D989; text-transform: uppercase; margin-top: 4px;">Natural Foods</div>
                  <div style="font-size: 11px; font-style: italic; color: #B9B9B9; margin-top: 6px;">Pure • Healthy • Delicious</div>
                  <div style="margin-top: 15px; display: inline-block; padding: 4px 14px; background: rgba(217, 173, 69, 0.15); border: 1px solid #D9AD45; border-radius: 20px; color: #F6D989; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">
                    🔔 New Customer Order Received
                  </div>
                </td>
              </tr>

              <!-- Order Summary Card -->
              <tr>
                <td style="padding: 25px 30px 10px 30px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <div style="font-size: 11px; color: #B9B9B9; text-transform: uppercase; letter-spacing: 1px;">Order Number</div>
                        <div style="font-size: 18px; font-weight: bold; color: #F6D989; font-family: monospace;">${order.orderNumber}</div>
                      </td>
                      <td align="right">
                        <div style="font-size: 11px; color: #B9B9B9; text-transform: uppercase; letter-spacing: 1px;">Order Date</div>
                        <div style="font-size: 13px; color: #FFFFFF;">${new Date(order.createdAt).toLocaleString("en-LK")}</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Customer Information -->
              <tr>
                <td style="padding: 15px 30px;">
                  <div style="background-color: #080D19; border: 1px solid rgba(217, 173, 69, 0.2); border-radius: 4px; padding: 18px;">
                    <div style="font-size: 12px; font-weight: bold; color: #D9AD45; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; font-family: Georgia, serif; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 6px;">
                      Customer & Delivery Details
                    </div>
                    <table width="100%" cellpadding="4" cellspacing="0" style="font-size: 12px; color: #E0E0E0;">
                      <tr>
                        <td width="35%" style="color: #B9B9B9;">Customer Name:</td>
                        <td style="color: #FFFFFF; font-weight: 600;">${order.customerName}</td>
                      </tr>
                      <tr>
                        <td style="color: #B9B9B9;">Phone Number:</td>
                        <td><a href="tel:${order.customerPhone}" style="color: #F6D989; text-decoration: none;">${order.customerPhone}</a></td>
                      </tr>
                      <tr>
                        <td style="color: #B9B9B9;">WhatsApp:</td>
                        <td><a href="${customerWhatsAppLink}" style="color: #25D366; text-decoration: none; font-weight: 600;">${order.customerWhatsapp || order.customerPhone} (Click to Chat)</a></td>
                      </tr>
                      ${order.customerEmail ? `
                      <tr>
                        <td style="color: #B9B9B9;">Email Address:</td>
                        <td><a href="mailto:${order.customerEmail}" style="color: #9EC5FE; text-decoration: none;">${order.customerEmail}</a></td>
                      </tr>` : ""}
                      <tr>
                        <td style="color: #B9B9B9;">Delivery Address:</td>
                        <td style="color: #FFFFFF;">${order.deliveryAddress}</td>
                      </tr>
                      <tr>
                        <td style="color: #B9B9B9;">City:</td>
                        <td style="color: #FFFFFF; font-weight: 500;">${order.city}</td>
                      </tr>
                      ${order.orderNotes ? `
                      <tr>
                        <td style="color: #B9B9B9;">Customer Notes:</td>
                        <td style="color: #F6D989; font-style: italic;">${order.orderNotes}</td>
                      </tr>` : ""}
                    </table>
                  </div>
                </td>
              </tr>

              <!-- Items Table -->
              <tr>
                <td style="padding: 10px 30px;">
                  <div style="font-size: 12px; font-weight: bold; color: #D9AD45; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; font-family: Georgia, serif;">
                    Ordered Botanicals
                  </div>
                  <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 12px; text-align: left; border-collapse: collapse;">
                    <thead>
                      <tr style="border-bottom: 1px solid #D9AD45; color: #D9AD45;">
                        <th style="padding: 8px; font-weight: 600;">Item</th>
                        <th style="padding: 8px; text-align: center; font-weight: 600;">Qty</th>
                        <th style="padding: 8px; text-align: right; font-weight: 600;">Price</th>
                        <th style="padding: 8px; text-align: right; font-weight: 600;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                    </tbody>
                  </table>
                </td>
              </tr>

              <!-- Financial Breakdown -->
              <tr>
                <td style="padding: 15px 30px;">
                  <table width="100%" cellpadding="5" cellspacing="0" style="font-size: 12px;">
                    <tr>
                      <td style="color: #B9B9B9;">Subtotal:</td>
                      <td align="right" style="color: #FFFFFF; font-family: monospace;">${formatPrice(order.subtotal)}</td>
                    </tr>
                    <tr>
                      <td style="color: #B9B9B9;">Delivery Fee:</td>
                      <td align="right" style="color: #FFFFFF; font-family: monospace;">
                        ${order.deliveryFee === 0 ? '<span style="color: #4ADE80; font-weight: bold;">FREE</span>' : formatPrice(order.deliveryFee)}
                      </td>
                    </tr>
                    <tr style="border-top: 1px solid rgba(217, 173, 69, 0.4);">
                      <td style="font-size: 14px; font-weight: bold; color: #F6D989; padding-top: 10px;">FINAL TOTAL:</td>
                      <td align="right" style="font-size: 16px; font-weight: bold; color: #F6D989; font-family: monospace; padding-top: 10px;">
                        ${formatPrice(order.finalTotal)}
                      </td>
                    </tr>
                    <tr>
                      <td style="color: #B9B9B9;">Payment Method:</td>
                      <td align="right" style="color: #FFFFFF; font-weight: 600;">
                        ${order.paymentMethod === "COD" ? "Cash on Delivery (COD)" : "Direct Bank Transfer"}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Action Buttons -->
              <tr>
                <td align="center" style="padding: 20px 30px 30px 30px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-right: 10px;">
                        <a href="${adminPortalLink}" target="_blank" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #F6D989 0%, #D9AD45 100%); color: #080D19; text-decoration: none; font-size: 12px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; border-radius: 4px;">
                          Open in Admin Portal
                        </a>
                      </td>
                      <td style="padding-left: 10px;">
                        <a href="${customerWhatsAppLink}" target="_blank" style="display: inline-block; padding: 12px 24px; background-color: #25D366; color: #FFFFFF; text-decoration: none; font-size: 12px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; border-radius: 4px;">
                          Chat with Customer
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="padding: 20px; background-color: #080D19; border-top: 1px solid rgba(217, 173, 69, 0.2); font-size: 11px; color: #7E8B9B;">
                  <div>SHYVON Natural Foods • Shylie Global Pvt Ltd. Gampaha, Sri Lanka</div>
                  <div style="margin-top: 4px;">Direct Hotline: +94 71 477 0176 | WhatsApp: +94 71 477 0176</div>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    // 2. If SMTP is configured, send the live email via Nodemailer
    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for 587
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"SHYVON Orders" <${smtpUser}>`,
        to: recipientEmail,
        subject: `🔔 New Order Received: ${order.orderNumber} - ${formatPrice(order.finalTotal)} (${order.customerName})`,
        html: htmlContent,
      });

      console.log(`✓ Order notification email successfully dispatched to ${recipientEmail}`);
      return true;
    } else {
      // If SMTP credentials not provided yet, log notification preview
      console.log(`[Order Email Notification Prepared]`);
      console.log(`To: ${recipientEmail}`);
      console.log(`Order: ${order.orderNumber} - ${order.customerName} - ${formatPrice(order.finalTotal)}`);
      console.log(`Notice: Configure SMTP_USER and SMTP_PASS in .env to dispatch live Gmail alerts.`);
      return false;
    }
  } catch (error) {
    console.error("Failed to send order notification email:", error);
    return false;
  }
}
