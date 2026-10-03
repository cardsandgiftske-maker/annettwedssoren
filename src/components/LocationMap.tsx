import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, ArrowUpRight, Calendar, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { WEDDING_DETAILS } from '../data';
import venuePhotoImg from '../assets/images/nakuru_garden_venue_1791020349538.jpg';

export default function LocationMap() {
  const ceremony = WEDDING_DETAILS.ceremony;

  const getNavigationUrl = () => {
    const venueName = encodeURIComponent('Infinite Green Garden Events Kiamunyi Nakuru Kenya');
    return `https://www.google.com/maps/search/?api=1&query=${venueName}`;
  };

  return (
    <section className="relative py-24 bg-[#FAF8F5] text-stone-850 border-t border-stone-200/60" id="maps-section">
      <div className="absolute inset-0 bg-radial-gradient from-[#D4AF37]/[0.05] via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[#1B4D3E] text-xs font-bold tracking-[0.2em] uppercase font-sans block mb-2">
            THE CELEBRATION VENUE
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-light text-stone-900 mb-4">When &amp; Where</h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
          <p className="text-stone-600 text-sm md:text-base mt-4 max-w-xl mx-auto italic font-serif">
            Join us in the lush garden atmosphere of Nakuru for both the Holy Matrimony ceremony and the joyful wedding reception.
          </p>
        </div>

        {/* Date, Location, Time Info Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto bg-white border border-stone-200/80 p-6 rounded-2xl shadow-sm mb-12 relative z-10">
          {/* Calendar Card */}
          <div className="flex flex-col items-center text-center p-3">
            <div className="w-10 h-10 rounded-full bg-[#F2F7F4] text-[#1B4D3E] flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5" />
            </div>
            <p className="text-xs text-stone-500 uppercase tracking-widest font-sans font-semibold mb-1">The Date</p>
            <p className="text-sm text-stone-800 font-serif font-medium">Saturday</p>
            <p className="text-base text-[#1B4D3E] font-serif font-semibold">19th December 2026</p>
          </div>

          {/* Time Card */}
          <div className="flex flex-col items-center text-center p-3 border-y sm:border-y-0 sm:border-x border-stone-150">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-[#885C1C] flex items-center justify-center mb-2">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-xs text-stone-500 uppercase tracking-widest font-sans font-semibold mb-1">Timeline</p>
            <p className="text-sm text-stone-800 font-serif font-semibold">9:00 AM Prompt</p>
            <p className="text-xs text-[#1B4D3E] font-sans mt-1 font-semibold">Ceremony &amp; Reception Follows</p>
          </div>

          {/* Venue Card */}
          <div className="flex flex-col items-center text-center p-3">
            <div className="w-10 h-10 rounded-full bg-stone-100 text-[#1B4D3E] flex items-center justify-center mb-2">
              <MapPin className="w-5 h-5" />
            </div>
            <p className="text-xs text-stone-500 uppercase tracking-widest font-sans font-semibold mb-1">The Venue</p>
            <p className="text-sm text-stone-800 font-serif font-medium leading-tight">Infinite Green Garden</p>
            <p className="text-xs text-stone-500 font-sans mt-1 font-medium">Kiamunyi, Nakuru County</p>
          </div>
        </div>

        {/* Single Venue Advantage Highlight Banner */}
        <div className="max-w-2xl mx-auto mb-10 bg-gradient-to-r from-[#F2F7F4] via-white to-[#FBF9F1] border border-[#1B4D3E]/20 rounded-2xl p-4 text-center shadow-xs flex items-center justify-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#1B4D3E] shrink-0" />
          <p className="text-xs md:text-sm text-stone-800 font-sans">
            <strong className="text-[#1B4D3E]">All-in-One Venue:</strong> Both the <strong>9:00 AM Ceremony</strong> and <strong>Reception</strong> take place at the same idyllic venue—no road transit required!
          </p>
        </div>

        {/* Info + Map Container Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Venue Details Card */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white border border-stone-200/80 rounded-2xl shadow-md relative overflow-hidden">
            {/* Venue Photo header */}
            <div className="relative h-56 w-full overflow-hidden border-b border-stone-150">
              <img
                src={venuePhotoImg}
                alt="Infinite Green Garden Events Kiamunyi Nakuru"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                <span className="font-serif italic font-light">Scenic Outdoor Garden Setting</span>
                <span className="bg-[#1B4D3E]/85 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
                  Kiamunyi, Nakuru
                </span>
              </div>
            </div>

            <div className="p-7 flex flex-col justify-between flex-1">
              <div className="space-y-5 z-10">
                <span className="text-[10px] tracking-widest uppercase font-sans font-bold px-3 py-1 rounded-full border inline-block text-[#1B4D3E] bg-[#F2F7F4] border-[#1B4D3E]/30">
                  Ceremony &amp; Reception at Same Grounds
                </span>

                <div className="space-y-1.5">
                  <h3 className="font-serif text-2xl lg:text-3xl text-stone-900 leading-tight font-medium">
                    Infinite Green Garden Events
                  </h3>
                  <p className="text-stone-500 text-xs tracking-wider uppercase font-sans font-medium">
                    Kiamunyi • Nakuru County, Kenya
                  </p>
                </div>

                <div className="space-y-3.5 pt-4 border-t border-stone-100">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#1B4D3E] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-stone-400 uppercase tracking-widest font-sans font-bold">Location Address</p>
                      <p className="text-sm text-stone-700 leading-normal mt-0.5">
                        Kiamunyi, along Nakuru-Eldoret Highway corridor, Nakuru, Kenya
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#885C1C] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-stone-400 uppercase tracking-widest font-sans font-bold">Guest Arrival</p>
                      <p className="text-sm text-stone-700 mt-0.5 font-medium">
                        Gates Open at 8:30 AM • Service starts at 9:00 AM Prompt
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[#D4AF37] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-stone-400 uppercase tracking-widest font-sans font-bold">Security &amp; Gate Verification</p>
                      <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                        Please present your digital RSVP code at the gate. Strictly adults-only admitted.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Driving navigation CTA button */}
              <div className="mt-8 pt-6 border-t border-stone-100 z-10">
                <a
                  href={getNavigationUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-stone-50 border border-stone-200 hover:bg-[#1B4D3E] hover:text-white font-sans font-bold uppercase tracking-wider text-xs text-stone-850 rounded-xl transition-all shadow-xs group cursor-pointer"
                >
                  <Navigation className="w-4 h-4 text-[#1B4D3E] group-hover:text-white" />
                  <span>Get Driving Directions (Google Maps)</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Embedded Map Iframe */}
          <div className="lg:col-span-7 bg-white border border-stone-200/80 rounded-2xl overflow-hidden min-h-[380px] lg:min-h-auto flex shadow-md relative">
            <iframe
              title="Map of Infinite Green Garden Events Kiamunyi Nakuru"
              src={ceremony.mapEmbedUrl}
              width="100%"
              height="100%"
              className="w-full min-h-[440px] border-0 filter contrast-[0.98] hover:contrast-100 transition-all duration-500"
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
