import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { WEDDING_DATE, WEDDING_DETAILS } from '../data';
import Crest from './Crest';
import coupleHandsImg from '../assets/images/couple_hands_wedding_1790328935151.jpg';

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

  const verses = WEDDING_DETAILS.bibleVerses.slice(0, 3);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FAF8F5] text-stone-850 py-16" id="hero-section">
      {/* Background Image with Warm Paper Vignette/Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={coupleHandsImg}
          alt="Annett and Søren Hands Joined in Love"
          className="w-full h-full object-cover object-center opacity-[0.24] scale-105 filter brightness-[1.02] contrast-[0.98]"
          referrerPolicy="no-referrer"
        />
        {/* Gradients tailored to Forest Green, Champagne Gold & Warm Linen */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/85 to-[#FAF8F5]/45" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-[#FAF8F5]/50 to-[#FAF8F5]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center max-w-4xl">
        {/* Elegant Crest at the top of the hero */}
        <div className="mb-4">
          <Crest size="md" animated={true} />
        </div>

        {/* Family Introduction Block */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="max-w-xl mx-auto mb-4 text-center"
        >
          <p className="text-[#1B4D3E] font-sans tracking-[0.24em] text-[10px] md:text-xs uppercase font-extrabold mb-1.5">
            Together with their Families
          </p>
          <p className="text-stone-800 font-serif text-sm md:text-base font-medium">
            Mr. &amp; Mrs. Koskei <span className="text-[#D4AF37] italic font-serif mx-1.5">&amp;</span> Mr. Hans Kolind
          </p>
          <p className="text-stone-600 font-serif text-xs md:text-sm italic leading-relaxed mt-1">
            request the honour of your presence at the holy matrimony and wedding celebration of their children
          </p>
        </motion.div>

        {/* Main Title: Annett & Søren */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-medium tracking-tight text-stone-900 mb-5"
        >
          <span className="text-stone-900">Annett</span>
          <span className="font-display font-light text-[#D4AF37] mx-3 md:mx-4 text-4xl md:text-6xl italic">&amp;</span>
          <span className="text-stone-900">Søren</span>
        </motion.h1>

        {/* Date, Time & Venue Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3 px-6 py-3 bg-white/90 border border-[#D4AF37]/50 rounded-full text-stone-850 text-xs md:text-sm font-sans font-semibold tracking-wider uppercase mb-5 shadow-xs"
        >
          <div className="flex items-center gap-1.5 text-[#1B4D3E] font-bold">
            <Calendar className="w-4 h-4 text-[#1B4D3E]" />
            <span>Saturday, 19th December 2026</span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] hidden sm:inline-block" />
          <div className="flex items-center gap-1.5 text-[#885C1C]">
            <Clock className="w-4 h-4 text-[#D4AF37]" />
            <span>9:00 AM Prompt</span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] hidden md:inline-block" />
          <div className="flex items-center gap-1.5 text-stone-700">
            <MapPin className="w-4 h-4 text-[#1B4D3E]" />
            <span>Infinite Green Garden Events, Nakuru</span>
          </div>
        </motion.div>

        {/* Essential Guest Protocol Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-8 text-[10px] md:text-xs font-sans uppercase tracking-widest"
        >
          <span className="bg-[#F2F7F4] text-[#1B4D3E] border border-[#1B4D3E]/30 px-3.5 py-1.5 rounded-full font-bold flex items-center gap-1.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Strictly Adults Only (No Children)
          </span>
          <span className="bg-[#FAF6EE] text-[#885C1C] border border-[#D4AF37]/40 px-3.5 py-1.5 rounded-full font-bold flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#885C1C]" />
            Personalized Entrance Pass Required
          </span>
          <span className="bg-stone-100 text-stone-700 border border-stone-250 px-3.5 py-1.5 rounded-full font-semibold">
            Confidential &amp; Non-Transferable
          </span>
        </motion.div>

        {/* Biblical Quotes */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full mx-auto mb-10"
        >
          {verses.map((verse, idx) => (
            <div
              key={`hero-verse-${idx}`}
              className="bg-white/95 border border-stone-200/90 rounded-2xl p-4 md:p-5 flex flex-col justify-between text-center shadow-xs hover:border-[#D4AF37] transition-all"
            >
              <p className="font-serif italic text-stone-800 text-sm md:text-base leading-relaxed mb-3">
                “{verse.text}”
              </p>
              <p className="text-[#1B4D3E] font-sans text-[11px] font-bold tracking-widest uppercase not-italic">
                — {verse.reference}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Countdown timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.95 }}
          className="flex flex-col items-center mb-8"
        >
          <h3 className="text-[10px] text-stone-500 uppercase tracking-widest font-sans font-bold mb-4">
            Countdown to 19th December 2026
          </h3>
          
          <div className="flex gap-3 md:gap-4 text-center">
            {/* Days */}
            <div className="flex flex-col bg-white border border-stone-200/80 rounded-xl px-4 py-3 min-w-[70px] md:min-w-[90px] shadow-xs">
              <span className="text-2xl md:text-4xl font-serif font-light text-[#1B4D3E]">{timeLeft.days}</span>
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-sans mt-1">Days</span>
            </div>

            {/* Hours */}
            <div className="flex flex-col bg-white border border-stone-200/80 rounded-xl px-4 py-3 min-w-[70px] md:min-w-[90px] shadow-xs">
              <span className="text-2xl md:text-4xl font-serif font-light text-[#1B4D3E]">{timeLeft.hours}</span>
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-sans mt-1">Hours</span>
            </div>

            {/* Minutes */}
            <div className="flex flex-col bg-white border border-stone-200/80 rounded-xl px-4 py-3 min-w-[70px] md:min-w-[90px] shadow-xs">
              <span className="text-2xl md:text-4xl font-serif font-light text-[#1B4D3E]">{timeLeft.minutes}</span>
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-sans mt-1">Mins</span>
            </div>

            {/* Seconds */}
            <div className="flex flex-col bg-white border border-stone-200/80 rounded-xl px-4 py-3 min-w-[70px] md:min-w-[90px] shadow-xs">
              <span className="text-2xl md:text-4xl font-serif font-light text-[#1B4D3E]">{timeLeft.seconds}</span>
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-sans mt-1">Secs</span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Subtle fade overlay */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FAF8F5] to-transparent pointer-events-none" />
    </section>
  );
}
