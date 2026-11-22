import React from "react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-shyvon-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-shyvon-card border border-shyvon-gold/25 rounded p-8 sm:p-12 space-y-6 text-xs sm:text-sm text-gray-300 leading-relaxed">
        <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white border-b border-shyvon-gold/20 pb-4">
          Terms & <span className="text-gold-gradient">Conditions</span>
        </h1>
        <p>
          Welcome to SHYVON. By accessing or using our website and purchasing our authentic Sri
          Lankan herbal products, you agree to comply with the terms and conditions outlined below.
        </p>
        <h3 className="font-cinzel text-base font-bold text-shyvon-goldLight pt-2">
          1. Product Availability & Pricing
        </h3>
        <p>
          All products, including our Organic Dried Blue Lotus Petals, are subject to seasonal
          availability. Prices are stated in Sri Lankan Rupees (Rs. / LKR) and are subject to change
          without prior notice.
        </p>
        <h3 className="font-cinzel text-base font-bold text-shyvon-goldLight pt-2">
          2. Orders & Cancellations
        </h3>
        <p>
          Orders placed via our website or authorized WhatsApp channel are confirmed upon backend
          validation. Cash on Delivery orders must be paid in full to the courier upon arrival.
        </p>
        <h3 className="font-cinzel text-base font-bold text-shyvon-goldLight pt-2">
          3. Herbal Disclaimer
        </h3>
        <p>
          Our organic dried botanical products are crafted for general culinary and traditional
          wellness relaxation tea infusions. They are not intended to diagnose, treat, cure, or
          prevent any medical conditions.
        </p>
      </div>
    </div>
  );
}
