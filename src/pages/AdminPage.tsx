import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, type User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Clock, CheckCircle2, XCircle, Search, Loader2, Shield } from 'lucide-react';
import { motion } from 'framer-motion';



const AdminPage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            const q = query(collection(db, 'registrations'), orderBy('timestamp', 'desc'));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                setRegistrations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            });
            return () => unsubscribe();
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

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const ref = doc(db, 'registrations', id);
            await updateDoc(ref, { status: newStatus });
        } catch (error) {
            console.error("Error updating status", error);
        }
    };

    // Helper to format full name
    const formatFullName = (lastName?: string, firstName?: string, middleName?: string) => {
        if (!lastName && !firstName && !middleName) return 'N/A';
        return `${lastName || ''}, ${firstName || ''} ${middleName || ''}`.trim();
    };

    // Filter registrations
    const filteredRegistrations = registrations.filter(reg =>
        reg.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.middleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.schoolAffiliation?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            <div className="container mx-auto px-4 py-10 flex justify-center items-center min-h-[calc(100vh-64px)]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-sm"
                >
                    <Card className="glass-card border-primary/20 shadow-2xl">
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
                                <Shield className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>Admin Portal</CardTitle>
                            <CardDescription>Secure access for specialized staff</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input type="email" value={loginEmail} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginEmail(e.target.value)} required placeholder="admin@ched.gov.ph" className="bg-background/50" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Password</Label>
                                    <Input type="password" value={loginPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginPassword(e.target.value)} required className="bg-background/50" />
                                </div>
                                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Sign In</Button>
                            </form>
                        </CardContent>
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
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredRegistrations.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
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
        </div>
    );
};

export default AdminPage;
