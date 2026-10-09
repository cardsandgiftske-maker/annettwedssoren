import React from 'react';
import { Shirt, Sparkles, Heart, ShieldAlert, Baby, KeyRound } from 'lucide-react';
import { WEDDING_DETAILS } from '../data';

export default function DressCode() {
  return (
    <section className="relative py-20 md:py-28 bg-[#FAF7F2] text-stone-900 border-t border-[#C9A227]/30" id="dress-code-section">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200/20 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-[#14532D] text-xs font-bold tracking-widest uppercase font-sans flex items-center justify-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Style &amp; Etiquette</span>
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#14532D] mb-3">Dress Code</h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mx-auto" />
        </div>

        {/* Dress Code Card */}
        <div className="bg-white border-2 border-[#C9A227]/60 p-8 md:p-12 rounded-3xl shadow-xl text-center space-y-6 relative overflow-hidden mb-8">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#14532D] via-[#D9CAAE] to-[#14532D]" />

          <div className="w-16 h-16 rounded-full bg-[#14532D]/10 border border-[#14532D]/20 text-[#14532D] flex items-center justify-center mx-auto shadow-xs">
            <Shirt className="w-8 h-8" />
          </div>

          <div className="inline-block px-6 py-2 bg-[#14532D]/10 border border-[#14532D]/30 rounded-full text-[#14532D] text-xs font-sans font-extrabold uppercase tracking-widest shadow-xs">
            Attire: Formal Elegant
          </div>

          <p className="text-stone-700 text-base md:text-lg font-serif italic leading-relaxed max-w-xl mx-auto">
            We kindly invite our cherished guests to grace our celebration in <strong className="font-semibold text-[#14532D] not-italic">Formal Elegant</strong> attire, reflecting our wedding theme colors of <span className="text-[#14532D] font-bold not-italic">Green</span> and <span className="text-[#8C7A5B] font-bold not-italic">Beige</span>.
          </p>

          <div className="pt-4 border-t border-stone-200 flex items-center justify-center gap-2 text-stone-600 text-xs font-serif italic">
            <Heart className="w-4 h-4 text-[#C9A227] fill-[#C9A227]/20" />
            <span>We look forward to sharing this picturesque, elegant day with you!</span>
          </div>
        </div>

        {/* Important Guidelines & Security Card */}
        <div className="bg-white border-2 border-[#C9A227]/60 rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#C9A227]" />
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#14532D]">
              Important Guest Guidelines &amp; Gate Protocol
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {/* 1. Children Protocol */}
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-[#855802] font-sans font-bold text-xs uppercase tracking-wider mb-1.5">
                <Baby className="w-4 h-4 text-[#855802]" />
                <span>No Children Allowed</span>
              </div>
              <p className="text-xs text-stone-700 font-sans leading-relaxed">
                No children allowed.
              </p>
            </div>

            {/* 2. Non-Transferable */}
            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-[#14532D] font-sans font-bold text-xs uppercase tracking-wider mb-1.5">
                <ShieldAlert className="w-4 h-4 text-[#14532D]" />
                <span>Non-Transferable</span>
              </div>
              <p className="text-xs text-stone-700 font-sans leading-relaxed">
                This invitation and website portal are personal and non-transferable. Please do not share, forward, or post this link.
              </p>
            </div>

            {/* 3. Entrance Pass Code */}
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-[#B8860B] font-sans font-bold text-xs uppercase tracking-wider mb-1.5">
                <KeyRound className="w-4 h-4 text-[#B8860B]" />
                <span>Personalized Gate Pass</span>
              </div>
              <p className="text-xs text-stone-700 font-sans leading-relaxed">
                Upon submitting your RSVP, you will receive a unique personalized entrance code to present to security at the gate.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

