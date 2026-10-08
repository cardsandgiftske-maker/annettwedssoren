import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Key, Search, Trash2, RefreshCw, X, Eye, EyeOff, Users, CheckCircle, FileSpreadsheet, LogOut } from 'lucide-react';
import { RsvpGuest } from '../types';
import { 
  adminLogin, 
  getAdminRsvps, 
  updateAdminRsvpStatus, 
  deleteAdminRsvp, 
  isFirebaseConfigured 
} from '../lib/firebase';

export default function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string>(() => sessionStorage.getItem('wedding_admin_token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!sessionStorage.getItem('wedding_admin_token'));
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [guests, setGuests] = useState<RsvpGuest[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [passcodeError, setPasscodeError] = useState('');

  // Fetch RSVPs from the secure backend endpoint
  const loadRsvps = useCallback(async (tokenToUse?: string) => {
    const token = tokenToUse || adminToken;
    if (!token) return;

    setIsLoadingData(true);
    try {
      const data = await getAdminRsvps(token);
      setGuests(data);
    } catch (err: any) {
      console.error('Failed to load RSVPs:', err);
      if (err.message && (err.message.includes('Unauthorized') || err.message.includes('Forbidden'))) {
        setIsAuthenticated(false);
        setAdminToken('');
        sessionStorage.removeItem('wedding_admin_token');
        setPasscodeError('Session expired. Please log in again.');
      }
    } finally {
      setIsLoadingData(false);
    }
  }, [adminToken]);

  // Load data ONLY when the modal is opened AND user is authenticated
  useEffect(() => {
    if (isOpen && isAuthenticated && adminToken) {
      loadRsvps(adminToken);
    }
  }, [isOpen, isAuthenticated, adminToken, loadRsvps]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError('');
    setIsLoggingIn(true);

    try {
      const result = await adminLogin(passcode);
      if (result.success && result.token) {
        setAdminToken(result.token);
        sessionStorage.setItem('wedding_admin_token', result.token);
        setIsAuthenticated(true);
        setPasscode('');
        await loadRsvps(result.token);
      }
    } catch (err: any) {
      setPasscodeError(err.message || 'Incorrect passcode. Access Denied.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminToken('');
    sessionStorage.removeItem('wedding_admin_token');
    setGuests([]);
  };

  const handleDelete = async (id: string) => {
    if (!adminToken) return;
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
    if (!adminToken) return;
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

    // Construct CSV Header and Content
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
    
    // Create hidden trigger to download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `annett_and_soren_wedding_rsvps_${new Date().toISOString().slice(0,10)}.csv`);
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
      {/* Small floating admin entry trigger in the page footer */}
      <div className="py-10 bg-stone-900 flex justify-center border-t border-stone-800 text-stone-100 font-sans text-xs select-none">
        <div className="flex flex-col items-center gap-2">
          <p className="text-stone-400">© 2026 Annett &amp; Søren. All rights reserved.</p>
          <button
            onClick={() => setIsOpen(true)}
            className="text-stone-200 hover:text-white font-medium transition-all flex items-center gap-1.5 cursor-pointer text-[11px] bg-stone-800 hover:bg-stone-700 px-4 py-2 rounded-full border border-stone-700 shadow-md active:scale-95"
            title="Password-Protected Couple Admin Panel"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Couple Admin Portal</span>
            <span className="text-[9px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/40 px-1.5 py-0.5 rounded-full font-mono text-[8px] font-bold tracking-wider uppercase">Secured</span>
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
            className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden relative flex flex-col my-8 max-h-[90vh]">
              {/* Header */}
              <div className="border-b border-stone-100 p-6 flex items-center justify-between bg-[#FCFAF7]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-maroon-50 border border-maroon-200 flex items-center justify-center text-maroon-700">
                    <Shield className="w-5 h-5" />
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
                <div className="flex items-center gap-2">
                  {isAuthenticated && (
                    <button
                      onClick={handleLogout}
                      className="p-2 hover:bg-rose-50 rounded-full text-stone-400 hover:text-rose-700 transition-colors cursor-pointer"
                      title="Log Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Login authentication overlay if not authenticated */}
              {!isAuthenticated ? (
                <div className="p-12 flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-6">
                  <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center animate-pulse">
                    <Key className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-serif text-lg text-stone-900 font-medium">Passcode Required</h4>
                    <p className="text-xs text-stone-500">Exclusively for Annett &amp; Søren to access the guest RSVP database.</p>
                  </div>

                  <form onSubmit={handleLogin} className="w-full space-y-4">
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter Admin Passcode"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 focus:border-maroon-700 rounded-xl pl-4 pr-11 py-3 text-sm text-stone-800 outline-none transition-colors text-center font-sans"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-700 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {passcodeError && (
                      <p className="text-xs text-rose-600 font-medium">{passcodeError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isLoggingIn}
                      className="w-full py-3 bg-maroon-800 hover:bg-maroon-900 text-white font-sans font-bold uppercase tracking-wider text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isLoggingIn ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>Authenticate Access</span>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                /* Authenticated Dashboard Panel */
                <div className="p-6 overflow-y-auto space-y-6 flex-1 flex flex-col">
                  {/* Dashboard stats cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Stat 1 */}
                    <div className="bg-[#FCFAF7] border border-stone-200 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
                      <div className="w-10 h-10 rounded-xl bg-maroon-50 text-maroon-700 flex items-center justify-center shrink-0">
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
                          className="w-full bg-stone-50 border border-stone-200 focus:border-maroon-700 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-800 outline-none transition-colors"
                        />
                      </div>

                      {/* Filter Pills */}
                      <div className="inline-flex bg-stone-50 border border-stone-200 rounded-lg p-1 text-xs">
                        <button
                          onClick={() => setAttendanceFilter('all')}
                          className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                            attendanceFilter === 'all' ? 'bg-maroon-700 text-white font-bold' : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setAttendanceFilter('yes')}
                          className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                            attendanceFilter === 'yes' ? 'bg-maroon-700 text-white font-bold' : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          Attending
                        </button>
                        <button
                          onClick={() => setAttendanceFilter('no')}
                          className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                            attendanceFilter === 'no' ? 'bg-maroon-700 text-white font-bold' : 'text-stone-600 hover:text-stone-900'
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
                        className="px-4 py-2 bg-maroon-800 hover:bg-maroon-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Guest Table/List */}
                  <div className="border border-stone-200 bg-white rounded-2xl overflow-hidden flex-1 overflow-x-auto shadow-inner max-h-[400px]">
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
                              <td className="p-4 text-center font-mono font-bold text-maroon-800 tracking-wider">
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
                    Showing {filteredGuests.length} of {guests.length} total registrations. Secured couple administrative portal.
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
