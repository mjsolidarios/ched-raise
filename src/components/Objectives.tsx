import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

const pillars = [
    { letter: "R", title: "Reimagine Education", desc: "Transform learning through AI-powered pedagogy and innovation", outcome: "Future-ready curricula" },
    { letter: "A", title: "Align Skills", desc: "Match HEI outputs with national AI and workforce roadmaps", outcome: "Job-ready graduates" },
    { letter: "I", title: "Innovate Responsibly", desc: "Ensure ethics, inclusion, and human values guide AI adoption", outcome: "Responsible education" },
    { letter: "S", title: "Strengthen Partnerships", desc: "Unite CHED, AAP, PCORP, TESDA, and IBPAP", outcome: "Multi-sector synergy" },
    { letter: "E", title: "Empower Communities", desc: "Leverage AI for social development and sustainability", outcome: "AI for societal good" },
]

export function Objectives() {
    return (
        <section id="objectives" className="py-24 bg-background relative">
            <div className="absolute top-0 right-0 p-20 opacity-20 pointer-events-none overflow-hidden">
                <div className="w-96 h-96 bg-primary blur-[150px] rounded-full" />
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
                    {pillars.map((pillar, index) => (
                        <motion.div
                            key={pillar.letter}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <Card className={`glass-card bg-slate-900/40 border-white/5 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-2 group overflow-hidden relative h-full`}>
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <span className="text-8xl font-black">{pillar.letter}</span>
                                </div>
                                <CardHeader className="pb-2 relative pt-8">
                                    <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-white mb-4">{pillar.letter}</div>
                                    <CardTitle className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors leading-tight h-12 flex items-center">{pillar.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="relative">
                                    <div className="h-px w-12 bg-indigo-500/30 mb-4" />
                                    <p className="text-sm text-slate-400 mb-6 min-h-[60px]">{pillar.desc}</p>
                                    <div className="text-xs font-bold text-teal-400 uppercase tracking-wider flex flex-col">
                                        <span className="text-[10px] text-slate-500 font-normal">Target Outcome</span>
                                        {pillar.outcome}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-1">
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:30px_30px]" />
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-slate-950/80 rounded-[22px] p-8 md:p-12 relative"
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
                                    className="flex gap-4 items-start group"
                                >
                                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-300 flex items-center justify-center text-sm font-bold group-hover:bg-accent group-hover:text-accent-foreground transition-colors">{i + 1}</span>
                                    <span className="text-slate-300 group-hover:text-white transition-colors pt-1">{obj}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
