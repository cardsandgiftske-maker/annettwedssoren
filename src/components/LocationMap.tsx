import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Compass, ArrowUpRight, Calendar, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { WEDDING_DETAILS } from '../data';

import venueImg from '../assets/images/infinite_green_gardens_1791475797084.jpg';

export default function LocationMap() {
  const [activeTab, setActiveTab] = useState<'overview' | 'ceremony' | 'reception'>('overview');

  const getNavigationUrl = () => {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Infinite Green Garden Events Kiamunyi Nakuru');
  };

  return (
    <section className="relative py-20 md:py-28 bg-[#FAF7F2] text-stone-900 border-t border-[#C9A227]/30" id="maps-section">
      {/* Background Radial Gold Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200/20 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[#14532D] text-xs font-bold tracking-widest uppercase font-sans flex items-center justify-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Ceremony &amp; Celebration Venue</span>
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-[#14532D] font-semibold mb-3">When &amp; Where</h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mx-auto" />
          <p className="text-stone-700 text-sm md:text-base mt-3 max-w-xl mx-auto italic font-serif">
            Both our sacred marriage ceremony and joyous reception take place on the picturesque grounds of Infinite Green Garden Events.
          </p>
        </div>

        {/* Date, Location, Time Info Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto bg-white border-2 border-[#C9A227]/60 p-6 rounded-3xl shadow-xl mb-10 text-stone-900 relative">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#14532D] via-[#C9A227] to-[#D9CAAE]" />

          {/* Calendar Card */}
          <div className="flex flex-col items-center text-center p-3">
            <div className="w-10 h-10 rounded-full bg-[#14532D]/10 text-[#14532D] flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 text-[#14532D]" />
            </div>
            <p className="text-[10px] text-stone-500 uppercase tracking-widest font-sans font-bold mb-1">The Date</p>
            <p className="text-sm text-stone-800 font-serif font-medium">Saturday</p>
            <p className="text-base text-[#14532D] font-serif font-bold">December 19, 2026</p>
          </div>

          {/* Time Card */}
          <div className="flex flex-col items-center text-center p-3 border-y sm:border-y-0 sm:border-x border-stone-200">
            <div className="w-10 h-10 rounded-full bg-[#C9A227]/15 text-[#855802] flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-[#855802]" />
            </div>
            <p className="text-[10px] text-stone-500 uppercase tracking-widest font-sans font-bold mb-1">The Time</p>
            <p className="text-sm text-[#14532D] font-serif font-bold">9:00 AM Prompt</p>
            <p className="text-xs text-[#855802] font-sans mt-1 font-semibold">Ceremony &amp; Reception</p>
          </div>

          {/* Venue Card */}
          <div className="flex flex-col items-center text-center p-3">
            <div className="w-10 h-10 rounded-full bg-[#14532D]/10 text-[#14532D] flex items-center justify-center mb-2">
              <MapPin className="w-5 h-5 text-[#14532D]" />
            </div>
            <p className="text-[10px] text-stone-500 uppercase tracking-widest font-sans font-bold mb-1">The Venue</p>
            <p className="text-sm text-stone-800 font-serif font-bold leading-tight">Infinite Green Garden Events</p>
            <p className="text-xs text-stone-600 font-sans mt-1">Kiamunyi, Nakuru, Kenya</p>
          </div>
        </div>

        {/* Unified Venue Notice Banner */}
        <div className="max-w-3xl mx-auto mb-10 bg-emerald-50/80 border border-[#14532D]/30 rounded-2xl p-4 flex items-center justify-center gap-3 text-center text-xs md:text-sm text-[#14532D] font-medium font-sans">
          <CheckCircle2 className="w-5 h-5 text-[#14532D] shrink-0" />
          <span>
            <strong>Single Destination:</strong> Ceremony &amp; Reception are held at the same venue — no travel required between events!
          </span>
        </div>

        {/* Info + Map Container Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Venue Details Card */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white border-2 border-[#C9A227]/60 rounded-3xl shadow-xl relative overflow-hidden text-stone-900">
            {/* Venue Photo header */}
            <div className="relative h-60 w-full overflow-hidden border-b border-stone-200">
              <img
                src={venueImg}
                alt="Infinite Green Garden Events Kiamunyi Nakuru"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-[10px] uppercase font-sans font-bold tracking-widest bg-white/90 text-[#14532D] px-3 py-1 rounded-full shadow-md border border-[#C9A227]/40">
                  Infinite Green Gardens • Kiamunyi, Nakuru
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
              <div className="space-y-4 z-10">
                <div className="space-y-1.5">
                  <h3 className="font-serif text-2xl lg:text-3xl text-[#14532D] leading-tight font-bold">
                    Infinite Green Garden Events
                  </h3>
                  <p className="text-[#855802] text-xs tracking-wider uppercase font-sans font-bold">
                    Ceremony &amp; Reception Celebrations
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-stone-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#14532D] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest font-sans font-bold">Address &amp; Location</p>
                      <p className="text-sm text-stone-800 leading-normal mt-0.5 font-medium">
                        Kiamunyi, Nakuru County, Kenya
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#14532D] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest font-sans font-bold">Timeline</p>
                      <p className="text-sm text-stone-800 mt-0.5 font-bold">
                        9:00 AM Ceremony • Reception Thereafter
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Driving navigation CTA button */}
              <div className="mt-8 pt-5 border-t border-stone-200 z-10">
                <a
                  href={getNavigationUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#14532D] to-[#0A3F24] hover:brightness-110 font-sans font-bold uppercase tracking-wider text-xs text-white rounded-2xl transition-all shadow-md border border-[#C9A227]/40 group cursor-pointer"
                >
                  <span>Open Directions in Google Maps</span>
                  <ArrowUpRight className="w-4 h-4 text-[#F5D77F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Embedded Map Iframe */}
          <div className="lg:col-span-7 bg-stone-100 border-2 border-[#C9A227]/60 rounded-3xl overflow-hidden min-h-[380px] lg:min-h-auto flex shadow-xl relative">
            <iframe
              title="Map of Infinite Green Garden Events Kiamunyi Nakuru"
              src="https://maps.google.com/maps?q=Infinite+Green+Garden+Events+Kiamunyi+Nakuru&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              className="w-full min-h-[420px] border-0 filter contrast-[0.98] hover:contrast-100 transition-all duration-500"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}


