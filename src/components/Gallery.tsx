import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles, Maximize2, X, Pause, Play } from 'lucide-react';

import couplePortrait from '../assets/images/annett_soren_couple_1791475779285.jpg';
import gardenVenueImg from '../assets/images/infinite_green_gardens_1791475797084.jpg';
import engagementHandsRingImg from '../assets/images/engagement_hands_ring_1786638744313.jpg';

interface GalleryItem {
  url: string;
  caption: string;
  category: string;
}

const GALLERY_IMAGES: GalleryItem[] = [
  {
    url: couplePortrait,
    caption: 'Annett Koskei & Søren Kolind — Embracing a Lifetime of Love',
    category: 'The Couple'
  },
  {
    url: gardenVenueImg,
    caption: 'Infinite Green Garden Events, Kiamunyi — The Wedding Grounds',
    category: 'Ceremony & Reception Venue'
  },
  {
    url: engagementHandsRingImg,
    caption: 'Forever Starts Here — The Sacred Engagement Ring',
    category: 'Engagement'
  },
  {
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
    caption: 'Joyful Moments & Elegant Celebrations',
    category: 'Pre-Wedding'
  },
  {
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200',
    caption: 'Hand-in-Hand into Forever — Nakuru Sunset Harmony',
    category: 'Romantic Moments'
  }
];

export default function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Swipe support
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying || isLightboxOpen) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying, isLightboxOpen]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section className="relative py-20 md:py-28 bg-[#FAF7F2] text-stone-900 overflow-hidden border-t border-[#C9A227]/30" id="gallery-section">
      {/* Background Radial Gold Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200/20 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <span className="text-[#14532D] text-xs font-bold tracking-widest uppercase font-sans flex items-center justify-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Memories &amp; Moments</span>
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-[#14532D] font-bold mb-3">
            Wedding Gallery
          </h2>
          <p className="text-stone-700 text-sm md:text-base font-serif italic max-w-xl mx-auto leading-relaxed">
            A celebration of our love story, engagement journey, and our picturesque Nakuru sanctuary venue.
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mx-auto mt-4" />
        </div>

        {/* Carousel Frame - Luxury Photo Album Style */}
        <div className="relative bg-white border-2 border-[#C9A227]/60 rounded-3xl p-3 md:p-6 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#14532D] via-[#C9A227] to-[#D9CAAE]" />

          {/* Main Display Container */}
          <div
            className="relative aspect-[16/10] md:aspect-[21/9] rounded-2xl overflow-hidden bg-stone-900 group shadow-inner border border-[#C9A227]/30"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={() => setIsPlaying(false)}
            onMouseLeave={() => setIsPlaying(true)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={GALLERY_IMAGES[currentIndex].url}
                alt={GALLERY_IMAGES[currentIndex].caption}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full h-full object-cover object-center cursor-pointer"
                onClick={() => setIsLightboxOpen(true)}
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>

            {/* Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />

            {/* Top Toolbar Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-full bg-white/90 hover:bg-white text-[#14532D] border border-[#C9A227]/60 backdrop-blur-md transition-all cursor-pointer shadow-md"
                title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              >
                {isPlaying ? <Pause className="w-4 h-4 text-[#14532D]" /> : <Play className="w-4 h-4 text-[#14532D]" />}
              </button>
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="p-2 rounded-full bg-white/90 hover:bg-white text-[#14532D] border border-[#C9A227]/60 backdrop-blur-md transition-all cursor-pointer shadow-md"
                title="Expand photo"
              >
                <Maximize2 className="w-4 h-4 text-[#14532D]" />
              </button>
            </div>

            {/* Caption & Counter Badge */}
            <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 flex items-end justify-between pointer-events-none z-10 gap-3">
              <div className="bg-white/95 backdrop-blur-md border border-[#C9A227]/60 rounded-2xl px-4 py-2.5 md:px-5 md:py-3 max-w-xl shadow-lg">
                <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-[#14532D] block mb-0.5">
                  {GALLERY_IMAGES[currentIndex].category}
                </span>
                <p className="text-xs md:text-sm font-serif text-stone-900 leading-snug font-medium">
                  {GALLERY_IMAGES[currentIndex].caption}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-stone-800 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#C9A227]/60 flex-shrink-0 shadow-md">
                <span className="text-[#14532D] font-bold">{currentIndex + 1}</span>
                <span className="text-stone-400">/</span>
                <span>{GALLERY_IMAGES.length}</span>
              </div>
            </div>

            {/* Previous & Next Navigation Buttons */}
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white text-[#14532D] border border-[#C9A227]/60 flex items-center justify-center backdrop-blur-md transition-all cursor-pointer opacity-90 hover:scale-105 active:scale-95 shadow-lg"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white text-[#14532D] border border-[#C9A227]/60 flex items-center justify-center backdrop-blur-md transition-all cursor-pointer opacity-90 hover:scale-105 active:scale-95 shadow-lg"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dots & Thumbnail Navigation Strip */}
          <div className="flex flex-col items-center gap-4 mt-5">
            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {GALLERY_IMAGES.map((_, idx) => (
                <button
                  key={`dot-${idx}`}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx
                      ? 'w-8 bg-[#14532D]'
                      : 'w-2 bg-stone-300 hover:bg-stone-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Thumbnail Strip */}
            <div className="flex items-center gap-2 md:gap-3 overflow-x-auto max-w-full py-1 px-2 no-scrollbar">
              {GALLERY_IMAGES.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative rounded-xl overflow-hidden transition-all cursor-pointer border-2 flex-shrink-0 ${
                    currentIndex === idx
                      ? 'border-[#14532D] scale-105 shadow-md'
                      : 'border-stone-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-14 h-10 md:w-20 md:h-14 object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white border border-[#C9A227]/60 text-[#6D1F32] hover:text-[#33070B] transition-all z-50 cursor-pointer shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>

            <div
              className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={GALLERY_IMAGES[currentIndex].url}
                alt={GALLERY_IMAGES[currentIndex].caption}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border-2 border-[#C9A227]/60"
                referrerPolicy="no-referrer"
              />
              <div className="mt-4 text-center">
                <span className="text-xs uppercase font-sans font-bold tracking-widest text-[#F5D77F]">
                  {GALLERY_IMAGES[currentIndex].category}
                </span>
                <p className="text-stone-200 font-serif text-lg mt-1">
                  {GALLERY_IMAGES[currentIndex].caption}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

