import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Leaf, Shield, Award, MapPin, Sparkles } from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-shyvon-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-shyvon-surface border border-shyvon-gold/30 text-shyvon-goldLight text-xs uppercase tracking-widest font-cinzel">
            <Sparkles className="w-3.5 h-3.5 text-shyvon-gold" />
            <span>Sri Lankan Herbal Authenticity</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-white">
            About <span className="text-gold-gradient">SHYVON</span>
          </h1>
          <p className="text-sm font-playfair italic text-shyvon-goldLight">
            Pure by Nature, for a Healthier You.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative aspect-square max-w-md mx-auto w-full rounded-lg overflow-hidden border border-shyvon-gold/30 shadow-2xl">
            <Image
              src="/images/branding/packaging-reference.jpg"
              alt="SHYVON Packaging and Heritage"
              fill
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-6 text-gray-300 text-sm leading-relaxed font-light">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white leading-snug">
              Discover the Pure Goodness of Nature
            </h2>
            <p>
              SHYVON was born out of a deep reverence for Sri Lanka’s lush tropical botanical
              wealth. For millennia, the island of Sri Lanka (historically famed as the Spice &
              Botanical Isle) has produced extraordinary native flora known for profound restorative
              and calming properties.
            </p>
            <p>
              Under our parent company, <strong>Shylie Global Pvt Ltd.</strong> located in Gampaha,
              Sri Lanka, we bring together traditional herbal harvesters and modern clean-room
              packaging to ensure that every leaf and petal reaches you in its purest botanical state.
            </p>
            <p>
              We firmly uphold our core promise: <strong>Pure • Healthy • Delicious</strong>. No
              fillers, no synthetics, no artificial dyes — only the healing touch of nature.
            </p>
          </div>
        </div>

        {/* Why Choose SHYVON Highlights */}
        <div className="border-t border-shyvon-gold/20 pt-16 space-y-8">
          <div className="text-center space-y-2">
            <h3 className="font-cinzel text-2xl font-bold text-white">
              Why Discerning Customers <span className="text-gold-gradient">Choose SHYVON</span>
            </h3>
            <p className="text-xs text-shyvon-muted max-w-md mx-auto">
              Uncompromising standards from hand-picking to final packaging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded text-center space-y-3">
              <Leaf className="w-8 h-8 text-shyvon-gold mx-auto" />
              <h4 className="font-cinzel text-base font-bold text-shyvon-goldLight">
                Naturally Inspired Products
              </h4>
              <p className="text-xs text-shyvon-muted">
                Every harvest is grown and gathered in pure harmony with Sri Lanka’s natural wetland
                and forest ecosystems.
              </p>
            </div>

            <div className="glass-panel p-6 rounded text-center space-y-3">
              <Award className="w-8 h-8 text-shyvon-gold mx-auto" />
              <h4 className="font-cinzel text-base font-bold text-shyvon-goldLight">
                Quality-Focused Selection
              </h4>
              <p className="text-xs text-shyvon-muted">
                Rigorous visual inspection and gentle shade-drying guarantee maximum flavor,
                vibrant color, and bioactivity.
              </p>
            </div>

            <div className="glass-panel p-6 rounded text-center space-y-3">
              <Shield className="w-8 h-8 text-shyvon-gold mx-auto" />
              <h4 className="font-cinzel text-base font-bold text-shyvon-goldLight">
                Carefully Packed & Sealed
              </h4>
              <p className="text-xs text-shyvon-muted">
                Our airtight luxury gold pouches protect delicate floral aromas and keep external
                moisture out.
              </p>
            </div>
          </div>
        </div>

        {/* Corporate Information Card */}
        <div className="bg-shyvon-card border border-shyvon-gold/30 rounded p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-cinzel text-lg font-bold text-white">
              Manufactured & Packed By
            </h4>
            <p className="text-sm text-shyvon-goldLight font-medium">Shylie Global Pvt Ltd.</p>
            <p className="text-xs text-shyvon-muted">Gampaha, Sri Lanka</p>
          </div>

          <GoldButton href="/shop" size="md">
            Explore Our Products
          </GoldButton>
        </div>
      </div>
    </div>
  );
}
