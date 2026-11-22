import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-shyvon-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-shyvon-card border border-shyvon-gold/25 rounded p-8 sm:p-12 space-y-6 text-xs sm:text-sm text-gray-300 leading-relaxed">
        <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white border-b border-shyvon-gold/20 pb-4">
          Privacy <span className="text-gold-gradient">Policy</span>
        </h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>
          At <strong>SHYVON Natural Foods</strong> (operated by Shylie Global Pvt Ltd., Gampaha, Sri
          Lanka), we are deeply committed to respecting and protecting the privacy of our
          customers.
        </p>
        <h3 className="font-cinzel text-base font-bold text-shyvon-goldLight pt-2">
          1. Information We Collect
        </h3>
        <p>
          When you place an order or create an account, we collect necessary contact information
          including your name, phone number, WhatsApp contact, delivery address, city, and optional
          email address solely to fulfill and dispatch your orders.
        </p>
        <h3 className="font-cinzel text-base font-bold text-shyvon-goldLight pt-2">
          2. How We Protect Your Data
        </h3>
        <p>
          We never sell, rent, or trade your personal information to third parties. Customer data is
          stored in secure, encrypted environments and used exclusively for delivery coordination and
          direct customer support.
        </p>
        <h3 className="font-cinzel text-base font-bold text-shyvon-goldLight pt-2">
          3. Contact Us
        </h3>
        <p>
          If you have questions about your personal data, please contact us at{" "}
          <strong>info@shyvon.com</strong> or via WhatsApp at <strong>+94 77 123 4567</strong>.
        </p>
      </div>
    </div>
  );
}
