import React from 'react';
import { Sparkles, Shirt, Palette } from 'lucide-react';
import { COLOR_SWATCHES } from '../data';

export default function DressCode() {
  return (
    <section className="relative py-20 bg-[#FAF8F5] text-stone-850 border-t border-stone-200/60" id="dress-code-section">
      <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
        {/* Section Header */}
        <span className="text-[#1B4D3E] text-[11px] font-bold tracking-[0.2em] uppercase font-sans block mb-2">
          GUEST ATTIRE &amp; PALETTE
        </span>
        <h2 className="text-3xl md:text-5xl font-serif font-normal text-stone-900 tracking-tight">
          Dress Code &amp; Theme Colors
        </h2>
        <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto my-4" />

        {/* Main Dress Code Directive Card */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-8 md:p-10 shadow-sm mt-6 mb-12">
          <div className="w-14 h-14 rounded-full bg-[#F2F7F4] text-[#1B4D3E] flex items-center justify-center mx-auto mb-4 border border-[#1B4D3E]/20">
            <Shirt className="w-6 h-6 text-[#1B4D3E]" />
          </div>

          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FAF7F0] border border-[#D4AF37]/50 shadow-2xs mb-4">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-serif text-2xl md:text-3xl text-stone-900 font-semibold tracking-wide">
              Formal Elegant
            </span>
          </div>

          <p className="text-stone-700 text-sm md:text-base max-w-xl mx-auto italic font-serif leading-relaxed mb-6">
            We kindly invite our guests to celebrate with us in Formal Elegant attire, inspired by our celebratory palette of lush Green, radiant Gold, and refined Beige.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-left text-xs font-sans">
            <div className="bg-[#FAF8F5] border border-stone-200/70 p-4 rounded-xl">
              <p className="font-bold text-[#1B4D3E] uppercase tracking-wider text-[11px] mb-1">Ladies</p>
              <p className="text-stone-600 leading-normal">
                Floor-length gowns, chic cocktail dresses, or elegant tailored sets in tones of emerald green, champagne gold, or warm beige.
              </p>
            </div>
            <div className="bg-[#FAF8F5] border border-stone-200/70 p-4 rounded-xl">
              <p className="font-bold text-[#885C1C] uppercase tracking-wider text-[11px] mb-1">Gentlemen</p>
              <p className="text-stone-600 leading-normal">
                Classic formal suits, tuxedo jackets, or bespoke tailored blazers with coordinated formal accessories.
              </p>
            </div>
          </div>
        </div>

        {/* Color Palette Swatches */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-widest text-[#1B4D3E] mb-2">
            <Palette className="w-4 h-4 text-[#D4AF37]" />
            <span>Theme Color Palette: Green, Gold &amp; Beige</span>
          </div>
          <p className="text-xs text-stone-500 font-serif italic max-w-md mx-auto">
            Harmonious shades curated to complement our lush garden atmosphere at Infinite Green Garden.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5 max-w-4xl mx-auto">
          {COLOR_SWATCHES.map((swatch, idx) => (
            <div
              key={`swatch-${idx}`}
              className="bg-white border border-stone-200/80 rounded-2xl p-3 shadow-xs flex flex-col items-center text-center group hover:shadow-md transition-shadow"
            >
              <div
                className="w-14 h-14 rounded-full shadow-inner border border-black/10 mb-2.5 transition-transform group-hover:scale-105"
                style={{ backgroundColor: swatch.hex }}
              />
              <span className="font-serif text-sm font-semibold text-stone-900 leading-tight">
                {swatch.name}
              </span>
              <span className="text-[10px] text-stone-400 font-mono mt-1">
                {swatch.hex}
              </span>
              <p className="text-[10px] text-stone-500 font-sans mt-1.5 leading-snug line-clamp-2">
                {swatch.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
