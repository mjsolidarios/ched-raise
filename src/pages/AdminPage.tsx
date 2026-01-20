
import { useState, useEffect, useMemo } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, deleteDoc, updateDoc, doc, query, where, onSnapshot, setDoc, deleteField } from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, type User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '@/components/ui/badge';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { Users, Clock, CheckCircle2, XCircle, Search, Loader2, Scan, Keyboard, Mail, Trash2, MoreHorizontal, Copy, BarChart3, ArrowUpDown, ArrowUp, ArrowDown, Filter, ShieldCheck, Activity } from 'lucide-react';
// Recharts removed as we switched to list view
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { UserAvatar, getDeterministicAvatarColor } from '@/components/UserAvatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceScanner } from '@/components/AttendanceScanner';
import { getAttendanceRecords, getAttendanceStats, type AttendanceRecord, type AttendanceStats } from '@/lib/attendanceService';
import { getRegionShortName, PHILIPPINE_REGIONS } from '@/lib/regions';
import axios from 'axios';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import NotFoundPage from './NotFoundPage';



const AdminPage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState<'name' | 'region' | 'status' | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [regionFilter, setRegionFilter] = useState<string>('all');
    const [eventStatus, setEventStatus] = useState<'ongoing' | 'finished'>('ongoing');

    // Admin Role State
    const [adminRole, setAdminRole] = useState<'super_admin' | 'regional_admin' | 'user' | null>(null);
    const [adminRegion, setAdminRegion] = useState<string | null>(null);
    const [userDataLoaded, setUserDataLoaded] = useState(false);

    // Attendance State
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null);
    const [attendanceSearch, setAttendanceSearch] = useState('');

    // Rejection Dialog State
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

    // Email Confirmation State
    const [emailConfirmation, setEmailConfirmation] = useState<{ isOpen: boolean; reg: any | null }>({
        isOpen: false,
        reg: null
    });

    // Delete Survey State
    const [deleteSurveyConfirmation, setDeleteSurveyConfirmation] = useState<{ isOpen: boolean; reg: any | null }>({
        isOpen: false,
        reg: null
    });

    // Promote Super Admin State
    const [promoteSuperAdminConfirmation, setPromoteSuperAdminConfirmation] = useState<{ isOpen: boolean; id: string | null }>({
        isOpen: false,
        id: null
    });


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

    const [globalStats, setGlobalStats] = useState<{ name: string; value: number }[]>([]);

    useEffect(() => {
        // Fetch global stats for the region breakdown card
        const unsub = onSnapshot(doc(db, 'settings', 'stats'), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.regions) {
                    setGlobalStats(data.regions);
                }
            }
        });
        return () => unsub();
    }, []);

    const toggleEventStatus = async () => {
        if (adminRole !== 'super_admin') return; // Security check
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
            if (!currentUser) {
                setLoading(false);
                setUserDataLoaded(true); // Technically loaded nothing
            }
        });
        return () => unsubscribe();
    }, []);

    // Sync Permissions State
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncSuccess, setSyncSuccess] = useState(false);

    // Fetch Admin Details (Role & Region)
    useEffect(() => {
        if (!user) return;

        // We need to find the registration doc for this user to get their role
        const q = query(collection(db, 'registrations'), where('uid', '==', user.uid));
        const unsub = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const data = snapshot.docs[0].data();
                setAdminRole(data.role || 'user'); // Default to user if no role
                setAdminRegion(data.region || null);
            } else {
                setAdminRole('user');
                setAdminRegion(null);
            }
            setUserDataLoaded(true);
        });

        return () => unsub();
    }, [user]);

    // Force region filter for regional admins
    useEffect(() => {
        if (adminRole === 'regional_admin' && adminRegion) {
            setRegionFilter(adminRegion);
        }
    }, [adminRole, adminRegion]);

    // Workaround: Sync Stats to Public Settings
    // Since common users can't read 'registrations', we aggregate stats here (as admin) and save to 'settings/stats' (public read)
    useEffect(() => {
        if (registrations.length > 0 && adminRole === 'super_admin') {
            console.log("🔄 Syncing public stats...");
            const stats: Record<string, { count: number, avatars: { seed: string, color: string, firstName?: string, id?: string, ticketCode?: string }[] }> = {};

            // Initialize all regions with 0
            PHILIPPINE_REGIONS.forEach(region => {
                stats[region] = { count: 0, avatars: [] };
            });

            // Re-calculate stats from the full list
            registrations.forEach(repo => { // repo? variable naming in map below suggests 'registrationsData' items
                const data = repo as any;
                const region = data.region || 'Unknown';
                if (!stats[region]) {
                    stats[region] = { count: 0, avatars: [] };
                }
                stats[region].count += 1;

                // Collect avatars (limit 15 for safety)
                if (stats[region].avatars.length < 15 && (data.ticketCode || data.id)) {
                    stats[region].avatars.push({
                        seed: data.avatarSeed || data.ticketCode || data.id,
                        id: data.id,
                        ticketCode: data.ticketCode,
                        color: data.avatarColor || getDeterministicAvatarColor(data.ticketCode || data.id),
                        firstName: data.firstName
                    });
                }
            });

            // Format for saving
            const chartData = Object.entries(stats)
                .map(([name, data]) => ({
                    name,
                    value: data.count,
                    avatars: data.avatars
                }))
                .sort((a, b) => b.value - a.value);

            // Debounce or just save
            // We use setDoc with merge to avoid overwriting other potential settings if we used a shared doc, but 'stats' is dedicated
            setDoc(doc(db, 'settings', 'stats'), {
                regions: chartData,
                lastUpdated: new Date()
            }, { merge: true })
                .then(() => console.log("✅ Stats synced to public settings"))
                .catch((err: any) => console.error("❌ Failed to sync stats", err));
        }
    }, [registrations, adminRole]);

    // const navigate = useNavigate();

    // Redirect non-admins
    // useEffect(() => {
    //     if (userDataLoaded && user && adminRole === 'user') {
    //         toast.error("Access Denied: You do not have admin privileges.");
    //         navigate('/');
    //     }
    // }, [userDataLoaded, user, adminRole, navigate]);

    useEffect(() => {
        if (user && userDataLoaded) {
            console.log('User authenticated and role loaded, fetching registrations...');
            try {
                let q;

                if (adminRole === 'regional_admin' && adminRegion) {
                    console.log(`Fetching registrations for region: ${adminRegion}`);
                    q = query(collection(db, 'registrations'), where('region', '==', adminRegion));
                } else {
                    // Super admin or normal user (though normal user shouldn't be here, we'll handle UI later)
                    // fetching all for super admin
                    console.log('Fetching all registrations');
                    q = query(collection(db, 'registrations'));
                }

                const unsubscribe = onSnapshot(q,
                    (snapshot) => {
                        const registrationsData = snapshot.docs.map(doc => {
                            return {
                                id: doc.id,
                                ...doc.data()
                            };
                        });
                        setRegistrations(registrationsData);
                        setLoading(false);
                    },
                    (error) => {
                        console.error('Error fetching registrations:', error);
                        setLoading(false);
                    }
                );
                return () => unsubscribe();
            } catch (error) {
                console.error('Error setting up query:', error);
                setLoading(false);
            }
        } else if (!user) {
            console.log('No user, clearing registrations');
            setRegistrations([]);
        }
    }, [user, userDataLoaded, adminRole, adminRegion]);

    // Load attendance data
    useEffect(() => {
        if (user) {
            loadAttendanceData();
        }
    }, [user]);

    const loadAttendanceData = async () => {
        const [records, stats] = await Promise.all([
            getAttendanceRecords(),
            getAttendanceStats()
        ]);
        setAttendanceRecords(records);
        setAttendanceStats(stats);
    };

    // Filter attendance records
    const filteredAttendanceRecords = useMemo(() => {
        return attendanceRecords.filter(record =>
            record.attendeeName.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
            record.ticketCode.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
            record.attendeeEmail?.toLowerCase().includes(attendanceSearch.toLowerCase())
        );
    }, [attendanceRecords, attendanceSearch]);


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
            await updateDoc(ref, {
                status: newStatus,
                statusUpdatedBy: user?.email,
                statusUpdatedAt: new Date()
            });

            if (newStatus === 'confirmed') {
                const reg = registrations.find(r => r.id === id);
                if (reg) {
                    axios.post('/api/email/', {
                        from: 'noreply@ched-raise.wvsu.edu.ph',
                        to: reg.email,
                        firstName: reg.firstName,
                        ticketCode: reg.ticketCode || reg.id,
                        type: 'registration_approved'
                    }).catch(err => console.error("Error sending approval email:", err));
                }
            }
        } catch (error) {
            console.error("Error updating status", error);
        }
    };

    const promoteToRegionalAdmin = async (id: string, region: string) => {
        if (adminRole !== 'super_admin') {
            toast.error("Only Super Admins can promote users.");
            return;
        }

        if (!region) {
            toast.error("User must have a region to be a Regional Admin.");
            return;
        }

        try {
            const ref = doc(db, 'registrations', id);
            await updateDoc(ref, {
                role: 'regional_admin'
            });

            // Sync to user_roles collection for Firestore Rules
            const reg = registrations.find(r => r.id === id);
            if (reg && reg.uid) {
                await setDoc(doc(db, 'user_roles', reg.uid), {
                    role: 'regional_admin',
                    region: region
                });
            }

            toast.success("User promoted to Regional Admin");
        } catch (error) {
            console.error("Error promoting user", error);
            toast.error("Failed to promote user");
        }
    };

    const promoteToSuperAdmin = async (id: string) => {
        if (adminRole !== 'super_admin') {
            toast.error("Only Super Admins can promote users.");
            return;
        }

        setPromoteSuperAdminConfirmation({ isOpen: true, id });
    };

    const handleConfirmPromoteSuperAdmin = async () => {
        const id = promoteSuperAdminConfirmation.id;
        if (!id) return;

        try {
            const ref = doc(db, 'registrations', id);
            await updateDoc(ref, {
                role: 'super_admin',
                region: deleteField()
            });

            // Sync to user_roles collection for Firestore Rules
            const reg = registrations.find(r => r.id === id);
            if (reg && reg.uid) {
                await setDoc(doc(db, 'user_roles', reg.uid), {
                    role: 'super_admin',
                    region: deleteField()
                });
            }

            toast.success("User promoted to Super Admin");
        } catch (error) {
            console.error("Error promoting user", error);
            toast.error("Failed to promote user");
        } finally {
            setPromoteSuperAdminConfirmation({ isOpen: false, id: null });
        }
    };

    const syncPermissions = async () => {
        if (adminRole !== 'super_admin') return;
        setIsSyncing(true);
        const toastId = toast.loading("Syncing permissions...");
        let count = 0;
        try {
            for (const reg of registrations) {
                if (reg.role === 'regional_admin' && reg.uid && reg.region) {
                    await setDoc(doc(db, 'user_roles', reg.uid), {
                        role: 'regional_admin',
                        region: reg.region
                    });
                    count++;
                }
            }
            toast.success(`Synced ${count} admin permissions`, { id: toastId });
            setSyncSuccess(true);
            setTimeout(() => setSyncSuccess(false), 3000);
        } catch (e) {
            console.error(e);
            toast.error("Failed to sync permissions", { id: toastId });
        } finally {
            setIsSyncing(false);
        }
    };

    const handleDeleteRegistration = async (id: string) => {
        if (adminRole !== 'super_admin') {
            toast.error("Only Super Admins can delete registrations.");
            return;
        }

        if (!confirm("Are you sure you want to delete this registration? This cannot be undone.")) return;

        try {
            await deleteDoc(doc(db, 'registrations', id));
            toast.success("Registration deleted");
        } catch (error) {
            console.error("Error deleting registration", error);
            toast.error("Failed to delete registration");
        }

    }

    const handleConfirmReject = async () => {
        if (!rejectingId) return;

        try {
            const ref = doc(db, 'registrations', rejectingId);
            await updateDoc(ref, {
                status: 'rejected',
                rejectionReason: rejectionReason,
                statusUpdatedBy: user?.email,
                statusUpdatedAt: new Date()
            });

            const reg = registrations.find(r => r.id === rejectingId);
            if (reg) {
                axios.post('/api/email/', {
                    from: 'noreply@ched-raise.wvsu.edu.ph',
                    to: reg.email,
                    firstName: reg.firstName,
                    ticketCode: reg.ticketCode || reg.id,
                    type: 'registration_rejected',
                    reason: rejectionReason
                }).catch(err => console.error("Error sending rejection email:", err));
            }

            setIsRejectDialogOpen(false);
            setRejectingId(null);
            setRejectionReason('');
        } catch (error) {
            console.error("Error rejecting registration", error);
            alert("Failed to reject registration");
        }
    };

    const initiateEmailSend = (reg: any) => {
        setEmailConfirmation({ isOpen: true, reg });
    };

    const handleConfirmSendEmail = async () => {
        const reg = emailConfirmation.reg;
        if (!reg) return;

        const loadingToast = toast.loading(`Sending email to ${reg.firstName}...`);

        try {
            await axios.post('/api/email/', {
                type: 'survey_completion',
                to: reg.email,
                name: reg.firstName,
                middleName: reg.middleName,
                lastName: reg.lastName,
                ticketCode: reg.ticketCode || reg.id,
                from: 'noreply@ched-raise.wvsu.edu.ph',
                school: reg.schoolAffiliation,
            });

            // Track email action
            const ref = doc(db, 'registrations', reg.id);
            await updateDoc(ref, {
                emailSentBy: user?.email,
                emailSentAt: new Date()
            });

            toast.success(`Email sent to ${reg.email}`, { id: loadingToast });
        } catch (error) {
            console.error("Error sending email:", error);
            toast.error("Failed to send email.", { id: loadingToast });
        } finally {
            setEmailConfirmation({ isOpen: false, reg: null });
        }
    };

    const initiateDeleteSurvey = (reg: any) => {
        setDeleteSurveyConfirmation({ isOpen: true, reg });
    };

    const handleConfirmDeleteSurvey = async () => {
        const reg = deleteSurveyConfirmation.reg;
        if (!reg) return;

        try {
            const ref = doc(db, 'registrations', reg.id);
            await updateDoc(ref, {
                surveyCompleted: false,
                surveyRating: deleteField(),
                surveyFeedback: deleteField(),
                surveyTimestamp: deleteField(),
                surveyDeletedBy: user?.email,
                surveyDeletedAt: new Date()
            });
            toast.success("Survey entry deleted.");
        } catch (error) {
            console.error("Error deleting survey entry:", error);
            toast.error("Failed to delete survey entry.");
        } finally {
            setDeleteSurveyConfirmation({ isOpen: false, reg: null });
        }
    };

    // Helper to format full name
    const formatFullName = (lastName?: string, firstName?: string, middleName?: string) => {
        if (!lastName && !firstName && !middleName) return 'N/A';
        return `${lastName || ''}, ${firstName || ''} ${middleName || ''}`.trim();
    };

    const handleExportCSV = () => {
        // Update CSV Headers
        const headers = [
            "Ticket ID", "Last Name", "First Name", "Middle Name",
            "Email", "Contact Number", "School/Affiliation", "Region",
            "Type", "Food Preference", "Status", "Survey Completed?", "Date Registered"
        ];

        const csvContent = [
            headers.join(','),
            ...filteredRegistrations.map(reg => {
                return [
                    reg.ticketCode || reg.id || '',
                    `"${reg.lastName || ''}"`,
                    `"${reg.firstName || ''}"`,
                    `"${reg.middleName || ''}"`,
                    `"${reg.email || ''}"`,
                    `"${reg.contactNumber || ''}"`,
                    `"${reg.schoolAffiliation || ''}"`,
                    `"${reg.region || ''}"`,
                    `"${reg.registrantType || ''}"`,
                    `"${reg.foodPreference || ''}"`,
                    reg.status || 'pending',
                    reg.surveyCompleted ? 'Yes' : 'No',
                    reg.timestamp?.toDate ? new Date(reg.timestamp.toDate()).toLocaleDateString() : ''
                ].join(',');
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `registrations_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Filter and sort registrations
    const filteredRegistrations = useMemo(() => {
        console.log('Filtering registrations with search term:', searchTerm);

        // Apply search filter
        let filtered = registrations.filter(reg => {
            const searchLower = searchTerm.toLowerCase();
            return (
                reg.lastName?.toLowerCase().includes(searchLower) ||
                reg.firstName?.toLowerCase().includes(searchLower) ||
                reg.middleName?.toLowerCase().includes(searchLower) ||
                reg.email?.toLowerCase().includes(searchLower) ||
                reg.schoolAffiliation?.toLowerCase().includes(searchLower) ||
                reg.region?.toLowerCase().includes(searchLower) ||
                reg.ticketCode?.toLowerCase().includes(searchLower) ||
                reg.id?.toLowerCase().includes(searchLower)
            );
        });

        // Apply region filter
        if (regionFilter !== 'all') {
            filtered = filtered.filter(reg => reg.region === regionFilter);
        }

        // Apply sorting
        if (sortColumn) {
            filtered = [...filtered].sort((a, b) => {
                let aValue: string = '';
                let bValue: string = '';

                if (sortColumn === 'name') {
                    aValue = formatFullName(a.lastName, a.firstName, a.middleName);
                    bValue = formatFullName(b.lastName, b.firstName, b.middleName);
                } else if (sortColumn === 'region') {
                    aValue = a.region || '';
                    bValue = b.region || '';
                } else if (sortColumn === 'status') {
                    aValue = a.status || '';
                    bValue = b.status || '';
                }

                const comparison = aValue.localeCompare(bValue);
                return sortDirection === 'asc' ? comparison : -comparison;
            });
        }

        console.log('Filtered registrations:', filtered);
        return filtered;
    }, [registrations, searchTerm, regionFilter, sortColumn, sortDirection]);



    // Local stats for table-dependent metrics (like Top Cards)
    const stats = {
        total: registrations.length,
        pending: registrations.filter(r => r.status === 'pending').length,
        confirmed: registrations.filter(r => r.status === 'confirmed').length,
        rejected: registrations.filter(r => r.status === 'rejected').length
    };

    // Use global stats if available, otherwise fallback to local calculation (though global should exist)
    // Use global stats if available, otherwise fallback to local calculation (though global should exist)
    const calculatedRegionStats = useMemo(() => {
        const stats: Record<string, number> = {};
        registrations.forEach(reg => {
            const region = reg.region || 'Unknown';
            stats[region] = (stats[region] || 0) + 1;
        });

        return Object.entries(stats)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [registrations]);

    const displayRegionStats = globalStats.length > 0 ? globalStats : calculatedRegionStats;

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

    // If user is logged in but is just a normal user, show 404
    if (user && userDataLoaded && adminRole === 'user') {
        return <NotFoundPage />;
    }

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
                    <div className="flex items-center gap-3 mt-16">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Overview</h1>
                        {adminRole && (
                            <Badge variant={adminRole === 'super_admin' ? 'default' : 'secondary'} className="h-6">
                                {adminRole === 'super_admin' ? 'Super Admin' : `Regional Admin ${adminRegion ? `(${getRegionShortName(adminRegion)})` : ''}`}
                            </Badge>
                        )}
                    </div>
                    <p className="text-muted-foreground">Welcome back, {user?.displayName || 'Admin'}.</p>
                </div>

                <div className="mt-16 relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-r from-background/50 to-muted/20 p-6 backdrop-blur-xl shadow-lg transition-all hover:shadow-primary/5">
                    <div className="absolute inset-0 bg-grid-white/5 mask-image-linear-gradient(to-bottom,transparent,black)" />
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${eventStatus === 'ongoing' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                {eventStatus === 'ongoing' ? <Activity className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold tracking-tight">System Status</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm text-muted-foreground">Current Event Mode:</span>
                                    <Badge variant={eventStatus === 'ongoing' ? 'default' : 'outline'} className={eventStatus === 'ongoing' ? 'bg-emerald-500 hover:bg-emerald-600' : 'text-amber-500 border-amber-500/50'}>
                                        {eventStatus.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {adminRole === 'super_admin' && (
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    onClick={syncPermissions}
                                    disabled={isSyncing}
                                    className={`h-10 px-4 transition-all duration-300 border-white/10 bg-black/20 hover:bg-black/40 hover:text-primary ${syncSuccess ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10' : ''}`}
                                >
                                    {isSyncing ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : syncSuccess ? (
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                    ) : (
                                        <ShieldCheck className="w-4 h-4 mr-2" />
                                    )}
                                    {isSyncing ? 'Syncing...' : syncSuccess ? 'Synced!' : 'Sync Permissions'}
                                </Button>
                                <div className="h-8 w-[1px] bg-white/10 mx-1 hidden md:block" />
                                <Button
                                    variant={eventStatus === 'ongoing' ? "destructive" : "default"}
                                    onClick={toggleEventStatus}
                                    className="h-10 px-6 shadow-lg shadow-black/20"
                                >
                                    {eventStatus === 'ongoing' ? 'Finish Event' : 'Re-open Event'}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
                {/* Main Content Area with Tabs */}
                <motion.div variants={item}>
                    <Tabs defaultValue="registrations" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="registrations" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Registrations
                            </TabsTrigger>
                            <TabsTrigger value="attendance" className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                Attendance
                            </TabsTrigger>
                        </TabsList>

                        {/* Registrations Tab */}
                        <TabsContent value="registrations">
                            {/* Stats Cards */}
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
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
                            </div>


                            <Card className="glass-card">
                                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle>Registrations</CardTitle>
                                        <CardDescription>Manage and review participant details.</CardDescription>
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <Button variant="outline" onClick={handleExportCSV} className="gap-2">
                                            <BarChart3 className="h-4 w-4" />
                                            Export CSV
                                        </Button>
                                        {adminRole === 'super_admin' && (
                                            <Select value={regionFilter} onValueChange={setRegionFilter}>
                                                <SelectTrigger className="w-full md:w-48 bg-background/50">
                                                    <div className="flex items-center gap-2">
                                                        <Filter className="h-4 w-4" />
                                                        <SelectValue placeholder="All Regions" />
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Regions</SelectItem>
                                                    {PHILIPPINE_REGIONS.map(region => (
                                                        <SelectItem key={region} value={region}>{getRegionShortName(region)}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                        <div className="relative flex-1 md:w-64">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search names, emails, regions..."
                                                className="pl-8 bg-background/50"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="rounded-md border border-border/50 overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-muted/50">
                                                <TableRow>
                                                    <TableHead>
                                                        <button
                                                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                                                            onClick={() => {
                                                                if (sortColumn === 'name') {
                                                                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                                                } else {
                                                                    setSortColumn('name');
                                                                    setSortDirection('asc');
                                                                }
                                                            }}
                                                        >
                                                            Full Name
                                                            {sortColumn === 'name' ? (
                                                                sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                                                            ) : <ArrowUpDown className="h-3 w-3 opacity-50" />}
                                                        </button>
                                                    </TableHead>
                                                    <TableHead>
                                                        <button
                                                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                                                            onClick={() => {
                                                                if (sortColumn === 'region') {
                                                                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                                                } else {
                                                                    setSortColumn('region');
                                                                    setSortDirection('asc');
                                                                }
                                                            }}
                                                        >
                                                            School / Region
                                                            {sortColumn === 'region' ? (
                                                                sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                                                            ) : <ArrowUpDown className="h-3 w-3 opacity-50" />}
                                                        </button>
                                                    </TableHead>
                                                    <TableHead>Contact</TableHead>
                                                    <TableHead>Food Preference</TableHead>
                                                    <TableHead>
                                                        <button
                                                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                                                            onClick={() => {
                                                                if (sortColumn === 'status') {
                                                                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                                                } else {
                                                                    setSortColumn('status');
                                                                    setSortDirection('asc');
                                                                }
                                                            }}
                                                        >
                                                            Status
                                                            {sortColumn === 'status' ? (
                                                                sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                                                            ) : <ArrowUpDown className="h-3 w-3 opacity-50" />}
                                                        </button>
                                                    </TableHead>
                                                    <TableHead>Updates</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredRegistrations.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                                            No registrations found.
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    filteredRegistrations.map((reg) => (
                                                        <TableRow key={reg.id} className="hover:bg-muted/30 transition-colors">
                                                            <TableCell>
                                                                <div className="flex items-center gap-3">
                                                                    <UserAvatar seed={reg.avatarSeed || reg.ticketCode || reg.id} size={40} className="shadow-sm" color={reg.avatarColor} />
                                                                    <div>
                                                                        <div className="font-medium">{formatFullName(reg.lastName, reg.firstName, reg.middleName)}</div>
                                                                        <div className="text-xs text-muted-foreground/70 font-mono">{reg.id.slice(0, 8)}...</div>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="text-sm font-medium">{reg.schoolAffiliation || 'N/A'}</div>
                                                                <div className="text-xs text-muted-foreground">{reg.region || 'N/A'}</div>
                                                                <div className="text-xs text-muted-foreground/60 capitalize mt-0.5">{reg.registrantType || 'N/A'} {reg.registrantType === 'others' && reg.registrantTypeOther ? `(${reg.registrantTypeOther})` : ''}</div>
                                                                {reg.role === 'regional_admin' && (
                                                                    <Badge variant="secondary" className="mt-1 text-[10px] h-5">Regional Admin</Badge>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="text-sm">{reg.email}</div>
                                                                <div className="text-xs text-muted-foreground">{reg.contactNumber}</div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline" className="capitalize">
                                                                    {(reg.foodPreference || 'no_restriction').replace('_', ' ')}
                                                                </Badge>
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
                                                                <div className="flex flex-col gap-1 text-[10px] text-muted-foreground/80">
                                                                    {reg.statusUpdatedBy && (
                                                                        <div className="flex items-center gap-1" title={`Status updated by ${reg.statusUpdatedBy} `}>
                                                                            <Clock className="w-3 h-3 text-muted-foreground/60" />
                                                                            <span className="truncate max-w-[120px]">{reg.statusUpdatedBy.split('@')[0]}</span>
                                                                        </div>
                                                                    )}
                                                                    {reg.emailSentBy && (
                                                                        <div className="flex items-center gap-1" title={`Email sent by ${reg.emailSentBy} `}>
                                                                            <Mail className="w-3 h-3 text-blue-500/60" />
                                                                            <span className="truncate max-w-[120px]">{reg.emailSentBy.split('@')[0]}</span>
                                                                        </div>
                                                                    )}
                                                                    {reg.surveyDeletedBy && (
                                                                        <div className="flex items-center gap-1" title={`Survey reset by ${reg.surveyDeletedBy} `}>
                                                                            <Trash2 className="w-3 h-3 text-destructive/60" />
                                                                            <span className="truncate max-w-[120px]">{reg.surveyDeletedBy.split('@')[0]}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                                            <span className="sr-only">Open menu</span>
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                        <DropdownMenuItem
                                                                            onClick={() => {
                                                                                navigator.clipboard.writeText(reg.ticketCode || reg.id);
                                                                                toast.success("Ticket ID copied to clipboard");
                                                                            }}
                                                                        >
                                                                            <Copy className="mr-2 h-4 w-4" />
                                                                            Copy Ticket ID
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuSub>
                                                                            <DropdownMenuSubTrigger>
                                                                                <Clock className="mr-2 h-4 w-4" />
                                                                                Change Status
                                                                            </DropdownMenuSubTrigger>
                                                                            <DropdownMenuSubContent>
                                                                                <DropdownMenuItem onClick={() => updateStatus(reg.id, 'pending')}>
                                                                                    <Clock className="mr-2 h-4 w-4" />
                                                                                    Pending
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuItem onClick={() => updateStatus(reg.id, 'confirmed')}>
                                                                                    <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
                                                                                    Confirm
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuItem onClick={() => updateStatus(reg.id, 'rejected')}>
                                                                                    <XCircle className="mr-2 h-4 w-4 text-destructive" />
                                                                                    Reject
                                                                                </DropdownMenuItem>
                                                                            </DropdownMenuSubContent>
                                                                        </DropdownMenuSub>

                                                                        {adminRole === 'super_admin' && (
                                                                            <>
                                                                                <DropdownMenuSeparator />
                                                                                <DropdownMenuItem onClick={() => promoteToRegionalAdmin(reg.id, reg.region)}>
                                                                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                                    Promote to Regional Admin
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuItem onClick={() => promoteToSuperAdmin(reg.id)}>
                                                                                    <ShieldCheck className="mr-2 h-4 w-4 text-primary" />
                                                                                    Promote to Super Admin
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuItem onClick={() => handleDeleteRegistration(reg.id)} className="text-destructive focus:text-destructive">
                                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                                    Delete Registration
                                                                                </DropdownMenuItem>
                                                                            </>
                                                                        )}

                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem onClick={() => initiateEmailSend(reg)}>
                                                                            <Mail className="mr-2 h-4 w-4" />
                                                                            Email Certificate
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() => initiateDeleteSurvey(reg)}
                                                                            disabled={!reg.surveyCompleted}
                                                                            className="text-destructive focus:text-destructive"
                                                                        >
                                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                                            Delete Survey
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid gap-4 my-4">
                                <Card className="glass-card">
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <BarChart3 className="h-4 w-4 text-primary" />
                                            Participants by Region
                                        </CardTitle>
                                        <CardDescription>Distribution of registrants across regions</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                            {displayRegionStats.length === 0 ? (
                                                <div className="text-center py-8 text-muted-foreground">
                                                    No data available yet
                                                </div>
                                            ) : (
                                                displayRegionStats.map((stat, index) => {
                                                    const total = displayRegionStats.reduce((acc, curr) => acc + curr.value, 0);
                                                    const percentage = ((stat.value / total) * 100).toFixed(1);

                                                    // Dynamic color based on index/rank
                                                    const isTop3 = index < 3;
                                                    const barColor = isTop3 ? 'bg-primary' : 'bg-primary/50';

                                                    return (
                                                        <div key={stat.name} className="space-y-1.5">
                                                            <div className="flex items-center justify-between text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${isTop3 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                                                        {index + 1}
                                                                    </span>
                                                                    <span className="font-medium truncate" title={stat.name}>
                                                                        {getRegionShortName(stat.name)}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-xs">
                                                                    <span className="font-bold text-foreground">{stat.value}</span>
                                                                    <span className="text-muted-foreground">({percentage}%)</span>
                                                                </div>
                                                            </div>
                                                            <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${(stat.value / total) * 100}%` }}
                                                                    transition={{ duration: 1, delay: index * 0.1 }}
                                                                    className={`h-full ${barColor} rounded-full`}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Attendance Tab */}
                        <TabsContent value="attendance" className="space-y-6">
                            {attendanceStats && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <Card className="glass-card border-white/10"><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Users className="h-4 w-4" />Total Attendance</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{attendanceStats.total}</div></CardContent></Card>
                                    <Card className="glass-card border-white/10"><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Confirmed</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-emerald-500">{attendanceStats.confirmed}</div></CardContent></Card>
                                    <Card className="glass-card border-white/10"><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Scan className="h-4 w-4 text-blue-500" />Scanned</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-blue-500">{attendanceStats.scanned}</div></CardContent></Card>
                                    <Card className="glass-card border-white/10"><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Keyboard className="h-4 w-4 text-purple-500" />Manual Entry</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-purple-500">{attendanceStats.manual}</div></CardContent></Card>
                                </div>
                            )}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-1">
                                    <AttendanceScanner scannedBy={user?.uid || ''} onSuccess={loadAttendanceData} />
                                </div>
                                <div className="lg:col-span-2">
                                    <Card className="glass-card border-white/10">
                                        <CardHeader>
                                            <CardTitle>Attendance Records</CardTitle>
                                            <CardDescription>Recent check-ins ({filteredAttendanceRecords.length} records)</CardDescription>
                                            <div className="pt-4">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input placeholder="Search by name, email, or ticket code..." value={attendanceSearch} onChange={(e) => setAttendanceSearch(e.target.value)} className="pl-10" />
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                                {filteredAttendanceRecords.length === 0 ? (
                                                    <div className="text-center py-12 text-muted-foreground">
                                                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                                        <p>No attendance records found</p>
                                                    </div>
                                                ) : (
                                                    filteredAttendanceRecords.map((record) => (
                                                        <motion.div key={record.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <h3 className="font-semibold">{record.attendeeName}</h3>
                                                                        <Badge variant="outline" className={record.method === 'scan' ? 'border-blue-500/30 text-blue-500' : 'border-purple-500/30 text-purple-500'}>
                                                                            {record.method === 'scan' ? <><Scan className="h-3 w-3 mr-1" /> Scanned</> : <><Keyboard className="h-3 w-3 mr-1" /> Manual</>}
                                                                        </Badge>
                                                                    </div>
                                                                    <p className="text-sm text-muted-foreground">{record.attendeeEmail}</p>
                                                                    <p className="text-xs text-muted-foreground font-mono mt-1">ID: {record.ticketCode}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-sm font-medium">{record.timestamp.toDate().toLocaleDateString()}</p>
                                                                    <p className="text-xs text-muted-foreground">{record.timestamp.toDate().toLocaleTimeString()}</p>
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
                        </TabsContent>
                    </Tabs>
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
            <AlertDialog open={emailConfirmation.isOpen} onOpenChange={(open) => setEmailConfirmation(prev => ({ ...prev, isOpen: open }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Send Survey Completion Email?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will send the unified certificate email (Participation & Appearance) to <strong>{emailConfirmation.reg?.firstName} {emailConfirmation.reg?.lastName}</strong> at {emailConfirmation.reg?.email}.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmSendEmail}>Send Email</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={deleteSurveyConfirmation.isOpen} onOpenChange={(open) => setDeleteSurveyConfirmation(prev => ({ ...prev, isOpen: open }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Survey Entry?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the survey entry for <strong>{deleteSurveyConfirmation.reg?.firstName} {deleteSurveyConfirmation.reg?.lastName}</strong>? This action cannot be undone and will allow the user to retake the survey.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleConfirmDeleteSurvey}>Delete Survey</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={promoteSuperAdminConfirmation.isOpen} onOpenChange={(open) => setPromoteSuperAdminConfirmation(prev => ({ ...prev, isOpen: open }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Promote to Super Admin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to promote this user to <strong>Super Admin</strong>?
                            <br /><br />
                            <span className="text-amber-500 font-medium">Warning:</span> This will grant them <strong>full access</strong> to the entire system, including all regions and settings. This action cannot be easily undone by them.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmPromoteSuperAdmin} className="bg-primary hover:bg-primary/90">
                            Promote to Super Admin
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    );
};

export default AdminPage;
