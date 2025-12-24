import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { AttendanceScanner } from '@/components/AttendanceScanner';
import { getAttendanceRecords, getAttendanceStats, type AttendanceRecord, type AttendanceStats } from '@/lib/attendanceService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, CheckCircle, Clock, XCircle, Scan, Keyboard, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AttendancePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [stats, setStats] = useState<AttendanceStats | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                navigate('/login');
            } else {
                setUser(currentUser);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user]);

    const loadData = async () => {
        const [attendanceRecords, attendanceStats] = await Promise.all([
            getAttendanceRecords(),
            getAttendanceStats()
        ]);
        setRecords(attendanceRecords);
        setStats(attendanceStats);
    };

    const filteredRecords = records.filter(record =>
        record.attendeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.ticketCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.attendeeEmail?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-12">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold mb-2">Attendance Tracking</h1>
                    <p className="text-muted-foreground">Record and manage event attendance</p>
                </motion.div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <Card className="glass-card border-white/10">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Total Attendance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.total}</div>
                            </CardContent>
                        </Card>

                        <Card className="glass-card border-white/10">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                                    Confirmed
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-emerald-500">{stats.confirmed}</div>
                            </CardContent>
                        </Card>

                        <Card className="glass-card border-white/10">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Scan className="h-4 w-4 text-blue-500" />
                                    Scanned
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-blue-500">{stats.scanned}</div>
                            </CardContent>
                        </Card>

                        <Card className="glass-card border-white/10">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Keyboard className="h-4 w-4 text-purple-500" />
                                    Manual Entry
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-purple-500">{stats.manual}</div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Scanner */}
                    <div className="lg:col-span-1">
                        <AttendanceScanner scannedBy={user?.uid || ''} onSuccess={loadData} />
                    </div>

                    {/* Attendance List */}
                    <div className="lg:col-span-2">
                        <Card className="glass-card border-white/10">
                            <CardHeader>
                                <CardTitle>Attendance Records</CardTitle>
                                <CardDescription>
                                    Recent check-ins ({filteredRecords.length} records)
                                </CardDescription>
                                <div className="pt-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search by name, email, or ticket code..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                    {filteredRecords.length === 0 ? (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p>No attendance records found</p>
                                        </div>
                                    ) : (
                                        filteredRecords.map((record) => (
                                            <motion.div
                                                key={record.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-semibold">{record.attendeeName}</h3>
                                                            <Badge
                                                                variant="outline"
                                                                className={
                                                                    record.method === 'scan'
                                                                        ? 'border-blue-500/30 text-blue-500'
                                                                        : 'border-purple-500/30 text-purple-500'
                                                                }
                                                            >
                                                                {record.method === 'scan' ? (
                                                                    <><Scan className="h-3 w-3 mr-1" /> Scanned</>
                                                                ) : (
                                                                    <><Keyboard className="h-3 w-3 mr-1" /> Manual</>
                                                                )}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">{record.attendeeEmail}</p>
                                                        <p className="text-xs text-muted-foreground font-mono mt-1">
                                                            ID: {record.ticketCode}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium">
                                                            {record.timestamp.toDate().toLocaleDateString()}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {record.timestamp.toDate().toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
