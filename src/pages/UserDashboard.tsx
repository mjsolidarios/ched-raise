import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { Loader2, CalendarDays, User as UserIcon, Mail, Phone, Building2, CheckCircle2, XCircle, Clock } from 'lucide-react';



const UserDashboard = () => {
    const [user, setUser] = useState<User | null>(auth.currentUser);
    const [registration, setRegistration] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        fullName: user?.displayName || '',
        email: user?.email || '',
        contactNumber: '',
        company: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) {
            setLoading(false); // If no user, stop loading and show registration form
            return;
        }

        // Query by UID first
        const q = query(collection(db, 'registrations'), where('uid', '==', user.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const docData = snapshot.docs[0];
                setRegistration({ id: docData.id, ...docData.data() });
            } else {
                setRegistration(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await addDoc(collection(db, 'registrations'), {
                ...formData,
                uid: user?.uid, // Link to Auth UID
                status: 'pending',
                createdAt: serverTimestamp()
            });
            // onSnapshot will update the view
        } catch (error) {
            console.error("Error adding registration: ", error);
            alert("Registration failed. Please try again.");
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
            case 'confirmed': return <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-2" />;
            case 'rejected': return <XCircle className="h-12 w-12 text-destructive mb-2" />;
            default: return <Clock className="h-12 w-12 text-amber-500 mb-2" />;
        }
    };

    if (loading) return (
        <div className="flex h-[calc(100vh-64px)] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Loading your dashboard...</p>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 lg:py-12 min-h-[calc(100vh-64px)]">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Welcome Section */}
                <div className="mt-10 flex items-center justify-between pb-6 border-b border-border/40">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Registration</h1>
                        <p className="text-muted-foreground mt-1">Manage your event registration and view status.</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Status / Form Card */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="glass-card border-primary/10 overflow-hidden relative">
                            {/* Decorative gradient blob */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-2xl">
                                    <CalendarDays className="h-6 w-6 text-primary" />
                                    Event Registration
                                </CardTitle>
                                <CardDescription>
                                    CHED-RAISE Summit 2025
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {registration ? (
                                    <div className="space-y-6">
                                        {/* Status Display */}
                                        <div className="flex flex-col items-center justify-center p-8 bg-background/50 rounded-xl border border-border/50 text-center">
                                            {getStatusIcon(registration.status)}
                                            <h3 className="text-xl font-semibold mb-2 capitalize">
                                                Registration {registration.status}
                                            </h3>
                                            <p className="text-muted-foreground max-w-sm mx-auto mb-6 text-sm">
                                                {registration.status === 'pending' && "We have received your details. Our team is reviewing your application."}
                                                {registration.status === 'confirmed' && "You are all set! Present your QR code or ID at the venue entrance."}
                                                {registration.status === 'rejected' && "Unfortunately, we cannot accommodate your registration at this time. Please check your email for details."}
                                            </p>
                                            <Badge variant="outline" className={`text-base px-6 py-2 h-auto ${getStatusColor(registration.status)}`}>
                                                {registration.status.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="fullName" className="flex items-center gap-2">
                                                    <UserIcon className="h-4 w-4 text-muted-foreground" /> Full Name
                                                </Label>
                                                <Input id="fullName" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="Juana Dela Cruz" className="bg-background/50" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-muted-foreground" /> Email Address
                                                </Label>
                                                <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} disabled className="bg-muted opacity-80" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="contactNumber" className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-muted-foreground" /> Contact Number
                                            </Label>
                                            <Input id="contactNumber" name="contactNumber" required value={formData.contactNumber} onChange={handleChange} placeholder="0912 345 6789" className="bg-background/50" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="company" className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4 text-muted-foreground" /> Company / Institution
                                            </Label>
                                            <Input id="company" name="company" value={formData.company} onChange={handleChange} placeholder="University of the Philippines" className="bg-background/50" />
                                        </div>

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

                    {/* Side Info / Details Card */}
                    <div className="space-y-6">
                        {registration && (
                            <Card className="glass-card h-fit">
                                <CardHeader>
                                    <CardTitle className="text-lg">Your Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm">
                                    <div className="space-y-1">
                                        <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Registration ID</span>
                                        <p className="font-mono bg-muted/50 p-2 rounded text-xs break-all border border-border/50">{registration.id}</p>
                                    </div>

                                    <div className="pt-2 flex items-start gap-3">
                                        <UserIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="font-medium">{registration.fullName}</p>
                                            <span className="text-muted-foreground text-xs">Full Name</span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="font-medium">{registration.email}</p>
                                            <span className="text-muted-foreground text-xs">Email</span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="font-medium">{registration.company}</p>
                                            <span className="text-muted-foreground text-xs">Institution</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="font-medium">{registration.contactNumber}</p>
                                            <span className="text-muted-foreground text-xs">Mobile</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <Card className="glass-card bg-primary/5 border-primary/10">
                            <CardHeader>
                                <CardTitle className="text-base text-primary">Need Help?</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                <p>If you have any questions about your registration status or need to make changes, please contact the developer.</p>
                                <div className="mt-4 pt-4 border-t border-primary/10 flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-primary" />
                                    <a href="mailto:mjsolidarios@wvsu.edu.ph" className="text-primary hover:underline">mjsolidarios@wvsu.edu.ph</a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
