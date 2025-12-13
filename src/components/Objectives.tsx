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
                    {pillars.map((pillar, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="h-full"
                        >
                            <Card className={`glass-card bg-gradient-to-br from-slate-900/60 to-slate-900/40 border-white/10 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-3 group overflow-hidden relative h-full`}>
                                {/* Animated gradient background */}
                                <motion.div 
                                    className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/20 to-teal-400/10 rounded-bl-full -mr-10 -mt-10"
                                    whileHover={{ scale: 1.3, rotate: 45 }}
                                    transition={{ duration: 0.5 }}
                                />
                                
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                                <CardHeader className="relative z-10">
                                    <motion.div 
                                        className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-cyan-300 to-teal-400 mb-4"
                                        whileHover={{ scale: 1.1, rotate: -5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        {pillar.letter}
                                    </motion.div>
                                    <CardTitle className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-300 group-hover:to-teal-300 transition-all duration-300">{pillar.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="relative z-10">
                                    <motion.div 
                                        className="h-1 w-16 bg-gradient-to-r from-primary to-teal-400 rounded-full mb-4"
                                        initial={{ width: 0 }}
                                        whileInView={{ width: 64 }}
                                        transition={{ duration: 0.8, delay: i * 0.1 }}
                                    />
                                    <p className="text-slate-400 group-hover:text-slate-300 leading-relaxed text-sm transition-colors">{pillar.desc}</p>
                                    <div className="text-xs font-bold text-teal-400 group-hover:text-teal-300 uppercase tracking-wider flex flex-col mt-4 transition-colors">
                                        <span className="text-[10px] text-slate-500 group-hover:text-slate-400 font-normal transition-colors">Target Outcome</span>
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
                                    <motion.span 
                                        className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20 text-slate-300 flex items-center justify-center text-sm font-bold group-hover:bg-gradient-to-br group-hover:from-accent group-hover:to-primary group-hover:text-white group-hover:border-accent/50 transition-all shadow-lg group-hover:shadow-accent/30"
                                        whileHover={{ scale: 1.2, rotate: 360 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                    >{i + 1}</motion.span>
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
