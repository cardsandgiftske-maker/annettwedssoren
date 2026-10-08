import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';
import couplePortrait from '../assets/images/annett_soren_couple_1791475779285.jpg';

interface EnvelopeProps {
  onOpen: () => void;
  onSealBreak?: () => void;
}

export default function Envelope({ onOpen, onSealBreak }: EnvelopeProps) {
  // Opening steps: 'closed' | 'opening-seal' | 'opening-flap' | 'card-rising' | 'complete'
  const [animationStep, setAnimationStep] = useState<
    'closed' | 'opening-seal' | 'opening-flap' | 'card-rising' | 'complete'
  >('closed');

  const handleOpen = () => {
    if (animationStep !== 'closed') return;

    if (onSealBreak) {
      onSealBreak();
    }

    // Step 1: Seal reacts
    setAnimationStep('opening-seal');

    // Step 2: Flap opens
    setTimeout(() => {
      setAnimationStep('opening-flap');
    }, 400);

    // Step 3: Card slides up
    setTimeout(() => {
      setAnimationStep('card-rising');
    }, 1100);

    // Step 4: Complete transition to main invitation
    setTimeout(() => {
      setAnimationStep('complete');
      onOpen();
    }, 2200);
  };

  const isFlapOpen =
    animationStep === 'opening-flap' ||
    animationStep === 'card-rising' ||
    animationStep === 'complete';

  const isCardRising =
    animationStep === 'card-rising' || animationStep === 'complete';

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.05,
        filter: 'blur(10px)',
        transition: { duration: 0.9, ease: [0.4, 0.0, 0.2, 1] },
      }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#1C0205] p-3 sm:p-6 select-none"
    >
      {/* Ambient background atmosphere - Burgundy & Emerald radial lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#6D1F32]/35 blur-[120px] animate-pulse"
          style={{ animationDuration: '7s' }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#0F5132]/30 blur-[120px] animate-pulse"
          style={{ animationDuration: '9s' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(15,2,5,0.85)_100%)]" />
      </div>

      {/* Main Container - Scaled for high precision on mobile viewports */}
      <div className="relative w-full max-w-[440px] sm:max-w-[500px] flex flex-col items-center justify-center z-10 my-auto">
        
        {/* Envelope Outer Frame */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative w-full aspect-[4/3] rounded-3xl shadow-[0_30px_80px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(201,162,39,0.35)] bg-[#FAF6F0] overflow-hidden"
          style={{ perspective: 1200 }}
        >
          {/* Subtle Embossed Floral SVG Background Texture on Paper */}
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <pattern
                id="embossed-floral"
                x="0"
                y="0"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M40 0 C 45 15, 60 20, 75 20 C 60 25, 55 40, 55 55 C 40 45, 35 60, 20 60 C 25 45, 10 40, 10 25 C 25 25, 30 10, 40 0 Z"
                  fill="#33070B"
                />
                <circle cx="40" cy="40" r="4" fill="#0F5132" />
                <path
                  d="M10 70 Q 25 55 40 70 T 70 70"
                  stroke="#C9A227"
                  strokeWidth="1"
                  fill="none"
                />
              </pattern>
              <rect width="100%" height="100%" fill="url(#embossed-floral)" />
            </svg>
          </div>

          {/* Gold Foil Double Line Border */}
          <div className="absolute inset-3 border border-[#C9A227]/40 rounded-2xl pointer-events-none z-10" />
          <div className="absolute inset-4 border border-[#C9A227]/20 rounded-xl pointer-events-none z-10" />

          {/* INNER LINING (Emerald & Gold Foil Pattern revealed when flap opens) */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B2E18] via-[#14532D] to-[#0A3F24] flex items-center justify-center p-6 text-center">
            <div className="border border-[#C9A227]/40 rounded-2xl p-4 w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
              <div className="w-16 h-16 rounded-full border border-[#C9A227]/50 flex items-center justify-center text-[#F5D77F] font-serif text-lg font-light tracking-widest bg-[#062010]/50 shadow-inner">
                A&amp;S
              </div>
              <p className="font-serif italic text-xs text-[#F5D77F]/80 mt-2 tracking-widest uppercase">
                Holy Matrimony
              </p>
            </div>
          </div>

          {/* RISING INVITATION CARD (Glides out of envelope when flap opens) */}
          <motion.div
            initial={{ y: '0%', opacity: 0 }}
            animate={
              isCardRising
                ? { y: '-60%', opacity: 1, scale: 1.05 }
                : { y: '0%', opacity: 0 }
            }
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-6 top-6 bottom-6 bg-[#FAF6F0] rounded-2xl border-2 border-[#C9A227]/70 shadow-2xl z-20 p-4 flex flex-col items-center justify-between text-stone-900 overflow-hidden"
          >
            <div className="text-center space-y-1">
              <p className="text-[9px] uppercase tracking-[0.25em] text-[#855802] font-sans font-bold">
                Wedding Invitation
              </p>
              <h2 className="font-serif text-xl font-medium text-[#14532D] tracking-wide">
                Annett &amp; Søren
              </h2>
            </div>

            <div className="w-20 h-20 rounded-full border-2 border-[#C9A227]/60 overflow-hidden shadow-md my-1">
              <img
                src={couplePortrait}
                alt="Annett & Søren"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center space-y-0.5 font-sans">
              <p className="text-[10px] font-bold text-[#14532D] uppercase tracking-wider">
                Saturday, December 19, 2026
              </p>
              <p className="text-[9px] text-stone-600 italic font-serif">
                Infinite Green Garden Events, Nakuru
              </p>
            </div>

            <div className="w-full py-1.5 bg-gradient-to-r from-[#14532D] via-[#C9A227] to-[#14532D] text-white text-[9px] font-sans font-bold uppercase tracking-widest text-center rounded-lg shadow-sm">
              You Are Cordially Invited
            </div>
          </motion.div>

          {/* ENVELOPE BASE POCKET FLAPS */}
          {/* Left Flap */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            <svg
              className="w-full h-full drop-shadow-[2px_0_4px_rgba(0,0,0,0.12)]"
              viewBox="0 0 400 300"
              preserveAspectRatio="none"
            >
              <path d="M0 0 L200 150 L0 300 Z" fill="#F5F0E6" />
              <path
                d="M0 0 L200 150 L0 300"
                stroke="#C9A227"
                strokeWidth="0.75"
                opacity="0.4"
              />
              {/* Embossed Vine Accent */}
              <path
                d="M20 40 Q 35 60 25 80 T 40 120"
                stroke="#E2D9C8"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="25" cy="80" r="1.5" fill="#C9A227" opacity="0.5" />
            </svg>
          </div>

          {/* Right Flap */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            <svg
              className="w-full h-full drop-shadow-[-2px_0_4px_rgba(0,0,0,0.12)]"
              viewBox="0 0 400 300"
              preserveAspectRatio="none"
            >
              <path d="M400 0 L200 150 L400 300 Z" fill="#F5F0E6" />
              <path
                d="M400 0 L200 150 L400 300"
                stroke="#C9A227"
                strokeWidth="0.75"
                opacity="0.4"
              />
              {/* Embossed Vine Accent */}
              <path
                d="M380 40 Q 365 60 375 80 T 360 120"
                stroke="#E2D9C8"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="375" cy="80" r="1.5" fill="#C9A227" opacity="0.5" />
            </svg>
          </div>

          {/* Bottom Triangular Pocket Flap */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            <svg
              className="w-full h-full drop-shadow-[0_-3px_6px_rgba(0,0,0,0.12)]"
              viewBox="0 0 400 300"
              preserveAspectRatio="none"
            >
              <path d="M0 300 L200 150 L400 300 Z" fill="#EFE8DA" />
              <path
                d="M0 300 L200 150 L400 300"
                stroke="#C9A227"
                strokeWidth="1"
                opacity="0.5"
              />
            </svg>
          </div>

          {/* TOP TRIANGULAR FLAP (3D Animated Unfolding) */}
          <motion.div
            animate={
              isFlapOpen
                ? { rotateX: 180, opacity: 0.1, y: -10 }
                : { rotateX: 0, opacity: 1, y: 0 }
            }
            transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1] }}
            className="absolute inset-0 z-30 origin-top pointer-events-none"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <svg
              className="w-full h-full drop-shadow-[0_8px_12px_rgba(0,0,0,0.18)]"
              viewBox="0 0 400 300"
              preserveAspectRatio="none"
            >
              <path d="M0 0 L200 150 L400 0 Z" fill="#FAF6F0" />
              <path
                d="M0 0 L200 150 L400 0"
                stroke="#C9A227"
                strokeWidth="1.2"
                opacity="0.6"
              />

              {/* Fine Embossed Botanical Leaf Pattern on Flap */}
              <g opacity="0.4" stroke="#855802" strokeWidth="0.8" fill="none">
                <path d="M120 20 Q 200 70 280 20" />
                <path d="M150 35 Q 200 65 250 35" />
                <circle cx="200" cy="50" r="2" fill="#C9A227" />
              </g>
            </svg>
          </motion.div>

          {/* GOLD DC WAX SEAL (Centered on the Flap Tip) */}
          <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
            <AnimatePresence>
              {animationStep === 'closed' || animationStep === 'opening-seal' ? (
                <motion.div
                  initial={{ scale: 1 }}
                  animate={
                    animationStep === 'opening-seal'
                      ? { scale: [1, 1.25, 0], opacity: [1, 0.9, 0], rotate: [0, 15, -10] }
                      : { scale: 1, opacity: 1 }
                  }
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  onClick={handleOpen}
                  className="pointer-events-auto cursor-pointer select-none group flex flex-col items-center justify-center"
                >
                  {/* Soft Radiant Backlight Pulse Glow */}
                  <div className="absolute w-28 h-28 rounded-full bg-gradient-to-r from-[#C9A227]/40 via-[#F5D77F]/60 to-[#B8860B]/40 blur-lg group-hover:scale-125 transition-all duration-300 animate-pulse" />

                  {/* 3D Wax Seal Body */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#FFF2C6] via-[#E2C062] to-[#855802] p-1 shadow-[0_12px_28px_rgba(51,7,11,0.5),_inset_0_2px_4px_rgba(255,255,255,0.8),_inset_0_-4px_8px_rgba(0,0,0,0.4)] border border-[#FFF2C6]/80 transform transition-transform duration-300 active:scale-95 group-hover:scale-105">
                    {/* Wavy Drip Contour Border */}
                    <div className="w-full h-full rounded-full bg-gradient-to-tl from-[#855802] via-[#C9A227] to-[#F5D77F] flex items-center justify-center shadow-[inset_0_3px_6px_rgba(0,0,0,0.4)] border border-[#C9A227]/50 relative overflow-hidden">
                      
                      {/* Monogram Crest Details */}
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="absolute inset-2.5 rounded-full border border-[#FFF2C6]/40" />
                        
                        <span className="font-serif font-bold text-2xl sm:text-3xl tracking-tight text-[#14532D] drop-shadow-[0_1px_2px_rgba(255,242,198,0.8)] italic">
                          A&amp;S
                        </span>
                        
                        <span className="text-[7px] font-sans font-extrabold uppercase tracking-[0.2em] text-[#14532D]/80 mt-0.5">
                          2026
                        </span>
                      </div>

                      {/* Glossy Refraction Highlight */}
                      <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent -rotate-12 transform origin-top-left scale-150 pointer-events-none" />
                    </div>
                  </div>

                  {/* "TAP TO OPEN" Call To Action */}
                  <div className="mt-4 px-4 py-1.5 bg-[#1C0205]/90 border border-[#C9A227]/60 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1.5 text-[#F5D77F] text-[10px] sm:text-xs font-sans font-bold uppercase tracking-widest animate-bounce">
                    <Sparkles className="w-3.5 h-3.5 text-[#F5D77F] animate-spin" style={{ animationDuration: '4s' }} />
                    <span>TAP TO OPEN</span>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Outer Caption Footer */}
        <div className="mt-6 text-center space-y-1">
          <p className="font-serif italic text-sm text-[#F5D77F] tracking-wide flex items-center justify-center gap-2">
            <Heart className="w-3.5 h-3.5 text-[#C9A227] fill-[#C9A227]" />
            <span>The Wedding Invitation of Annett &amp; Søren</span>
            <Heart className="w-3.5 h-3.5 text-[#C9A227] fill-[#C9A227]" />
          </p>
          <p className="text-[10px] uppercase font-sans tracking-widest text-stone-300">
            December 19, 2026 • Infinite Green Garden Events, Nakuru
          </p>
        </div>

      </div>
    </motion.div>
  );
}
