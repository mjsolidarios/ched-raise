import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useNavigate, useLocation } from 'react-router-dom';
import { Globe, Mail, Lock, LogIn, Loader2, AlertCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            navigate(from, { replace: true });
        } catch (err: any) {
            console.error("Auth error:", err);
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate(from, { replace: true });
        } catch (err: any) {
            console.error("Google Auth error:", err);
            setError(err.message || 'Google Sign-In failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl opacity-20 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="mt-10 w-full glass-card border-white/10 relative z-10 shadow-2xl">
                    <CardHeader className="text-center space-y-2 pb-6">
                        <div className="mx-auto w-24 h-24 rounded-2xl flex items-center justify-center p-4">
                            <img src="/r-icon.svg" alt="CHED RAISE Logo" className="w-full h-full object-contain" />
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tight">
                            {isLogin ? 'Welcome Back' : 'Join CHED RAISE'}
                        </CardTitle>
                        <CardDescription className="text-base">
                            {isLogin ? 'Enter your credentials to access your account' : 'Start your journey with us today'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Button
                            variant="outline"
                            className="w-full h-12 text-base font-medium relative hover:bg-white/5 border-white/10 gap-3"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                        >
                            {/* Simple Google G icon SVG can be used here or just the Lucide Globe as placeholder if no SVG asset */}
                            <Globe className="h-5 w-5 text-blue-400" />
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

                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="pl-10 h-12 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                                        value={email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 h-12 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                                        value={password}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2 justify-center">
                                    <AlertCircle className="h-4 w-4" />
                                    {error}
                                </div>
                            )}

                            <Button type="submit" className="w-full h-12 text-base bg-primary hover:bg-primary/90 mt-2 shadow-lg shadow-primary/20" disabled={loading}>
                                {loading ? (
                                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Please wait...</>
                                ) : (isLogin ? (
                                    <><LogIn className="mr-2 h-5 w-5" /> Sign In</>
                                ) : (
                                    <><Zap className="mr-2 h-5 w-5" /> Create Account</>
                                ))}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center border-t border-white/5 py-4">
                        <p className="text-sm text-muted-foreground">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="px-1.5 font-semibold text-primary hover:text-primary/80">
                                {isLogin ? "Sign up" : "Sign in"}
                            </Button>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default LoginPage;
