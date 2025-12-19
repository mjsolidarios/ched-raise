
import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, updateDoc, doc, serverTimestamp, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { Loader2, CalendarDays, Mail, Phone, CheckCircle2, XCircle, Clock, Pencil, InfoIcon, EditIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { RegistrationProgress } from '@/components/RegistrationProgress';
import { SchoolAutocomplete } from '@/components/SchoolAutocomplete';
import { RegistrationBusinessCard } from '@/components/RegistrationBusinessCard';
import { toTitleCase } from '@/lib/utils/format';
import { generateTicketCode } from '@/lib/raiseCodeUtils';

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
        registrantType: '',
        registrantTypeOther: ''
    });
    const [submitting, setSubmitting] = useState(false);

    // Edit State
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editFormData, setEditFormData] = useState<any>(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
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

                // Migration: Generate ticketCode if missing
                if (!data.ticketCode) {
                    const ticketCode = generateTicketCode();
                    console.log('⚠️ Migrating registration to use ticketCode:', ticketCode);

                    updateDoc(doc(db, 'registrations', docData.id), {
                        ticketCode
                    }).catch(err => console.error("Migration failed:", err));

                    // Optimistic update for UI
                    regData.ticketCode = ticketCode;
                }

                setRegistration(regData);
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

    const handleCancelRegistration = async () => {
        if (!registration?.id) return;

        try {
            await deleteDoc(doc(db, "registrations", registration.id));
            // State will automatically update via onSnapshot
        } catch (error) {
            console.error("Error cancelling registration:", error);
            alert("Failed to cancel registration.");
        }
    };

    const handleEditOpen = () => {
        setEditFormData({
            lastName: registration.lastName || '',
            firstName: registration.firstName || '',
            middleName: registration.middleName || '',
            contactNumber: registration.contactNumber || '',
            schoolAffiliation: registration.schoolAffiliation || '',
            registrantType: registration.registrantType || '',
            registrantTypeOther: registration.registrantTypeOther || ''
        });
        setIsEditOpen(true);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleEditSelectChange = (value: string) => {
        setEditFormData({ ...editFormData, registrantType: value });
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
            alert("Failed to update registration.");
        } finally {
            setEditing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        if (!formData.lastName || !formData.firstName || !formData.middleName || !formData.contactNumber || !formData.schoolAffiliation || !formData.registrantType) {
            alert("Please fill in all required fields.");
            setSubmitting(false);
            return;
        }

        if (formData.registrantType === 'others' && !formData.registrantTypeOther) {
            alert("Please specify your registrant type.");
            setSubmitting(false);
            return;
        }

        try {
            // Check if user already exists
            const q = query(collection(db, "registrations"), where("uid", "==", user?.uid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                alert("You have already registered.");
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
            console.log('✨ New registration created with ID:', docRef.id);

            // Reset form (optional, as we redirect or show status)
        } catch (error) {
            console.error("Error submitting registration:", error);
            alert("Failed to submit registration.");
        } finally {
            setSubmitting(false);
        }
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
                            CHED RAISE 2026 has Concluded!
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Thank you for participating in our event. We hope you had a fruitful experience.
                        </p>
                    </div>

                    <Card className="glass-card border-primary/20 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5" />
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {registration.surveyCompleted ? "Certificate of Participation" : "Claim Your Certificate"}
                            </CardTitle>
                            <CardDescription>
                                {registration.surveyCompleted
                                    ? "You have successfully completed the event requirements."
                                    : "Please complete the feedback survey to generate your certificate."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="relative z-10 flex flex-col items-center gap-6 py-8">
                            {registration.surveyCompleted ? (
                                <div className="space-y-6">
                                    <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                    </div>
                                    <div className="p-6 bg-background/50 border border-border rounded-lg max-w-sm mx-auto">
                                        <p className="font-mono text-sm text-muted-foreground mb-2">CERTIFICATE ID</p>
                                        <p className="text-xl font-bold tracking-wider">{registration.ticketCode || registration.id}</p>
                                    </div>
                                    <Button size="lg" className="gap-2" onClick={() => alert("Certificate Download Started...")}>
                                        <CheckCircle2 className="w-4 h-4" /> Download Certificate
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
                                        <Pencil className="w-10 h-10 text-amber-500" />
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
                    <div className="opacity-70 pointer-events-none filter grayscale hover:grayscale-0 transition-all duration-500">
                        <RegistrationBusinessCard registration={registration} />
                    </div>

                </motion.div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 min-h-[calc(100vh-64px)]">
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
                {/* Header Welcome Section */}
                <div className="mt-6 sm:mt-10 flex items-center justify-between pb-4 sm:pb-6 border-b border-border/40">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Registration</h1>
                        <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your event registration and view status.</p>
                    </div>
                </div>

                <RegistrationProgress status={registration ? registration.status : null} />
                <div className="flex items-center justify-center">
                    <p className="text-sm sm:text-base text-muted-foreground mt-1 flex items-center"><InfoIcon className="w-4 h-4 mr-2" /> Tap the card to view your code or <EditIcon className="w-4 h-4 mx-2" /> to update your registration details.</p>
                </div>
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid gap-4 sm:gap-6 lg:grid-cols-3"
                >
                    {registration && (
                        <motion.div
                            key={registration.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-3"
                        >
                            <div className="max-w-3xl mx-auto">
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
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-schoolAffiliation">School Affiliation <span className="text-destructive">*</span></Label>
                                                <SchoolAutocomplete
                                                    id="edit-schoolAffiliation"
                                                    name="schoolAffiliation"
                                                    value={editFormData.schoolAffiliation}
                                                    onChange={(val) => setEditFormData((prev: any) => ({ ...prev, schoolAffiliation: val }))}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-contactNumber">Contact Number <span className="text-destructive">*</span></Label>
                                                <Input id="edit-contactNumber" name="contactNumber" value={editFormData.contactNumber} onChange={handleEditChange} className="col-span-3" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-registrantType">Registrant Type <span className="text-destructive">*</span></Label>
                                                <Select onValueChange={handleEditSelectChange} value={editFormData.registrantType}>
                                                    <SelectTrigger className="bg-background/50">
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="student">Student</SelectItem>
                                                        <SelectItem value="faculty">Faculty</SelectItem>
                                                        <SelectItem value="administrator">Administrator</SelectItem>
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
                        </motion.div>
                    )}


                    {/* Main Status / Form Card */}
                    <motion.div variants={item} className="lg:col-span-2 space-y-6">
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
                                            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto mb-3 sm:mb-4">
                                                {registration.status === 'pending' && "We have received your details. Our team is reviewing your application."}
                                                {registration.status === 'confirmed' && "You are all set! Present your QR code or ID at the venue entrance."}
                                                {registration.status === 'rejected' && "Unfortunately, we cannot accommodate your registration at this time. Please check your email for details."}
                                            </p>
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

                                        <div className="space-y-2">
                                            <Label htmlFor="registrantType">Registrant Type <span className="text-destructive">*</span></Label>
                                            <Select onValueChange={handleSelectChange} value={formData.registrantType}>
                                                <SelectTrigger className="bg-background/50">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="student">Student</SelectItem>
                                                    <SelectItem value="faculty">Faculty</SelectItem>
                                                    <SelectItem value="administrator">Administrator</SelectItem>
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
                    </motion.div>

                    <motion.div variants={item} className="space-y-6">
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
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default UserDashboard;
