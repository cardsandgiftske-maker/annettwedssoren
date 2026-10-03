import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, AlertCircle, Sparkles, User, Phone, Check, QrCode, Download, Users, Image as ImageIcon, Calendar, ShieldCheck, ShieldAlert } from 'lucide-react';
import { toPng } from 'html-to-image';
import { RsvpGuest } from '../types';
import { WEDDING_DETAILS } from '../data';
import { saveRsvp, isFirebaseConfigured, hasPhoneAlreadyRsvped } from '../lib/firebase';
import couplePortraitImg from '../assets/images/annett_soren_portrait_1791020362236.jpg';

export default function RsvpForm() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [willAttend, setWillAttend] = useState<'yes' | 'no'>('yes');
  const [adultsCount, setAdultsCount] = useState(1);
  const [notes, setNotes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [submittedGuest, setSubmittedGuest] = useState<RsvpGuest | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const cardRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadECard = async () => {
    if (!cardRef.current || !submittedGuest) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#FAF8F5'
      });
      const link = document.createElement('a');
      const safeName = submittedGuest.fullName.replace(/[^a-zA-Z0-9]/g, '_');
      link.download = `Annett_Soren_Wedding_Pass_${safeName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate downloadable e-card image:', err);
    } finally {
      setDownloading(false);
    }
  };

  const generateInvitationCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'AS-26-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
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
      // Deduplication check: only one RSVP submission per phone number
      const alreadySubmitted = await hasPhoneAlreadyRsvped(phoneNumber.trim());
      if (alreadySubmitted) {
        setErrorMessage('This phone number has already submitted an RSVP. Each phone number can only RSVP once. Please reach out directly to Annett or Søren if you need to adjust your reservation.');
        setLoading(false);
        return;
      }

      const newGuest: RsvpGuest = {
        id: 'rsvp-' + Date.now(),
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        willAttend,
        adultsCount: willAttend === 'yes' ? adultsCount : 0,
        childrenCount: 0, // Strictly adults only
        submittedAt: new Date().toISOString(),
        eCardCode: generateInvitationCode(),
        notes: notes.trim() || undefined,
      };

      // Save to Firebase (with transparent localStorage fallback inside)
      await saveRsvp(newGuest);

      setSubmittedGuest(newGuest);
      setLoading(false);

      // Reset fields
      setFullName('');
      setPhoneNumber('');
      setWillAttend('yes');
      setAdultsCount(1);
      setNotes('');

      // Dispatch event to refresh admin dashboard
      window.dispatchEvent(new Event('rsvp_database_updated'));
    } catch (err) {
      setErrorMessage('Something went wrong. Please try again.');
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
      <section className="relative py-24 bg-[#FAF8F5] text-stone-850 border-t border-stone-200/60" id="rsvp-section">
        <div className="absolute inset-0 bg-radial-gradient from-[#1B4D3E]/[0.02] via-transparent to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="text-[#1B4D3E] text-[11px] font-bold tracking-[0.2em] uppercase font-sans block mb-2">
              CONFIRM ATTENDANCE &amp; GATE PASS
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-normal text-stone-900 tracking-tight mb-3">
              RSVP &amp; Entrance Pass
            </h2>
            <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto mb-6" />
            
            {/* Prominent Callout Banner for RSVP Deadline & Security */}
            <div className="inline-block w-full max-w-xl mx-auto bg-white border border-[#D4AF37]/50 shadow-sm rounded-2xl p-5 text-stone-900 relative overflow-hidden text-center">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1B4D3E] via-[#D4AF37] to-[#885C1C]" />
              <div className="flex items-center justify-center gap-2 mb-1.5 text-[#1B4D3E] font-sans font-bold text-xs uppercase tracking-widest">
                <Calendar className="w-4 h-4 text-[#1B4D3E]" />
                <span>RSVP Deadline: 30th November 2026</span>
              </div>
              <p className="text-base md:text-lg font-serif font-medium text-stone-900 leading-relaxed">
                Kindly RSVP on or before <span className="text-[#1B4D3E] font-bold underline decoration-[#D4AF37] underline-offset-4">30th November 2026</span> to guarantee your reserved seats and receive your personalized entrance pass.
              </p>
              
              {/* Security protocol pill */}
              <div className="mt-3 pt-3 border-t border-stone-150 flex flex-wrap items-center justify-center gap-3 text-[11px] font-sans text-stone-600">
                <span className="flex items-center gap-1 font-semibold text-rose-800">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
                  Strictly Adults Only (No Children)
                </span>
                <span className="text-stone-300">•</span>
                <span className="flex items-center gap-1 font-semibold text-[#1B4D3E]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1B4D3E]" />
                  Non-Transferable Invitation
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            {/* Form Column */}
            <div className="md:col-span-6 bg-white border border-stone-200/80 p-8 rounded-3xl shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl text-stone-900 flex items-center gap-2 font-medium">
                  <Mail className="w-5 h-5 text-[#1B4D3E]" />
                  <span>RSVP Registration</span>
                </h3>
                {isFirebaseConfigured ? (
                  <span className="flex items-center gap-1.5 text-[9px] text-[#1B4D3E] bg-[#F2F7F4] border border-[#1B4D3E]/30 px-2.5 py-0.5 rounded-full font-sans font-bold uppercase tracking-wider shadow-2xs">
                    <span className="w-1.5 h-1.5 bg-[#1B4D3E] rounded-full animate-pulse" />
                    <span>Cloud Database</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[9px] text-stone-500 bg-stone-100 border border-stone-250 px-2.5 py-0.5 rounded-full font-sans font-semibold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                    <span>Ready</span>
                  </span>
                )}
              </div>

              <form onSubmit={handleRsvpSubmit} className="space-y-5" id="rsvp-wedding-form">
                {/* Full Name input */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-widest text-stone-500 font-sans font-bold flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span>Full Name (as per ID / Invitation)</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gladys Chepkemoi"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-200 focus:border-[#1B4D3E] focus:ring-1 focus:ring-[#1B4D3E]/20 rounded-xl px-4 py-3 text-sm text-stone-800 outline-none transition-all"
                  />
                </div>

                {/* Phone Number input */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-widest text-stone-500 font-sans font-bold flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +254 700 000 000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-200 focus:border-[#1B4D3E] focus:ring-1 focus:ring-[#1B4D3E]/20 rounded-xl px-4 py-3 text-sm text-stone-800 outline-none transition-all"
                  />
                  <p className="text-[10px] text-stone-400 font-sans italic">
                    Used to generate your secure gate entrance code.
                  </p>
                </div>

                {/* Will Attend toggle radio */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-widest text-stone-500 font-sans font-bold block">
                    Will you attend?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setWillAttend('yes')}
                      className={`py-3.5 text-xs uppercase tracking-wider font-sans font-bold border rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        willAttend === 'yes'
                          ? 'bg-[#1B4D3E] border-[#1B4D3E] text-white shadow-md'
                          : 'bg-[#FAF8F5] border-stone-200 text-stone-500 hover:text-stone-800 hover:border-stone-300'
                      }`}
                    >
                      <Check className="w-4 h-4 shrink-0" />
                      <span>Yes, with joy!</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setWillAttend('no')}
                      className={`py-3.5 text-xs uppercase tracking-wider font-sans font-bold border rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        willAttend === 'no'
                          ? 'bg-stone-200 border-stone-300 text-stone-800 shadow-xs'
                          : 'bg-[#FAF8F5] border-stone-200 text-stone-500 hover:text-stone-800 hover:border-stone-300'
                      }`}
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Regretfully declines</span>
                    </button>
                  </div>
                </div>

                {/* Number of Adults Attending (Strictly Adults Only) */}
                <AnimatePresence>
                  {willAttend === 'yes' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 pt-2 pb-1 overflow-hidden"
                    >
                      <div className="bg-[#FAF8F5] border border-stone-200 p-4 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] uppercase tracking-wider text-stone-700 font-sans font-bold flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#1B4D3E]" />
                            <span>Adult Guests (Age 18+)</span>
                          </label>
                          <span className="text-[10px] font-sans font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                            Strictly No Children
                          </span>
                        </div>

                        <div className="flex items-center justify-between bg-white border border-stone-200 rounded-lg p-1.5">
                          <button
                            type="button"
                            onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                            className="w-9 h-9 rounded-md bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-700 font-bold flex items-center justify-center cursor-pointer transition-all"
                            title="Decrease adults count"
                          >
                            -
                          </button>
                          <span className="font-serif text-lg font-semibold text-stone-900">
                            {adultsCount} {adultsCount === 1 ? 'Adult' : 'Adults'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setAdultsCount(Math.min(2, adultsCount + 1))}
                            className="w-9 h-9 rounded-md bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-700 font-bold flex items-center justify-center cursor-pointer transition-all"
                            title="Increase adults count (max 2 per invitation)"
                          >
                            +
                          </button>
                        </div>

                        <p className="text-[10px] text-stone-500 font-sans leading-normal">
                          * Seats are strictly reserved for invited adults. Invitations cannot be transferred or shared.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Custom Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-widest text-stone-500 font-sans font-bold block">
                    Special Wishes or Dietary Notes
                  </label>
                  <textarea
                    placeholder="Optional message to Annett & Søren (e.g., Congratulations, dietary preferences)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full bg-[#FAF8F5] border border-stone-200 focus:border-[#1B4D3E] focus:ring-1 focus:ring-[#1B4D3E]/20 rounded-xl px-4 py-3 text-sm text-stone-800 outline-none transition-all resize-none"
                  />
                </div>

                {/* Errors display */}
                {errorMessage && (
                  <div className="p-3.5 bg-rose-50 border border-rose-250 rounded-xl flex items-center gap-2.5 text-xs text-rose-700">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#1B4D3E] hover:bg-[#153e32] active:scale-98 disabled:opacity-50 text-white font-sans font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      <span>Confirm &amp; Generate Gate Pass</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* E-Invitation & Entrance Gate Pass Display Column */}
            <div className="md:col-span-6 flex flex-col items-center">
              <AnimatePresence mode="wait">
                {submittedGuest ? (
                  /* Success / Downloadable Gate Pass E-Card */
                  <div className="w-full max-w-[390px] flex flex-col items-center space-y-4">
                    {/* Visual Printable/Downloadable E-Card Element */}
                    <div
                      ref={cardRef}
                      id="downloadable-wedding-ecard"
                      className="w-full bg-[#FAF8F5] border-2 border-[#D4AF37] rounded-3xl p-6 shadow-xl relative flex flex-col overflow-hidden text-stone-800"
                    >
                      {/* Decorative Gold & Emerald Accents */}
                      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#1B4D3E] via-[#D4AF37] to-[#1B4D3E]" />
                      <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#D4AF37]/15 rounded-full blur-xl pointer-events-none" />
                      <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-[#1B4D3E]/15 rounded-full blur-xl pointer-events-none" />

                      {/* Top Header */}
                      <div className="text-center pb-3 border-b border-stone-200/80">
                        <span className="text-[9px] uppercase tracking-widest font-sans font-bold text-[#1B4D3E] bg-[#F2F7F4] border border-[#1B4D3E]/30 px-3 py-1 rounded-full inline-block mb-1.5">
                          Official Gate Pass &amp; E-Invitation
                        </span>
                        <h4 className="font-serif text-2xl font-normal text-stone-900 tracking-tight">Annett &amp; Søren</h4>
                        <p className="text-[10px] font-serif italic text-stone-600 mt-0.5 leading-tight">
                          Together with Mr. &amp; Mrs. Koskei and Mr. Hans Kolind
                        </p>
                      </div>

                      {/* Couple Photo Section */}
                      <div className="my-3 relative rounded-2xl overflow-hidden border border-[#D4AF37]/50 shadow-2xs">
                        <img
                          src={couplePortraitImg}
                          alt="Annett & Søren Wedding Portrait"
                          className="w-full h-44 object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5">
                          <p className="text-white text-xs font-serif italic font-light tracking-wide">
                            “Two are better than one...” — Ecclesiastes 4:9
                          </p>
                        </div>
                      </div>

                      {/* Wedding Details */}
                      <div className="bg-white/95 border border-stone-200/80 rounded-2xl p-3.5 space-y-2 text-center shadow-2xs">
                        <div className="space-y-0.5">
                          <p className="text-[9px] text-stone-400 font-sans font-bold uppercase tracking-widest">Date &amp; Time</p>
                          <p className="font-serif text-sm font-semibold text-stone-900">Saturday, 19th December 2026 | 9:00 AM Prompt</p>
                        </div>
                        <div className="border-t border-stone-100 pt-1.5 space-y-0.5">
                          <p className="text-[9px] text-stone-400 font-sans font-bold uppercase tracking-widest">Celebration Venue</p>
                          <p className="text-xs font-serif font-medium text-stone-850">
                            <strong>Infinite Green Garden Events</strong>, Kiamunyi, Nakuru
                          </p>
                          <p className="text-[10px] text-stone-500 font-sans">
                            (Ceremony &amp; Reception at the same grounds)
                          </p>
                        </div>
                      </div>

                      {/* Guest Details Section with Security Entrance Code */}
                      <div className="mt-3 bg-[#FAF7F0] border border-[#D4AF37]/70 rounded-2xl p-3.5 text-center space-y-2">
                        <p className="text-[9px] text-[#1B4D3E] uppercase tracking-widest font-sans font-bold">Personal Admittance Pass</p>
                        <p className="font-serif text-base font-semibold text-stone-900">{submittedGuest.fullName}</p>
                        
                        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-0.5">
                          <span className={`text-[10px] uppercase font-sans font-bold px-2.5 py-0.5 rounded-full ${
                            submittedGuest.willAttend === 'yes' ? 'bg-[#1B4D3E] text-white' : 'bg-stone-300 text-stone-700'
                          }`}>
                            {submittedGuest.willAttend === 'yes' ? 'Attending' : 'Declined'}
                          </span>
                          {submittedGuest.willAttend === 'yes' && (
                            <span className="text-[10px] font-sans font-medium text-stone-800 bg-white border border-[#D4AF37] px-2.5 py-0.5 rounded-full">
                              {submittedGuest.adultsCount} Adult{submittedGuest.adultsCount !== 1 ? 's' : ''} (Strictly Adults Only)
                            </span>
                          )}
                        </div>

                        {/* Personalized Gate Access Code & QR */}
                        <div className="pt-2 flex items-center justify-between border-t border-[#D4AF37]/50 text-left">
                          <div>
                            <p className="text-[9px] text-stone-500 uppercase font-bold tracking-wider">Gate Entrance Code</p>
                            <p className="font-mono text-sm font-bold text-[#1B4D3E] tracking-wider">{submittedGuest.eCardCode}</p>
                            <p className="text-[8px] text-stone-400 font-sans mt-0.5">Required at Security Gate</p>
                          </div>
                          <div className="w-12 h-12 bg-white border border-stone-200 rounded-lg p-1 flex items-center justify-center shadow-xs">
                            <QrCode className="w-full h-full text-stone-800" />
                          </div>
                        </div>
                      </div>

                      {/* Dress Code & Non-Transferable notice */}
                      <div className="text-center mt-2.5 bg-white border border-stone-200 rounded-xl p-2 text-[9px] font-sans space-y-0.5">
                        <p className="text-[#1B4D3E] font-bold uppercase tracking-wider">
                          Dress Code: Formal Elegant (Green, Gold &amp; Beige)
                        </p>
                        <p className="text-stone-500 font-medium">
                          Strictly Adults Only • Private &amp; Non-Transferable
                        </p>
                      </div>
                    </div>

                    {/* Download & Share Action Buttons */}
                    <div className="w-full space-y-2.5 pt-2">
                      <button
                        onClick={handleDownloadECard}
                        disabled={downloading}
                        className="w-full py-3.5 bg-[#1B4D3E] hover:bg-[#153e32] active:scale-98 disabled:opacity-50 text-white font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        {downloading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Generating Gate Pass...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            <span>Download Gate Pass (PNG)</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setSubmittedGuest(null)}
                        className="w-full py-2.5 text-xs text-stone-500 hover:text-stone-800 font-semibold tracking-wide block text-center cursor-pointer transition-colors"
                      >
                        ← Back to RSVP Form
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Standard / Instruction Side Card */
                  <motion.div
                    key="standard-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full max-w-[360px] bg-white border border-stone-200/90 shadow-sm rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-5 relative overflow-hidden group"
                  >
                    {/* Couple Portrait Preview */}
                    <div className="w-full h-44 rounded-2xl overflow-hidden border border-stone-200 relative shadow-inner">
                      <img
                        src={couplePortraitImg}
                        alt="Annett & Søren Wedding Preview"
                        className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center p-2.5">
                        <span className="text-[10px] text-white font-serif uppercase tracking-widest">Annett &amp; Søren</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-serif text-lg text-stone-850 font-medium">Personal Gate Pass Preview</h4>
                      <p className="text-xs text-stone-500 leading-relaxed max-w-[270px] mx-auto">
                        Upon completing your RSVP, you will receive a unique entrance pass code and downloadable pass required for verification at Infinite Green Garden Events.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 w-full text-[10px] text-stone-500 uppercase tracking-widest font-sans font-bold flex items-center justify-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#1B4D3E]" />
                      <span>Instant Gate Code &amp; PNG Pass</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
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
              className="flex items-center gap-2.5 px-6 py-3.5 bg-[#1B4D3E] hover:bg-[#153e32] text-white font-sans font-bold text-xs uppercase tracking-wider rounded-full shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37] animate-spin" style={{ animationDuration: '4s' }} />
              <span>Confirm Attendance &amp; Pass</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
