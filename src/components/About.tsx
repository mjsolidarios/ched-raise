import { Card, CardContent } from "@/components/ui/card"
import { BrainCircuit, Lightbulb, Users, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"

export function About() {
    return (
        <section id="about" className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-950/50" />
            <div className="container px-4 relative z-10">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            Rationale & Vision
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white">
                            Beyond Modernization: <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400">AI for Nation Building</span>
                        </h2>
                        <div className="space-y-6 text-lg text-slate-400 leading-relaxed">
                            <p>
                                The rapid rise of AI presents both a challenge and an opportunity.
                                <strong className="text-white block mt-2">CHED RAISE 2025</strong> captures the vision of leveraging Artificial Intelligence not just for efficiency,
                                but for <span className="text-white">equity and societal empowerment</span>.
                            </p>
                            <p>
                                As a catalytic conference, we are operationalizing the National AI Strategy (NAIS-PH) and the CHED ACHIEVE Agenda
                                to ensure every Filipino is AI-ready, future-proof, and ethically grounded.
                            </p>
                        </div>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            { icon: BrainCircuit, color: "text-indigo-400", title: "AI-Ready", desc: "Operationalizing the National AI Upskilling Roadmap." },
                            { icon: Lightbulb, color: "text-accent", title: "Innovation", desc: "Creative and values-based solutions for SDGs." },
                            { icon: ShieldCheck, color: "text-teal-400", title: "Ethical", desc: "Responsible adoption grounded in human values." },
                            { icon: Users, color: "text-blue-400", title: "Inclusivity", desc: "Strengthening collaboration between academe, industry, and government." }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="glass-card bg-white/5 border-white/5 hover:bg-white/10 transition-colors h-full">
                                    <CardContent className="p-6">
                                        <item.icon className={`h-8 w-8 ${item.color} mb-4`} />
                                        <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                        <p className="text-sm text-slate-400">{item.desc}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
