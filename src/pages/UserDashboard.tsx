
import { useState, useEffect, useRef } from 'react';
import { Github } from '@uiw/react-color';
import { GithubPlacement } from '@uiw/react-color-github';
import { db, auth } from '@/lib/firebase';
import { deleteAttendanceForRegistration } from '@/lib/attendanceService';
import { collection, addDoc, deleteDoc, updateDoc, doc, serverTimestamp, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { Loader2, CalendarDays, Mail, Phone, CheckCircle2, XCircle, Clock, Pencil, InfoIcon, EditIcon, RefreshCcw, Circle, AlertCircle, MailCheckIcon, ClipboardCheck, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGSAPScroll, fadeInUp, slideInLeft, slideInRight } from '@/hooks/useGSAPScroll';
import { RegistrationProgress } from '@/components/RegistrationProgress';
import { SchoolAutocomplete } from '@/components/SchoolAutocomplete';
import { RegistrationBusinessCard } from '@/components/RegistrationBusinessCard';
import { toTitleCase } from '@/lib/utils/format';
import { generateTicketCode } from '@/lib/raiseCodeUtils';
import { Link } from 'react-router-dom';
import { UserAvatar, getDeterministicAvatarColor } from '@/components/UserAvatar';
import { PHILIPPINE_REGIONS, getRegionShortName } from '@/lib/regions';
// Recharts removed as we switched to list view

const UserDashboard = () => {
    const [user, setUser] = useState<User | null>(auth.currentUser);
    const [registration, setRegistration] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        middleName: '',
        email: user?.email || '',
        contactNumber: '',
        schoolAffiliation: '',
        region: '',
        registrantType: '',
        registrantTypeOther: '',
        foodPreference: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [dashboardAlert, setDashboardAlert] = useState<{ show: boolean, message: string, variant?: 'default' | 'destructive', title?: string } | null>(null);
    const [regionStats, setRegionStats] = useState<{ name: string; value: number; avatars: { seed: string; color: string; id?: string; firstName?: string; ticketCode?: string }[] }[]>([]);

    // Edit State
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editFormData, setEditFormData] = useState<any>(null);
    const [editing, setEditing] = useState(false);

    // Avatar State
    const [avatarSeed, setAvatarSeed] = useState<string>('');
    const [avatarColor, setAvatarColor] = useState<string>('#5b8def'); // Default primary color
    const [showColorPicker, setShowColorPicker] = useState(false);

    // Animation Refs
    const headerRef = useRef<HTMLDivElement>(null);
    const registrationCardRef = useRef<HTMLDivElement>(null);
    const statusCardRef = useRef<HTMLDivElement>(null);
    const helpRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    const { gsap } = useGSAPScroll();

    useEffect(() => {
        if (loading) return;

        // Small timeout to ensure DOM is ready
        const timer = setTimeout(() => {
            if (headerRef.current) fadeInUp(headerRef.current);
            if (progressRef.current) fadeInUp(progressRef.current, { delay: 0.1 });
            if (registrationCardRef.current) slideInLeft(registrationCardRef.current, { delay: 0.2 });
            if (statusCardRef.current) slideInRight(statusCardRef.current, { delay: 0.3 });
            if (helpRef.current) fadeInUp(helpRef.current, { delay: 0.4 });
            if (statsRef.current) fadeInUp(statsRef.current, { delay: 0.5 });
        }, 100);

        return () => clearTimeout(timer);
    }, [loading, registration, gsap]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Fetch stats from public settings document (aggregated by Admin)
        const unsub = onSnapshot(doc(db, 'settings', 'stats'), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.regions) {
                    setRegionStats(data.regions);
                    console.log("📊 Loaded public stats from settings:", data.regions.length);
                }
            } else {
                console.log("ℹ️ No public stats found");
                setRegionStats([]);
            }
        }, (error) => {
            console.error("Error fetching public stats:", error);
        });

        return () => unsub();
    }, []);

    useEffect(() => {
        console.log('🎨 Registration state changed:', registration);
    }, [registration]);

    useEffect(() => {
        if (!user) {
            setLoading(false); // If no user, stop loading and show registration form
            return;
        }

        // Query by UID first
        const q = query(collection(db, 'registrations'), where('uid', '==', user.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log('📡 onSnapshot triggered, empty:', snapshot.empty, 'size:', snapshot.size);
            if (!snapshot.empty) {
                const docData = snapshot.docs[0];
                const data = docData.data() as any;
                const regData = { id: docData.id, ...data };
                console.log('✅ Registration data:', regData);

                if (!data.ticketCode) {
                    const ticketCode = generateTicketCode();
                    console.log('⚠️ Migrating registration to use ticketCode:', ticketCode);

                    updateDoc(doc(db, 'registrations', docData.id), {
                        ticketCode
                    }).catch(err => console.error("Migration failed:", err));

                    // Optimistic update for UI
                    regData.ticketCode = ticketCode;
                }

                // Initialize Avatar Seed if not present
                if (!data.avatarSeed) {
                    const seed = data.ticketCode || data.id;
                    updateDoc(doc(db, 'registrations', docData.id), {
                        avatarSeed: seed
                    }).catch(err => console.error("Avatar seed init failed", err));
                    regData.avatarSeed = seed;
                }

                setRegistration(regData);
                const seed = regData.avatarSeed || regData.ticketCode || regData.id;
                setAvatarSeed(seed);
                if (regData.avatarColor) {
                    setAvatarColor(regData.avatarColor);
                } else {
                    setAvatarColor(getDeterministicAvatarColor(seed));
                }
            } else {
                console.log('❌ No registration found');
                setRegistration(null);
            }
            setLoading(false);
        }, (error) => {
            console.error('🔥 onSnapshot error:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (value: string) => {
        setFormData({ ...formData, registrantType: value });
    };

    // const handleRegionChange = (value: string) => {
    //     setFormData({ ...formData, region: value });
    // };

    // const handleFoodPreferenceChange = (value: string) => {
    //     setFormData({ ...formData, foodPreference: value });
    // };

    const handleCancelRegistration = async () => {
        if (!registration?.id) return;

        try {
            // Delete attendance records first
            await deleteAttendanceForRegistration(registration.id);

            await deleteDoc(doc(db, "registrations", registration.id));
            // State will automatically update via onSnapshot
        } catch (error) {
            console.error("Error cancelling registration:", error);
            setDashboardAlert({
                show: true,
                message: "Failed to cancel registration.",
                variant: "destructive",
                title: "Error"
            });
        }
    };

    const handleEditOpen = () => {
        setEditFormData({
            lastName: registration.lastName || '',
            firstName: registration.firstName || '',
            middleName: registration.middleName || '',
            contactNumber: registration.contactNumber || '',
            schoolAffiliation: registration.schoolAffiliation || '',
            region: registration.region || '',
            registrantType: registration.registrantType || '',
            registrantTypeOther: registration.registrantTypeOther || '',
            foodPreference: registration.foodPreference || ''
        });
        setIsEditOpen(true);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleEditSelectChange = (value: string) => {
        setEditFormData({ ...editFormData, registrantType: value });
    };

    const handleEditRegionChange = (value: string) => {
        setEditFormData({ ...editFormData, region: value });
    };

    const handleEditFoodPreferenceChange = (value: string) => {
        setEditFormData({ ...editFormData, foodPreference: value });
    };

    const handleUpdateRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!registration?.id) return;
        setEditing(true);

        try {
            const updatedData: any = {
                ...editFormData,
                lastName: toTitleCase(editFormData.lastName),
                firstName: toTitleCase(editFormData.firstName),
                middleName: toTitleCase(editFormData.middleName),
                schoolAffiliation: toTitleCase(editFormData.schoolAffiliation)
            };

            // No need to save raiseId anymore
            // if (!registration.raiseId) {
            //      ...
            // }

            await updateDoc(doc(db, "registrations", registration.id), updatedData);
            console.log('✏️ Registration updated successfully');
            setIsEditOpen(false);
        } catch (error) {
            console.error("Error updating registration:", error);
            setDashboardAlert({
                show: true,
                message: "Failed to update registration.",
                variant: "destructive",
                title: "Error"
            });
        } finally {
            setEditing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        if (!formData.lastName || !formData.firstName || !formData.middleName || !formData.contactNumber || !formData.schoolAffiliation || !formData.region || !formData.registrantType || !formData.foodPreference) {
            setDashboardAlert({
                show: true,
                message: "Please fill in all required fields.",
                variant: "destructive",
                title: "Incomplete Form"
            });
            setSubmitting(false);
            return;
        }

        if (formData.registrantType === 'others' && !formData.registrantTypeOther) {
            setDashboardAlert({
                show: true,
                message: "Please specify your registrant type.",
                variant: "destructive",
                title: "Incomplete Form"
            });
            setSubmitting(false);
            return;
        }

        try {
            // Check if user already exists
            const q = query(collection(db, "registrations"), where("uid", "==", user?.uid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setDashboardAlert({
                    show: true,
                    message: "You have already registered.",
                    variant: "destructive",
                    title: "Notice"
                });
                setSubmitting(false);
                return;
            }

            // Generate Ticket Code
            const ticketCode = generateTicketCode();

            // Create registration document
            const docRef = await addDoc(collection(db, 'registrations'), {
                ...formData,
                lastName: toTitleCase(formData.lastName),
                firstName: toTitleCase(formData.firstName),
                middleName: toTitleCase(formData.middleName),
                schoolAffiliation: toTitleCase(formData.schoolAffiliation),
                uid: user?.uid,
                status: 'pending',
                ticketCode: ticketCode,
                timestamp: serverTimestamp()
            });

            //Email the user
            await axios.post('/api/email/', {
                from: 'noreply@ched-raise.wvsu.edu.ph',
                to: formData.email,
                firstName: toTitleCase(formData.firstName),
                ticketCode: ticketCode,
                type: 'registration_confirmation',
            });

            console.log('✨ New registration created with ID:', docRef.id);

            // Reset form (optional, as we redirect or show status)
        } catch (error) {
            console.error("Error submitting registration:", error);
            setDashboardAlert({
                show: true,
                title: "Error",
                message: "Failed to submit registration. Please try again.",
                variant: "destructive"
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleRegenerateAvatar = async () => {
        if (!registration?.id) return;

        // Generate a new random seed
        const newSeed = Math.random().toString(36).substring(7);
        setAvatarSeed(newSeed);

        try {
            await updateDoc(doc(db, 'registrations', registration.id), {
                avatarSeed: newSeed
            });
            // Snapshot listener will update 'registration' state
        } catch (error) {
            console.error("Error updating avatar:", error);
            // Revert on error (optional, or just alert)
            setAvatarSeed(registration.avatarSeed);
            setDashboardAlert({
                show: true,
                message: "Failed to update avatar.",
                variant: "destructive",
                title: "Error"
            });
        }
    };

    const handleColorChange = (newColor: { hex: string }) => {
        const hexColor = newColor.hex;
        setAvatarColor(hexColor);
        if (registration?.id) {
            updateDoc(doc(db, 'registrations', registration.id), {
                avatarColor: hexColor
            }).catch(error => {
                console.error("Error updating avatar color:", error);
            });
        }
        setShowColorPicker(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20';
            case 'rejected': return 'bg-destructive/15 text-destructive border-destructive/20';
            default: return 'bg-amber-500/15 text-amber-500 border-amber-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed': return <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-500 mb-2" />;
            case 'rejected': return <XCircle className="h-8 w-8 sm:h-10 sm:w-10 text-destructive mb-2" />;
            default: return <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-amber-500 mb-2" />;
        }
    };

    // Variants removed in favor of GSAP

    const [eventStatus, setEventStatus] = useState<'ongoing' | 'finished'>('ongoing');

    useEffect(() => {
        // Subscribe to global settings for event status
        const settingsUnsub = onSnapshot(doc(db, 'settings', 'general'), (docSnap) => {
            if (docSnap.exists()) {
                setEventStatus(docSnap.data().eventStatus || 'ongoing');
            }
        });
        return () => settingsUnsub();
    }, []);

    if (loading) return (
        <div className="flex h-[calc(100vh-64px)] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Loading your dashboard...</p>
            </div>
        </div>
    );

    // Event Finished State
    if (eventStatus === 'finished' && registration) {
        return (
            <div className="mt-12 container mx-auto px-4 py-8 min-h-[calc(100vh-64px)] flex flex-col items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl w-full space-y-8 text-center"
                >
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Our event has concluded!
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Thank you for participating. We hope you had a fruitful experience.
                        </p>
                    </div>

                    <Card className="glass-card border-primary/20 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5" />
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {registration.surveyCompleted ? "Claim Your Certificate" : "Survey"}
                            </CardTitle>
                            <CardDescription>
                                {registration.surveyCompleted
                                    ? "The certificate of participation and certificate of appearance was sent in your email."
                                    : "Please complete the feedback survey to receive your certificate."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="relative z-10 flex flex-col items-center gap-6 py-8">
                            {registration.surveyCompleted ? (
                                <div className="space-y-6 w-full max-w-md mx-auto">
                                    <div className="relative group cursor-default">
                                        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full group-hover:bg-emerald-500/30 transition-all duration-500" />
                                        <div className="relative w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-lg shadow-emerald-500/5 group-hover:scale-105 transition-transform duration-500">
                                            <MailCheckIcon className="w-16 h-16 text-emerald-500 drop-shadow-sm" />

                                            {/* Pulse rings */}
                                            <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-[ping_3s_ease-in-out_infinite]" />
                                            <div className="absolute inset-0 rounded-full border border-emerald-500/10 animate-[ping_3s_ease-in-out_infinite_delay-1000ms]" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-xl font-semibold text-emerald-500 glow-text-sm">Sent Successfully!</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Please check your inbox (and spam folder) for an email from <br /> <span className="text-foreground font-medium">no-reply@ched-raise.wvsu.edu.ph</span>
                                        </p>
                                    </div>

                                    <div className="pt-4 flex justify-center">
                                        <Button variant="outline" className="gap-2 text-xs h-8 rounded-full border-primary/20 hover:border-primary/50" onClick={() => window.open('https://mail.google.com', '_blank')}>
                                            <Mail className="w-3 h-3" /> Open Gmail
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
                                        <ClipboardCheck className="w-10 h-10 text-amber-500" />
                                    </div>
                                    <Button size="lg" className="w-full sm:w-auto text-lg px-8" onClick={() => window.location.href = '/survey'}>
                                        Take Feedback Survey
                                    </Button>
                                    <p className="text-xs text-muted-foreground">Takes approximately 2 minutes</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Show limited registration details for reference */}
                    <div className="opacity-70 pointer-events-none filter grayscale hover:grayscale-0 transition-all duration-500 text-left">
                        <RegistrationBusinessCard registration={registration} hideFlipInstruction={true} hideDownloadButton={true} />
                    </div>

                </motion.div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 min-h-[calc(100vh-64px)]">
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
                {/* Header Welcome Section */}
                <div ref={headerRef} className="mt-6 sm:mt-10 flex items-center justify-between pb-4 sm:pb-6 border-b border-border/40 opacity-0">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-10">My Registration</h1>
                        <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your event registration and view status.</p>
                    </div>
                </div>

                {/* Alert Display */}
                {dashboardAlert?.show && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-4xl mx-auto"
                    >
                        <Alert variant={dashboardAlert.variant} className="relative">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>{dashboardAlert.title}</AlertTitle>
                            <AlertDescription>
                                {dashboardAlert.message}
                            </AlertDescription>
                            <button
                                onClick={() => setDashboardAlert(null)}
                                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                            >
                                <XCircle className="h-4 w-4" />
                            </button>
                        </Alert>
                    </motion.div>
                )}

                <div ref={progressRef} className="opacity-0">
                    <RegistrationProgress status={registration ? registration.status : null} />
                </div>
                <div
                    className="grid gap-4 sm:gap-6 lg:grid-cols-3"
                >
                    {registration && (
                        <div
                            ref={registrationCardRef}
                            key={registration.id}
                            className="lg:col-span-3 opacity-0"
                        >
                            <div className="max-w-3xl mx-auto space-y-6">
                                <Card className="glass-card border-primary/20">
                                    <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="relative">
                                                <UserAvatar
                                                    seed={avatarSeed || registration.ticketCode || registration.id}
                                                    size={120}
                                                    className="shadow-xl"
                                                    interactive
                                                    onRegenerate={handleRegenerateAvatar}
                                                    color={avatarColor}
                                                />
                                                {/* Color picker circle */}
                                                <div className="absolute -bottom-2 -left-2">
                                                    <button
                                                        onClick={() => setShowColorPicker(!showColorPicker)}
                                                        className="w-6 h-6 rounded-full border-2 border-background shadow-lg hover:scale-110 transition-transform"
                                                        style={{ backgroundColor: avatarColor }}
                                                        title="Pick color"
                                                    />
                                                    {showColorPicker && (
                                                        <Github
                                                            color={avatarColor}
                                                            onChange={handleColorChange}
                                                            placement={GithubPlacement.Right}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">Tap <Circle className='w-4 h-4' /> or <RefreshCcw className='w-4 h-4' /> to customize</p>
                                        </div>

                                        <div className="flex-1 text-center sm:text-left space-y-1">
                                            <h2 className="text-2xl font-bold tracking-tight">Hello, {registration.firstName}!</h2>
                                            <p className="text-muted-foreground">Ready for the CHED RAISE 2026 Summit?</p>
                                            <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-2">
                                                <Badge variant="outline" className="capitalize text-xs">{registration.registrantType}</Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="flex items-center justify-center">
                                    <p className="text-sm sm:text-base text-muted-foreground mt-1 flex items-center"><InfoIcon className="w-4 h-4 mr-2" /> Tap the card to view your code or <EditIcon className="w-4 h-4 mx-2" /> to update your registration details.</p>
                                </div>

                                <RegistrationBusinessCard
                                    registration={registration}
                                    actions={
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/10"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditOpen();
                                            }}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    }
                                />
                            </div>

                            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Edit Registration Details</DialogTitle>
                                        <DialogDescription>
                                            Make changes to your registration profile here. Click save when you're done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    {editFormData && (
                                        <form onSubmit={handleUpdateRegistration} className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-registrantType">Registrant Type <span className="text-destructive">*</span></Label>
                                                <Select
                                                    value={editFormData.registrantType}
                                                    onValueChange={(val) => {
                                                        handleEditSelectChange(val);
                                                        if (val === 'chedofficial') {
                                                            setEditFormData((prev: any) => ({ ...prev, schoolAffiliation: 'Not Applicable' }));
                                                        } else if (editFormData.schoolAffiliation === 'Not Applicable') {
                                                            // Clear it if switching back from chedofficial
                                                            setEditFormData((prev: any) => ({ ...prev, schoolAffiliation: '' }));
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger className="bg-background/50">
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="participant">Participant</SelectItem>
                                                        <SelectItem value="shs">Senior High or High School</SelectItem>
                                                        <SelectItem value="speaker">Speaker</SelectItem>
                                                        <SelectItem value="exhibitor">Exhibitor</SelectItem>
                                                        <SelectItem value="chedofficial">CHED Official</SelectItem>
                                                        <SelectItem value="others">Others</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {editFormData.registrantType === 'others' && (
                                                <div className="space-y-2">
                                                    <Label htmlFor="edit-registrantTypeOther">Please specify <span className="text-destructive">*</span></Label>
                                                    <Input
                                                        id="edit-registrantTypeOther"
                                                        name="registrantTypeOther"
                                                        value={editFormData.registrantTypeOther}
                                                        onChange={handleEditChange}
                                                        className="col-span-3"
                                                    />
                                                </div>
                                            )}

                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="space-y-2 col-span-1">
                                                    <Label htmlFor="edit-lastName">Last Name <span className="text-destructive">*</span></Label>
                                                    <Input id="edit-lastName" name="lastName" value={editFormData.lastName} onChange={handleEditChange} className="col-span-3" />
                                                </div>
                                                <div className="space-y-2 col-span-1">
                                                    <Label htmlFor="edit-firstName">First Name <span className="text-destructive">*</span></Label>
                                                    <Input id="edit-firstName" name="firstName" value={editFormData.firstName} onChange={handleEditChange} className="col-span-3" />
                                                </div>
                                                <div className="space-y-2 col-span-1">
                                                    <Label htmlFor="edit-middleName">Middle Name <span className="text-destructive">*</span></Label>
                                                    <Input id="edit-middleName" name="middleName" value={editFormData.middleName} onChange={handleEditChange} className="col-span-3" />
                                                </div>
                                            </div>
                                            {editFormData.registrantType !== 'chedofficial' && (
                                                <div className="space-y-2">
                                                    <Label htmlFor="edit-schoolAffiliation">School Affiliation <span className="text-destructive">*</span></Label>
                                                    <SchoolAutocomplete
                                                        id="edit-schoolAffiliation"
                                                        name="schoolAffiliation"
                                                        value={editFormData.schoolAffiliation}
                                                        onChange={(val) => setEditFormData((prev: any) => ({ ...prev, schoolAffiliation: val }))}
                                                    />
                                                </div>
                                            )}
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-region">Region <span className="text-destructive">*</span></Label>
                                                <Select onValueChange={handleEditRegionChange} value={editFormData.region}>
                                                    <SelectTrigger className="bg-background/50">
                                                        <SelectValue placeholder="Select region" />
                                                    </SelectTrigger>
                                                    <SelectContent className="max-h-[200px]">
                                                        {PHILIPPINE_REGIONS.map((region) => (
                                                            <SelectItem key={region} value={region}>
                                                                {region}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-contactNumber">Contact Number <span className="text-destructive">*</span></Label>
                                                <Input id="edit-contactNumber" name="contactNumber" value={editFormData.contactNumber} onChange={handleEditChange} className="col-span-3" />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="edit-foodPreference">Food Preference <span className="text-destructive">*</span></Label>
                                                <Select onValueChange={handleEditFoodPreferenceChange} value={editFormData.foodPreference}>
                                                    <SelectTrigger className="bg-background/50">
                                                        <SelectValue placeholder="Select preference" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="no_restriction">No Food Restriction</SelectItem>
                                                        <SelectItem value="halal">Halal</SelectItem>
                                                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <DialogFooter>
                                                <Button type="submit" disabled={editing}>
                                                    {editing ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                                        </>
                                                    ) : 'Save changes'}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    )}
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}


                    {/* Main Status / Form Card */}
                    <div ref={statusCardRef} className="lg:col-span-2 space-y-6 opacity-0">
                        <Card className="glass-card border-primary/10 overflow-hidden relative">
                            {/* Decorative gradient blob */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

                            <CardHeader className="pb-4 sm:pb-6">
                                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                                    <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                                    Event Registration
                                </CardTitle>
                                <CardDescription className="text-sm sm:text-base">
                                    CHED-RAISE Summit 2026
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {registration ? (
                                    <div className="space-y-6">
                                        {/* Status Display */}
                                        <div className="flex flex-col items-center justify-center p-3 sm:p-5 bg-background/50 rounded-xl border border-border/50 text-center">
                                            {getStatusIcon(registration.status)}
                                            <h3 className="text-lg sm:text-xl font-semibold mb-1 capitalize">
                                                Registration {registration.status}
                                            </h3>
                                            <div className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto mb-3 sm:mb-4 space-y-2">
                                                {registration.status === 'pending' && <p>We have received your details. Our team is reviewing your application.</p>}
                                                {registration.status === 'confirmed' && <p>You are all set! Present your QR code or ID at the venue entrance.</p>}
                                                {registration.status === 'rejected' && (
                                                    <>
                                                        <p>Unfortunately, we cannot accommodate your registration at this time.</p>
                                                        {registration.rejectionReason && (
                                                            <div className="p-2 bg-destructive/10 border border-destructive/20 rounded-md text-destructive font-medium">
                                                                Reason: {registration.rejectionReason}
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Badge variant="outline" className={`text-sm sm:text-base px-4 sm:px-6 py-2 h-auto mx-auto ${getStatusColor(registration.status)}`}>
                                                    {registration.status.toUpperCase()}
                                                </Badge>

                                                {(registration.status === 'pending' || registration.status === 'confirmed') && (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                className="text-destructive hover:text-destructive hover:bg-destructive/10 text-sm"
                                                            >
                                                                Cancel Registration
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. This will permanently delete your registration for the CHED RAISE 2026 Summit.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={handleCancelRegistration} className="bg-destructive hover:bg-destructive/90">
                                                                    Continue
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="registrantType">Registrant Type <span className="text-destructive">*</span></Label>
                                            <Select
                                                value={formData.registrantType}
                                                onValueChange={(val) => {
                                                    handleSelectChange(val);
                                                    if (val === 'chedofficial') {
                                                        setFormData(prev => ({ ...prev, schoolAffiliation: 'Not Applicable' }));
                                                    } else if (formData.schoolAffiliation === 'Not Applicable') {
                                                        // Clear it if switching back from chedofficial
                                                        setFormData(prev => ({ ...prev, schoolAffiliation: '' }));
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className="bg-background/50">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="participant">Participant</SelectItem>
                                                    <SelectItem value="shs">Senior High or High School</SelectItem>
                                                    <SelectItem value="speaker">Speaker</SelectItem>
                                                    <SelectItem value="exhibitor">Exhibitor</SelectItem>
                                                    <SelectItem value="chedofficial">CHED Official</SelectItem>
                                                    <SelectItem value="others">Others</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {formData.registrantType === 'others' && (
                                            <div className="space-y-2">
                                                <Label htmlFor="registrantTypeOther">Please specify <span className="text-destructive">*</span></Label>
                                                <Input
                                                    id="registrantTypeOther"
                                                    name="registrantTypeOther"
                                                    required
                                                    value={formData.registrantTypeOther}
                                                    onChange={handleChange}
                                                    placeholder="e.g. Researcher, Guest"
                                                    className="bg-background/50"
                                                />
                                            </div>
                                        )}

                                        <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name <span className="text-destructive">*</span></Label>
                                                <Input id="lastName" name="lastName" required value={formData.lastName} onChange={handleChange} placeholder="Dela Cruz" className="bg-background/50" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
                                                <Input id="firstName" name="firstName" required value={formData.firstName} onChange={handleChange} placeholder="Juana" className="bg-background/50" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="middleName">Middle Name <span className="text-destructive">*</span></Label>
                                                <Input id="middleName" name="middleName" required value={formData.middleName} onChange={handleChange} placeholder="Santos" className="bg-background/50" />
                                            </div>
                                        </div>

                                        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-muted-foreground" /> Email Address
                                                </Label>
                                                <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} disabled className="bg-muted opacity-80" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="contactNumber" className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-muted-foreground" /> Contact Number <span className="text-destructive">*</span>
                                                </Label>
                                                <Input id="contactNumber" name="contactNumber" required value={formData.contactNumber} onChange={handleChange} placeholder="0912 345 6789" className="bg-background/50" />
                                            </div>
                                        </div>

                                        {formData.registrantType !== 'chedofficial' && (
                                            <div className="space-y-2">
                                                <Label htmlFor="schoolAffiliation">School Affiliation <span className="text-destructive">*</span></Label>
                                                <SchoolAutocomplete
                                                    id="schoolAffiliation"
                                                    name="schoolAffiliation"
                                                    value={formData.schoolAffiliation}
                                                    onChange={(val) => setFormData(prev => ({ ...prev, schoolAffiliation: val }))}
                                                    placeholder="e.g. University of the Philippines"
                                                    className="bg-background/50"
                                                    required
                                                />
                                            </div>
                                        )}


                                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 mt-4" size="lg" disabled={submitting}>
                                            {submitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                                                </>
                                            ) : 'Complete Registration'}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div ref={helpRef} className="space-y-6 opacity-0">
                        <Card className="glass-card bg-primary/5 border-primary/10">
                            <CardHeader>
                                <CardTitle className="text-base text-primary">Need Help?</CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs sm:text-sm text-muted-foreground">
                                <p>If you have any questions about your registration status or need to make changes, please contact support.</p>
                                <div className="mt-4 pt-4 border-t border-primary/10 flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-primary" />
                                    <a href="helpdesk.chedraise@gmail.com" className="text-primary hover:underline">helpdesk.chedraise@gmail.com</a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div ref={statsRef} className="opacity-0">
                    <Card className="glass-card border-none shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-primary" />
                                Who are RAISE-ing with us?
                            </CardTitle>
                            <CardDescription>Here are our current registrants so far.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {regionStats.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No data available yet
                                    </div>
                                ) : (
                                    regionStats.map((stat, index) => {
                                        const isTop3 = index < 3;

                                        // Take only top 7 avatars
                                        const displayAvatars = stat.avatars?.slice(0, 7) || [];
                                        const hasMore = (stat.avatars?.length || 0) > 7 || stat.value > 7;

                                        return (
                                            <div key={stat.name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                                <div className="flex items-center gap-3">
                                                    <span className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold shrink-0 ${isTop3 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                                        {index + 1}
                                                    </span>
                                                    <span className="font-medium text-sm truncate max-w-[120px] sm:max-w-[150px]" title={stat.name}>
                                                        {getRegionShortName(stat.name)}
                                                    </span>
                                                </div>

                                                <div className="flex items-center -space-x-2 overflow-hidden pl-2 pb-2 pt-1">
                                                    <TooltipProvider>
                                                        {displayAvatars.map((avatar, i) => (
                                                            <Tooltip key={i}>
                                                                <TooltipTrigger asChild>
                                                                    <div className="relative z-10 inline-block h-8 w-8 rounded-full ring-2 ring-background transition-transform duration-200 hover:scale-125 hover:z-20 cursor-pointer">
                                                                        <UserAvatar
                                                                            seed={(registration && (avatar.id === registration.id || (registration.ticketCode && avatar.ticketCode === registration.ticketCode) || (registration.ticketCode && avatar.seed === registration.ticketCode))) ? (registration.avatarSeed || registration.ticketCode || registration.id) : avatar.seed}
                                                                            size={32}
                                                                            color={
                                                                                (registration && (avatar.id === registration.id || (registration.ticketCode && avatar.ticketCode === registration.ticketCode) || (registration.ticketCode && avatar.seed === registration.ticketCode)))
                                                                                    ? registration.avatarColor
                                                                                    : ((!avatar.color || avatar.color === '#000000') ? undefined : avatar.color)
                                                                            }
                                                                            className="h-full w-full"
                                                                        />
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p className="text-xs font-semibold">{avatar.firstName || 'Participant'}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        ))}
                                                    </TooltipProvider>
                                                    {hasMore && (
                                                        <div className="relative z-0 inline-block flex items-center justify-center h-8 w-8 rounded-full bg-muted ring-2 ring-background text-[10px] font-bold text-muted-foreground ml-1">
                                                            +{stat.value - displayAvatars.length}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="mt-12 pt-8 border-t border-border/40 text-center">
                    <Link to="/privacy-policy" className="text-xs text-muted-foreground/60 hover:text-primary transition-colors">
                        Privacy Policy
                    </Link>
                </div>
            </div>
        </div >
    );
};

export default UserDashboard;
