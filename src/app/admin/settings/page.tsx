"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, CheckCircle2, Building, Truck, Bell, Globe } from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Settings state
  const [brandName, setBrandName] = useState("SHYVON");
  const [brandTagline, setBrandTagline] = useState("Pure • Healthy • Delicious");
  const [brandDescription, setBrandDescription] = useState("");
  const [contactPhone, setContactPhone] = useState("+94 77 123 4567");
  const [whatsappNumber, setWhatsappNumber] = useState("+94 77 123 4567");
  const [businessEmail, setBusinessEmail] = useState("info@shyvon.com");
  const [businessAddress, setBusinessAddress] = useState("Shylie Global Pvt Ltd, Gampaha, Sri Lanka");

  // Bank Transfer Details
  const [bankName, setBankName] = useState("Commercial Bank of Ceylon");
  const [bankAccountName, setBankAccountName] = useState("Shylie Global Pvt Ltd");
  const [bankAccountNumber, setBankAccountNumber] = useState("100012345678");
  const [bankBranch, setBankBranch] = useState("Gampaha Branch");
  const [bankInstructions, setBankInstructions] = useState("");
  const [isBankTransferEnabled, setIsBankTransferEnabled] = useState(true);
  const [isCodEnabled, setIsCodEnabled] = useState(true);

  // Delivery Fees & Threshold
  const [deliveryFeeStandard, setDeliveryFeeStandard] = useState("350");
  const [deliveryFeeFreeThreshold, setDeliveryFeeFreeThreshold] = useState("5000");

  // Announcements & URLs
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementActive, setAnnouncementActive] = useState(true);
  const [qrTargetUrl, setQrTargetUrl] = useState("https://shyvon.com");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          const s = data.settings;
          setBrandName(s.brandName || "SHYVON");
          setBrandTagline(s.brandTagline || "Pure • Healthy • Delicious");
          setBrandDescription(s.brandDescription || "");
          setContactPhone(s.contactPhone || "");
          setWhatsappNumber(s.whatsappNumber || "");
          setBusinessEmail(s.businessEmail || "");
          setBusinessAddress(s.businessAddress || "");
          setBankName(s.bankName || "");
          setBankAccountName(s.bankAccountName || "");
          setBankAccountNumber(s.bankAccountNumber || "");
          setBankBranch(s.bankBranch || "");
          setBankInstructions(s.bankInstructions || "");
          setIsBankTransferEnabled(s.isBankTransferEnabled ?? true);
          setIsCodEnabled(s.isCodEnabled ?? true);
          setDeliveryFeeStandard(String(s.deliveryFeeStandard ?? 350));
          setDeliveryFeeFreeThreshold(String(s.deliveryFeeFreeThreshold ?? 5000));
          setAnnouncementText(s.announcementText || "");
          setAnnouncementActive(s.announcementActive ?? true);
          setQrTargetUrl(s.qrTargetUrl || "https://shyvon.com");
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const payload = {
        brandName,
        brandTagline,
        brandDescription,
        contactPhone,
        whatsappNumber,
        businessEmail,
        businessAddress,
        bankName,
        bankAccountName,
        bankAccountNumber,
        bankBranch,
        bankInstructions,
        isBankTransferEnabled,
        isCodEnabled,
        deliveryFeeStandard: parseFloat(deliveryFeeStandard),
        deliveryFeeFreeThreshold: parseFloat(deliveryFeeFreeThreshold),
        announcementText,
        announcementActive,
        qrTargetUrl,
      };

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update settings");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between border-b border-shyvon-gold/20 pb-4">
        <div>
          <span className="text-xs uppercase font-cinzel text-shyvon-gold tracking-widest">
            Configuration
          </span>
          <h1 className="font-cinzel text-2xl font-extrabold text-white">
            Website <span className="text-gold-gradient">Settings</span>
          </h1>
          <p className="text-xs text-shyvon-muted mt-0.5">
            Configure contact information, bank transfer details, delivery fees, and announcements.
          </p>
        </div>

        {success && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-green-950/60 border border-green-500/40 text-green-300 text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Brand Information */}
        <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded p-6 space-y-4 shadow-xl">
          <h3 className="font-cinzel text-sm font-bold text-shyvon-goldLight uppercase tracking-wider border-b border-white/10 pb-2">
            Brand Identity & Contact Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-shyvon-muted mb-1 font-medium">Brand Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white focus:outline-none focus:border-shyvon-gold"
              />
            </div>

            <div>
              <label className="block text-shyvon-muted mb-1 font-medium">Brand Tagline</label>
              <input
                type="text"
                value={brandTagline}
                onChange={(e) => setBrandTagline(e.target.value)}
                className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white focus:outline-none focus:border-shyvon-gold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-shyvon-muted mb-1 font-medium">Brand Description</label>
              <textarea
                rows={2}
                value={brandDescription}
                onChange={(e) => setBrandDescription(e.target.value)}
                className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white focus:outline-none focus:border-shyvon-gold"
              />
            </div>

            <div>
              <label className="block text-shyvon-muted mb-1 font-medium">Contact Telephone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white focus:outline-none focus:border-shyvon-gold"
              />
            </div>

            <div>
              <label className="block text-shyvon-muted mb-1 font-medium">
                WhatsApp Business Number (e.g. +94 77 123 4567)
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white focus:outline-none focus:border-shyvon-gold"
              />
            </div>

            <div>
              <label className="block text-shyvon-muted mb-1 font-medium">Corporate Email</label>
              <input
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white focus:outline-none focus:border-shyvon-gold"
              />
            </div>

            <div>
              <label className="block text-shyvon-muted mb-1 font-medium">Physical Address</label>
              <input
                type="text"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white focus:outline-none focus:border-shyvon-gold"
              />
            </div>
          </div>
        </div>

        {/* Bank Details & Payment Settings */}
        <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <Building className="w-4 h-4 text-shyvon-gold" />
            <h3 className="font-cinzel text-sm font-bold text-shyvon-goldLight uppercase tracking-wider">
              Bank Transfer & Payment Settings
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-shyvon-muted mb-1 font-medium">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white focus:outline-none focus:border-shyvon-gold"
              />
            </div>

            <div>
              <label className="block text-shyvon-muted mb-1 font-medium">Account Name</label>
              <input
                type="text"
                value={bankAccountName}
                onChange={(e) => setBankAccountName(e.target.value)}
                className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white focus:outline-none focus:border-shyvon-gold"
              />
            </div>

            <div>
              <label className="block text-shyvon-muted mb-1 font-medium">Account Number</label>
              <input
                type="text"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white font-mono focus:outline-none focus:border-shyvon-gold"
              />
            </div>

            <div>
              <label className="block text-shyvon-muted mb-1 font-medium">Branch</label>
              <input
                type="text"
                value={bankBranch}
                onChange={(e) => setBankBranch(e.target.value)}
                className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white focus:outline-none focus:border-shyvon-gold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-shyvon-muted mb-1 font-medium">
                Customer Bank Deposit Instructions
              </label>
              <input
                type="text"
                value={bankInstructions}
                onChange={(e) => setBankInstructions(e.target.value)}
                className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white focus:outline-none focus:border-shyvon-gold"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isBankTransferEnabled}
                onChange={(e) => setIsBankTransferEnabled(e.target.checked)}
                className="accent-shyvon-gold"
              />
              <span className="text-white">Enable Bank Transfer Payment</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isCodEnabled}
                onChange={(e) => setIsCodEnabled(e.target.checked)}
                className="accent-shyvon-gold"
              />
              <span className="text-white">Enable Cash on Delivery (COD)</span>
            </label>
          </div>
        </div>

        {/* Shipping & Announcements */}
        <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <Truck className="w-4 h-4 text-shyvon-gold" />
            <h3 className="font-cinzel text-sm font-bold text-shyvon-goldLight uppercase tracking-wider">
              Shipping & Top Announcement
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-shyvon-muted mb-1 font-medium">
                Standard Island-wide Delivery Fee (LKR)
              </label>
              <input
                type="number"
                value={deliveryFeeStandard}
                onChange={(e) => setDeliveryFeeStandard(e.target.value)}
                className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white font-mono focus:outline-none focus:border-shyvon-gold"
              />
            </div>

            <div>
              <label className="block text-shyvon-muted mb-1 font-medium">
                Complimentary Delivery Order Threshold (LKR)
              </label>
              <input
                type="number"
                value={deliveryFeeFreeThreshold}
                onChange={(e) => setDeliveryFeeFreeThreshold(e.target.value)}
                className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white font-mono focus:outline-none focus:border-shyvon-gold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-shyvon-muted mb-1 font-medium">
                Top Announcement Text
              </label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full bg-[#080D19] border border-shyvon-gold/30 rounded p-2.5 text-white focus:outline-none focus:border-shyvon-gold"
              />
            </div>
          </div>
        </div>

        <GoldButton type="submit" size="md" loading={saving} icon={<Save className="w-4 h-4" />}>
          Save Settings
        </GoldButton>
      </form>
    </div>
  );
}
