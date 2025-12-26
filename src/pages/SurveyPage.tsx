import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '@/lib/firebase';
import { doc, updateDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Loader2, Send, Star } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const SurveyPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [registrationId, setRegistrationId] = useState<string | null>(null);
    const [registrationData, setRegistrationData] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const q = query(collection(db, 'registrations'), where('uid', '==', user.uid));
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        const docData = querySnapshot.docs[0];
                        setRegistrationId(docData.id);
                        setRegistrationData(docData.data());
                    } else {
                        toast.error("No registration found.");
                        navigate('/dashboard');
                    }
                } catch (error) {
                    console.error("Error fetching registration:", error);
                }
                setLoading(false);
            } else {
                navigate('/login');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!registrationId || !registrationData) return;

        if (rating === 0) {
            toast.error("Please provide a rating.");
            return;
        }

        setSubmitting(true);
        try {
            await updateDoc(doc(db, 'registrations', registrationId), {
                surveyCompleted: true,
                surveyRating: rating,
                surveyFeedback: feedback,
                surveyTimestamp: new Date()
            });

            // Send Participation Certificate Email
            await axios.post('/api/email/', {
                type: 'participation_certificate',
                to: registrationData.email,
                name: registrationData.firstName,
                middleName: registrationData.middleName,
                lastName: registrationData.lastName,
                ticketCode: registrationData.ticketCode,
                // Pass a fallback from if needed, or let API handle it
                from: 'noreply@ched-raise.wvsu.edu.ph',
            });

            toast.success("Survey submitted! Your certificate has been sent to your email.");
            navigate('/dashboard');
        } catch (error) {
            console.error("Error submitting survey:", error);
            toast.error("Failed to submit survey. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg"
            >
                <Card className="glass-card border-primary/20 shadow-2xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Event Feedback
                        </CardTitle>
                        <CardDescription>
                            We hope you enjoyed the event! Please share your thoughts to get your certificate.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-base text-center block">How would you rate the event?</Label>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={`p-2 transition-transform hover:scale-110 focus:outline-none ${rating >= star ? 'text-yellow-400' : 'text-muted-foreground/30'}`}
                                        >
                                            <Star className="w-8 h-8 fill-current" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="feedback">Comments & Suggestions</Label>
                                <textarea
                                    id="feedback"
                                    placeholder="What did you like? What can we improve?"
                                    value={feedback}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFeedback(e.target.value)}
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Submit & Get Certificate
                                        <Send className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
};

export default SurveyPage;
