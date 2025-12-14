import { useMemo, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Loader2, Search, XCircle } from 'lucide-react';

const StatusPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [searched, setSearched] = useState(false);

    const handleCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSearched(false);
        setResult(null);

        try {
            const normalizedEmail = email.trim();
            const q = query(collection(db, 'registrations'), where('email', '==', normalizedEmail));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docSnap = querySnapshot.docs[0];
                setResult({ id: docSnap.id, ...docSnap.data() });
            }
            setSearched(true);
        } catch (error) {
            console.error("Error checking status: ", error);
        } finally {
            setLoading(false);
        }
    };

    const status = (result?.status || 'pending') as string;

    const fullName = useMemo(() => {
        if (!result) return '';
        if (result.fullName) return result.fullName as string;
        const parts = [result.firstName, result.middleName, result.lastName].filter(Boolean);
        return parts.length ? parts.join(' ') : '';
    }, [result]);

    const registrantTypeLabel = useMemo(() => {
        if (!result) return '';
        if (result.registrantType === 'others') return result.registrantTypeOther || 'Other';
        return result.registrantType || '';
    }, [result]);

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'confirmed':
                return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20';
            case 'rejected':
                return 'bg-destructive/15 text-destructive border-destructive/20';
            default:
                return 'bg-amber-500/15 text-amber-500 border-amber-500/20';
        }
    };

    const getStatusIcon = (s: string) => {
        switch (s) {
            case 'confirmed':
                return <CheckCircle2 className="h-6 w-6 text-emerald-500" />;
            case 'rejected':
                return <XCircle className="h-6 w-6 text-destructive" />;
            default:
                return <Clock className="h-6 w-6 text-amber-500" />;
        }
    };

    const statusMessage = useMemo(() => {
        switch (status) {
            case 'confirmed':
                return 'Your registration is confirmed. Please watch your email for venue updates.';
            case 'rejected':
                return 'Your registration was not approved. Please check your email for details.';
            default:
                return 'Your registration is on review. Please check back later.';
        }
    }, [status]);

    return (
        <div className="container mx-auto px-4 py-10 min-h-[calc(100vh-64px)]">
            <div className="max-w-xl mx-auto">
                <div className="text-center mb-8">
                    <p className="text-xs tracking-wider uppercase text-muted-foreground">CHED-RAISE Summit 2026</p>
                    <h1 className="text-3xl font-bold tracking-tight mt-2">Registration Status</h1>
                    <p className="text-muted-foreground mt-2">Enter the email you used to register.</p>
                </div>

                <Card className="glass-card overflow-hidden">
                    <CardHeader className="border-b border-white/5">
                        <CardTitle className="flex items-center justify-center gap-2">
                            <Search className="h-5 w-5 text-primary" />
                            Status Lookup
                        </CardTitle>
                        <CardDescription className="text-center">
                            Tip: make sure the email matches what you submitted.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-6">
                        <form onSubmit={handleCheck} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                    placeholder="juana@example.com"
                                    className="bg-background/50"
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <span className="inline-flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Checking...
                                    </span>
                                ) : (
                                    'Check Status'
                                )}
                            </Button>
                        </form>

                        {searched && (
                            <div className="mt-6">
                                {result ? (
                                    <div className="rounded-xl bg-background/40 border border-white/10 p-4 sm:p-5 space-y-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                {getStatusIcon(status)}
                                                <div>
                                                    <p className="font-semibold leading-tight">{fullName || 'Registrant'}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{statusMessage}</p>
                                                </div>
                                            </div>

                                            <Badge variant="outline" className={getStatusColor(status)}>
                                                {status.toUpperCase()}
                                            </Badge>
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2 text-sm">
                                            <div className="space-y-1">
                                                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Registration ID</p>
                                                <p className="font-mono text-xs break-all">{result.id}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Email</p>
                                                <p className="text-xs break-all">{result.email || email.trim()}</p>
                                            </div>
                                            {!!(result.schoolAffiliation || result.company) && (
                                                <div className="space-y-1 sm:col-span-2">
                                                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Affiliation</p>
                                                    <p className="text-sm">{result.schoolAffiliation || result.company}</p>
                                                </div>
                                            )}
                                            {!!(registrantTypeLabel) && (
                                                <div className="space-y-1">
                                                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Registrant Type</p>
                                                    <p className="text-sm capitalize">{registrantTypeLabel}</p>
                                                </div>
                                            )}
                                            {!!(result.contactNumber) && (
                                                <div className="space-y-1">
                                                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Contact</p>
                                                    <p className="text-sm">{result.contactNumber}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-xl bg-background/40 border border-white/10 p-4 sm:p-5 text-center">
                                        <p className="font-medium">No registration found</p>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Double-check the spelling, or try the email you used during sign-up.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default StatusPage;
