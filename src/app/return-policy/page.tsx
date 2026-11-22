import React from "react";

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-shyvon-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-shyvon-card border border-shyvon-gold/25 rounded p-8 sm:p-12 space-y-6 text-xs sm:text-sm text-gray-300 leading-relaxed">
        <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white border-b border-shyvon-gold/20 pb-4">
          Return & <span className="text-gold-gradient">Refund Policy</span>
        </h1>
        <p>
          At <strong>SHYVON</strong>, we take immense pride in the pure quality of our natural
          botanicals. If you receive a damaged or compromised package, we are here to assist.
        </p>
        <h3 className="font-cinzel text-base font-bold text-shyvon-goldLight pt-2">
          1. Damaged or Incorrect Items
        </h3>
        <p>
          If your package arrives with broken outer seals or incorrect contents, please notify us
          within 48 hours of delivery with photographic evidence via WhatsApp at +94 77 123 4567 or
          email to info@shyvon.com.
        </p>
        <h3 className="font-cinzel text-base font-bold text-shyvon-goldLight pt-2">
          2. Replacement or Refund
        </h3>
        <p>
          Verified damaged products will be promptly replaced at zero additional cost to you, or a
          full bank refund will be issued within 3-5 business days.
        </p>
        <h3 className="font-cinzel text-base font-bold text-shyvon-goldLight pt-2">
          3. Food & Herbal Safety
        </h3>
        <p>
          Due to strict health and botanical safety regulations, opened packages cannot be returned
          unless defective in quality.
        </p>
      </div>
    </div>
  );
}
