import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scan, Keyboard, CheckCircle, XCircle, Loader2, RefreshCw, Pause, Play } from 'lucide-react';
import { recordAttendance } from '@/lib/attendanceService';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

interface AttendanceScannerProps {
    scannedBy: string;
    onSuccess?: () => void;
}

export function AttendanceScanner({ scannedBy, onSuccess }: AttendanceScannerProps) {
    const [mode, setMode] = useState<'scan' | 'manual'>('manual');
    const [ticketCode, setTicketCode] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [lastResult, setLastResult] = useState<{ success: boolean; message: string } | null>(null);
    const [scannerError, setScannerError] = useState<string | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const isScannerRunning = useRef(false);
    const scannerContainerId = "attendance-scanner-reader";

    // Initialize/Cleanup Scanner
    useEffect(() => {
        let isMounted = true;

        const startScanner = async () => {
            if (mode !== 'scan') return;

            // Cleanup previous instance if any
            if (scannerRef.current && isScannerRunning.current) {
                try {
                    await scannerRef.current.stop();
                    scannerRef.current.clear();
                    isScannerRunning.current = false;
                } catch (e) {
                    console.warn("Cleanup error:", e);
                }
            }
            // If instance exists but not running (failed start or cleared), just null it
            scannerRef.current = null;

            // Small delay to ensure DOM is ready
            await new Promise(resolve => setTimeout(resolve, 100));
            if (!isMounted) return;

            const element = document.getElementById(scannerContainerId);
            if (!element) {
                console.error("Scanner container not found");
                return;
            }

            try {
                const html5QrCode = new Html5Qrcode(scannerContainerId);
                scannerRef.current = html5QrCode;

                const config = {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                    formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
                };

                await html5QrCode.start(
                    { facingMode: "environment" },
                    config,
                    (decodedText) => {
                        if (isMounted) onScanSuccess(decodedText);
                    },
                    (_errorMessage) => {
                        // ignore frame errors
                    }
                );

                if (isMounted) {
                    isScannerRunning.current = true;
                    setScannerError(null);
                } else {
                    // Start finished but we unmounted
                    try {
                        await html5QrCode.stop();
                        html5QrCode.clear();
                    } catch (e) { console.warn("Unmount cleanup error", e); }
                }

            } catch (err) {
                console.error("Failed to start scanner", err);
                if (isMounted) {
                    setScannerError("Could not access camera. Please ensure permissions are granted.");
                    toast.error("Camera access failed");
                }
                // Ensure ref is null if start failed
                scannerRef.current = null;
                isScannerRunning.current = false;
            }
        };

        if (mode === 'scan') {
            startScanner();
        }

        return () => {
            isMounted = false;
            if (scannerRef.current && isScannerRunning.current) {
                isScannerRunning.current = false; // Mark as stopping immediately
                scannerRef.current.stop().then(() => {
                    scannerRef.current?.clear();
                }).catch(err => {
                    console.warn("Failed to stop scanner on unmount", err);
                });
            }
        };
    }, [mode]);

    const onScanSuccess = async (decodedText: string) => {
        if (isProcessing) return;

        // Pause scanning logic implicitly by setting processing flag
        // We don't necessarily need to pause the camera stream, just ignore new inputs
        // But for better UX, we can pause
        if (scannerRef.current) {
            try {
                await scannerRef.current.pause();
            } catch (e) { console.warn("Pause error", e) }
        }

        setIsProcessing(true);
        try {
            const result = await recordAttendance(decodedText, 'scan', scannedBy);
            setLastResult(result);

            if (result.success) {
                toast.success(result.message);
                onSuccess?.();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to process scan");
        } finally {
            setIsProcessing(false);
            // Resume scanning after delay
            setTimeout(() => {
                if (scannerRef.current) {
                    try {
                        scannerRef.current.resume();
                    } catch (e) { console.warn("Resume error", e) }
                }
            }, 2000);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!ticketCode.trim()) {
            toast.error('Please enter a ticket code');
            return;
        }

        setIsProcessing(true);
        setLastResult(null);

        const result = await recordAttendance(ticketCode.trim(), mode, scannedBy);

        setLastResult(result);

        if (result.success) {
            toast.success(result.message);
            setTicketCode('');
            onSuccess?.();
        } else {
            toast.error(result.message);
        }

        setIsProcessing(false);
    };

    const handleRetryCamera = () => {
        // Force re-mount of effect
        setMode('manual');
        setTimeout(() => setMode('scan'), 100);
    };

    const togglePause = async () => {
        if (!scannerRef.current) return;

        if (isPaused) {
            try {
                await scannerRef.current.resume();
                setIsPaused(false);
            } catch (e) {
                console.warn("Resume error", e);
                toast.error("Failed to resume scanner");
            }
        } else {
            try {
                await scannerRef.current.pause();
                setIsPaused(true);
            } catch (e) {
                console.warn("Pause error", e);
                setIsPaused(true); // Treat as paused anyway UI wise
            }
        }
    };

    return (
        <Card className="glass-card border-white/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Scan className="h-5 w-5 text-primary" />
                    Record Attendance
                </CardTitle>
                <CardDescription>
                    Scan or manually enter the RAISE ID to record attendance
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Mode Toggle */}
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={mode === 'manual' ? 'default' : 'outline'}
                        onClick={() => setMode('manual')}
                        className="flex-1 min-w-[140px]"
                    >
                        <Keyboard className="h-4 w-4 mr-2" />
                        <span className="whitespace-nowrap">Manual Entry</span>
                    </Button>
                    <Button
                        variant={mode === 'scan' ? 'default' : 'outline'}
                        onClick={() => setMode('scan')}
                        className="flex-1 min-w-[140px]"
                    >
                        <Scan className="h-4 w-4 mr-2" />
                        <span className="whitespace-nowrap">Scan QR Code</span>
                    </Button>
                </div>

                {/* Scanner View */}
                {mode === 'scan' && (
                    <div className="w-full max-w-sm mx-auto overflow-hidden rounded-lg border border-white/10 bg-black/50 relative min-h-[300px] flex flex-col items-center justify-center">
                        <div id={scannerContainerId} className="w-full h-full" />

                        {scannerError && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-black/80 z-10">
                                <XCircle className="h-8 w-8 text-red-500 mb-2" />
                                <p className="text-red-400 text-sm mb-4">{scannerError}</p>
                                <Button size="sm" variant="outline" onClick={handleRetryCamera}>
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Retry Camera
                                </Button>
                            </div>
                        )}

                        {!scannerError && <p className="text-xs text-center text-muted-foreground p-2 absolute bottom-0 left-0 right-0 bg-black/50 z-10">
                            Point camera at QR code
                        </p>}

                        {/* Pause Overlay */}
                        {isPaused && (
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
                                <Pause className="h-12 w-12 text-white/50 mb-2" />
                                <p className="text-white font-medium">Scanner Paused</p>
                                <Button variant="secondary" size="sm" className="mt-4" onClick={togglePause}>
                                    <Play className="h-4 w-4 mr-2" /> Resume
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Scanner Controls */}
                {mode === 'scan' && !scannerError && (
                    <div className="flex justify-center">
                        <Button
                            variant={isPaused ? "default" : "secondary"}
                            size="sm"
                            onClick={togglePause}
                            className="w-full"
                        >
                            {isPaused ? (
                                <>
                                    <Play className="h-4 w-4 mr-2" /> Resume Scanning
                                </>
                            ) : (
                                <>
                                    <Pause className="h-4 w-4 mr-2" /> Pause Scanning
                                </>
                            )}
                        </Button>
                    </div>
                )}

                {/* Manual Entry Form */}
                {mode === 'manual' && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">
                                Ticket Code / Registration ID
                            </label>
                            <Input
                                value={ticketCode}
                                onChange={(e) => setTicketCode(e.target.value)}
                                placeholder="Enter ticket code or registration ID"
                                className="font-mono"
                                disabled={isProcessing}
                                autoFocus
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isProcessing || !ticketCode.trim()}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Record Attendance
                                </>
                            )}
                        </Button>
                    </form>
                )}

                {/* Result Display */}
                <AnimatePresence>
                    {lastResult && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`p-4 rounded-lg border ${lastResult.success
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                : 'bg-red-500/10 border-red-500/20 text-red-500'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                {lastResult.success ? (
                                    <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                ) : (
                                    <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                )}
                                <p className="text-sm font-medium">{lastResult.message}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}
