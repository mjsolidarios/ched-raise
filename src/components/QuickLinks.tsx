import { useRef, useLayoutEffect } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Calendar, Users, BookOpen, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useGSAPScroll, staggerFadeIn } from "@/hooks/useGSAPScroll"

const LINKS = [
    {
        title: "Official Agenda",
        description: "View the complete 3-day schedule of keynotes, panels, and workshops.",
        icon: Calendar,
        href: "/agenda",
        color: "blue"
    },
    {
        title: "Track Program",
        description: "Explore specialized breakout sessions for Students, Teachers, and Admins.",
        icon: BookOpen,
        href: "/program",
        color: "teal"
    },
    {
        title: "Resource Persons",
        description: "Meet the world-class experts and visionaries joining us for the summit.",
        icon: Users,
        href: "/resource-persons",
        color: "purple"
    }
]

export function QuickLinks() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const { gsap } = useGSAPScroll()

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (containerRef.current) {
                staggerFadeIn(containerRef.current.children, { delay: 0.2 })
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
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Explore the Event</h2>
                    <p className="text-slate-400 text-lg">Navigate through the core components of the CHED-RAISE Summit 2026.</p>
                </div>

                <div ref={containerRef} className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto opacity-0">
                    {LINKS.map((link, index) => (
                        <LinkCard key={index} {...link} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function LinkCard({ title, description, icon: Icon, href, color }: typeof LINKS[0]) {
    return (
        <Link to={href} className="block h-full">
            <motion.div whileHover={{ y: -5 }} className="h-full">
                <Card className={`glass-card h-full border-white/5 hover:border-${color}-500/30 transition-all duration-300 group overflow-hidden relative`}>
                    <div className={`absolute inset-0 bg-gradient-to-br from-${color}-500/0 via-transparent to-transparent group-hover:from-${color}-500/5 transition-all duration-500`} />

                    <CardContent className="p-8 flex flex-col items-center text-center h-full relative z-10">
                        <div className={`w-16 h-16 rounded-2xl bg-${color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                            <Icon className={`w-8 h-8 text-${color}-400 group-hover:text-${color}-300 transition-colors`} />
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{title}</h3>
                        <p className="text-slate-400 mb-8 flex-grow">{description}</p>

                        <div className={`flex items-center gap-2 text-${color}-400 font-semibold group-hover:gap-3 transition-all`}>
                            View Details <ArrowRight className="w-4 h-4" />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </Link>
    )
}
