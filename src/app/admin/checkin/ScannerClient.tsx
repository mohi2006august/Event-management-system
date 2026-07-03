'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Event } from '@/types';
import { CheckCircle, AlertTriangle, XCircle, RefreshCcw, Camera, ShieldAlert } from 'lucide-react';

interface ScannerClientProps {
  events: Pick<Event, 'id' | 'title'>[];
}

type ScanStatus = 'idle' | 'scanning' | 'processing' | 'success' | 'duplicate' | 'invalid' | 'wrong_event' | 'error';

interface ScanResult {
  status: ScanStatus;
  message?: string;
  attendee?: { name: string; email: string };
  attendedAt?: number;
}

export default function ScannerClient({ events }: ScannerClientProps) {
  const [selectedEventId, setSelectedEventId] = useState<string>(events.length > 0 ? events[0].id : '');
  const [scanResult, setScanResult] = useState<ScanResult>({ status: 'idle' });
  const [successCount, setSuccessCount] = useState(0);
  const [hasPermissionError, setHasPermissionError] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  // Debounce ref to prevent multiple rapid scans of the same code
  const lastScannedCode = useRef<string | null>(null);
  const lockRef = useRef<boolean>(false);

  useEffect(() => {
    if (!selectedEventId) return;

    // Check if we're in a secure context (required for camera access)
    if (window.isSecureContext === false) {
      setHasPermissionError(true);
      return;
    }

    try {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        },
        false
      );

      scannerRef.current.render(onScanSuccess, onScanFailure);
    } catch (err) {
      console.error("Scanner init error", err);
      setHasPermissionError(true);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEventId]);

  const onScanSuccess = async (decodedText: string) => {
    // If we're already processing a scan, or the same code was just scanned, ignore
    if (lockRef.current || lastScannedCode.current === decodedText) {
      return;
    }

    lockRef.current = true;
    lastScannedCode.current = decodedText;
    setScanResult({ status: 'processing', message: 'Verifying ticket...' });

    // Auto-reset the duplicate scan lock after 5 seconds to allow rescanning the same code if needed
    setTimeout(() => {
      lastScannedCode.current = null;
    }, 5000);

    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketCode: decodedText,
          targetEventId: selectedEventId,
        }),
      });

      const data = await response.json();

      if (data.result === 'success') {
        setSuccessCount(prev => prev + 1);
        setScanResult({
          status: 'success',
          message: data.message,
          attendee: data.attendee,
        });
      } else if (data.result === 'duplicate') {
        setScanResult({
          status: 'duplicate',
          message: data.message,
          attendee: data.attendee,
          attendedAt: data.attendedAt,
        });
      } else if (data.result === 'invalid' || data.result === 'wrong_event') {
        setScanResult({
          status: data.result,
          message: data.message || 'Invalid ticket.',
        });
      } else {
        setScanResult({ status: 'error', message: data.error || 'Unknown error occurred.' });
      }

    } catch (error) {
      setScanResult({ status: 'error', message: 'Network error communicating with server.' });
    } finally {
      // Keep the result visible for a few seconds before returning to idle
      setTimeout(() => {
        setScanResult({ status: 'idle' });
        lockRef.current = false;
      }, 3500);
    }
  };

  const onScanFailure = (error: any) => {
    // html5-qrcode spam-calls this on every frame that doesn't have a QR code.
    // We ignore it to keep the console clean.
  };

  const manualResume = () => {
    setScanResult({ status: 'idle' });
    lockRef.current = false;
    lastScannedCode.current = null;
  };

  if (hasPermissionError) {
    return (
      <div className="bg-red-50 p-8 rounded-2xl border border-red-200 text-center max-w-lg mx-auto mt-10">
        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-900 mb-2">Camera Access Required</h2>
        <p className="text-red-700 mb-4">
          We could not access your camera. This usually happens if you deny camera permissions, or if you are not accessing this site over HTTPS.
        </p>
        <p className="text-sm text-red-600 bg-red-100 p-4 rounded-lg font-mono">
          <strong>Testing locally on your phone?</strong><br/>
          You cannot use an IP address (like 192.168.x.x) because modern browsers block camera access on non-HTTPS connections. <br/><br/>
          Please use a tunneling service like <strong>ngrok</strong> (`ngrok http 3000`) and open the HTTPS URL on your phone.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      {/* Scanner Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Event to Check-in</label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
            disabled={scanResult.status === 'processing'}
          >
            {events.length === 0 && <option value="">No events available</option>}
            {events.map(event => (
              <option key={event.id} value={event.id}>{event.title}</option>
            ))}
          </select>
        </div>

        <div className="relative flex-1 bg-black rounded-xl overflow-hidden min-h-[300px]">
          <div id="qr-reader" className="w-full h-full border-0 !border-transparent [&>div]:!border-0"></div>
          
          {/* Overlay for lock state */}
          {scanResult.status !== 'idle' && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
              {scanResult.status === 'processing' && (
                <>
                  <RefreshCcw className="w-12 h-12 text-blue-400 animate-spin mb-4" />
                  <h3 className="text-xl font-bold text-white">Verifying...</h3>
                </>
              )}
              
              {scanResult.status === 'success' && (
                <>
                  <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">{scanResult.attendee?.name}</h3>
                  <p className="text-green-300 text-lg">Check-in successful!</p>
                </>
              )}

              {scanResult.status === 'duplicate' && (
                <>
                  <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">{scanResult.attendee?.name}</h3>
                  <p className="text-amber-300 font-medium mb-1">Already Checked In</p>
                  {scanResult.attendedAt && (
                    <p className="text-amber-200/70 text-sm">
                      Originally scanned at {new Date(scanResult.attendedAt).toLocaleTimeString()}
                    </p>
                  )}
                </>
              )}

              {(scanResult.status === 'invalid' || scanResult.status === 'wrong_event' || scanResult.status === 'error') && (
                <>
                  <XCircle className="w-16 h-16 text-red-500 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Scan Failed</h3>
                  <p className="text-red-300">{scanResult.message}</p>
                </>
              )}

              {scanResult.status !== 'processing' && (
                <button 
                  onClick={manualResume}
                  className="mt-8 px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm font-medium transition-colors"
                >
                  Tap to scan next
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <Camera className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="text-gray-500 text-lg font-medium mb-2">Session Check-ins</h2>
        <div className="text-7xl font-black text-gray-900 tracking-tighter">
          {successCount}
        </div>
        <p className="mt-6 text-sm text-gray-400 max-w-xs">
          Keep the camera pointed at the QR code. The scanner will automatically lock after a scan and resume shortly after.
        </p>
      </div>
    </div>
  );
}
