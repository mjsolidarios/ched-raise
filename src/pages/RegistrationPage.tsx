import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { generateRaiseGrid } from '@/lib/raise';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const RegistrationPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        schoolAffiliation: ''
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

            const docRef = await addDoc(collection(db, 'registrations'), {
                firstName: formData.firstName,
                middleName: formData.middleName,
                lastName: formData.lastName,
                email: formData.email,
                contactNumber: formData.contactNumber,
                schoolAffiliation: formData.schoolAffiliation,
                status: 'pending',
                createdAt: serverTimestamp()
            });

            const qrValue = `CHED-RAISE-2026|${docRef.id}|${formData.email}`;
            const raiseCode = generateRaiseGrid(qrValue);

            await updateDoc(doc(db, 'registrations', docRef.id), {
                raiseCode: raiseCode
            });

            setStatus('success');
            setFormData({ firstName: '', middleName: '', lastName: '', email: '', contactNumber: '', schoolAffiliation: '' });
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
                    <CardDescription className="text-center">Join us for CHED RAISE 2026</CardDescription>
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
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" name="firstName" required value={formData.firstName} onChange={handleChange} placeholder="Juana" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" name="lastName" required value={formData.lastName} onChange={handleChange} placeholder="Dela Cruz" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="middleName">Middle Name (Optional)</Label>
                                <Input id="middleName" name="middleName" value={formData.middleName} onChange={handleChange} />
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
                                <Label htmlFor="schoolAffiliation">Company / Institution</Label>
                                <Input id="schoolAffiliation" name="schoolAffiliation" value={formData.schoolAffiliation} onChange={handleChange} placeholder="University of the Philippines" />
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
