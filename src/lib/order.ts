import { prisma } from "./prisma";

/**
 * Generates an incrementing unique order number formatted as:
 * SHY-YYYYMMDD-XXXX (e.g. SHY-20261122-0001)
 */
export async function generateUniqueOrderNumber(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const datePrefix = `SHY-${year}${month}${day}`;

  // Count orders created today with this prefix
  const countToday = await prisma.order.count({
    where: {
      orderNumber: {
        startsWith: datePrefix,
      },
    },
  });

  const nextSequence = String(countToday + 1).padStart(4, "0");
  let candidate = `${datePrefix}-${nextSequence}`;

  // Double check collision
  let existing = await prisma.order.findUnique({
    where: { orderNumber: candidate },
  });

  let counter = countToday + 1;
  while (existing) {
    counter += 1;
    candidate = `${datePrefix}-${String(counter).padStart(4, "0")}`;
    existing = await prisma.order.findUnique({
      where: { orderNumber: candidate },
    });
  }

  return candidate;
}

export function formatPrice(amount: number): string {
  return `Rs. ${Number(amount).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
