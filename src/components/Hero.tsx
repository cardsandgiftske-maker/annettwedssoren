import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Sparkles, Clock } from 'lucide-react';
import { WEDDING_DATE, WEDDING_DETAILS } from '../data';
import Crest from './Crest';

import couplePortraitImg from '../assets/images/annett_soren_couple_1791475779285.jpg';
import engagementHandsRingImg from '../assets/images/engagement_hands_ring_1786638744313.jpg';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPassed: boolean;
}

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = WEDDING_DATE.getTime() - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isPassed: false,
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FAF7F2] text-stone-900 py-16 md:py-24 border-b border-[#C9A227]/30" id="hero-section">
      {/* 1. Subtle Radial Gold Wash Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFF2C6]/60 via-[#FAF6F0]/40 to-transparent" />
      
      {/* 2. Delicate Gold Linework Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.12]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="gold-grid-hero" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1.5" fill="#C9A227" />
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#C9A227" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gold-grid-hero)" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 max-w-4xl flex flex-col items-center text-center">
        
        {/* 1. TOP ANNOUNCEMENT & FAMILIES */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center gap-2 mb-4"
        >
          <div className="flex items-center gap-3">
            <span className="w-12 h-px bg-gradient-to-r from-transparent via-[#C9A227] to-transparent" />
            <span className="text-[#14532D] text-[11px] md:text-xs tracking-[0.25em] font-sans font-bold uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
              TOGETHER WITH OUR FAMILIES
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            </span>
            <span className="w-12 h-px bg-gradient-to-r from-transparent via-[#C9A227] to-transparent" />
          </div>

          {/* PARENTS' NAMES INTEGRATED ELEGANTLY */}
          <div className="text-[#14532D] font-serif text-lg md:text-2xl font-semibold tracking-wide mt-1 space-x-2">
            <span>{WEDDING_DETAILS.parents.brideParents}</span>
            <span className="text-[#C9A227] font-sans text-sm font-bold">&amp;</span>
            <span>{WEDDING_DETAILS.parents.groomParents}</span>
          </div>

          <p className="text-stone-600 text-xs md:text-sm font-serif italic mt-1 max-w-lg">
            REQUEST THE HONOR OF YOUR PRESENCE AT THE CELEBRATION OF THE WEDDING OF THEIR CHILDREN
          </p>
        </motion.div>

        {/* 2. HAND-CRAFTED WEDDING MONOGRAM */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="my-3 md:my-5 flex items-center justify-center"
        >
          <Crest size="lg" animated={true} />
        </motion.div>

        {/* 3. HERO PHOTOGRAPH: COUPLE PORTRAIT IN LUXURY IVORY PAPER FRAME */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative w-full max-w-md md:max-w-xl mx-auto my-6 group"
        >
          {/* Outer Radiant Gold Backlight */}
          <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-r from-[#14532D]/30 via-[#F5D77F]/60 to-[#C9A227]/40 opacity-70 blur-sm group-hover:opacity-90 transition-opacity" />
          
          {/* Layered Stationery Frame Container */}
          <div className="relative rounded-[28px] p-2.5 sm:p-3 bg-white border-2 border-[#C9A227] shadow-[0_20px_50px_-10px_rgba(20,83,45,0.18)] overflow-hidden">
            
            {/* Fine Inner Gold Foil Double Line Border */}
            <div className="absolute inset-2 border border-[#C9A227]/70 rounded-[22px] pointer-events-none z-10" />
            <div className="absolute inset-3 border border-[#C9A227]/30 rounded-[18px] pointer-events-none z-10" />

            {/* Corner Filigree Ornaments */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#C9A227] z-20" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#C9A227] z-20" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#C9A227] z-20" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#C9A227] z-20" />

            {/* Photo Crop Wrapper */}
            <div className="relative rounded-[18px] overflow-hidden bg-stone-100 aspect-[4/3] md:aspect-[16/10] flex items-center justify-center">
              <img
                src={couplePortraitImg}
                alt="Annett Koskei & Søren Kolind Couple Portrait"
                className="w-full h-full object-cover object-center transform group-hover:scale-102 transition-transform duration-700 filter brightness-[1.02] contrast-[1.01]"
                referrerPolicy="no-referrer"
              />

              {/* Natural Border Vignette */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_65%,_rgba(20,83,45,0.25)_100%)] pointer-events-none" />

              {/* Editorial Caption Tag */}
              <div className="absolute bottom-3 inset-x-0 mx-auto w-max bg-white/95 border border-[#C9A227] px-4 py-1.5 rounded-full text-[10px] text-[#14532D] font-sans font-bold tracking-widest uppercase shadow-md">
                Annett &amp; Søren • Celebrating Love
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4. COUPLE NAMES IN ELEGANT EMERALD & GOLD CALLIGRAPHY */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center my-4"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight text-[#14532D] flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 font-normal">
            <span className="font-serif italic text-[#14532D] drop-shadow-xs">
              Annett Koskei
            </span>
            <span className="text-[#C9A227] font-serif italic text-3xl md:text-5xl font-light my-1 md:my-0">
              &amp;
            </span>
            <span className="font-serif italic text-[#14532D] drop-shadow-xs">
              Søren Kolind
            </span>
          </h1>
        </motion.div>

        {/* 5. INVITATION DATE & VENUE SUMMARY BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="w-full max-w-2xl bg-white border-2 border-[#C9A227]/70 rounded-2xl p-5 md:p-6 my-6 shadow-xl relative overflow-hidden text-stone-900"
        >
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#14532D] via-[#C9A227] to-[#D9CAAE]" />
          
          <div className="flex flex-col md:flex-row items-center justify-around gap-4 text-center md:text-left">
            {/* Date */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#14532D]/10 border border-[#14532D]/30 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-[#14532D]" />
              </div>
              <div>
                <p className="text-[10px] text-stone-500 uppercase font-sans font-bold tracking-widest">Date &amp; Time</p>
                <p className="font-serif text-[#14532D] text-base md:text-lg font-bold">Saturday, December 19, 2026</p>
                <p className="text-xs text-[#855802] font-sans font-semibold">9:00 AM Prompt</p>
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-stone-200" />

            {/* Time & Venue */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/40 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#855802]" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-[10px] text-stone-500 uppercase font-sans font-bold tracking-widest">Ceremony &amp; Reception</p>
                <p className="font-serif text-[#14532D] text-sm md:text-base font-bold">
                  {WEDDING_DETAILS.ceremony.venue}
                </p>
                <p className="text-xs text-stone-600 font-sans">
                  {WEDDING_DETAILS.ceremony.address} (Same Venue)
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 6. BIBLE VERSE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="max-w-md mx-auto my-4 text-stone-700 italic font-serif text-sm md:text-base border-y border-[#C9A227]/40 py-3"
        >
          <p className="mb-1">“I have found the one whom my soul loves.”</p>
          <p className="text-[#14532D] text-xs tracking-widest font-sans font-bold uppercase not-italic">Song of Solomon 3:4</p>
        </motion.div>

        {/* 7. COUNTDOWN TIMER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col items-center mt-4"
        >
          <span className="text-[10px] text-[#14532D] uppercase tracking-widest font-sans font-extrabold mb-3 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Countdown To Our Wedding Day</span>
          </span>

          <div className="flex gap-3 md:gap-4 text-center">
            {/* Days */}
            <div className="flex flex-col bg-white border border-[#C9A227]/60 rounded-2xl px-4 py-3 min-w-[70px] md:min-w-[90px] shadow-md">
              <span className="text-2xl md:text-4xl font-serif font-bold text-[#14532D]">{timeLeft.days}</span>
              <span className="text-[9px] uppercase tracking-wider text-stone-500 font-sans font-bold mt-0.5">Days</span>
            </div>

            {/* Hours */}
            <div className="flex flex-col bg-white border border-[#C9A227]/60 rounded-2xl px-4 py-3 min-w-[70px] md:min-w-[90px] shadow-md">
              <span className="text-2xl md:text-4xl font-serif font-bold text-[#14532D]">{timeLeft.hours}</span>
              <span className="text-[9px] uppercase tracking-wider text-stone-500 font-sans font-bold mt-0.5">Hours</span>
            </div>

            {/* Mins */}
            <div className="flex flex-col bg-white border border-[#C9A227]/60 rounded-2xl px-4 py-3 min-w-[70px] md:min-w-[90px] shadow-md">
              <span className="text-2xl md:text-4xl font-serif font-bold text-[#14532D]">{timeLeft.minutes}</span>
              <span className="text-[9px] uppercase tracking-wider text-stone-500 font-sans font-bold mt-0.5">Mins</span>
            </div>

            {/* Secs */}
            <div className="flex flex-col bg-white border border-[#C9A227]/60 rounded-2xl px-4 py-3 min-w-[70px] md:min-w-[90px] shadow-md">
              <span className="text-2xl md:text-4xl font-serif font-bold text-[#14532D]">{timeLeft.seconds}</span>
              <span className="text-[9px] uppercase tracking-wider text-stone-500 font-sans font-bold mt-0.5">Secs</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}


