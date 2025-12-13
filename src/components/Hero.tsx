import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, MapPin } from "lucide-react"
import { motion } from "framer-motion"

import { CountdownTimer } from "@/components/CountdownTimer"

export function Hero() {
    return (
        <section id="hero" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(to_bottom,white,transparent)]">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-40 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[20%] w-72 h-72 bg-primary blur-[120px] rounded-full mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[10%] right-[20%] w-96 h-96 bg-secondary blur-[120px] rounded-full mix-blend-screen opacity-70 animate-pulse delay-1000" />
                <div className="absolute top-[40%] left-[60%] w-64 h-64 bg-accent/30 blur-[100px] rounded-full mix-blend-screen opacity-50 animate-bounce duration-[10000ms]" />
            </div>

            <div className="container px-4 relative z-10 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Badge variant="outline" className="mb-12 py-1.5 px-4 border-primary/50 text-blue-200 bg-blue-900/20 hover:bg-blue-900/30 transition-colors uppercase tracking-widest text-xs font-semibold backdrop-blur-sm">
                        National Industry–Academe Collaborative Conference
                    </Badge>
                </motion.div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-16 max-w-5xl mx-auto">
                    {/* Logo Side */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: -50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex-shrink-0"
                    >
                        <img src="/r-icon.svg" alt="R Icon" className="h-48 md:h-64 w-auto drop-shadow-[0_0_50px_rgba(8,52,159,0.3)]" />
                    </motion.div>

                    {/* Text Side */}
                    <div className="flex flex-col text-center md:text-left">
                        <motion.h2
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-4xl md:text-5xl font-light text-white mb-2 tracking-tight"
                        >
                            CHED
                        </motion.h2>
                        <motion.h1
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-4 leading-none"
                        >
                            RAISE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#08349f] via-cyan-400 to-teal-400">2025</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="text-lg md:text-2xl font-medium text-blue-200 max-w-md"
                        >
                            Responding through AI for Societal Empowerment
                        </motion.p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-8 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                    <div className="flex items-center gap-3 text-slate-200">
                        <div className="p-2 rounded-full bg-primary/20 text-blue-300">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <span className="font-medium">January 28-30, 2026</span>
                    </div>
                    <div className="hidden md:block w-px h-8 bg-white/10" />
                    <div className="flex items-center gap-3 text-slate-200">
                        <div className="p-2 rounded-full bg-teal-500/20 text-teal-300">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <span className="font-medium">Iloilo Convention Center, Iloilo City</span>
                    </div>
                </motion.div>

                <CountdownTimer targetDate="2026-01-28T08:00:00" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 h-14 px-8 text-lg font-bold shadow-[0_0_30px_rgba(8,52,159,0.5)] transition-all hover:scale-105 active:scale-95 transition-transform" asChild>
                        <a href="/login">
                            Register Now
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </a>
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/10 hover:bg-white/5 bg-transparent backdrop-blur-sm active:scale-95 transition-transform">
                        View Agenda
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}
