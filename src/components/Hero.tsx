import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, MapPin } from "lucide-react"
import { motion } from "framer-motion"

export function Hero() {
    return (
        <section id="hero" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(to_bottom,white,transparent)]">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-40 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[20%] w-72 h-72 bg-primary blur-[120px] rounded-full mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[10%] right-[20%] w-96 h-96 bg-secondary blur-[120px] rounded-full mix-blend-screen opacity-70 animate-pulse delay-1000" />
                <div className="absolute top-[40%] left-[60%] w-64 h-64 bg-accent/30 blur-[100px] rounded-full mix-blend-screen opacity-50 animate-bounce duration-[10000ms]" />
            </div>

            <div className="container px-4 relative z-10 text-center flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Badge variant="outline" className="mb-8 py-1.5 px-4 border-primary/50 text-blue-200 bg-blue-900/20 hover:bg-blue-900/30 transition-colors uppercase tracking-widest text-xs font-semibold backdrop-blur-sm">
                        National Industry–Academe Collaborative Conference
                    </Badge>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 leading-[1.1]"
                >
                    CHED RAISE <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-400">2025</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl font-medium text-indigo-200 mb-2"
                >
                    Responding through AI for Societal Empowerment
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-light"
                >
                    Empowering Minds, Transforming Communities through <br className="hidden md:block" />
                    <span className="text-white font-medium">Responsible and Inclusive AI</span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-12 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                    <div className="flex items-center gap-3 text-slate-200">
                        <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-300">
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

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 h-14 px-8 text-lg font-bold shadow-[0_0_30px_rgba(251,191,36,0.3)] transition-all hover:scale-105">
                        Register Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/10 hover:bg-white/5 bg-transparent backdrop-blur-sm">
                        View Agenda
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mt-20 pt-10 border-t border-white/5 w-full max-w-4xl flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 gap-4"
                >
                    <span>Lead Institutions:</span>
                    <div className="flex gap-6 font-semibold text-slate-300">
                        <span>Northern Iloilo State University (NISU)</span>
                        <span>•</span>
                        <span>West Visayas State University (WVSU)</span>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
