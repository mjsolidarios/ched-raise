import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const RegistrationPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        contactNumber: '',
        company: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'exists'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');

        try {
            // Check if email already exists
            const q = query(collection(db, 'registrations'), where('email', '==', formData.email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setStatus('exists');
                setLoading(false);
                return;
            }

            await addDoc(collection(db, 'registrations'), {
                ...formData,
                status: 'pending',
                createdAt: serverTimestamp()
            });
            setStatus('success');
            setFormData({ fullName: '', email: '', contactNumber: '', company: '' });
        } catch (error) {
            console.error("Error adding registration: ", error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-10 flex justify-center items-center min-h-[calc(100vh-64px)]">
            <Card className="w-full max-w-md glass-card">
                <CardHeader>
                    <CardTitle className="text-2xl text-center text-primary">Event Registration</CardTitle>
                    <CardDescription className="text-center">Join us for CHED RAISE 2025</CardDescription>
                </CardHeader>
                <CardContent>
                    {status === 'success' ? (
                        <div className="text-center space-y-4">
                            <div className="text-green-500 font-bold text-xl">Registration Successful!</div>
                            <p className="text-muted-foreground">Thank you for registering. You can check your status using your email.</p>
                            <Link to="/status">
                                <Button className="w-full mt-4">Check Status</Button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input id="fullName" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="Juana Dela Cruz" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="juana@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contactNumber">Contact Number</Label>
                                <Input id="contactNumber" name="contactNumber" required value={formData.contactNumber} onChange={handleChange} placeholder="0912 345 6789" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company">Company / Institution</Label>
                                <Input id="company" name="company" value={formData.company} onChange={handleChange} placeholder="University of the Philippines" />
                            </div>

                            {status === 'exists' && <p className="text-destructive text-sm text-center">Reference with this email already exists.</p>}
                            {status === 'error' && <p className="text-destructive text-sm text-center">Something went wrong. Please try again.</p>}

                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                                {loading ? 'Submitting...' : 'Register'}
                            </Button>
                        </form>
                    )}
                </CardContent>
                {status !== 'success' && (
                    <CardFooter className="justify-center">
                        <Link to="/status" className="text-sm text-muted-foreground hover:text-primary">
                            Already registered? Check status
                        </Link>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
};

export default RegistrationPage;
