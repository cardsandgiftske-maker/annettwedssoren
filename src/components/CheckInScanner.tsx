import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { AlertCircle, CheckCircle2, ShieldAlert, ScanLine } from 'lucide-react';

type CheckInResult = {
  success: boolean;
  status: 'granted' | 'used' | 'invalid' | 'declined' | 'error';
  message: string;
  guest?: { fullName: string; eCardCode?: string; checkedInAt?: string };
};

export default function CheckInScanner({ adminToken }: { adminToken: string }) {
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [scannerKey, setScannerKey] = useState(0);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('wedding-qr-reader', { fps: 10, qrbox: { width: 230, height: 230 } }, false);
    scannerRef.current = scanner;
    scanner.render(async (decodedText) => {
      if (busyRef.current) return;
      busyRef.current = true;
      setBusy(true);
      setResult(null);
      try {
        const response = await fetch('/api/admin/check-in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
          body: JSON.stringify({ token: decodedText }),
        });
        const data = await response.json();
        setResult(data as CheckInResult);
      } catch {
        setResult({ success: false, status: 'error', message: 'Unable to verify QR. Check your connection and try again.' });
      } finally {
        setBusy(false);
      }
    }, () => {});
    return () => {
      scanner.clear().catch(() => {});
      scannerRef.current = null;
    };
  }, [adminToken, scannerKey]);

  const granted = result?.status === 'granted';
  const duplicate = result?.status === 'used';
  return (
    <section className="mb-6 rounded-2xl border border-[#C9A227]/50 bg-[#FCFAF7] p-5 text-stone-900">
      <div className="mb-3 flex items-center gap-2 text-[#14532D]"><ScanLine className="h-5 w-5"/><h3 className="font-serif text-xl font-bold">Guest QR Check-in</h3></div>
      <p className="mb-4 text-sm text-stone-600">Scan each guest's personal QR code. The first valid scan grants entry; repeat scans are rejected.</p>
      <div id="wedding-qr-reader" className="mx-auto max-w-md overflow-hidden rounded-xl bg-white" />
      {busy && <p className="mt-3 text-center text-sm font-semibold text-stone-600">Verifying invitation…</p>}
      {result && <div className={`mt-4 rounded-xl border p-4 ${granted ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-rose-300 bg-rose-50 text-rose-900'}`}>
        <div className="flex items-center gap-2 font-extrabold">{granted ? <CheckCircle2 className="h-6 w-6"/> : duplicate ? <ShieldAlert className="h-6 w-6"/> : <AlertCircle className="h-6 w-6"/>}<span>{result.message}</span></div>
        {result.guest && <div className="mt-2 text-sm"><p className="font-bold">{result.guest.fullName}</p>{result.guest.eCardCode && <p>Gate code: {result.guest.eCardCode}</p>}{result.guest.checkedInAt && <p>First check-in: {new Date(result.guest.checkedInAt).toLocaleString()}</p>}</div>}
        <button type="button" onClick={() => { busyRef.current = false; setResult(null); setScannerKey((v) => v + 1); }} className="mt-3 rounded-lg bg-[#14532D] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">Scan next guest</button>
      </div>}
    </section>
  );
}
