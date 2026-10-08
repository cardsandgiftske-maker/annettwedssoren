import React from 'react';
import { motion } from 'motion/react';
import { Clock, Sparkles, Camera, GlassWater, Utensils, Music, Moon, Heart } from 'lucide-react';
import { PROGRAM_ITEMS } from '../data';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  '9:00 AM': Heart,
  '11:00 AM': Camera,
  '12:00 PM': GlassWater,
  '1:00 PM': Utensils,
  '2:00 PM': Music,
  '6:00 PM': Moon,
};

export default function ProgramSchedule() {
  return (
    <section className="relative py-20 md:py-28 bg-[#FAF7F2] text-stone-900 border-t border-[#C9A227]/30" id="program-section">
      {/* Background Radial Gold Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200/20 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[#14532D] text-xs font-bold tracking-widest uppercase font-sans flex items-center justify-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Order of Celebrations</span>
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-[#14532D] font-semibold mb-3">
            Wedding Program
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mx-auto" />
          <p className="text-stone-700 text-sm md:text-base mt-3 max-w-xl mx-auto italic font-serif">
            A joy-filled schedule from our sacred morning vows to our starry evening celebration at Infinite Green Garden Events.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative border-l-2 border-[#C9A227]/50 ml-4 md:ml-32 space-y-8 my-8">
          {PROGRAM_ITEMS.map((item, index) => {
            const IconComponent = iconMap[item.time] || Clock;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-7 md:pl-10"
              >
                {/* Timeline Node Badge */}
                <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-white border-2 border-[#C9A227] flex items-center justify-center shadow-md text-[#14532D]">
                  <IconComponent className="w-4 h-4 text-[#14532D]" />
                </div>

                {/* Desktop Left Time Tag */}
                <div className="md:absolute md:-left-32 md:top-2 md:w-24 md:text-right hidden md:block">
                  <span className="font-sans font-bold text-xs uppercase tracking-wider text-[#14532D] block">
                    {item.time}
                  </span>
                  <span className="text-[10px] text-stone-500 font-sans">
                    {item.duration}
                  </span>
                </div>

                {/* Content Card */}
                <div className="bg-white border border-[#C9A227]/40 rounded-2xl p-5 md:p-6 shadow-md hover:shadow-lg transition-all group">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="md:hidden font-mono font-bold text-xs bg-[#14532D]/10 text-[#14532D] px-2.5 py-0.5 rounded-full">
                        {item.time}
                      </span>
                      <h3 className="font-serif text-lg md:text-xl font-bold text-[#14532D]">
                        {item.title}
                      </h3>
                    </div>
                    {item.isChurch && (
                      <span className="text-[10px] uppercase font-sans font-extrabold tracking-wider bg-[#C9A227]/20 text-[#855802] px-3 py-1 rounded-full border border-[#C9A227]/40">
                        Sacrament
                      </span>
                    )}
                  </div>

                  <p className="text-xs md:text-sm text-stone-700 leading-relaxed font-sans mb-3">
                    {item.description}
                  </p>

                  {item.bullets && item.bullets.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100">
                      {item.bullets.map((b, bIdx) => (
                        <span
                          key={bIdx}
                          className="text-[11px] font-sans font-medium text-stone-600 bg-stone-50 border border-stone-200 px-2.5 py-0.5 rounded-full"
                        >
                          • {b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Note at bottom of schedule */}
        <div className="mt-12 text-center p-4 bg-white/80 border border-[#C9A227]/40 rounded-2xl max-w-xl mx-auto shadow-sm">
          <p className="font-serif italic text-xs md:text-sm text-stone-700">
            * Note: All program activities flow smoothly within Infinite Green Garden Events. Reception immediately follows the morning ceremony.
          </p>
        </div>
      </div>
    </section>
  );
}
