import React, { useState } from 'react';
import { Gift, Copy, Check, Sparkles, Mail, Heart } from 'lucide-react';
import { MPESA_DETAILS } from '../data';

export default function Gifting() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <section className="relative py-20 md:py-28 bg-[#FAF7F2] text-stone-900 border-t border-[#C9A227]/30" id="gifting-section">
      {/* Background Radial Gold Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200/20 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-[#14532D] text-xs font-bold tracking-widest uppercase font-sans flex items-center justify-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Love &amp; Blessings</span>
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-[#14532D] font-bold mb-3">Wedding Gifts Registry</h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mx-auto" />
          <p className="text-stone-700 text-sm md:text-base font-serif italic max-w-xl mx-auto mt-3">
            Your presence with us is the greatest treasure. For guests who wish to honor Annett &amp; Søren with a gift, we have provided two convenient options below:
          </p>
        </div>

        {/* Two Options Grid: Envelope Blessing & M-Pesa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Option 1: ENVELOPE BLESSING Card */}
          <div className="bg-white border-2 border-[#C9A227]/60 p-6 md:p-8 rounded-3xl shadow-xl text-stone-900 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#C9A227] via-[#D9CAAE] to-[#14532D]" />

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#C9A227]/15 text-[#855802] flex items-center justify-center border border-[#C9A227]/30">
                  <Mail className="w-6 h-6 text-[#855802]" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-sans font-extrabold tracking-widest text-[#855802]">Option 1</span>
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-[#14532D]">1. ENVELOPE BLESSING</h3>
                </div>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 text-base">
                      In-Person Presentation
                    </h4>
                    <p className="text-sm text-stone-700 font-sans leading-relaxed mt-2">
                      Gift envelopes can be presented in person at the reception venue during the speeches and gifts session.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-200 text-center text-xs text-stone-600 font-serif italic">
              Thank you dearly for celebrating with us and for your warm blessings!
            </div>
          </div>

          {/* Option 2: MPesa Paybill Card */}
          <div className="bg-white border-2 border-[#C9A227]/60 p-6 md:p-8 rounded-3xl shadow-xl text-stone-900 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#14532D] via-[#C9A227] to-[#14532D]" />

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#14532D]/10 text-[#14532D] flex items-center justify-center border border-[#14532D]/20">
                  <Gift className="w-6 h-6 text-[#14532D]" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-sans font-extrabold tracking-widest text-[#855802]">Option 2</span>
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-[#14532D]">2. M-PESA GIFTING</h3>
                </div>
              </div>

              <div className="space-y-4">
                {/* Paybill Number */}
                <div className="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-200 rounded-2xl shadow-xs">
                  <div>
                    <span className="text-[10px] text-stone-500 font-sans uppercase font-bold tracking-widest block">Paybill Number</span>
                    <span className="text-xl font-mono font-bold text-[#14532D]">{MPESA_DETAILS.paybill}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(MPESA_DETAILS.paybill, 'paybill')}
                    className="px-3 py-2 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 rounded-xl text-xs font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    {copiedField === 'paybill' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#14532D]" />}
                    <span>{copiedField === 'paybill' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Account Number */}
                <div className="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-200 rounded-2xl shadow-xs">
                  <div>
                    <span className="text-[10px] text-stone-500 font-sans uppercase font-bold tracking-widest block">Account Number</span>
                    <span className="text-base font-mono font-bold text-stone-800">{MPESA_DETAILS.accountNumber}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(MPESA_DETAILS.accountNumber, 'account')}
                    className="px-3 py-2 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 rounded-xl text-xs font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    {copiedField === 'account' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#14532D]" />}
                    <span>{copiedField === 'account' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Account Name */}
                <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl shadow-xs text-center">
                  <span className="text-[10px] text-stone-500 font-sans uppercase font-bold tracking-widest block">Account Name</span>
                  <span className="text-sm font-serif font-bold text-[#14532D]">{MPESA_DETAILS.accountName}</span>
                </div>
              </div>
            </div>

            <p className="mt-6 pt-4 border-t border-stone-200 text-center text-xs text-stone-500 font-sans">
              Instant mobile transfer via Safaricom M-Pesa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


