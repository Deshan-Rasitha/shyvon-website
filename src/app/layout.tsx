import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import CustomerWelcomeModal from "@/components/auth/CustomerWelcomeModal";

export const metadata: Metadata = {
  title: "SHYVON — Pure • Healthy • Delicious | Premium Sri Lankan Organic Natural Foods",
  description:
    "Discover the pure goodness of nature with SHYVON. Handcrafted Sri Lankan organic herbal products, dried blue lotus petals, and wellness infusions naturally crafted for your well-being.",
  keywords: [
    "SHYVON",
    "Organic Dried Blue Lotus Petals",
    "Sri Lankan Herbal Tea",
    "Natural Foods",
    "Ayurvedic Wellness",
    "Organic Petals",
    "Blue Lotus",
    "Shylie Global",
  ],
  authors: [{ name: "SHYVON Natural Foods" }],
  openGraph: {
    title: "SHYVON — Pure • Healthy • Delicious",
    description: "Premium Sri Lankan Organic Herbal Products and Natural Foods.",
    url: "https://shyvon.com",
    siteName: "SHYVON",
    images: [
      {
        url: "/images/branding/packaging-reference.jpg",
        width: 1200,
        height: 800,
        alt: "SHYVON Organic Dried Blue Lotus Petals",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-shyvon-dark text-white flex flex-col antialiased selection:bg-shyvon-gold/30 selection:text-shyvon-goldLight">
        <CartProvider>
          <WishlistProvider>
            <Navbar />
            <CartDrawer />
            <CustomerWelcomeModal />
            <main className="flex-1">{children}</main>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
