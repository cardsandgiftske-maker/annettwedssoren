import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Gift, Shirt, Sparkles, Mail, ChevronUp, Clock } from 'lucide-react';
import Hero from './components/Hero';
import ProgramSchedule from './components/ProgramSchedule';
import DressCode from './components/DressCode';
import Gifting from './components/Gifting';
import LocationMap from './components/LocationMap';
import RsvpForm from './components/RsvpForm';
import AdminPanel from './components/AdminPanel';
import Envelope from './components/Envelope';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero-section');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [shouldPlayMusic, setShouldPlayMusic] = useState(false);

  // Lock body scroll while the envelope is closed
  useEffect(() => {
    if (!isEnvelopeOpened) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isEnvelopeOpened]);

  const handleEnvelopeOpen = () => {
    setIsEnvelopeOpened(true);
  };

  // Monitor scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      const sections = ['hero-section', 'maps-section', 'program-section', 'dress-code-section', 'gifting-section', 'rsvp-section'];
      const scrollPosition = window.scrollY + window.innerHeight * 0.4;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'hero-section', label: 'Welcome', icon: Sparkles },
    { id: 'maps-section', label: 'Venue', icon: MapPin },
    { id: 'program-section', label: 'Program', icon: Clock },
    { id: 'dress-code-section', label: 'Attire', icon: Shirt },
    { id: 'gifting-section', label: 'Gifting', icon: Gift },
    { id: 'rsvp-section', label: 'RSVP', icon: Mail },
  ];

  return (
    <>
      <MusicPlayer shouldPlay={shouldPlayMusic} />
      
      <AnimatePresence mode="wait">
        {!isEnvelopeOpened && (
          <Envelope 
            onOpen={handleEnvelopeOpen} 
            onSealBreak={() => setShouldPlayMusic(true)} 
          />
        )}
      </AnimatePresence>

      {isEnvelopeOpened && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="relative min-h-screen bg-[#071F11] text-stone-100 font-sans selection:bg-[#C9A227]/30 selection:text-white overflow-x-hidden antialiased"
        >
        {/* Floating Header Navigation */}
        <header className="fixed top-0 inset-x-0 z-40 bg-[#071F11]/90 backdrop-blur-md border-b border-[#C9A227]/30 transition-all">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo Name */}
            <button 
              onClick={() => scrollToSection('hero-section')}
              className="font-serif text-lg tracking-widest font-light cursor-pointer flex items-center gap-1.5 hover:opacity-90 transition-opacity text-stone-100"
            >
              <span className="text-gold-light font-bold">ANNETT</span>
              <span className="text-[#C9A227] font-sans text-xs italic">&amp;</span>
              <span className="text-gold-light font-bold">SØREN</span>
            </button>

            {/* Desktop Nav menu items */}
            <nav className="hidden md:flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-stone-300">
              {navItems.map((item) => {
                const IconComp = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-3.5 py-2 rounded-full transition-all flex items-center gap-1.5 cursor-pointer hover:text-white ${
                      isActive
                        ? 'bg-[#C9A227] text-[#14532D] font-extrabold shadow-sm'
                        : 'border border-transparent hover:border-[#C9A227]/40'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Direct Action Button */}
            <button
              onClick={() => scrollToSection('rsvp-section')}
              className="md:hidden px-4 py-1.5 bg-gradient-to-r from-[#C9A227] to-[#B8860B] text-[#14532D] font-sans font-extrabold text-[10px] uppercase tracking-widest rounded-full transition-all cursor-pointer shadow-md"
            >
              RSVP NOW
            </button>
          </div>
        </header>

        {/* Main Content Sections Wrapper */}
        <main className="relative z-10 pt-16">
          <Hero />
          <LocationMap />
          <ProgramSchedule />
          <DressCode />
          <Gifting />
          <RsvpForm />
        </main>

        {/* Couple Administrative Database Section */}
        <AdminPanel />

        {/* Desktop Vertical Indicator Navigation Dots (Right Edge) */}
        <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-5 items-center">
          {navItems.map((item) => (
            <button
              key={`dot-${item.id}`}
              onClick={() => scrollToSection(item.id)}
              className="group relative flex items-center justify-end"
              title={item.label}
            >
              <span className="absolute right-full mr-4 bg-[#071F11] border border-[#C9A227]/60 px-2.5 py-1 rounded text-[10px] font-sans font-bold uppercase tracking-wider shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 text-[#F5D77F]">
                {item.label}
              </span>
              <span className={`w-2.5 h-2.5 rounded-full border transition-all ${
                activeSection === item.id 
                  ? 'bg-[#C9A227] border-[#F5D77F] scale-125 shadow-sm' 
                  : 'bg-stone-800 border-stone-600 group-hover:border-[#C9A227] group-hover:scale-110'
              }`} />
            </button>
          ))}
        </div>

        {/* Floating scroll-to-top button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed bottom-6 left-6 z-45"
              id="scroll-to-top-button-container"
            >
              <button
                onClick={() => scrollToSection('hero-section')}
                className="p-3 bg-[#071F11] hover:bg-[#14532D] border border-[#C9A227]/60 text-[#F5D77F] rounded-full shadow-xl active:scale-95 transition-all cursor-pointer"
                title="Scroll to Top"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      )}
    </>
  );
}
