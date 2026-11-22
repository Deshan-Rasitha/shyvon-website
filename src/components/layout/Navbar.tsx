"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Phone,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import GoldButton from "../ui/GoldButton";

export default function Navbar() {
  const pathname = usePathname();
  const { openCart, itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Categories", href: "/categories" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
      setIsSearchOpen(false);
    }
  };

  // Don't render customer navbar inside admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-shyvon-dark via-[#18233C] to-shyvon-dark border-b border-shyvon-gold/20 py-1.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-xs text-shyvon-goldLight/90 tracking-wider">
          <div className="hidden md:flex items-center gap-2 text-shyvon-muted">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-shyvon-gold animate-pulse" />
            <span>Pure • Healthy • Delicious</span>
          </div>
          <div className="mx-auto flex items-center gap-2 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-shyvon-gold animate-pulse" />
            <span>Complimentary Island-wide Delivery on Orders Over Rs. 5,000</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-shyvon-muted">
            <span className="text-[11px] text-shyvon-goldLight/70 font-playfair italic">
              Sri Lankan Botanicals
            </span>
          </div>
        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "bg-shyvon-dark/95 backdrop-blur-md shadow-2xl py-3 border-b border-shyvon-gold/30"
            : "bg-shyvon-dark/80 backdrop-blur-sm py-4 border-b border-shyvon-gold/15"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-shyvon-gold hover:text-white transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 ml-1 text-shyvon-gold hover:text-white transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Brand Logo */}
            <Link href="/" className="flex flex-col items-center group py-0.5">
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-2xl sm:text-3xl font-extrabold tracking-[0.2em] text-gold-gradient drop-shadow group-hover:brightness-110 transition-all">
                  SHYVON
                </span>
              </div>
              <div className="flex items-center gap-1 -mt-0.5">
                <div className="h-[1px] w-3 bg-gradient-to-r from-transparent to-shyvon-gold/60" />
                <span className="text-[9px] uppercase tracking-[0.25em] text-shyvon-goldLight/90 font-medium">
                  Natural Foods
                </span>
                <div className="h-[1px] w-3 bg-gradient-to-l from-transparent to-shyvon-gold/60" />
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`font-cinzel text-sm uppercase tracking-widest transition-all duration-200 relative py-1 ${
                      isActive
                        ? "text-shyvon-goldLight font-bold"
                        : "text-gray-300 hover:text-shyvon-goldLight"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-gradient shadow-gold" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Action Icons (Search, Wishlist, Account, Cart) */}
            <div className="flex items-center space-x-4 sm:space-x-5">
              {/* Search Toggle (Desktop) */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hidden lg:flex items-center text-gray-300 hover:text-shyvon-gold transition-colors p-1"
                aria-label="Search Products"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative text-gray-300 hover:text-shyvon-gold transition-colors p-1"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-shyvon-gold text-shyvon-dark text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-sans shadow">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Customer Account */}
              <Link
                href="/account"
                className="text-gray-300 hover:text-shyvon-gold transition-colors p-1"
                aria-label="Customer Account"
                title="My Account"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Shopping Cart Button */}
              <button
                onClick={openCart}
                className="relative flex items-center gap-2 bg-gradient-to-r from-shyvon-surface to-shyvon-card border border-shyvon-gold/40 hover:border-shyvon-gold px-3.5 py-1.5 rounded-sm transition-all duration-200 group shadow-sm hover:shadow-gold"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 text-shyvon-gold group-hover:scale-110 transition-transform" />
                <span className="text-xs font-cinzel font-semibold text-shyvon-goldLight hidden sm:inline">
                  Cart
                </span>
                <span className="bg-shyvon-gold text-shyvon-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center font-sans ml-0.5">
                  {itemCount}
                </span>
              </button>
            </div>
          </div>

          {/* Expandable Search Bar */}
          {isSearchOpen && (
            <div className="pt-3 pb-2 animate-fadeIn">
              <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto">
                <input
                  type="text"
                  placeholder="Search Organic Dried Blue Lotus Petals, Herbal Teas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-shyvon-surface/90 border border-shyvon-gold/40 rounded-sm py-2 pl-4 pr-10 text-sm text-white placeholder-shyvon-muted/60 focus:outline-none focus:border-shyvon-gold focus:ring-1 focus:ring-shyvon-gold"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-shyvon-gold hover:text-white p-1"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-shyvon-card border-b border-shyvon-gold/30 px-6 py-6 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-cinzel text-base tracking-widest text-gray-200 hover:text-shyvon-goldLight py-1 border-b border-white/5"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
