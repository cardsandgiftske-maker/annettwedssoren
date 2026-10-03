import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface EnvelopeProps {
  onOpen: () => void;
  onSealBreak?: () => void;
}

export default function Envelope({ onOpen, onSealBreak }: EnvelopeProps) {
  const [isSealed, setIsSealed] = useState(true);
  const [isFlapOpen, setIsFlapOpen] = useState(false);
  const [isCardEmerging, setIsCardEmerging] = useState(false);

  const handleOpen = () => {
    if (!isSealed) return;
    setIsSealed(false);

    if (onSealBreak) {
      onSealBreak();
    }

    // Step 1: Open top flap
    setTimeout(() => {
      setIsFlapOpen(true);
    }, 350);

    // Step 2: Slide the invitation card up out of the envelope
    setTimeout(() => {
      setIsCardEmerging(true);
    }, 750);

    // Step 3: Transition to main experience
    setTimeout(() => {
      onOpen();
    }, 2800);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        filter: 'blur(8px)',
        transition: { duration: 1.0, ease: [0.43, 0.13, 0.23, 0.96] },
      }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-stone-900 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-900 via-[#0E2319] to-black p-4 md:p-6"
    >
      {/* Ambient background flora/glow simulation in emerald green & warm gold */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div
          className="absolute top-10 left-10 w-96 h-96 rounded-full bg-[#1B4D3E]/30 blur-3xl animate-pulse"
          style={{ animationDuration: '8s' }}
        />
        <div
          className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#D4AF37]/20 blur-3xl animate-pulse"
          style={{ animationDuration: '11s' }}
        />
      </div>

      {/* Main interactive envelope container with crisp white luxury frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{
          opacity: 0,
          scale: 1.12,
          y: -20,
          transition: { duration: 0.9, ease: [0.43, 0.13, 0.23, 0.96] },
        }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-full max-w-[430px] aspect-[9/16] max-h-[90vh] bg-white/20 backdrop-blur-md rounded-[40px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border border-white/40 flex items-center justify-center overflow-hidden"
      >
        {/* Pure White screen boundary / card viewport */}
        <div className="relative w-full h-full bg-[#FCFAF7] rounded-[32px] overflow-hidden shadow-inner flex flex-col justify-between select-none border border-stone-200">
          {/* Top header on the invitation screen */}
          <motion.div
            animate={isCardEmerging ? { opacity: 0, y: -15 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full text-center pt-8 px-6 z-10"
          >
            <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-extrabold text-[#1B4D3E]">
              Wedding Invitation
            </span>
            <h1 className="font-serif text-xl tracking-[0.1em] text-stone-900 font-semibold mt-1">
              ANNETT &amp; SØREN
            </h1>
            <p className="text-[11px] font-serif italic text-stone-600 mt-0.5">
              Saturday, 19th December 2026 • 9:00 AM Prompt
            </p>
          </motion.div>

          {/* Central Envelope Area with overflow visible for card extraction */}
          <div className="relative flex-1 w-full flex items-center justify-center px-4 overflow-visible">
            {/* The Envelope Outer Box */}
            <div className="relative w-full aspect-[4/3] flex items-center justify-center">
              {/* 1. Envelope Back Panel & Warm Paper with Gold Accent */}
              <div className="absolute inset-0 bg-white rounded-2xl shadow-[0_12px_35px_rgba(0,0,0,0.09)] border border-stone-200 overflow-hidden">
                {/* Elegant Interior Lining with Green & Gold Accent */}
                <div className="absolute inset-2 rounded-xl bg-gradient-to-b from-white via-[#FAF7F0] to-[#EFECE2] border border-[#D4AF37]/30 flex flex-col items-center justify-center p-4">
                  <div className="w-16 h-16 rounded-full border border-[#D4AF37]/40 flex items-center justify-center opacity-80 bg-white/70">
                    <span className="font-serif text-[#1B4D3E] text-base tracking-widest font-semibold">A &amp; S</span>
                  </div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-transparent to-transparent opacity-70" />
                </div>
              </div>

              {/* 2. THE PHYSICAL INVITATION CARD (Slides out of the envelope) */}
              <motion.div
                initial={{ y: 25, scale: 0.94, opacity: 0.85 }}
                animate={
                  isCardEmerging
                    ? { y: -125, scale: 1.03, opacity: 1, zIndex: 40 }
                    : { y: 25, scale: 0.94, opacity: 0.85, zIndex: 10 }
                }
                transition={{
                  duration: 1.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={() => {
                  if (isCardEmerging) onOpen();
                }}
                className={`absolute w-[92%] aspect-[4/3.2] bg-white rounded-xl border border-[#D4AF37] shadow-[0_18px_45px_rgba(0,0,0,0.18)] p-4 flex flex-col justify-between text-center cursor-pointer transition-shadow hover:shadow-[0_22px_55px_rgba(0,0,0,0.25)] ${
                  isCardEmerging ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
              >
                {/* Luxury double gold border line */}
                <div className="absolute inset-1.5 rounded-lg border border-[#D4AF37]/40 pointer-events-none" />

                {/* Card Top: Mini Crest & Monogram */}
                <div className="pt-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1B4D3E] via-[#246652] to-[#12382D] mx-auto flex items-center justify-center shadow-xs text-white text-[10px] font-serif font-bold tracking-widest border border-[#D4AF37]">
                    A&amp;S
                  </div>
                  <span className="text-[8.5px] uppercase tracking-[0.22em] font-sans font-bold text-[#1B4D3E] block mt-1">
                    Solemnization of Matrimony
                  </span>
                </div>

                {/* Card Center: Couple Names */}
                <div className="my-auto py-1">
                  <h2 className="font-serif text-2xl md:text-3xl text-stone-900 font-normal tracking-wide">
                    Annett &amp; Søren
                  </h2>
                  <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto my-1.5" />
                  <p className="font-serif italic text-[11px] text-stone-600">
                    Together with Mr. &amp; Mrs. Koskei and Mr. Hans Kolind
                  </p>
                </div>

                {/* Card Bottom: Date & Venue */}
                <div className="pb-1 text-[11px] font-sans">
                  <p className="font-bold text-[#1B4D3E] tracking-wider uppercase text-[10px]">
                    Saturday, 19th December 2026 • 9:00 AM
                  </p>
                  <p className="text-stone-600 text-[9.5px] mt-0.5 font-medium">
                    Infinite Green Garden Events, Kiamunyi, Nakuru
                  </p>
                  <p className="text-[#885C1C] text-[8.5px] font-sans font-semibold mt-0.5">
                    Strictly Adults Only • Personalized Gate Pass
                  </p>
                </div>

                {/* Tap to enter cue */}
                {isCardEmerging && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  >
                    <span className="text-[10px] font-sans uppercase tracking-widest text-[#1B4D3E] bg-[#F2F7F4] border border-[#1B4D3E]/30 px-3 py-1 rounded-full shadow-xs">
                      Tap card to open
                    </span>
                  </motion.div>
                )}
              </motion.div>

              {/* 3. Envelope Front Pocket in Pure Crisp White */}
              <div className="absolute inset-0 pointer-events-none z-20">
                <svg
                  className="absolute inset-0 w-full h-full drop-shadow-[2px_0_4px_rgba(0,0,0,0.04)]"
                  viewBox="0 0 400 300"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path d="M0 0 L200 150 L0 300 Z" fill="#FFFFFF" />
                  <path d="M0 0 L200 150 L0 300" stroke="#E5E7EB" strokeWidth="1" />
                </svg>

                {/* Right Flap */}
                <svg
                  className="absolute inset-0 w-full h-full drop-shadow-[-2px_0_4px_rgba(0,0,0,0.04)]"
                  viewBox="0 0 400 300"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path d="M400 0 L200 150 L400 300 Z" fill="#FFFFFF" />
                  <path d="M400 0 L200 150 L400 300" stroke="#E5E7EB" strokeWidth="1" />
                </svg>

                {/* Bottom Flap */}
                <svg
                  className="absolute inset-0 w-full h-full drop-shadow-[0_-3px_5px_rgba(0,0,0,0.04)]"
                  viewBox="0 0 400 300"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path d="M0 300 L200 150 L400 300 Z" fill="#FAFAFA" />
                  <path d="M0 300 L200 150 L400 300" stroke="#E5E7EB" strokeWidth="1" />
                </svg>
              </div>

              {/* 4. Top Flap with 3D Fold Animation */}
              <motion.div
                initial={false}
                animate={
                  isFlapOpen
                    ? {
                        rotateX: 180,
                        zIndex: 5,
                      }
                    : {
                        rotateX: 0,
                        zIndex: 35,
                      }
                }
                transition={{
                  duration: 0.8,
                  ease: [0.77, 0, 0.175, 1],
                }}
                style={{
                  transformOrigin: 'top center',
                  transformStyle: 'preserve-3d',
                }}
                className="absolute inset-0 pointer-events-none"
              >
                <svg
                  className="w-full h-full drop-shadow-[0_6px_10px_rgba(0,0,0,0.08)]"
                  viewBox="0 0 400 300"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path d="M0 0 L200 150 L400 0 Z" fill="#FFFFFF" />
                  <path d="M0 0 L200 150 L400 0" stroke="#E5E7EB" strokeWidth="1" />
                  <path
                    d="M30 15 L200 140 L370 15"
                    stroke="#F3F4F6"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                </svg>
              </motion.div>

              {/* 5. Golden Wax Seal with Crest (Sits on top flap when closed) */}
              <AnimatePresence>
                {isSealed && (
                  <motion.div
                    key="wax-seal"
                    initial={{ scale: 1, opacity: 1 }}
                    exit={{
                      scale: 1.3,
                      opacity: 0,
                      filter: 'blur(4px)',
                      transition: { duration: 0.4, ease: 'easeOut' },
                    }}
                    onClick={handleOpen}
                    className="absolute z-40 cursor-pointer select-none group"
                  >
                    {/* Glowing Backlight Halo in Radiant Gold */}
                    <div
                      className="absolute -inset-6 rounded-full bg-[#D4AF37]/45 blur-xl group-hover:bg-[#D4AF37]/60 transition-all duration-300 animate-pulse"
                      style={{ animationDuration: '3s' }}
                    />

                    {/* Realistic 3D Wax Seal Body in Radiant Metallic Gold */}
                    <div className="relative w-28 h-28 rounded-full flex items-center justify-center p-1 bg-gradient-to-br from-[#F5D882] via-[#D4AF37] to-[#8C6D1F] shadow-[0_12px_28px_rgba(180,135,30,0.5),_inset_0_3px_5px_rgba(255,255,255,0.65),_inset_0_-4px_8px_rgba(70,50,10,0.5)] border border-[#C59E36] transition-transform duration-300 active:scale-95 group-hover:scale-105">
                      <div className="absolute -inset-1.5 rounded-full border-[3px] border-[#B88E2D]/60 opacity-90" />

                      {/* Inner Circular Well of the golden crest */}
                      <div className="w-22 h-22 rounded-full bg-gradient-to-tl from-[#1B4D3E] via-[#276B55] to-[#12382D] flex items-center justify-center shadow-[inset_0_4px_8px_rgba(0,0,0,0.6),_0_2px_2px_rgba(255,255,255,0.35)] border border-[#D4AF37] relative overflow-hidden">
                        {/* Golden monograms inside the wax seal: A & S */}
                        <div className="flex flex-col items-center justify-center text-center select-none pointer-events-none">
                          <div className="absolute inset-2.5 rounded-full border border-[#D4AF37]/50" />

                          <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
                            <defs>
                              <linearGradient id="gold-seal-env" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFFFFF" />
                                <stop offset="25%" stopColor="#FFF2D1" />
                                <stop offset="60%" stopColor="#F5DC8C" />
                                <stop offset="100%" stopColor="#D4AF37" />
                              </linearGradient>
                              <filter id="seal-shadow" x="-10%" y="-10%" width="120%" height="120%">
                                <feDropShadow dx="1" dy="2" stdDeviation="1.2" floodColor="#000000" floodOpacity="0.7" />
                              </filter>
                            </defs>

                            <g filter="url(#seal-shadow)">
                              <text
                                x="34"
                                y="58"
                                fontFamily="'Cormorant Garamond', 'Playfair Display', Georgia, serif"
                                fontSize="36"
                                fontWeight="600"
                                fill="url(#gold-seal-env)"
                                textAnchor="middle"
                              >
                                A
                              </text>
                              <text
                                x="49"
                                y="53"
                                fontFamily="'Cormorant Garamond', 'Playfair Display', Georgia, serif"
                                fontSize="18"
                                fontStyle="italic"
                                fill="url(#gold-seal-env)"
                                opacity="0.9"
                                textAnchor="middle"
                              >
                                &amp;
                              </text>
                              <text
                                x="66"
                                y="58"
                                fontFamily="'Cormorant Garamond', 'Playfair Display', Georgia, serif"
                                fontSize="36"
                                fontWeight="600"
                                fill="url(#gold-seal-env)"
                                textAnchor="middle"
                              >
                                S
                              </text>
                            </g>
                          </svg>
                        </div>

                        {/* Highlight reflection */}
                        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent -rotate-12 transform origin-top-left scale-150 pointer-events-none" />
                      </div>
                    </div>

                    {/* Interactive call-to-action badge */}
                    <div className="absolute top-full mt-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-center z-40">
                      <p
                        className="font-sans font-bold text-xs uppercase tracking-widest text-[#1B4D3E] bg-white border-2 border-[#D4AF37] px-4 py-1.5 rounded-full shadow-lg flex items-center justify-center gap-2 animate-bounce"
                        style={{ animationDuration: '2s' }}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" style={{ animationDuration: '4s' }} />
                        <span>Tap Seal to Open</span>
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Footer Details with private notice */}
          <motion.div
            animate={isCardEmerging ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full text-center pb-8 px-6 z-10 flex flex-col items-center gap-1.5"
          >
            <p className="font-serif text-[13px] text-stone-700 tracking-wide italic">
              Infinite Green Garden Events • Kiamunyi, Nakuru
            </p>
            <div className="flex items-center gap-1.5 text-[9.5px] font-sans font-semibold text-stone-500 uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3 text-[#1B4D3E]" />
              <span>Private &amp; Non-Transferable Invitation</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
