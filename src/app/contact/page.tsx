"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-shyvon-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-white">
            Contact <span className="text-gold-gradient">SHYVON</span>
          </h1>
          <p className="text-sm text-shyvon-muted">
            We are always delighted to connect with our customers, wholesale partners, and herbal
            enthusiasts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 bg-shyvon-card border border-shyvon-gold/25 rounded p-8 space-y-6 shadow-xl">
            <h3 className="font-cinzel text-lg font-bold text-shyvon-goldLight border-b border-shyvon-gold/20 pb-3">
              Corporate Headquarters
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 text-gray-300">
                <MapPin className="w-5 h-5 text-shyvon-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Company & Packaging Facility:</strong>
                  <span>Shylie Global Pvt Ltd.</span>
                  <p className="text-shyvon-muted">Gampaha, Sri Lanka</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-5 h-5 text-shyvon-gold shrink-0" />
                <div>
                  <strong className="block text-white">Direct Telephone:</strong>
                  <span>+94 71 477 0176</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-5 h-5 text-shyvon-gold shrink-0" />
                <div>
                  <strong className="block text-white">Email Address:</strong>
                  <span>info@shyvon.com</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider">
                Instant WhatsApp Inquiries:
              </h4>
              <p className="text-xs text-shyvon-muted">
                Reach our team directly for order assistance, delivery tracking, or questions:
              </p>
              <a
                href="https://wa.me/94714770176?text=Hello%20SHYVON%2C%20I%20have%20an%20inquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded bg-[#128C7E] hover:bg-[#075E54] text-white font-medium text-xs transition-colors shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with us on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7 bg-shyvon-card border border-shyvon-gold/25 rounded p-8 shadow-xl">
            <h3 className="font-cinzel text-lg font-bold text-shyvon-goldLight border-b border-shyvon-gold/20 pb-3 mb-6">
              Send Us a Message
            </h3>

            {submitted ? (
              <div className="p-8 text-center space-y-3 bg-green-950/40 border border-green-500/40 rounded">
                <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto" />
                <h4 className="font-cinzel text-base font-bold text-white">
                  Message Sent Successfully
                </h4>
                <p className="text-xs text-gray-300">
                  Thank you for contacting SHYVON. Our team will review your inquiry and respond
                  shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-shyvon-muted mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Kasun Fernando"
                      className="w-full bg-shyvon-surface border border-shyvon-gold/30 rounded p-2.5 text-white placeholder-shyvon-muted/50 focus:outline-none focus:border-shyvon-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-shyvon-muted mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. kasun@gmail.com"
                      className="w-full bg-shyvon-surface border border-shyvon-gold/30 rounded p-2.5 text-white placeholder-shyvon-muted/50 focus:outline-none focus:border-shyvon-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-shyvon-muted mb-1">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 077 123 4567"
                    className="w-full bg-shyvon-surface border border-shyvon-gold/30 rounded p-2.5 text-white placeholder-shyvon-muted/50 focus:outline-none focus:border-shyvon-gold"
                  />
                </div>

                <div>
                  <label className="block text-shyvon-muted mb-1">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message or inquiry here..."
                    className="w-full bg-shyvon-surface border border-shyvon-gold/30 rounded p-2.5 text-white placeholder-shyvon-muted/50 focus:outline-none focus:border-shyvon-gold"
                  />
                </div>

                <GoldButton type="submit" size="md" icon={<Send className="w-4 h-4" />}>
                  Send Message
                </GoldButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
