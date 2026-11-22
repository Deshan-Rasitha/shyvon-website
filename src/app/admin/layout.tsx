"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Archive,
  Star,
  QrCode,
  Settings,
  ShieldCheck,
  BarChart3,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setIsLoading(false);
      return;
    }

    fetch("/api/auth/admin/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setAdminUser(data.user);
        } else {
          router.push("/admin/login");
        }
      })
      .catch(() => {
        router.push("/admin/login");
      })
      .finally(() => setIsLoading(false));
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    await fetch("/api/auth/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <div className="min-h-screen bg-shyvon-dark">{children}</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-shyvon-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-shyvon-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const navItems = [
    { name: "Overview", href: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Products", href: "/admin/products", icon: <Package className="w-4 h-4" /> },
    { name: "Categories", href: "/admin/categories", icon: <Layers className="w-4 h-4" /> },
    { name: "Orders", href: "/admin/orders", icon: <ShoppingBag className="w-4 h-4" /> },
    { name: "Customers", href: "/admin/customers", icon: <Users className="w-4 h-4" /> },
    { name: "Inventory", href: "/admin/inventory", icon: <Archive className="w-4 h-4" /> },
    { name: "Reviews", href: "/admin/reviews", icon: <Star className="w-4 h-4" /> },
    { name: "QR Code", href: "/admin/qr", icon: <QrCode className="w-4 h-4" /> },
    { name: "Website Settings", href: "/admin/settings", icon: <Settings className="w-4 h-4" /> },
    { name: "Admin Users", href: "/admin/users", icon: <ShieldCheck className="w-4 h-4" /> },
    { name: "Reports", href: "/admin/reports", icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex flex-col lg:flex-row font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#0A101D] border-b border-shyvon-gold/20 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-cinzel text-lg font-bold text-gold-gradient">SHYVON ADMIN</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-shyvon-gold p-1"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-[#0A101D] border-r border-shyvon-gold/20 flex flex-col justify-between transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Brand Logo & Portal Tag */}
          <div className="p-6 border-b border-shyvon-gold/20">
            <Link href="/" target="_blank" className="block group">
              <span className="font-cinzel text-xl font-extrabold tracking-[0.15em] text-gold-gradient">
                SHYVON
              </span>
              <div className="flex items-center justify-between text-[10px] uppercase text-shyvon-goldLight mt-0.5">
                <span>Management Console</span>
                <ExternalLink className="w-3 h-3 text-shyvon-muted group-hover:text-shyvon-gold transition-colors" />
              </div>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-190px)]">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-all ${
                    isActive
                      ? "bg-shyvon-gold text-shyvon-dark font-bold shadow"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className={isActive ? "text-shyvon-dark" : "text-shyvon-gold"}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout Footer */}
        <div className="p-4 border-t border-shyvon-gold/20 bg-[#080D19]">
          <div className="mb-2">
            <p className="text-xs font-semibold text-white truncate">
              {adminUser?.name || "Admin"}
            </p>
            <p className="text-[10px] text-shyvon-muted truncate">{adminUser?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin View Container */}
      <main className="flex-1 min-h-screen overflow-x-hidden p-4 sm:p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
}
