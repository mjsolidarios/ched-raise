import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import Typewriter from 'typewriter-effect';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from "firebase/firestore";
import { useGSAPScroll, parallax, scaleIn, staggerFadeIn } from "@/hooks/useGSAPScroll"

import { CountdownTimer } from "@/components/CountdownTimer"
// import { Robot } from "@/components/Robot"
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

export function Hero() {
    const containerRef = useRef<HTMLElement>(null);
    const [eventStatus, setEventStatus] = useState<'ongoing' | 'finished'>('ongoing');
    const blob1Ref = useRef<HTMLDivElement>(null);
    const blob2Ref = useRef<HTMLDivElement>(null);
    const blob3Ref = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const detailsRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    const { gsap } = useGSAPScroll();

    useEffect(() => {
        // Subscribe to global settings for event status
        const settingsUnsub = onSnapshot(doc(db, 'settings', 'general'), (docSnap) => {
            if (docSnap.exists()) {
                setEventStatus(docSnap.data().eventStatus || 'ongoing');
            }
        });
        return () => settingsUnsub();
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { left, top } = container.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;
            container.style.setProperty("--mouse-x", `${x}px`);
            container.style.setProperty("--mouse-y", `${y}px`);
        };

        container.addEventListener("mousemove", handleMouseMove);
        return () => container.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // GSAP Scroll Animations
    useEffect(() => {
        // Parallax effect on background blobs
        if (blob1Ref.current) {
            parallax(blob1Ref.current, -0.3);
        }
        if (blob2Ref.current) {
            parallax(blob2Ref.current, -0.4);
        }
        if (blob3Ref.current) {
            parallax(blob3Ref.current, -0.2);
        }

        // Logo scale in animation
        if (logoRef.current) {
            scaleIn(logoRef.current, { delay: 0.3 });
        }

        // Stagger animation for badge, details, and CTA
        const elements = [badgeRef.current, detailsRef.current, ctaRef.current].filter(Boolean);
        if (elements.length > 0) {
            staggerFadeIn(elements);
        }
    }, [gsap]);

    const { RiveComponent, rive } = useRive({
        src: '/ched_raise_anim.riv',
        autoplay: true,
        layout: new Layout({
            fit: Fit.Contain,
            alignment: Alignment.Center,
        }),
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && rive) {
                    rive.reset();
                    rive.play();
                }
            },
            { threshold: 0.5 }
        );

        if (logoRef.current) {
            observer.observe(logoRef.current);
        }

        return () => observer.disconnect();
    }, [rive]);

    return (
        <section
            id="hero"
            ref={containerRef}
            className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden group/hero"
        >
            {/* Professional Grid & Dots Background Overlay */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Base Faint Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-5" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                {/* Dynamic Spotlight Reveal Effect */}
                <div
                    className="absolute inset-0 bg-[linear-gradient(to_right,#80808020_1px,transparent_1px),linear-gradient(to_bottom,#80808020_1px,transparent_1px)] bg-[size:40px_40px] opacity-0 transition-opacity duration-300 group-hover/hero:opacity-100 will-change-[mask-image]"
                    style={{
                        maskImage: `radial-gradient(300px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), black, transparent)`,
                        WebkitMaskImage: `radial-gradient(300px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), black, transparent)`,
                    }}
                />
            </div>

            {/* Enhanced Background Effects with Animation - Reduced on mobile */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-50 pointer-events-none overflow-hidden hidden md:block">
                <motion.div
                    ref={blob1Ref}
                    className="absolute top-[-10%] left-[20%] w-96 h-96 bg-primary blur-[100px] rounded-full mix-blend-screen gpu-accelerated"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.4, 0.6, 0.4],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    ref={blob2Ref}
                    className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-secondary blur-[100px] rounded-full mix-blend-screen gpu-accelerated"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />
                <motion.div
                    ref={blob3Ref}
                    className="absolute top-[40%] left-[60%] w-80 h-80 bg-teal-400/40 blur-[80px] rounded-full mix-blend-screen gpu-accelerated"
                    animate={{
                        y: [0, -50, 0],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                />
            </div>

            <div className="container px-4 relative z-10 flex flex-col items-center">
                <motion.div
                    ref={badgeRef}
                    whileHover={{ scale: 1.05 }}
                >
                    <Badge variant="outline" className="mb-12 py-1.5 px-4 border-primary/50 text-blue-200 bg-blue-900/30 hover:bg-blue-900/50 hover:border-primary/70 transition-all duration-300 uppercase tracking-widest text-xs font-semibold backdrop-blur-md shadow-lg shadow-primary/10">
                        <span className="relative flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                            National Industry–Academe Collaborative Conference
                        </span>
                    </Badge>
                </motion.div>

                <motion.div
                    ref={logoRef}
                    className="group relative w-full max-w-5xl aspect-[3/1] flex items-center justify-center -mt-12"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out pointer-events-none" />

                    <div className="w-full h-full relative z-10 transition-all duration-500 group-hover:drop-shadow-[0_0_20px_rgba(91,141,239,0.8)]">
                        <RiveComponent />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-xs sm:text-sm md:text-2xl text-center font-medium text-blue-200 mb-8 -mt-4 md:-mt-16 relative z-20"
                >
                    <Typewriter
                        options={{
                            strings: [
                                'Responding through AI for Societal Empowerment',
                                'Connecting ASEAN Through Knowledge & Play',
                                'Building a Future-Ready Region'
                            ],
                            autoStart: true,
                            loop: true,
                            deleteSpeed: 50,
                            delay: 50,
                            cursor: "|",
                        }}
                    />
                </motion.div>

                <motion.div
                    ref={detailsRef}
                    whileHover={{ scale: 1.02 }}
                    className="flex flex-col md:flex-row items-start md:items-center md:justify-center gap-4 md:gap-8 mb-8 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-md shadow-2xl shadow-primary/5 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="flex items-center gap-3 text-slate-200 relative z-10">
                        <motion.div
                            className="p-3 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 text-blue-300 shadow-lg shadow-primary/20"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                            <Calendar className="h-5 w-5" />
                        </motion.div>
                        <span className="font-semibold">February 25-27, 2026</span>
                    </div>
                    <div className="hidden md:block w-px h-10 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                    <div className="flex items-center gap-3 text-slate-200 relative z-10">
                        <motion.div
                            className="p-3 rounded-xl bg-gradient-to-br from-teal-500/30 to-teal-500/10 text-teal-300 shadow-lg shadow-teal-500/20"
                            whileHover={{ scale: 1.1, rotate: -5 }}
                        >
                            <MapPin className="h-5 w-5" />
                        </motion.div>
                        <span className="font-semibold">Iloilo Convention Center, Iloilo City</span>
                    </div>
                </motion.div>

                {eventStatus !== 'finished' && (
                    <>
                        <CountdownTimer targetDate="2026-02-25T08:00:00" />

                        <motion.div
                            ref={ctaRef}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button size="lg" className="bg-primary text-white hover:bg-primary/90 h-14 px-8 text-lg font-bold shadow-[0_0_40px_rgba(8,52,159,0.6)] hover:shadow-[0_0_50px_rgba(8,52,159,0.8)] transition-all relative overflow-hidden group" asChild>
                                    <Link to="/login" onClick={() => window.scrollTo(0, 0)}>
                                        <span className="relative z-10 flex items-center">
                                            Register Now
                                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </Link>
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 hover:bg-white/5 hover:border-teal-400/50 bg-white/5 backdrop-blur-md transition-all relative overflow-hidden group" asChild>
                                    <Link to="/agenda">
                                        <span className="relative z-10 flex items-center group-hover:text-teal-300 transition-colors">
                                            <Calendar className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                                            View Agenda
                                        </span>
                                        <span className="absolute inset-0 bg-gradient-to-r from-teal-400/10 via-cyan-400/10 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                                    </Link>
                                </Button>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </div>

            {/* 3D Robot Floating at the Bottom */}
            {/* <Robot /> */}
        </section >
    )
}
