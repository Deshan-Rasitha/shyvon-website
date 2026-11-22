"use client";

import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface GoldButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
}

export default function GoldButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
  type = "button",
  icon,
}: GoldButtonProps) {
  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs font-semibold tracking-wider",
    md: "px-6 py-2.5 text-sm font-semibold tracking-wider",
    lg: "px-8 py-3.5 text-base font-semibold tracking-widest",
  };

  const variantClasses = {
    primary:
      "bg-gold-gradient text-shyvon-dark shadow-gold hover:shadow-gold-lg hover:brightness-110 active:scale-95 border border-yellow-200/40",
    outline:
      "bg-transparent text-shyvon-goldLight border border-shyvon-gold/60 hover:bg-shyvon-gold/15 hover:border-shyvon-goldLight active:scale-95",
    ghost:
      "bg-transparent text-shyvon-goldLight hover:bg-white/5 hover:text-white",
  };

  const baseClasses =
    "relative inline-flex items-center justify-center rounded-sm uppercase transition-all duration-300 font-cinzel select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer overflow-hidden group";

  const content = (
    <>
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />
      ) : icon ? (
        <span className="mr-2 transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>
      ) : null}
      <span className="relative z-10">{children}</span>
      {/* Subtle luxury shimmer overlay */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {content}
    </button>
  );
}
