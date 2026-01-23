import { useRef, useLayoutEffect } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Calendar, Users, BookOpen, ArrowRight, type LucideIcon } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useGSAPScroll, staggerFadeIn } from "@/hooks/useGSAPScroll"

const LINKS = [
    {
        title: "Official Agenda",
        description: "View the complete 3-day schedule of keynotes, panels, and workshops.",
        icon: Calendar,
        href: "/agenda",
        color: "blue",
        action: "View Schedule"
    },
    {
        title: "Track Program",
        description: "Explore specialized breakout sessions for Students, Teachers, and Admins.",
        icon: BookOpen,
        href: "/program",
        color: "teal",
        action: "Browse Tracks"
    },
    {
        title: "Resource Persons",
        description: "Meet the world-class experts and visionaries joining us for the summit.",
        icon: Users,
        href: "/resource-persons",
        color: "purple",
        action: "Meet Experts"
    }
]

export function QuickLinks() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const { gsap } = useGSAPScroll()

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (containerRef.current) {
                staggerFadeIn(Array.from(containerRef.current.children), {
                    delay: 0.2,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 95%",
                        toggleActions: "play none none reverse"
                    }
                })
            }
        }, sectionRef)
        return () => ctx.revert()
    }, [gsap])

    return (
        <section ref={sectionRef} className="py-24 bg-slate-950 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl opacity-30 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/20 blur-[128px] rounded-full" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/20 blur-[128px] rounded-full" />
            </div>

            <div className="container px-4 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-5xl font-bold text-white mb-6"
                    >
                        Explore the Event
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-slate-400 text-lg"
                    >
                        Navigate through the core components of the CHED-RAISE Summit 2026.
                    </motion.p>
                </div>

                <div ref={containerRef} className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {LINKS.map((link, index) => (
                        <SpotlightCard key={index} link={link} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function SpotlightCard({ link }: { link: typeof LINKS[0] }) {
    const divRef = useRef<HTMLDivElement>(null)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return

        const rect = divRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        divRef.current.style.setProperty("--mouse-x", `${x}px`)
        divRef.current.style.setProperty("--mouse-y", `${y}px`)
    }

    const theme = getTheme(link.color)

    return (
        <Link to={link.href} className="h-full block group/card">
            <motion.div className="h-full">
                <Card
                    ref={divRef as any}
                    onMouseMove={handleMouseMove}
                    className={`glass-card bg-slate-950/40 backdrop-blur-md border-white/10 ${theme.border} ${theme.shadow} hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden relative h-full flex flex-col`}
                    style={{
                        // @ts-ignore
                        "--mouse-x": "0px",
                        "--mouse-y": "0px",
                    } as React.CSSProperties}
                >
                    {/* Spotlight Gradient */}
                    <div
                        className="absolute inset-0 z-0 transition-opacity duration-300 opacity-0 group-hover/card:opacity-100 pointer-events-none"
                        style={{
                            background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), ${theme.spotlight}, transparent 40%)`
                        }}
                    />

                    {/* Background Watermark Icon */}
                    <link.icon
                        className={`absolute -right-8 -bottom-8 w-48 h-48 opacity-[0.03] group-hover/card:opacity-[0.08] transition-opacity duration-500 select-none text-${link.color}-500/50`}
                    />

                    {/* Subtle top gradient */}
                    <div className={`absolute top-0 right-0 w-full h-32 bg-gradient-to-b ${theme.bgGradient} opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                    <CardHeader className="relative z-10 pb-2">
                        <div className="flex items-center justify-between mb-4">
                            <motion.div
                                className={`p-3 rounded-xl bg-gradient-to-br ${theme.iconBg} border border-white/10`}
                            >
                                <link.icon className={`w-6 h-6 ${theme.iconText}`} />
                            </motion.div>
                            <div className={`h-1.5 w-12 rounded-full bg-gradient-to-r ${theme.bar}`} />
                        </div>
                        <CardTitle className={`text-2xl font-bold text-white group-hover/card:text-transparent group-hover/card:bg-clip-text group-hover/card:bg-gradient-to-r ${theme.titleGradient} transition-all duration-300`}>
                            {link.title}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="relative z-10 flex-1 flex flex-col pt-2">
                        <p className="text-slate-400/90 group-hover/card:text-slate-300 leading-relaxed text-sm mb-8 transition-colors">
                            {link.description}
                        </p>

                        <div className="mt-auto">
                            <div className={`flex items-center gap-2 text-sm font-semibold tracking-wide transition-colors ${theme.actionText} group-hover/card:translate-x-1 duration-300`}>
                                {link.action} <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </Link>
    )
}

function getTheme(color: string) {
    if (color === 'blue') {
        return {
            border: 'hover:border-blue-500/50',
            shadow: 'hover:shadow-blue-500/20',
            spotlight: 'hsl(220 70% 50% / 0.15)',
            bgGradient: 'from-blue-500/10 to-indigo-500/5',
            titleGradient: 'group-hover/card:from-blue-300 group-hover/card:to-indigo-300',
            iconBg: 'from-blue-500/20 to-blue-500/5',
            iconText: 'text-blue-400 group-hover/card:text-blue-300',
            bar: 'from-blue-500 to-indigo-500',
            actionText: 'text-blue-400 group-hover/card:text-blue-300'
        }
    }
    if (color === 'teal') {
        return {
            border: 'hover:border-teal-500/50',
            shadow: 'hover:shadow-teal-500/20',
            spotlight: 'hsl(170 70% 50% / 0.15)',
            bgGradient: 'from-teal-500/10 to-emerald-500/5',
            titleGradient: 'group-hover/card:from-teal-300 group-hover/card:to-emerald-300',
            iconBg: 'from-teal-500/20 to-teal-500/5',
            iconText: 'text-teal-400 group-hover/card:text-teal-300',
            bar: 'from-teal-500 to-emerald-500',
            actionText: 'text-teal-400 group-hover/card:text-teal-300'
        }
    }
    // Purple
    return {
        border: 'hover:border-purple-500/50',
        shadow: 'hover:shadow-purple-500/20',
        spotlight: 'hsl(270 50% 60% / 0.15)',
        bgGradient: 'from-purple-500/10 to-pink-500/5',
        titleGradient: 'group-hover/card:from-purple-300 group-hover/card:to-pink-300',
        iconBg: 'from-purple-500/20 to-purple-500/5',
        iconText: 'text-purple-400 group-hover/card:text-purple-300',
        bar: 'from-purple-500 to-pink-500',
        actionText: 'text-purple-400 group-hover/card:text-purple-300'
    }
}
