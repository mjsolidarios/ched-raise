import { Button } from "@/components/ui/button"
import { Menu, LogOut } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

import { cn } from "@/lib/utils"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [user, setUser] = useState<User | null>(null);
    const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
    const [checkingRegistration, setCheckingRegistration] = useState(true);
    const location = useLocation()
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) {
            setCheckingRegistration(false);
            return;
        }

        const q = query(collection(db, 'registrations'), where('uid', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const data = snapshot.docs[0].data();
                setIsRegistrationComplete(data.status === 'confirmed');
            } else {
                setIsRegistrationComplete(false); // No registration means not complete
            }
            setCheckingRegistration(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
        const isActive = location.pathname === href

        return (
            <Link
                to={href}
                className={cn(
                    "text-sm font-medium transition-all duration-300 relative py-2 px-4 rounded-full flex items-center gap-2 overflow-hidden",
                    isActive
                        ? "bg-primary text-white shadow-none ring-0 outline-none"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                )}
                onClick={() => setIsOpen(false)}
            >
                {children}
            </Link>
        )
    }

    const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
        <>
            <div className={cn(
                "flex gap-1",
                isMobile ? "flex-col items-start w-full gap-2" : "items-center"
            )}>

                {["About", "Objectives", "Program"].map((item) => (
                    <a
                        key={item}
                        href={`/#${item.toLowerCase()}`}
                        className={cn(
                            "text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 py-2 px-3 rounded-full transition-all",
                            isMobile && "w-full text-left pl-4"
                        )}
                        onClick={() => setIsOpen(false)}
                    >
                        {item}
                    </a>
                ))}
                <NavLink href="/tourism">
                    Visit Iloilo
                </NavLink>
            </div>

            <div className={cn(
                "bg-white/10 mx-2",
                isMobile ? "h-px w-full my-2" : "w-px h-6"
            )} />

            {user && (
                <div className={cn(isMobile && "w-full pl-1")}>
                    <NavLink href="/dashboard">
                        <div className="flex items-center gap-2">
                            My Registration
                            {!checkingRegistration && !isRegistrationComplete && (
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                            )}
                        </div>
                    </NavLink>
                </div>
            )}
        </>
    )

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/60 backdrop-blur-xl">
            <div className="container mx-auto flex items-center justify-between px-4 h-16">
                <div className="flex items-center gap-3">
                    <Link
                        to="/"
                        onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            setIsOpen(false);
                        }}
                    >
                        <img src="/logo-light.svg" alt="CHED RAISE Logo" className="h-8 w-auto" />
                    </Link>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8 text-foreground/80">
                    <NavLinks />
                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-muted-foreground hidden lg:block max-w-[150px] truncate" title={user.displayName || user.email || ''}>
                                {user.displayName || user.email}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                                className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                            >
                                <LogOut className="w-4 h-4 mr-2" /> Logout
                            </Button>
                        </div>
                    ) : (
                        <Link to="/login">
                            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold">
                                Sign In / Register
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Mobile Nav */}
                <div className="md:hidden flex items-center gap-4">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-background/95 backdrop-blur-xl border-l border-white/10">
                            <div className="flex flex-col gap-6 mt-10">
                                <NavLinks isMobile={true} />
                                {user ? (
                                    <Button
                                        variant="outline"
                                        className="w-full border-red-500/50 text-red-400 hover:bg-red-950/20"
                                        onClick={() => {
                                            handleLogout();
                                            setIsOpen(false);
                                        }}
                                    >
                                        Logout
                                    </Button>
                                ) : (
                                    <Link to="/login" onClick={() => setIsOpen(false)}>
                                        <Button className="bg-accent text-accent-foreground hover:bg-accent/90 w-full">
                                            Sign In / Register
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    )
}
