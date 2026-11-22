"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { QrCode, Download, ExternalLink, Printer, Sparkles, RefreshCw } from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";

export default function AdminQrPage() {
  const [targetUrl, setTargetUrl] = useState("https://shyvon.com");
  const [qrPngUrl, setQrPngUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateQr = (urlToEncode: string) => {
    setLoading(true);
    fetch(`/api/qr?url=${encodeURIComponent(urlToEncode)}&format=png`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.dataUrl) {
          setQrPngUrl(data.dataUrl);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Fetch default configured URL from settings
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.qrTargetUrl) {
          setTargetUrl(data.settings.qrTargetUrl);
          generateQr(data.settings.qrTargetUrl);
        } else {
          generateQr("https://shyvon.com");
        }
      })
      .catch(() => generateQr("https://shyvon.com"));
  }, []);

  const handleRegenerate = (e: React.FormEvent) => {
    e.preventDefault();
    generateQr(targetUrl);
  };

  const handleDownloadPng = () => {
    if (!qrPngUrl) return;
    const link = document.createElement("a");
    link.href = qrPngUrl;
    link.download = "SHYVON-Official-QR-Code.png";
    link.click();
  };

  const handleDownloadSvg = () => {
    const url = `/api/qr?url=${encodeURIComponent(targetUrl)}&format=svg`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-shyvon-gold/20 pb-4">
        <span className="text-xs uppercase font-cinzel text-shyvon-gold tracking-widest">
          Brand Packaging & Marketing
        </span>
        <h1 className="font-cinzel text-2xl font-extrabold text-white">
          QR Code <span className="text-gold-gradient">Management</span>
        </h1>
        <p className="text-xs text-shyvon-muted mt-0.5">
          Generate premium black and gold QR codes for product boxes, tea tins, and flyers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Visual QR Card */}
        <div className="md:col-span-5 bg-[#0A101D] border border-shyvon-gold/30 rounded p-6 flex flex-col items-center text-center space-y-4 shadow-2xl">
          <div className="relative w-64 h-64 bg-[#080D19] rounded border border-shyvon-gold/40 p-4 flex items-center justify-center shadow-gold">
            {loading ? (
              <RefreshCw className="w-8 h-8 text-shyvon-gold animate-spin" />
            ) : qrPngUrl ? (
              <Image
                src={qrPngUrl}
                alt="SHYVON QR Code"
                width={240}
                height={240}
                className="rounded"
              />
            ) : null}
          </div>

          <div>
            <span className="font-cinzel text-xs uppercase tracking-widest text-shyvon-gold font-bold block">
              SHYVON Natural Foods
            </span>
            <p className="text-[11px] text-shyvon-muted truncate max-w-xs mt-0.5">{targetUrl}</p>
          </div>

          <div className="flex gap-2 w-full pt-2">
            <button
              onClick={handleDownloadPng}
              className="flex-1 py-2 px-3 rounded bg-gold-gradient text-shyvon-dark font-cinzel font-bold text-xs uppercase tracking-wider shadow hover:brightness-110 flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PNG</span>
            </button>
            <button
              onClick={handleDownloadSvg}
              className="flex-1 py-2 px-3 rounded bg-shyvon-surface border border-shyvon-gold/40 text-shyvon-goldLight font-cinzel font-semibold text-xs uppercase tracking-wider hover:bg-white/5 flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>SVG</span>
            </button>
          </div>
        </div>

        {/* Configuration Details */}
        <div className="md:col-span-7 bg-[#0A101D] border border-shyvon-gold/25 rounded p-6 space-y-6 shadow-xl text-xs">
          <h3 className="font-cinzel text-sm font-bold text-shyvon-goldLight uppercase tracking-wider border-b border-white/10 pb-2">
            Target Website URL
          </h3>

          <form onSubmit={handleRegenerate} className="space-y-4">
            <div>
              <label className="block text-shyvon-muted mb-1 font-medium">
                Destination URL for Customers:
              </label>
              <input
                type="url"
                required
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://shyvon.com"
                className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white font-mono focus:outline-none focus:border-shyvon-gold"
              />
            </div>

            <GoldButton type="submit" size="sm" loading={loading} icon={<RefreshCw className="w-3.5 h-3.5" />}>
              Regenerate QR Code
            </GoldButton>
          </form>

          {/* Project Requirement Note */}
          <div className="p-4 bg-shyvon-surface/70 border border-shyvon-gold/20 rounded space-y-2 text-shyvon-muted">
            <span className="font-cinzel font-bold text-white block">
              Local Development & Production Notice:
            </span>
            <p className="leading-relaxed">
              For local testing on Windows, this QR code points to your configured public website
              domain placeholder (e.g. <code className="text-yellow-300">https://shyvon.com</code>).
            </p>
            <p className="leading-relaxed">
              Once you arrange hosting and configure your real domain, simply update the website
              URL here or in <strong>Website Settings</strong> to instantly generate your print-ready
              packaging QR code!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
