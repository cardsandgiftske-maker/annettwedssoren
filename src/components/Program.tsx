import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Award, Camera, Wine, Utensils, Music, PartyPopper } from 'lucide-react';
import { PROGRAM_ITEMS } from '../data';

export default function Program() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'ceremony' | 'reception'>('all');

  const filteredItems = PROGRAM_ITEMS.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'ceremony') return item.isChurch;
    return !item.isChurch;
  });

  const getIconForTitle = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('matrimony') || t.includes('ceremony')) return <Award className="w-4 h-4 text-[#1B4D3E]" />;
    if (t.includes('photo') || t.includes('shoot')) return <Camera className="w-4 h-4 text-[#885C1C]" />;
    if (t.includes('mocktail') || t.includes('refreshment')) return <Wine className="w-4 h-4 text-[#D4AF37]" />;
    if (t.includes('lunch') || t.includes('feast')) return <Utensils className="w-4 h-4 text-[#1B4D3E]" />;
    if (t.includes('entertainment') || t.includes('cake') || t.includes('speech')) return <Music className="w-4 h-4 text-[#885C1C]" />;
    return <PartyPopper className="w-4 h-4 text-[#D4AF37]" />;
  };

  return (
    <section className="relative py-24 bg-[#FAF7F2] text-stone-800 border-t border-stone-200/60" id="program-section">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section Title */}
        <div className="text-center mb-14">
          <span className="text-[#1B4D3E] text-xs font-bold tracking-widest uppercase font-sans">ORDER OF EVENTS</span>
          <h2 className="text-3xl md:text-5xl font-display font-light text-stone-900 mt-2 mb-4">Wedding Programme</h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
          <p className="text-stone-600 text-sm md:text-base mt-4 max-w-xl mx-auto italic font-serif">
            “Two are better than one, because they have a good return for their labor.” <br />
            <span className="text-[#1B4D3E] uppercase font-sans text-xs tracking-wider font-semibold not-italic block mt-1">— Ecclesiastes 4:9</span>
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white border border-stone-200 p-1.5 rounded-full shadow-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-5 py-2 text-xs md:text-sm font-sans font-medium uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                activeFilter === 'all' ? 'bg-[#1B4D3E] text-white font-semibold shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Full Schedule
            </button>
            <button
              onClick={() => setActiveFilter('ceremony')}
              className={`px-5 py-2 text-xs md:text-sm font-sans font-medium uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                activeFilter === 'ceremony' ? 'bg-[#1B4D3E] text-white font-semibold shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Ceremony &amp; Vows (9 AM)
            </button>
            <button
              onClick={() => setActiveFilter('reception')}
              className={`px-5 py-2 text-xs md:text-sm font-sans font-medium uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                activeFilter === 'reception' ? 'bg-[#885C1C] text-white font-semibold shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Reception &amp; Party
            </button>
          </div>
        </div>

        {/* Program Timeline */}
        <div className="relative border-l-2 border-[#D4AF37]/50 ml-5 md:ml-10 pl-6 md:pl-10 space-y-8">
          {filteredItems.map((item, index) => (
            <motion.div
              key={`program-item-${index}`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="relative"
            >
              {/* Timeline Node */}
              <div className="absolute -left-[45px] md:-left-[61px] top-1.5 w-9 h-9 rounded-full bg-white border-2 border-[#D4AF37] flex items-center justify-center shadow-xs z-10">
                {getIconForTitle(item.title)}
              </div>

              {/* Program Detail Card */}
              <div className="bg-white border border-stone-200/80 rounded-2xl p-5 md:p-6 hover:border-[#D4AF37] transition-all shadow-xs hover:shadow-md group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-stone-100 mb-3">
                  {/* Time Badge */}
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-[#FAF7F0] text-stone-900 border border-[#D4AF37]/40 px-3 py-1 rounded-full text-xs font-sans font-bold tracking-wide">
                      <Clock className="w-3.5 h-3.5 text-[#1B4D3E]" />
                      <span>{item.time}</span>
                    </span>
                    <span className="text-[11px] text-stone-500 font-sans font-medium">({item.duration})</span>
                  </div>

                  {/* Category Pill */}
                  <span className={`text-[9px] uppercase tracking-wider font-sans font-bold px-2.5 py-1 rounded-full self-start sm:self-auto ${
                    item.isChurch 
                      ? 'bg-[#F2F7F4] text-[#1B4D3E] border border-[#1B4D3E]/30' 
                      : 'bg-amber-50 text-[#885C1C] border border-[#D4AF37]/30'
                  }`}>
                    {item.isChurch ? 'Church Ceremony & Matrimony' : 'Garden Reception'}
                  </span>
                </div>

                {/* Title and Description */}
                <h4 className="text-lg md:text-xl font-serif font-medium text-stone-900 group-hover:text-[#1B4D3E] transition-colors">
                  {item.title}
                </h4>

                {item.description && (
                  <p className="text-stone-600 text-xs md:text-sm mt-1.5 leading-relaxed font-sans">
                    {item.description}
                  </p>
                )}

                {/* Bullets */}
                {item.bullets && item.bullets.length > 0 && (
                  <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-stone-600 font-sans">
                    {item.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing Warm Blessing Card */}
        <div className="mt-14 text-center bg-white border border-stone-200 p-6 rounded-2xl max-w-xl mx-auto shadow-xs">
          <p className="font-serif text-stone-900 italic text-base">
            “We eagerly look forward to sharing every precious moment of our celebration with you in Nakuru.”
          </p>
          <p className="text-xs text-[#1B4D3E] font-sans font-bold uppercase tracking-widest mt-2">
            Annett &amp; Søren
          </p>
        </div>
      </div>
    </section>
  );
}
