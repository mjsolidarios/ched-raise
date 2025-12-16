import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useRef } from "react"

const pillars = [
    { letter: "R", title: "Reimagine Education", desc: "Transform learning through AI-powered pedagogy and innovation", outcome: "Future-ready curricula" },
    { letter: "A", title: "Align Skills", desc: "Match HEI outputs with national AI and workforce roadmaps", outcome: "Job-ready graduates" },
    { letter: "I", title: "Innovate Responsibly", desc: "Ensure ethics, inclusion, and human values guide AI adoption", outcome: "Responsible education" },
    { letter: "S", title: "Strengthen Partnerships", desc: "Unite CHED, AAP, PCORP, TESDA, and IBPAP", outcome: "Multi-sector synergy" },
    { letter: "E", title: "Empower Communities", desc: "Leverage AI for social development and sustainability", outcome: "AI for societal good" },
]

export function Objectives() {
    return (
        <section id="objectives" className="py-24 relative">
            <div className="absolute top-0 right-0 p-20 opacity-20 pointer-events-none overflow-hidden w-full">
                <div className="w-96 h-96 bg-primary blur-[300px] rounded-full" />
            </div>

            <div className="container px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-5xl font-bold text-white mb-4"
                    >
                        The RAISE Framework
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-muted-foreground text-lg"
                    >
                        Our strategic approach to operationalizing AI in the academe.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-24">
                    {pillars.map((pillar, i) => (
                        <SpotlightCard key={i} pillar={pillar} index={i} />
                    ))}
                </div>

                <KeyObjectivesCard />
            </div>
        </section>
    )
}

function KeyObjectivesCard() {
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
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-1 group gpu-accelerated"
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
                    background: "radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), hsl(var(--primary) / 0.15), transparent 40%)"
                }}
            />

            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:30px_30px]" />
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-slate-950/80 rounded-[22px] p-8 md:p-12 relative z-10"
            >
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                    <span className="w-1.5 h-8 bg-accent rounded-full" />
                    Key Objectives
                </h3>
                <ul className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                    {[
                        "Promote responsible and ethical AI adoption across higher education.",
                        "Operationalize the National AI Upskilling Roadmap.",
                        "Strengthen AI literacy and digital competency.",
                        "Showcase innovations addressing SDGs.",
                        "Enhance collaboration through Philippine Skills Framework.",
                        "Inspire creative and values-based innovation."
                    ].map((obj, i) => (
                        <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            className="flex gap-4 items-start group/item"
                        >
                            <motion.span
                                className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20 text-slate-300 flex items-center justify-center text-sm font-bold group-hover/item:bg-gradient-to-br group-hover/item:from-accent group-hover/item:to-primary group-hover/item:text-white group-hover/item:border-accent/50 transition-all shadow-lg group-hover/item:shadow-accent/30"
                            >{i + 1}</motion.span>
                            <span className="text-slate-300 group-hover/item:text-white transition-colors pt-1">{obj}</span>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>
        </div>
    )
}


function SpotlightCard({ pillar, index }: { pillar: { letter: string, title: string, desc: string, outcome: string }, index: number }) {
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="h-full"
        >
            <Card
                ref={divRef as any}
                onMouseMove={handleMouseMove}
                className={`glass-card bg-gradient-to-br from-slate-900/60 to-slate-900/40 border-white/10 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-3 group overflow-hidden relative h-full gpu-accelerated flex flex-col`}
                style={{
                    // @ts-ignore
                    "--mouse-x": "0px",
                    "--mouse-y": "0px",
                } as React.CSSProperties}
            >
                {/* Spotlight Gradient */}
                <div
                    className="absolute inset-0 z-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"
                    style={{
                        background: "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), hsl(var(--primary) / 0.15), transparent 40%)"
                    }}
                />

                {/* Animated gradient background - KEEPING as per design but ensuring it doesn't conflict excessively, maybe tone it down if user asked? User didn't ask to remove this, only to ADD spotlight. 
                   Actually user said "remove the hover animation effect on the pillar texts R-A-I-S-E". 
                   Also "Remove the wiggling or shaking hover effect on the logos."
                   I will keep other bg effects but remove the text animation below.
                */}
                <motion.div
                    className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/20 to-teal-400/10 rounded-bl-full -mr-10 -mt-10"
                    // Removing whileHover scale/rotate on the bg blob as it might be distracting? User didn't explicitly say to remove THIS, but "wiggling" on logos. 
                    // I will leave this background blob animation for now as it wasn't requested to be removed.
                    whileHover={{ scale: 1.3, rotate: 45 }}
                    transition={{ duration: 0.5 }}
                />

                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-0" />

                <CardHeader className="relative z-10">
                    <motion.div
                        className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-cyan-300 to-teal-400 mb-4"
                    // REMOVED whileHover animation here as requested
                    >
                        {pillar.letter}
                    </motion.div>
                    <CardTitle className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-300 group-hover:to-teal-300 transition-all duration-300">{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 flex-1 flex flex-col">
                    <motion.div
                        className="h-1 w-16 bg-gradient-to-r from-primary to-teal-400 rounded-full mb-4"
                        initial={{ width: 0 }}
                        whileInView={{ width: 64 }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                    <p className="text-slate-400 group-hover:text-slate-300 leading-relaxed text-sm transition-colors">{pillar.desc}</p>
                    <div className="text-xs font-bold text-teal-400 group-hover:text-teal-300 uppercase tracking-wider flex flex-col mt-auto pt-4 transition-colors">
                        <span className="text-[10px] text-slate-500 group-hover:text-slate-400 font-normal transition-colors">Target Outcome</span>
                        {pillar.outcome}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
