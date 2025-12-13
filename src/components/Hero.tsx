import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import Typewriter from 'typewriter-effect';

import { CountdownTimer } from "@/components/CountdownTimer"

export function Hero() {
    return (
        <section id="hero" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-20 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />

            {/* Enhanced Background Effects with Animation - Reduced on mobile */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-50 pointer-events-none overflow-hidden hidden md:block">
                <motion.div
                    className="absolute top-[-10%] left-[20%] w-96 h-96 bg-primary blur-[140px] rounded-full mix-blend-screen"
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
                    className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-secondary blur-[140px] rounded-full mix-blend-screen"
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
                    className="absolute top-[40%] left-[60%] w-80 h-80 bg-teal-400/40 blur-[120px] rounded-full mix-blend-screen"
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                >
                    <Badge variant="outline" className="mb-12 py-1.5 px-4 border-primary/50 text-blue-200 bg-blue-900/30 hover:bg-blue-900/50 hover:border-primary/70 transition-all duration-300 uppercase tracking-widest text-xs font-semibold backdrop-blur-md shadow-lg shadow-primary/10">
                        <span className="relative flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                            National Industry–Academe Collaborative Conference
                        </span>
                    </Badge>
                </motion.div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-16 max-w-5xl mx-auto">
                    {/* Logo Side */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: -50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                        className="flex-shrink-0 relative"
                    >
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                        <img src="/r-icon.svg" alt="R Icon" className="h-48 md:h-64 w-auto drop-shadow-[0_0_50px_rgba(8,52,159,0.5)] relative z-10" />
                    </motion.div>

                    {/* Text Side */}
                    <div className="flex flex-col text-center md:text-left">
                        <motion.h2
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-4xl md:text-5xl font-light text-white mb-2 tracking-tight font-rubik"
                        >
                            CHED
                        </motion.h2>
                        <motion.h1
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-4 leading-tight py-2 relative font-rubik"
                        >
                            RAISE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#08349f] via-cyan-400 to-teal-400 animate-gradient">2026</span>
                            CHED RAISE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#08349f] via-cyan-400 to-teal-400 animate-gradient">2026</span>
                            <motion.span
                                className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-cyan-400/20 to-teal-400/20 blur-2xl -z-10"
                                animate={{ opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="text-lg md:text-2xl font-medium text-blue-200 max-w-md h-[64px]"
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
                                }}
                            />
                        </motion.div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-8 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-md shadow-2xl shadow-primary/5 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="flex items-center gap-3 text-slate-200 relative z-10">
                        <motion.div
                            className="p-3 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 text-blue-300 shadow-lg shadow-primary/20"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                            <Calendar className="h-5 w-5" />
                        </motion.div>
                        <span className="font-semibold">January 28-30, 2026</span>
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

                <CountdownTimer targetDate="2026-01-28T08:00:00" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 h-14 px-8 text-lg font-bold shadow-[0_0_40px_rgba(8,52,159,0.6)] hover:shadow-[0_0_50px_rgba(8,52,159,0.8)] transition-all relative overflow-hidden group" asChild>
                            <Link to="/login">
                                <span className="relative z-10 flex items-center">
                                    Register Now
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <span className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </Link>
                        </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 hover:bg-white/10 hover:border-white/40 bg-white/5 backdrop-blur-md transition-all relative overflow-hidden group">
                            <span className="relative z-10">View Agenda</span>
                            <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-teal-400/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
