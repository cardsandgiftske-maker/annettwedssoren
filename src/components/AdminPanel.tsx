import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Key, 
  Lock, 
  Unlock, 
  Search, 
  Trash2, 
  RefreshCw, 
  X, 
  Eye, 
  EyeOff, 
  Users, 
  CheckCircle, 
  FileSpreadsheet, 
  LogOut,
  AlertCircle
} from 'lucide-react';
import { RsvpGuest } from '../types';
import CheckInScanner from './CheckInScanner';
import { 
  adminLogin, 
  getAdminRsvps, 
  updateAdminRsvpStatus, 
  deleteAdminRsvp, 
  isFirebaseConfigured 
} from '../lib/firebase';

interface AdminPanelProps {
  openSignal?: number;
}

export default function AdminPanel({ openSignal = 0 }: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Open the admin modal directly when requested from the top navigation.
  useEffect(() => {
    if (openSignal > 0) setIsOpen(true);
  }, [openSignal]);
  const [guests, setGuests] = useState<RsvpGuest[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'yes' | 'no'>('all');

  // Authentication barrier state
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState('');
  const [adminToken, setAdminToken] = useState<string>(() => {
    return sessionStorage.getItem('wedding_admin_token') || '';
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!sessionStorage.getItem('wedding_admin_authenticated');
  });

  // Fetch RSVPs when authenticated
  const loadRsvps = useCallback(async (token?: string) => {
    const activeToken = token || adminToken;
    setIsLoadingData(true);
    try {
      const data = await getAdminRsvps(activeToken);
      setGuests(data);
    } catch (err: any) {
      console.error('Failed to load RSVPs:', err);
    } finally {
      setIsLoadingData(false);
    }
  }, [adminToken]);

  // Load data automatically when opened and authenticated
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadRsvps();
    }
  }, [isOpen, isAuthenticated, loadRsvps]);

  // Handle Passcode Submission to Unlock Portal
  const handleUnlock = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!passcode.trim()) {
      setAuthError('Please enter the couple admin passcode.');
      return;
    }

    setIsVerifying(true);
    setAuthError('');

    try {
      const res = await adminLogin(passcode);
      if (res.success && res.token) {
        setAdminToken(res.token);
        setIsAuthenticated(true);
        sessionStorage.setItem('wedding_admin_authenticated', 'true');
        sessionStorage.setItem('wedding_admin_token', res.token);
        setPasscode('');
        loadRsvps(res.token);
      } else {
        setAuthError('Incorrect passcode. Please try again.');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Incorrect passcode. Access denied.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Lock portal / log out
  const handleLockPortal = () => {
    setIsAuthenticated(false);
    setAdminToken('');
    setPasscode('');
    setAuthError('');
    sessionStorage.removeItem('wedding_admin_authenticated');
    sessionStorage.removeItem('wedding_admin_token');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this RSVP entry?')) {
      try {
        await deleteAdminRsvp(adminToken, id);
        setGuests((prev) => prev.filter((g) => g.id !== id));
      } catch (err) {
        console.error('Failed to delete RSVP:', err);
      }
    }
  };

  const handleToggleAttendance = async (id: string) => {
    const guest = guests.find((g) => g.id === id);
    if (!guest) return;

    const nextAttend = guest.willAttend === 'yes' ? 'no' : 'yes';
    const nextAdults = nextAttend === 'yes' ? (guest.adultsCount || 1) : 0;

    try {
      await updateAdminRsvpStatus(adminToken, id, nextAttend, nextAdults, 0);
      setGuests((prev) =>
        prev.map((g) => (g.id === id ? { ...g, willAttend: nextAttend, adultsCount: nextAdults } : g))
      );
    } catch (err) {
      console.error('Failed to update attendance:', err);
    }
  };

  const handleExportCSV = () => {
    if (guests.length === 0) return;

    const headers = ['ID', 'Full Name', 'Phone Number', 'Will Attend', 'Song Request', 'Digital Code', 'Notes', 'Submitted At'];
    const rows = guests.map((g) => [
      g.id,
      `"${g.fullName.replace(/"/g, '""')}"`,
      `"${g.phoneNumber}"`,
      g.willAttend === 'yes' ? 'YES' : 'NO',
      `"${(g.songRequest || '').replace(/"/g, '""')}"`,
      g.eCardCode,
      `"${(g.notes || '').replace(/"/g, '""')}"`,
      g.submittedAt,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `annett_and_soren_wedding_rsvps_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered lists
  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.phoneNumber.includes(searchQuery);

    const matchesAttendance =
      attendanceFilter === 'all' ||
      (attendanceFilter === 'yes' && g.willAttend === 'yes') ||
      (attendanceFilter === 'no' && g.willAttend === 'no');

    return matchesSearch && matchesAttendance;
  });

  // Aggregate stats
  const totalRsvps = guests.length;
  const totalAttending = guests.filter((g) => g.willAttend === 'yes').length;
  const totalDeclined = guests.filter((g) => g.willAttend === 'no').length;

  return (
    <>
      {/* Floating admin entry trigger in page footer */}
      <div className="py-10 bg-stone-900 flex justify-center border-t border-stone-800 text-stone-100 font-sans text-xs select-none">
        <div className="flex flex-col items-center gap-2">
          <p className="text-stone-400">© 2026 Annett &amp; Søren. All rights reserved.</p>
          <button
            onClick={() => setIsOpen(true)}
            className="text-stone-200 hover:text-white font-medium transition-all flex items-center gap-2 cursor-pointer text-[11px] bg-stone-800 hover:bg-stone-700 px-4 py-2 rounded-full border border-stone-700 shadow-md active:scale-95"
            title="Couple Admin Portal"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Couple Admin Portal</span>
            {isAuthenticated ? (
              <span className="text-[9px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/40 px-1.5 py-0.5 rounded-full font-mono font-bold tracking-wider uppercase flex items-center gap-1">
                <Unlock className="w-2.5 h-2.5" /> Unlocked
              </span>
            ) : (
              <span className="text-[9px] bg-amber-950/80 text-amber-300 border border-amber-800/40 px-1.5 py-0.5 rounded-full font-mono font-bold tracking-wider uppercase flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> Protected
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Full screen modal wrapper */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-md flex items-start md:items-center justify-center p-2 sm:p-4 overflow-y-auto"
          >
            {/* PASSCODE BARRIER SCREEN */}
            {!isAuthenticated ? (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white border border-stone-200 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative p-8 my-8 text-stone-900"
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-5 right-5 p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#14532D]/15 to-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center text-[#14532D] mb-4 shadow-sm">
                    <Key className="w-8 h-8 text-[#14532D]" />
                  </div>

                  <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-[#C9A227] bg-[#C9A227]/10 px-3 py-1 rounded-full mb-2">
                    Private Couple Access
                  </span>

                  <h3 className="font-serif text-2xl text-stone-900 font-bold mb-1">
                    Couple Admin Portal
                  </h3>
                  <p className="text-xs text-stone-600 font-sans max-w-xs leading-relaxed mb-6">
                    Enter the secret passcode to access guest RSVPs, responses, and attendance records.
                  </p>

                  {/* Passcode Form */}
                  <form onSubmit={handleUnlock} className="w-full space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPasscode ? 'text' : 'password'}
                        value={passcode}
                        onChange={(e) => {
                          setPasscode(e.target.value);
                          if (authError) setAuthError('');
                        }}
                        placeholder="Enter admin passcode"
                        autoFocus
                        className="w-full bg-stone-50 border border-stone-300 focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/15 rounded-xl pl-10 pr-11 py-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all font-mono tracking-wider"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasscode(!showPasscode)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700 cursor-pointer"
                        title={showPasscode ? 'Hide passcode' : 'Show passcode'}
                      >
                        {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Error display */}
                    {authError && (
                      <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 text-left">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                        <span>{authError}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isVerifying || !passcode.trim()}
                      className="w-full bg-gradient-to-r from-[#14532D] to-[#1e6f3d] hover:from-[#114525] hover:to-[#175b32] text-white py-3 rounded-xl font-sans font-bold text
