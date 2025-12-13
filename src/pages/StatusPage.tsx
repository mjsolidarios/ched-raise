import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
            const q = query(collection(db, 'registrations'), where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                setResult({ id: doc.id, ...doc.data() });
            }
            setSearched(true);
        } catch (error) {
            console.error("Error checking status: ", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-500 hover:bg-green-600';
            case 'rejected': return 'bg-red-500 hover:bg-red-600';
            default: return 'bg-yellow-500 hover:bg-yellow-600';
        }
    };

    return (
        <div className="container mx-auto px-4 py-10 flex justify-center items-center min-h-[calc(100vh-64px)]">
            <Card className="w-full max-w-md glass-card">
                <CardHeader>
                    <CardTitle className="text-2xl text-center text-primary">Check Registration Status</CardTitle>
                    <CardDescription className="text-center">Enter your registered email address</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCheck} className="space-y-4 mb-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                placeholder="juana@example.com"
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Checking...' : 'Check Status'}
                        </Button>
                    </form>

                    {searched && (
                        <div className="mt-6 p-4 rounded-lg bg-background/50 border border-border">
                            {result ? (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">Name:</span>
                                        <span>{result.fullName}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">Status:</span>
                                        <Badge className={`${getStatusColor(result.status)} text-white`}>
                                            {result.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-2 text-center">
                                        Registration ID: {result.id}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    No registration found for this email.
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default StatusPage;
