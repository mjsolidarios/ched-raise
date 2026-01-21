import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { generateTicketCode } from '@/lib/raiseCodeUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { SchoolAutocomplete } from '@/components/SchoolAutocomplete';
import { SearchableSelect } from '@/components/SearchableSelect';
import { PHILIPPINE_REGIONS } from '@/lib/regions';

const RegistrationPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        schoolAffiliation: '',
        region: '',
        registrantType: 'participant',
        foodPreference: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'exists'>('idle');
    const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);
    const [noAffiliation, setNoAffiliation] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAffiliationChange = (value: string) => {
        setFormData({ ...formData, schoolAffiliation: value });
    };

    const handleRegionChange = (value: string) => {
        setFormData({ ...formData, region: value });
    };

    const handleNoAffiliationChange = (checked: boolean) => {
        setNoAffiliation(checked);
        if (checked) {
            setFormData(prev => ({ ...prev, schoolAffiliation: 'None' }));
        } else {
            setFormData(prev => ({ ...prev, schoolAffiliation: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!privacyPolicyAccepted) {
            alert('Please accept the privacy policy to proceed.');
            return;
        }

        if (!formData.foodPreference) {
            alert('Please select a food preference.');
            return;
        }

        if (!formData.region) {
            alert('Please select a region.');
            return;
        }

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

            // Generate Ticket Code and RAISE ID beforehand
            const ticketCode = generateTicketCode();

            await addDoc(collection(db, 'registrations'), {
                firstName: formData.firstName,
                middleName: formData.middleName,
                lastName: formData.lastName,
                email: formData.email,
                contactNumber: formData.contactNumber,
                schoolAffiliation: formData.schoolAffiliation,
                region: formData.region,
                registrantType: formData.registrantType,
                foodPreference: formData.foodPreference,
                status: 'pending',
                ticketCode: ticketCode,
                createdAt: serverTimestamp()
            });

            setStatus('success');
            setFormData({
                firstName: '',
                middleName: '',
                lastName: '',
                email: '',
                contactNumber: '',
                schoolAffiliation: '',
                region: '',
                registrantType: 'participant',
                foodPreference: ''
            });
            setNoAffiliation(false);
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
                                <Button className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 mt-4 shadow-[0_0_40px_rgba(8,52,159,0.6)] hover:shadow-[0_0_50px_rgba(8,52,159,0.8)] transition-all">Check Status</Button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2 mb-4">
                                <Label htmlFor="registrantType">Registrant Type</Label>
                                <select
                                    id="registrantType"
                                    name="registrantType"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.registrantType}
                                    onChange={(e) => {
                                        const type = e.target.value;
                                        const updates: any = { registrantType: type };
                                        if (type === 'chedofficial') {
                                            updates.schoolAffiliation = 'Not Applicable';
                                            setNoAffiliation(true); // Treat Not Applicable as None/Checked
                                        } else if (formData.schoolAffiliation === 'Not Applicable') {
                                            updates.schoolAffiliation = '';
                                            setNoAffiliation(false);
                                        }
                                        setFormData({ ...formData, ...updates });
                                    }}
                                >
                                    <option value="chedofficial">CHED Official</option>
                                    <option value="speaker">Speaker</option>
                                    <option value="exhibitor">Exhibitor</option>
                                    <option value="faculty">Faculty</option>
                                    <option value="college">College Student</option>
                                    <option value="shs">Senior High Student</option>
                                    <option value="participant">Participant</option>
                                    <option value="others">Others</option>
                                </select>
                            </div>

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
                            {formData.registrantType !== 'chedofficial' && (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="schoolAffiliation">Company / Institution</Label>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="noAffiliation"
                                                checked={noAffiliation}
                                                onCheckedChange={(checked: boolean) => handleNoAffiliationChange(checked)}
                                            />
                                            <label
                                                htmlFor="noAffiliation"
                                                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                                            >
                                                N/A or None
                                            </label>
                                        </div>
                                    </div>
                                    {!noAffiliation ? (
                                        <SchoolAutocomplete
                                            id="schoolAffiliation"
                                            name="schoolAffiliation"
                                            value={formData.schoolAffiliation}
                                            onChange={handleAffiliationChange}
                                            placeholder="Type university or college name..."
                                        />
                                    ) : (
                                        <Input
                                            id="schoolAffiliation"
                                            name="schoolAffiliation"
                                            value={formData.schoolAffiliation}
                                            disabled
                                            className="bg-muted text-muted-foreground"
                                        />
                                    )}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="region">Region <span className="text-destructive">*</span></Label>
                                <SearchableSelect
                                    options={PHILIPPINE_REGIONS}
                                    value={formData.region}
                                    onChange={handleRegionChange}
                                    placeholder="Select region"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="space-y-2">
                                    <Label htmlFor="foodPreference">Food Preference <span className="text-destructive">*</span></Label>
                                    <select
                                        id="foodPreference"
                                        name="foodPreference"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.foodPreference}
                                        onChange={(e) => setFormData({ ...formData, foodPreference: e.target.value })}
                                    >
                                        <option value="" disabled>Select preference</option>
                                        <option value="no_restriction">No Food Restriction</option>
                                        <option value="halal">Halal</option>
                                        <option value="vegetarian">Vegetarian</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="privacy-policy" checked={privacyPolicyAccepted} onCheckedChange={(checked: boolean | "indeterminate") => setPrivacyPolicyAccepted(checked === true)} />
                                <label
                                    htmlFor="privacy-policy"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    I agree to the <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
                                </label>
                            </div>
                            <p className="text-xs text-muted-foreground text-center">
                                By creating an account, you agree to our <Link to="/privacy-policy" className="underline hover:text-primary">Privacy Policy</Link>.
                            </p>

                            {status === 'exists' && <p className="text-destructive text-sm text-center">Reference with this email already exists.</p>}
                            {status === 'error' && <p className="text-destructive text-sm text-center">Something went wrong. Please try again.</p>}

                            <Button type="submit" className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 shadow-[0_0_40px_rgba(8,52,159,0.6)] hover:shadow-[0_0_50px_rgba(8,52,159,0.8)] transition-all" disabled={loading}>
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
