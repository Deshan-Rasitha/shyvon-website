"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Shield,
  Truck,
  Leaf,
  Award,
} from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#050811] text-gray-300 border-t border-shyvon-gold/25 relative overflow-hidden">
      {/* Botanical Brand Values Banner */}
      <div className="border-b border-shyvon-gold/15 py-8 bg-shyvon-dark/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center p-3">
              <Leaf className="w-7 h-7 text-shyvon-gold mb-2" />
              <h4 className="font-cinzel text-sm text-shyvon-goldLight font-bold">100% Organic</h4>
              <p className="text-xs text-shyvon-muted mt-0.5">Authentic Sri Lankan Botanicals</p>
            </div>
            <div className="flex flex-col items-center p-3">
              <Award className="w-7 h-7 text-shyvon-gold mb-2" />
              <h4 className="font-cinzel text-sm text-shyvon-goldLight font-bold">Premium Quality</h4>
              <p className="text-xs text-shyvon-muted mt-0.5">Carefully Packed & Sealed</p>
            </div>
            <div className="flex flex-col items-center p-3">
              <Truck className="w-7 h-7 text-shyvon-gold mb-2" />
              <h4 className="font-cinzel text-sm text-shyvon-goldLight font-bold">Island-wide Delivery</h4>
              <p className="text-xs text-shyvon-muted mt-0.5">Fast & Reliable Doorstep Shipping</p>
            </div>
            <div className="flex flex-col items-center p-3">
              <Shield className="w-7 h-7 text-shyvon-gold mb-2" />
              <h4 className="font-cinzel text-sm text-shyvon-goldLight font-bold">Safe & Authentic</h4>
              <p className="text-xs text-shyvon-muted mt-0.5">Pure by Nature, For You</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-cinzel text-3xl font-extrabold tracking-[0.2em] text-gold-gradient">
                SHYVON
              </span>
              <p className="text-[10px] tracking-[0.3em] uppercase text-shyvon-goldLight">
                Natural Foods
              </p>
            </Link>
            <p className="text-xs text-shyvon-muted leading-relaxed">
              SHYVON brings you the goodness of nature with pure and authentic Sri Lankan herbs.
              Pure by Nature, for a Healthier You.
            </p>
            <p className="text-xs italic text-shyvon-goldLight font-playfair">
              Pure • Healthy • Delicious
            </p>
            <div className="pt-1">
              <span className="text-[11px] text-shyvon-muted uppercase tracking-wider block mb-1">
                Manufactured & Packed by:
              </span>
              <span className="text-xs text-gray-200 font-semibold block">
                Shylie Global Pvt Ltd.
              </span>
              <span className="text-xs text-shyvon-muted block">Gampaha, Sri Lanka.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-cinzel text-sm uppercase tracking-widest text-shyvon-goldLight font-bold border-b border-shyvon-gold/20 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-shyvon-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-shyvon-gold transition-colors">
                  Shop Collection
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-shyvon-gold transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-shyvon-gold transition-colors">
                  About SHYVON
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-shyvon-gold transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-shyvon-gold transition-colors">
                  My Account & Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="space-y-3">
            <h3 className="font-cinzel text-sm uppercase tracking-widest text-shyvon-goldLight font-bold border-b border-shyvon-gold/20 pb-2">
              Collections
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/shop?category=herbal-teas"
                  className="hover:text-shyvon-gold transition-colors"
                >
                  Herbal Teas & Infusions
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=dried-flowers"
                  className="hover:text-shyvon-gold transition-colors"
                >
                  Dried Petals & Flowers
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=wellness"
                  className="hover:text-shyvon-gold transition-colors"
                >
                  Wellness & Relaxation
                </Link>
              </li>
              <li>
                <Link
                  href="/products/organic-dried-blue-lotus-petals-50g"
                  className="text-shyvon-goldLight hover:underline transition-all"
                >
                  Blue Lotus Petals (50g)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & WhatsApp */}
          <div className="space-y-3">
            <h3 className="font-cinzel text-sm uppercase tracking-widest text-shyvon-goldLight font-bold border-b border-shyvon-gold/20 pb-2">
              Contact & Order
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2.5 text-gray-300">
                <MapPin className="w-4 h-4 text-shyvon-gold shrink-0 mt-0.5" />
                <span>Shylie Global Pvt Ltd, Gampaha, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2.5 text-gray-300">
                <Phone className="w-4 h-4 text-shyvon-gold shrink-0" />
                <span>+94 71 477 0176</span>
              </li>
              <li className="flex items-center gap-2.5 text-gray-300">
                <Mail className="w-4 h-4 text-shyvon-gold shrink-0" />
                <span>info@shyvon.com</span>
              </li>
              <li className="pt-2">
                <a
                  href="https://wa.me/94714770176?text=Hello%20SHYVON%2C%20I%20would%20like%20to%20inquire%20about%20your%20organic%20herbal%20products."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-sm bg-[#128C7E] hover:bg-[#075E54] text-white font-medium text-xs transition-colors shadow"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order via WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Policies */}
        <div className="mt-12 pt-8 border-t border-shyvon-gold/15 flex flex-col md:flex-row items-center justify-between text-[11px] text-shyvon-muted gap-4">
          <p>© {new Date().getFullYear()} SHYVON Natural Foods. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 text-center">
            <Link href="/privacy-policy" className="hover:text-shyvon-gold transition-colors">
              Privacy Policy
            </Link>
            <span className="text-shyvon-gold/30">•</span>
            <Link href="/terms-and-conditions" className="hover:text-shyvon-gold transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-shyvon-gold/30">•</span>
            <Link href="/return-policy" className="hover:text-shyvon-gold transition-colors">
              Return Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
