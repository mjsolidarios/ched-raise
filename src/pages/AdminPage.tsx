import { useState, useEffect, useMemo } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, type User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Clock, CheckCircle2, XCircle, Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";



const AdminPage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [eventStatus, setEventStatus] = useState<'ongoing' | 'finished'>('ongoing');

    // Rejection Dialog State
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

    useEffect(() => {
        // Subscribe to global settings
        const settingsUnsub = onSnapshot(doc(db, 'settings', 'general'), (docSnap) => {
            if (docSnap.exists()) {
                setEventStatus(docSnap.data().eventStatus || 'ongoing');
            } else {
                setEventStatus('ongoing');
            }
        });
        return () => settingsUnsub();
    }, []);

    const toggleEventStatus = async () => {
        const newStatus = eventStatus === 'ongoing' ? 'finished' : 'ongoing';
        try {
            // Ensure document exists and update
            await updateDoc(doc(db, 'settings', 'general'), {
                eventStatus: newStatus
            });
        } catch (e) {
            // If doc doesn't exist, create it (lazy init)
            try {
                const { setDoc } = await import('firebase/firestore');
                await setDoc(doc(db, 'settings', 'general'), { eventStatus: newStatus }, { merge: true });
            } catch (err) {
                console.error("Error toggling status", err);
            }
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            console.log('User authenticated, fetching registrations...');
            try {
                const q = query(collection(db, 'registrations'));
                console.log('Query:', q);

                const unsubscribe = onSnapshot(q,
                    (snapshot) => {
                        const registrationsData = snapshot.docs.map(doc => {
                            console.log('Document data:', doc.id, doc.data());
                            return {
                                id: doc.id,
                                ...doc.data()
                            };
                        });
                        console.log('Fetched registrations:', registrationsData);
                        setRegistrations(registrationsData);
                    },
                    (error) => {
                        console.error('Error fetching registrations:', error);
                        console.error('Error details:', error.code, error.message);
                    }
                );
                return () => unsubscribe();
            } catch (error) {
                console.error('Error setting up query:', error);
            }
        } else {
            console.log('No user, clearing registrations');
            setRegistrations([]);
        }
    }, [user]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
        } catch (error) {
            console.error("Login failed", error);
            alert("Login failed. Check console.");
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (err: any) {
            console.error("Google Auth error:", err);
            alert(err.message || 'Google Sign-In failed');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        if (newStatus === 'rejected') {
            setRejectingId(id);
            setRejectionReason('');
            setIsRejectDialogOpen(true);
            return;
        }

        try {
            const ref = doc(db, 'registrations', id);
            await updateDoc(ref, { status: newStatus });
        } catch (error) {
            console.error("Error updating status", error);
        }
    };

    const handleConfirmReject = async () => {
        if (!rejectingId) return;

        try {
            const ref = doc(db, 'registrations', rejectingId);
            await updateDoc(ref, {
                status: 'rejected',
                rejectionReason: rejectionReason
            });
            setIsRejectDialogOpen(false);
            setRejectingId(null);
            setRejectionReason('');
        } catch (error) {
            console.error("Error rejecting registration", error);
            alert("Failed to reject registration");
        }
    };

    // Helper to format full name
    const formatFullName = (lastName?: string, firstName?: string, middleName?: string) => {
        if (!lastName && !firstName && !middleName) return 'N/A';
        return `${lastName || ''}, ${firstName || ''} ${middleName || ''}`.trim();
    };

    // Filter registrations
    const filteredRegistrations = useMemo(() => {
        console.log('Filtering registrations with search term:', searchTerm);
        const filtered = registrations.filter(reg => {
            const searchLower = searchTerm.toLowerCase();
            return (
                reg.lastName?.toLowerCase().includes(searchLower) ||
                reg.firstName?.toLowerCase().includes(searchLower) ||
                reg.middleName?.toLowerCase().includes(searchLower) ||
                reg.email?.toLowerCase().includes(searchLower) ||
                reg.schoolAffiliation?.toLowerCase().includes(searchLower) ||
                reg.ticketCode?.toLowerCase().includes(searchLower) ||
                reg.id?.toLowerCase().includes(searchLower)
            );
        });
        console.log('Filtered registrations:', filtered);
        return filtered;
    }, [registrations, searchTerm]);

    // Calculate Stats
    const stats = {
        total: registrations.length,
        pending: registrations.filter(r => r.status === 'pending').length,
        confirmed: registrations.filter(r => r.status === 'confirmed').length,
        rejected: registrations.filter(r => r.status === 'rejected').length
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );

    if (!user) {
        return (
            <div className="container mt-10 mx-auto px-4 py-10 flex justify-center items-center min-h-[calc(100vh-64px)]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-sm"
                >
                    <Card className="glass-card border-primary/20 shadow-2xl">
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto w-20 h-20 flex items-center justify-center mb-2">
                                <img className='h-16 w-64' src="/r-icon.svg" alt="" />
                            </div>
                            <CardTitle>Admin Portal</CardTitle>
                            <CardDescription>Manage RAISE Registrations</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Button
                                variant="outline"
                                className="w-full h-12 text-base font-medium relative hover:bg-white/5 border-white/10 gap-3 hover:text-white mt-4"
                                onClick={handleGoogleLogin}
                                disabled={loading}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="h-5 w-5">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Continue with Google
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-[#0b1221] px-2 text-muted-foreground border border-white/10 rounded-full">Or continue with email</span>
                                </div>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input type="email" value={loginEmail} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginEmail(e.target.value)} required placeholder="admin@ched.gov.ph" className="bg-background/50 h-11" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Password</Label>
                                    <Input type="password" value={loginPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginPassword(e.target.value)} required className="bg-background/50 h-11" />
                                </div>
                                <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 mt-2 shadow-[0_0_20px_rgba(8,52,159,0.3)] hover:shadow-[0_0_30px_rgba(8,52,159,0.5)] transition-all">Sign In</Button>
                            </form>
                        </CardContent>
                        <CardFooter className="justify-center border-t border-white/5 py-4">
                            <Link to="/privacy-policy" className="text-xs text-muted-foreground/60 hover:text-primary transition-colors">
                                Privacy Policy
                            </Link>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        );
    }


    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
                <div>
                    <h1 className="mt-16 text-3xl font-bold tracking-tight text-foreground">Overview</h1>
                    <p className="text-muted-foreground">Welcome back, Admin.</p>
                </div>

                <div className="mt-10 flex items-center gap-4 bg-muted/30 p-4 rounded-lg border border-border/50">
                    <div className="space-y-0.5">
                        <Label className="text-base">Event Status: <span className={eventStatus === 'ongoing' ? 'text-emerald-500' : 'text-amber-500'}>{eventStatus.toUpperCase()}</span></Label>
                        <p className="text-xs text-muted-foreground">Toggle to specific 'Event Finished' mode.</p>
                    </div>
                    <Button
                        variant={eventStatus === 'ongoing' ? "default" : "secondary"}
                        onClick={toggleEventStatus}
                    >
                        {eventStatus === 'ongoing' ? 'Finish Event' : 'Re-open Event'}
                    </Button>
                </div>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
                {/* Stats Cards */}
                <motion.div variants={item} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="glass-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">All time submissions</p>
                        </CardContent>
                    </Card>
                    <Card className="glass-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                            <Clock className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-500">{stats.pending}</div>
                            <p className="text-xs text-muted-foreground">Requires action</p>
                        </CardContent>
                    </Card>
                    <Card className="glass-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-500">{stats.confirmed}</div>
                            <p className="text-xs text-muted-foreground">Approved attendees</p>
                        </CardContent>
                    </Card>
                    <Card className="glass-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                            <XCircle className="h-4 w-4 text-destructive" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-destructive">{stats.rejected}</div>
                            <p className="text-xs text-muted-foreground">Declined submissions</p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Main Content Area */}
                <motion.div variants={item} >
                    <Card className="glass-card">
                        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Registrations</CardTitle>
                                <CardDescription>Manage and review participant details.</CardDescription>
                            </div>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search names, emails..."
                                    className="pl-8 bg-background/50"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="rounded-md border border-border/50 overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead>Full Name</TableHead>
                                            <TableHead>School / Type</TableHead>
                                            <TableHead>Contact</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Ticket ID</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredRegistrations.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                                    No registrations found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredRegistrations.map((reg) => (
                                                <TableRow key={reg.id} className="hover:bg-muted/30 transition-colors">
                                                    <TableCell>
                                                        <div className="font-medium">{formatFullName(reg.lastName, reg.firstName, reg.middleName)}</div>
                                                        <div className="text-xs text-muted-foreground/70 font-mono">{reg.id.slice(0, 8)}...</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">{reg.schoolAffiliation || 'N/A'}</div>
                                                        <div className="text-xs text-muted-foreground capitalize">{reg.registrantType || 'N/A'} {reg.registrantType === 'others' && reg.registrantTypeOther ? `(${reg.registrantTypeOther})` : ''}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">{reg.email}</div>
                                                        <div className="text-xs text-muted-foreground">{reg.contactNumber}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={`
                                                                ${reg.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : ''}
                                                                ${reg.status === 'rejected' ? 'bg-destructive/10 text-destructive border-destructive/20' : ''}
                                                                ${reg.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : ''}
                                                            `}
                                                        >
                                                            {reg.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-sm">{reg.ticketCode || reg.id}</span>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6"
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(reg.ticketCode || reg.id);
                                                                    // Optional: Show a toast notification
                                                                    // toast.success('Ticket ID copied to clipboard');
                                                                }}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                                                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                                                </svg>
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Select onValueChange={(val: string) => updateStatus(reg.id, val)} value={reg.status}>
                                                            <SelectTrigger className="w-[130px] ml-auto h-8 text-xs">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent align="end">
                                                                <SelectItem value="pending">
                                                                    <div className="flex items-center gap-2"><Clock className="h-3 w-3" /> Pending</div>
                                                                </SelectItem>
                                                                <SelectItem value="confirmed">
                                                                    <div className="flex items-center gap-2 decoration-emerald-500"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Confirm</div>
                                                                </SelectItem>
                                                                <SelectItem value="rejected">
                                                                    <div className="flex items-center gap-2"><XCircle className="h-3 w-3 text-destructive" /> Reject</div>
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Registration</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting this registration. This will be visible to the user.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="rejection-reason" className="mb-2 block">Reason for Rejection</Label>
                        <textarea
                            id="rejection-reason"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="e.g., Invalid ID uploaded, Duplicate entry..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleConfirmReject} disabled={!rejectionReason.trim()}>Confirm Rejection</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
};

export default AdminPage;
