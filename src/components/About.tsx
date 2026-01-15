import { Card, CardContent } from "@/components/ui/card"
import { BrainCircuit, Lightbulb, Users, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"
import { useRef, useEffect } from "react"
import { useGSAPScroll, parallax, slideInLeft, staggerFadeIn } from "@/hooks/useGSAPScroll"

export function About() {
    const sectionRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const { gsap } = useGSAPScroll();

    useEffect(() => {
        // Parallax background effect
        if (bgRef.current) {
            parallax(bgRef.current, 0.2);
        }

        // Slide in text from left
        if (textRef.current) {
            slideInLeft(textRef.current);
        }

        // Stagger cards
        if (cardsRef.current) {
            const cards = cardsRef.current.querySelectorAll('.feature-card');
            if (cards.length > 0) {
                staggerFadeIn(cards);
            }
        }
    }, [gsap]);

    return (
        <section ref={sectionRef} id="about" className="py-24 relative overflow-hidden">
            <div ref={bgRef} className="absolute inset-0 bg-slate-950/50" />
            <div className="container px-4 relative z-10">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div
                        ref={textRef}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            Rationale & Vision
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white">
                            Beyond Modernization: <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#08349f] to-teal-400">AI for Nation Building</span>
                        </h2>
                        <div className="space-y-6 text-lg text-slate-400 leading-relaxed">
                            <p>
                                The rapid rise of AI presents both a challenge and an opportunity.
                                <strong className="text-white block mt-2">CHED RAISE 2026</strong> captures the vision of leveraging Artificial Intelligence not just for efficiency,
                                but for <span className="text-white">equity and societal empowerment</span>.
                            </p>
                            <p>
                                As a catalytic conference, we are operationalizing the National AI Strategy (NAIS-PH) and the CHED ACHIEVE Agenda
                                to ensure every Filipino is AI-ready, future-proof, and ethically grounded.
                            </p>
                        </div>
                    </div>

                    <div ref={cardsRef} className="grid sm:grid-cols-2 gap-4">
                        {[
                            { icon: BrainCircuit, color: "text-blue-400", title: "AI-Ready", desc: "Operationalizing the National AI Upskilling Roadmap." },
                            { icon: Lightbulb, color: "text-accent", title: "Innovation", desc: "Creative and values-based solutions for SDGs." },
                            { icon: ShieldCheck, color: "text-teal-400", title: "Ethical", desc: "Responsible adoption grounded in human values." },
                            { icon: Users, color: "text-blue-400", title: "Inclusivity", desc: "Strengthening collaboration between academe, industry, and government." }
                        ].map((item, index) => (
                            <SpotlightCard key={index} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

function SpotlightCard({ item }: { item: any }) {
    const divRef = useRef<HTMLDivElement>(null)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return

        const rect = divRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        divRef.current.style.setProperty("--mouse-x", `${x}px`)
        divRef.current.style.setProperty("--mouse-y", `${y}px`)
    }

    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="feature-card"
        >
            <Card
                ref={divRef as any}
                onMouseMove={handleMouseMove}
                className="glass-card bg-gradient-to-br from-white/10 to-white/5 border-white/10 hover:border-white/30 hover:from-white/15 hover:to-white/10 transition-all duration-300 h-full shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 relative overflow-hidden group gpu-accelerated"
                style={{
                    // @ts-ignore
                    "--mouse-x": "0px",
                    "--mouse-y": "0px",
                } as React.CSSProperties}
            >
                {/* Spotlight Gradient - Primary Color */}
                <div
                    className="absolute inset-0 z-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"
                    style={{
                        background: "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), hsl(var(--primary) / 0.15), transparent 40%)"
                    }}
                />

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-teal-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <CardContent className="p-6 relative z-10">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="inline-block"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 blur-xl opacity-50" style={{ backgroundColor: item.color.replace('text-', '') }} />
                            <item.icon className={`h-10 w-10 ${item.color} mb-4 relative`} />
                        </div>
                    </motion.div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-300 transition-all">{item.title}</h3>
                    <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{item.desc}</p>
                </CardContent>
            </Card>
        </motion.div>
    )
}
