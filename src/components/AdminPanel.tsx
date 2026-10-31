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
