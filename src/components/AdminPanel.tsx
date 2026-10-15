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

export default function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
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
              <span className="text-[9px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/40 px-1.5 py-0.5 rounded-full font-mono text-[8px] font-bold tracking-wider uppercase flex items-center gap-1">
                <Unlock className="w-2.5 h-2.5" /> Unlocked
              </span>
            ) : (
              <span className="text-[9px] bg-amber-950/80 text-amber-300 border border-amber-800/40 px-1.5 py-0.5 rounded-full font-mono text-[8px] font-bold tracking-wider uppercase flex items-center gap-1">
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
                    className="w-full bg-gradient-to-r from-[#14532D] to-[#1e6f3d] hover:from-[#114525] hover:to-[#175b32] text-white py-3 rounded-xl font-sans font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying Passcode...</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4 text-amber-300" />
                        <span>Unlock Portal</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          ) : ( 
            /* AUTHENTICATED DASHBOARD PANEL */
            <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-4xl shadow-2xl overflow-y-auto relative flex flex-col my-2 sm:my-8 max-h-[96dvh] md:max-h-[90vh]">
              {/* Header */}
              <div className="border-b border-stone-100 p-6 flex items-center justify-between bg-[#FCFAF7]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                    <Shield className="w-5 h-5 text-[#14532D]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-xl text-stone-900 font-medium">Guest RSVP Dashboard</h3>
                      {isFirebaseConfigured ? (
                        <span className="flex items-center gap-1 text-[8px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-sans font-bold uppercase tracking-wider">
                          Cloud Live
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[8px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-sans font-bold uppercase tracking-wider">
                          Sandbox
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 font-sans">Annett &amp; Søren Wedding RSVP Database</p>
                  </div>
                </div>
                
                {/* Lock Portal & Close */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLockPortal}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700 border border-stone-200 hover:border-rose-200 rounded-xl text-xs font-sans font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Lock portal and require passcode again"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Lock Portal</span>
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Dashboard Panel Content */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 flex flex-col">
                {/* Authorized live QR scanner and one-time entry validation */}
                <CheckInScanner adminToken={adminToken} />

                {/* Dashboard stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Stat 1 */}
                  <div className="bg-[#FCFAF7] border border-stone-200 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-[#14532D]/10 text-[#14532D] flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-stone-500 uppercase font-sans font-bold">Total RSVPs</p>
                      <p className="text-xl font-semibold font-serif text-stone-900">{totalRsvps}</p>
                    </div>
                  </div>

                  {/* Stat 2 */}
                  <div className="bg-[#FCFAF7] border border-stone-200 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-stone-500 uppercase font-sans font-bold">Attending</p>
                      <p className="text-xl font-semibold font-serif text-stone-900">{totalAttending}</p>
                    </div>
                  </div>

                  {/* Stat 3 */}
                  <div className="bg-[#FCFAF7] border border-stone-200 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                      <X className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-stone-500 uppercase font-sans font-bold">Declined</p>
                      <p className="text-xl font-semibold font-serif text-stone-900">{totalDeclined}</p>
                    </div>
                  </div>
                </div>

                {/* Filter and Action Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
                  {/* Search and Filters */}
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
                    {/* Search Bar */}
                    <div className="relative flex-1 max-w-sm min-w-[200px]">
                      <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Search guest by name or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 focus:border-[#14532D] rounded-xl pl-10 pr-4 py-2 text-xs text-stone-800 outline-none transition-colors"
                      />
                    </div>

                    {/* Filter Pills */}
                    <div className="inline-flex bg-stone-50 border border-stone-200 rounded-lg p-1 text-xs">
                      <button
                        onClick={() => setAttendanceFilter('all')}
                        className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                          attendanceFilter === 'all' ? 'bg-[#14532D] text-white font-bold' : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setAttendanceFilter('yes')}
                        className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                          attendanceFilter === 'yes' ? 'bg-[#14532D] text-white font-bold' : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        Attending
                      </button>
                      <button
                        onClick={() => setAttendanceFilter('no')}
                        className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                          attendanceFilter === 'no' ? 'bg-[#14532D] text-white font-bold' : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        Declined
                      </button>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <button
                      onClick={() => loadRsvps()}
                      disabled={isLoadingData}
                      className="px-3.5 py-2 bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 hover:text-stone-900 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      title="Reload Database"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                     
                    <button
                      onClick={handleExportCSV}
                      disabled={guests.length === 0}
                      className="px-4 py-2 bg-[#14532D] hover:bg-[#0f3d21] text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-amber-300" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                {/* Mobile-friendly RSVP cards: every record can be reviewed without horizontal scrolling */}
                <div className="border border-stone-200 bg-white rounded-2xl overflow-y-auto shadow-inner max-h-[45dvh] sm:max-h-[55vh] min-h-[180px]">
                  {filteredGuests.length === 0 ? (
                    <div className="p-8 text-center text-stone-500 text-sm">
                      {isLoadingData ? 'Loading RSVPs from database...' : 'No guest records found matching the search criteria.'}
                    </div>
                  ) : (
                    <div className="divide-y divide-stone-100">
                      {filteredGuests.map((guest) => (
                        <article key={guest.id} className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h4 className="font-serif font-semibold text-stone-900 text-base break-words">{guest.fullName}</h4>
                              <p className="text-xs text-stone-500 mt-1">{guest.phoneNumber}</p>
                              <p className="text-[10px] text-stone-400 mt-1">
                                {new Date(guest.submittedAt).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDelete(guest.id)}
                              className="shrink-0 p-2 bg-white hover:bg-rose-50 text-stone-400 hover:text-rose-700 border border-stone-200 rounded-lg"
                              title="Delete Entry"
                              aria-label={`Delete RSVP for ${guest.fullName}`}
                            ><Trash2 className="w-4 h-4" /></button>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <p className="text-stone-400 uppercase tracking-wide text-[10px] mb-1">Attendance</p>
                              <button
                                onClick={() => handleToggleAttendance(guest.id)}
                                className={`px-3 py-1.5 rounded-full font-bold text-[10px] uppercase border ${
                                  guest.willAttend === 'yes'
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                    : 'bg-stone-100 border-stone-200 text-stone-600'
                                }`}
                              >{guest.willAttend === 'yes' ? 'Attending' : 'Declined'}</button>
                            </div>
                            <div>
                              <p className="text-stone-400 uppercase tracking-wide text-[10px] mb-1">E-card code</p>
                              <p className="font-mono font-bold text-[#14532D] break-all">{guest.eCardCode || '—'}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-stone-400 uppercase tracking-wide text-[10px] mb-1">Notes / Wishes</p>
                            <p className="text-sm text-stone-600 whitespace-pre-wrap break-words">{guest.notes || 'None'}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>

                {/* Desktop table */}
                <div className="hidden border border-stone-200 bg-white rounded-2xl overflow-hidden flex-1 overflow-x-auto shadow-inner max-h-[400px]">
                  <table className="w-full text-left text-xs border-collapse min-w-[650px]">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-sans font-bold uppercase tracking-wider">
                        <th className="p-4">Guest Name</th>
                        <th className="p-4">Phone Number</th>
                        <th className="p-4 text-center">Attendance</th>
                        <th className="p-4 text-center">E-Card Code</th>
                        <th className="p-4">Notes / Wishes</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGuests.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-10 text-center text-stone-500 font-serif italic text-sm">
                            {isLoadingData ? 'Loading RSVPs from database...' : 'No guest records found matching the search criteria.'}
                          </td>
                        </tr>
                      ) : (
                        filteredGuests.map((guest) => (
                          <tr key={guest.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                            <td className="p-4">
                              <div className="font-serif font-semibold text-stone-900 text-sm">{guest.fullName}</div>
                              <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                                {new Date(guest.submittedAt).toLocaleDateString('en-KE', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </td>
                            <td className="p-4 font-mono text-stone-600">{guest.phoneNumber}</td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleToggleAttendance(guest.id)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-sans font-bold text-[9px] uppercase tracking-wider border cursor-pointer ${
                                  guest.willAttend === 'yes'
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                    : 'bg-stone-100 border-stone-200 text-stone-600'
                                }`}
                                title="Click to toggle status"
                              >
                                {guest.willAttend === 'yes' ? 'Attending' : 'Declined'}
                              </button>
                            </td>
                            <td className="p-4 text-center font-mono font-bold text-[#14532D] tracking-wider">
                              {guest.eCardCode}
                            </td>
                            <td className="p-4 text-stone-600 italic max-w-xs truncate" title={guest.notes}>
                              {guest.notes || <span className="text-stone-300">None</span>}
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => handleDelete(guest.id)}
                                className="p-2 bg-white hover:bg-rose-50 text-stone-400 hover:text-rose-700 border border-stone-200 hover:border-rose-300 rounded-lg transition-all cursor-pointer"
                                title="Delete Entry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Footer Stats summary */}
                <div className="text-[10px] text-stone-500 text-center font-sans">
                  Showing {filteredGuests.length} of {guests.length} total registrations. Protected couple administrative portal.
                </div>
            </div>
          </div>
        )}
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}
