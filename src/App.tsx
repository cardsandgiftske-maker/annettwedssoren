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

            {/* Admin Portal Direct Access */}
            <button
              onClick={() => scrollToSection('admin-panel')}
              className="px-3 md:px-4 py-2 bg-[#14532D] hover:bg-[#1B6B3A] border border-[#C9A227]/70 text-[#F5D77F] font-sans font-extrabold text-[9px] md:text-[10px] uppercase tracking-wider rounded-full transition-all cursor-pointer shadow-md flex items-center gap-1.5 whitespace-nowrap"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
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
        <div id="admin-panel">
          <AdminPanel />
        </div>

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
