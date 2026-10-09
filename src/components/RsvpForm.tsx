import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  User,
  Phone,
  Check,
  Heart,
  MessageSquare,
  ArrowLeft,
  KeyRound,
  Copy,
  ShieldCheck,
  Baby,
  Calendar,
  MapPin,
} from 'lucide-react';
import { RsvpGuest } from '../types';
import { saveRsvp, isFirebaseConfigured } from '../lib/firebase';
import Crest from './Crest';

export default function RsvpForm() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [willAttend, setWillAttend] = useState<'yes' | 'no'>('yes');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [submittedGuest, setSubmittedGuest] = useState<RsvpGuest | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);

  // Floating button state
  const [showFloatingBtn, setShowFloatingBtn] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const rsvpSection = document.getElementById('rsvp-section');
      if (rsvpSection) {
        const rect = rsvpSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setShowFloatingBtn(false);
        } else {
          setShowFloatingBtn(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const generateInvitationCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'AS-26-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2500);
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage('Please enter your phone number.');
      return;
    }

    setLoading(true);

    try {
      const cleanNotes = notes.trim();
      const newGuest: RsvpGuest = {
        id: 'rsvp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        willAttend,
        adultsCount: willAttend === 'yes' ? 1 : 0,
        childrenCount: 0,
        submittedAt: new Date().toISOString(),
        eCardCode: generateInvitationCode(),
        ...(cleanNotes ? { notes: cleanNotes } : {}),
      };

      // Save to secure backend database
      const response = await saveRsvp(newGuest);

      setSubmittedGuest(response?.rsvp || newGuest);
      setLoading(false);

      // Reset form fields
      setFullName('');
      setPhoneNumber('');
      setWillAttend('yes');
      setNotes('');
    } catch (err: any) {
      console.error('RSVP submission failure:', err);
      setErrorMessage(
        err instanceof Error && err.message
          ? err.message
          : 'Unable to submit your RSVP at this time. Please check your network connection and try again.'
      );
      setLoading(false);
    }
  };

  const scrollToRsvp = () => {
    const element = document.getElementById('rsvp-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section
        className="relative py-20 bg-[#FAF7F2] text-stone-900 border-t border-[#C9A227]/30"
        id="rsvp-section"
      >
        {/* Background Gold Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200/20 via-transparent to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          {/* Section Header */}
          <div className="text-center mb-10">
            <span className="text-[#14532D] text-xs font-bold tracking-widest uppercase font-sans flex items-center justify-center gap-1.5 mb-2">
              <Mail className="w-4 h-4 text-[#C9A227]" />
              <span>RSVP</span>
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#14532D] font-bold mb-3">
              Confirm Attendance
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mx-auto" />
            <p className="text-stone-700 text-sm md:text-base mt-3 max-w-lg mx-auto italic font-serif">
              Kindly confirm your attendance to receive your personalized entrance gate access pass.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {submittedGuest ? (
              /* WARM & ELEGANT RSVP SUCCESS EXPERIENCE WITH PERSONALIZED ENTRANCE PASS */
              <motion.div
                key="rsvp-submitted-success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="bg-white border-2 border-[#C9A227]/70 p-6 md:p-10 rounded-3xl shadow-2xl text-center text-stone-900 relative overflow-hidden max-w-2xl mx-auto"
              >
                {/* Decorative Top Accent Bar */}
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#14532D] via-[#C9A227] to-[#D9CAAE]" />

                {/* Subtle Monogram Crest */}
                <div className="mb-3">
                  <Crest size="sm" animated={false} />
                </div>

                <div className="w-12 h-12 bg-[#14532D]/10 border border-[#14532D]/30 text-[#14532D] rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>

                <p className="text-[10px] uppercase font-sans font-bold tracking-[0.25em] text-[#855802] mb-1">
                  Confirmation Received
                </p>

                <h3 className="font-serif text-2xl md:text-3xl font-semibold text-[#14532D] mb-4">
                  RSVP SUBMITTED SUCCESSFULLY
                </h3>

                <div className="w-16 h-px bg-[#C9A227]/50 mx-auto mb-6" />

                {submittedGuest.willAttend === 'yes' ? (
                  <div className="space-y-4">
                    <p className="text-base md:text-lg text-stone-800 font-serif">
                      Thank you dearly, <span className="font-bold text-[#14532D]">{submittedGuest.fullName}</span>! We look forward to celebrating this glorious day with you.
                    </p>

                    {/* PERSONALIZED GATE ENTRANCE PASS CARD */}
                    <div className="bg-gradient-to-br from-[#FAF6F0] via-white to-[#F5EFEB] border-2 border-[#C9A227] rounded-2xl p-5 md:p-6 shadow-md text-left relative overflow-hidden">
                      <div className="flex items-center justify-between pb-3 border-b border-[#C9A227]/30 mb-4">
                        <div className="flex items-center gap-2 text-[#14532D] font-serif font-bold text-base md:text-lg">
                          <KeyRound className="w-5 h-5 text-[#855802]" />
                          <span>Personalized Gate Entrance Pass</span>
                        </div>
                        <span className="text-[9px] font-sans font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#14532D]/10 text-[#14532D] border border-[#14532D]/30">
                          Verified Guest
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider font-sans font-bold text-stone-500 block">
                            Guest Name
                          </span>
                          <span className="font-serif text-lg font-bold text-stone-900">
                            {submittedGuest.fullName}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider font-sans font-bold text-stone-500 block flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-[#14532D]" /> Date &amp; Time
                            </span>
                            <span className="font-sans font-medium text-stone-800">
                              Saturday, Dec 19, 2026 • 9:00 AM
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-wider font-sans font-bold text-stone-500 block flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#14532D]" /> Venue
                            </span>
                            <span className="font-sans font-medium text-stone-800">
                              Infinite Green Gardens, Nakuru
                            </span>
                          </div>
                        </div>

                        {/* ACCESS CODE DISPLAY BOX */}
                        <div className="mt-4 p-4 bg-white border border-[#C9A227]/60 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
                          <div>
                            <span className="text-[10px] uppercase tracking-widest font-sans font-bold text-[#855802] block">
                              Gate Entrance Code
                            </span>
                            <span className="text-2xl font-mono font-bold tracking-widest text-[#14532D]">
                              {submittedGuest.eCardCode}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopyCode(submittedGuest.eCardCode)}
                            className="px-4 py-2 bg-[#14532D] hover:bg-[#0A3F24] text-white rounded-xl text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                          >
                            {codeCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-[#F5D77F]" />}
                            <span>{codeCopied ? 'Code Copied!' : 'Copy Code'}</span>
                          </button>
                        </div>

                        <div className="pt-2 text-[11px] text-stone-600 font-sans flex items-start gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#14532D] shrink-0 mt-0.5" />
                          <span>
                            <strong>Gate Security Note:</strong> Please present or quote this code to security at the gate of Infinite Green Garden Events. This entrance code is personal and non-transferable.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 font-serif">
                    <p className="text-lg text-stone-800">
                      Thank you for letting us know, <span className="font-semibold text-[#14532D]">{submittedGuest.fullName}</span>.
                    </p>
                    <p className="text-lg text-stone-700 italic">
                      We truly appreciate your response and will miss having you with us in person.
                    </p>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-stone-200 flex flex-col items-center gap-4">
                  <p className="text-xs text-stone-500 font-sans italic">
                    Annett Koskei &amp; Søren Kolind • Saturday, December 19, 2026
                  </p>

                  <button
                    onClick={() => setSubmittedGuest(null)}
                    className="text-stone-600 hover:text-[#14532D] text-xs font-sans font-bold tracking-wider uppercase flex items-center gap-1.5 cursor-pointer hover:underline transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Submit another response</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              /* CLEAN, SIMPLE RSVP FORM */
              <motion.div
                key="rsvp-input-form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white border-2 border-[#C9A227]/60 p-6 md:p-10 rounded-3xl shadow-xl relative text-stone-900 max-w-2xl mx-auto"
              >
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#14532D] via-[#C9A227] to-[#D9CAAE]" />

                <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200">
                  <h3 className="font-serif text-xl text-[#14532D] flex items-center gap-2 font-bold">
                    <Heart className="w-5 h-5 text-[#C9A227] fill-[#C9A227]/20" />
                    <span>RSVP Response Form</span>
                  </h3>
                  {isFirebaseConfigured ? (
                    <span className="flex items-center gap-1.5 text-[9px] text-[#14532D] bg-[#14532D]/10 border border-[#14532D]/30 px-2.5 py-0.5 rounded-full font-sans font-bold uppercase tracking-wider shadow-xs">
                      <span className="w-1.5 h-1.5 bg-[#14532D] rounded-full animate-pulse" />
                      <span>Cloud Synced</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[9px] text-stone-500 bg-stone-100 border border-stone-200 px-2.5 py-0.5 rounded-full font-sans font-semibold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 bg-[#C9A227] rounded-full" />
                      <span>Ready</span>
                    </span>
                  )}
                </div>

                {/* Important Advisory Banner: Adults-Only & Gate Code Notice */}
                <div className="bg-gradient-to-r from-[#14532D]/10 via-[#F5D77F]/15 to-[#D9CAAE]/30 border border-[#C9A227]/60 rounded-2xl p-4 mb-6 shadow-xs text-stone-900 font-sans leading-relaxed space-y-2">
                  <div className="flex items-start gap-2.5">
                    <Baby className="w-4 h-4 text-[#14532D] shrink-0 mt-0.5" />
                    <p className="text-xs text-stone-800 leading-snug">
                      <strong>Children Protocol:</strong> No children allowed.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <KeyRound className="w-4 h-4 text-[#855802] shrink-0 mt-0.5" />
                    <p className="text-xs text-stone-800 leading-snug">
                      <strong>Personalized Entrance Code:</strong> This invitation is personal and non-transferable (do not share this link). Upon confirming your RSVP, you will receive your unique gate entrance code.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleRsvpSubmit} className="space-y-5" id="rsvp-wedding-form">
                  {/* Full Name input */}
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-widest text-stone-700 font-sans font-bold flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#14532D]" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border border-stone-300 focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/20 rounded-xl px-4 py-3 text-sm text-stone-900 outline-none transition-all font-sans"
                    />
                  </div>

                  {/* Phone Number input */}
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-widest text-stone-700 font-sans font-bold flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#14532D]" />
                      <span>Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +254 700 000 000"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-white border border-stone-300 focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/20 rounded-xl px-4 py-3 text-sm text-stone-900 outline-none transition-all font-sans"
                    />
                  </div>

                  {/* Will Attend toggle buttons */}
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-widest text-stone-700 font-sans font-bold block">
                      Will you be joining us?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setWillAttend('yes')}
                        className={`py-3.5 text-xs uppercase tracking-wider font-sans font-bold border rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          willAttend === 'yes'
                            ? 'bg-[#14532D] border-[#14532D] text-white shadow-md'
                            : 'bg-white border-stone-300 text-stone-700 hover:text-stone-900'
                        }`}
                      >
                        <Check className="w-4 h-4 shrink-0" />
                        <span>Joyfully Accepts</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setWillAttend('no')}
                        className={`py-3.5 text-xs uppercase tracking-wider font-sans font-bold border rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          willAttend === 'no'
                            ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
                            : 'bg-white border-stone-300 text-stone-700 hover:text-stone-900'
                        }`}
                      >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Regretfully Declines</span>
                      </button>
                    </div>
                  </div>

                  {/* Custom Notes / Wishes */}
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-widest text-stone-700 font-sans font-bold flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#B8860B]" />
                      <span>
                        Wishes for Annett &amp; Søren / Special Notes{' '}
                        <span className="text-[10px] text-stone-400 font-normal">(Optional)</span>
                      </span>
                    </label>
                    <textarea
                      placeholder="Leave a heartfelt message or blessing for Annett & Søren..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full bg-white border border-stone-300 focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/20 rounded-xl px-4 py-3 text-sm text-stone-900 outline-none transition-all resize-none font-sans"
                    />
                  </div>

                  {/* Errors display */}
                  {errorMessage && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-700">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-[#14532D] via-[#104424] to-[#0A3F24] hover:brightness-110 active:scale-98 disabled:opacity-50 text-white font-sans font-bold text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg border border-[#C9A227]/40 mt-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-[#F5D77F]" />
                        <span>Confirm RSVP &amp; Get Gate Code</span>
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Floating RSVP Button */}
      <AnimatePresence>
        {showFloatingBtn && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 pointer-events-auto"
            id="floating-rsvp-button-wrapper"
          >
            <button
              onClick={scrollToRsvp}
              className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#C9A227] via-[#F5D77F] to-[#B8860B] hover:brightness-110 text-[#2E2002] font-sans font-extrabold text-xs uppercase tracking-wider rounded-full shadow-2xl active:scale-95 transition-all cursor-pointer border border-[#FFF2C6]"
            >
              <Sparkles className="w-4 h-4 text-[#2E2002]" />
              <span>RSVP NOW</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


