import React, { useState } from 'react';
import { Smartphone, Mail, Copy, Check, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';
import { WEDDING_DETAILS } from '../data';

export default function GiftsRegistry() {
  const [copiedMpesa, setCopiedMpesa] = useState(false);
  const gifts = WEDDING_DETAILS.gifts;
  const notices = WEDDING_DETAILS.notices;

  const handleCopyMpesa = () => {
    navigator.clipboard.writeText(`${gifts.mpesa.accountName} - ${gifts.mpesa.number}`);
    setCopiedMpesa(true);
    setTimeout(() => setCopiedMpesa(false), 2500);
  };

  return (
    <section className="relative py-20 bg-[#FAF7F2] text-stone-850 border-t border-stone-200/60" id="gifts-section">
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="text-[#1B4D3E] text-[11px] font-bold tracking-[0.2em] uppercase font-sans block mb-2">
            REGISTRY &amp; IMPORTANT NOTICES
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-normal text-stone-900 tracking-tight mb-3">
            Gifts &amp; Guest Guidelines
          </h2>
          <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto mb-4" />
          <p className="text-stone-600 text-sm md:text-base max-w-xl mx-auto italic font-serif leading-relaxed">
            {gifts.subtitle}
          </p>
        </div>

        {/* Gifts Cards: M-Pesa & Envelopes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {/* M-Pesa Card */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-7 shadow-xs hover:border-[#1B4D3E] transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                  <Smartphone className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-emerald-100/70 text-emerald-900 px-3 py-1 rounded-full">
                  M-Pesa Contribution
                </span>
              </div>

              <h3 className="font-serif text-2xl text-stone-900 font-medium mb-1">
                M-Pesa Monetary Gift
              </h3>
              <p className="text-xs text-stone-500 font-sans mb-4">
                Convenient and secure mobile gifting for monetary blessings.
              </p>

              <div className="bg-[#FAF8F5] border border-stone-200 rounded-xl p-4 space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-400 font-sans font-semibold uppercase tracking-wider text-[10px]">Recipient:</span>
                  <span className="font-serif font-semibold text-stone-850 text-sm">{gifts.mpesa.accountName}</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1.5 border-t border-stone-200/60">
                  <span className="text-stone-400 font-sans font-semibold uppercase tracking-wider text-[10px]">Number / Till:</span>
                  <span className="font-mono font-bold text-[#1B4D3E] text-sm">{gifts.mpesa.number}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCopyMpesa}
              className="w-full py-3 bg-[#F2F7F4] hover:bg-[#1B4D3E] text-[#1B4D3E] hover:text-white border border-[#1B4D3E]/30 font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              {copiedMpesa ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy M-Pesa Details</span>
                </>
              )}
            </button>
          </div>

          {/* Envelopes Card */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-7 shadow-xs hover:border-[#D4AF37] transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-amber-100/70 text-amber-900 px-3 py-1 rounded-full">
                  Physical Cards &amp; Envelopes
                </span>
              </div>

              <h3 className="font-serif text-2xl text-stone-900 font-medium mb-1">
                Cards &amp; Envelopes
              </h3>
              <p className="text-xs text-stone-500 font-sans mb-4">
                Traditional congratulatory cards and gift envelopes.
              </p>

              <div className="bg-[#FAF8F5] border border-stone-200 rounded-xl p-4 space-y-2 mb-4 text-xs text-stone-700 leading-relaxed font-sans">
                <p>
                  A beautifully decorated <strong>Greeting &amp; Envelope Registry Station</strong> will be located at the reception entrance at <em>Infinite Green Garden Events</em>.
                </p>
                <p className="text-stone-500 italic font-serif pt-1 text-[11px]">
                  Envelopes and registry attendants will be on hand to receive your warm wishes and cards.
                </p>
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-center text-xs text-amber-900 font-serif italic">
              Station opens upon arrival at 8:30 AM
            </div>
          </div>
        </div>

        {/* Essential Protocols: Adults Only, Non-Transferable & Gate Pass */}
        <div className="bg-white border border-[#D4AF37]/50 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-stone-100">
            <ShieldAlert className="w-5 h-5 text-[#1B4D3E]" />
            <h4 className="font-serif text-xl md:text-2xl text-stone-900 font-medium">
              Important Guest Protocols
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Protocol 1: Adults Only */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-sans font-bold text-xs uppercase tracking-wider">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold">1</span>
                <span>{notices.adultsOnly.title}</span>
              </div>
              <p className="text-xs text-stone-600 font-sans leading-relaxed">
                {notices.adultsOnly.message}
              </p>
            </div>

            {/* Protocol 2: Non-transferable */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-sans font-bold text-xs uppercase tracking-wider">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">2</span>
                <span>{notices.nonTransferable.title}</span>
              </div>
              <p className="text-xs text-stone-600 font-sans leading-relaxed">
                {notices.nonTransferable.message}
              </p>
            </div>

            {/* Protocol 3: Entrance Pass */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-sans font-bold text-xs uppercase tracking-wider">
                <span className="w-6 h-6 rounded-full bg-[#F2F7F4] text-[#1B4D3E] flex items-center justify-center text-xs font-bold">3</span>
                <span>{notices.entranceCode.title}</span>
              </div>
              <p className="text-xs text-stone-600 font-sans leading-relaxed">
                {notices.entranceCode.message}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
