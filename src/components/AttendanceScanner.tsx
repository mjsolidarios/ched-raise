import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scan, Keyboard, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { recordAttendance } from '@/lib/attendanceService';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface AttendanceScannerProps {
    scannedBy: string;
    onSuccess?: () => void;
}

export function AttendanceScanner({ scannedBy, onSuccess }: AttendanceScannerProps) {
    const [mode, setMode] = useState<'scan' | 'manual'>('manual');
    const [ticketCode, setTicketCode] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [lastResult, setLastResult] = useState<{ success: boolean; message: string } | null>(null);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    // Initialize/Cleanup Scanner
    useEffect(() => {
        if (mode === 'scan') {
            // Small timeout to ensure DOM element exists
            const timer = setTimeout(() => {
                const scanner = new Html5QrcodeScanner(
                    "reader",
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1
                    },
                    false
                );

                scanner.render(onScanSuccess, onScanFailure);
                scannerRef.current = scanner;
            }, 100);

            return () => {
                clearTimeout(timer);
                if (scannerRef.current) {
                    scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
                }
            };
        }
    }, [mode]);

    const onScanSuccess = async (decodedText: string) => {
        if (isProcessing) return;

        // Pause scanning
        if (scannerRef.current) {
            scannerRef.current.pause();
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
            // Resume scanning afte delay
            setTimeout(() => {
                if (scannerRef.current) {
                    scannerRef.current.resume();
                }
            }, 2000);
        }
    };

    const onScanFailure = (_error: any) => {
        // console.warn(error); // Ignore frame errors
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
                    <div className="w-full max-w-sm mx-auto overflow-hidden rounded-lg border border-white/10 bg-black/50">
                        <div id="reader" className="w-full"></div>
                        <p className="text-xs text-center text-muted-foreground p-2">
                            Point camera at QR code
                        </p>
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
