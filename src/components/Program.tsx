import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function Program() {
    return (
        <section id="program" className="py-24 bg-slate-950 relative">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-0 w-full h-[500px] bg-gradient-to-r from-blue-900/10 to-indigo-900/10 blur-3xl pointer-events-none -translate-y-1/2" />

            <div className="container px-4 relative z-10">
                <div className="flex flex-col items-center mb-16">
                    <Badge variant="outline" className="mb-4 border-green-500/30 text-green-400 bg-green-900/10 uppercase tracking-widest">Multi-Track Agenda</Badge>
                    <h2 className="text-3xl md:text-5xl font-bold text-white text-center">Breakout Sessions</h2>
                </div>

                <Tabs defaultValue="students" className="max-w-5xl mx-auto">
                    <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-slate-900/50 border border-white/10 p-1.5 h-auto rounded-xl mb-12 backdrop-blur-sm">
                        <TabsTrigger value="students" className="data-[state=active]:bg-primary data-[state=active]:text-white py-3 font-semibold rounded-lg transition-all text-slate-400">Students</TabsTrigger>
                        <TabsTrigger value="teachers" className="data-[state=active]:bg-primary data-[state=active]:text-white py-3 font-semibold rounded-lg transition-all text-slate-400">Teachers</TabsTrigger>
                        <TabsTrigger value="admins" className="data-[state=active]:bg-primary data-[state=active]:text-white py-3 font-semibold rounded-lg transition-all text-slate-400">Administrators</TabsTrigger>
                    </TabsList>

                    <TabsContent value="students" className="space-y-4">
                        <SessionCard
                            index={0}
                            time="1 Hour"
                            title="Demystifying the AI World"
                            type="Foundational"
                            desc="Distinguish between AI, Machine Learning (ML), and Deep Learning (DL) through practical solutions."
                        />
                        <SessionCard
                            index={1}
                            time="1 Hour"
                            title="Teaching Machines to See"
                            type="Computer Vision"
                            desc="Understanding classification, object detection, and segmentation to solve societal problems."
                        />
                        <SessionCard
                            index={2}
                            time="1 Hour"
                            title="The Next Frontier: AI Agents"
                            type="Advanced"
                            desc="Defining AI Agents and showcasing how they address real-world problems."
                        />
                        <SessionCard
                            index={3}
                            time="1 Hour"
                            title="Building Smarter Chatbots"
                            type="RAG & LLMs"
                            desc="Understanding limitations of pre-trained LLMs and learning about Retrieval-Augmented Generation."
                        />
                    </TabsContent>

                    <TabsContent value="teachers" className="space-y-4">
                        <SessionCard
                            index={0}
                            time="1 Hour"
                            title="Teaching Smarter with AI"
                            type="Pedagogy Tools"
                            desc="Learn to use tools like ChatGPT and Canva for lesson planning and prompt engineering."
                        />
                        <SessionCard
                            index={1}
                            time="1 Hour"
                            title="Assessments in the Age of AI"
                            type="Evaluation"
                            desc="Automate quizzes, ethically detect AI-assisted work, and explore authentic assessment models."
                        />
                        <SessionCard
                            index={2}
                            time="1 Hour"
                            title="From Slides to Stories"
                            type="Content Creation"
                            desc="Create compelling materials using Canva, Gamma, and NotebookLM."
                        />
                        <SessionCard
                            index={3}
                            time="1 Hour"
                            title="Your AI Teaching Companion"
                            type="Productivity"
                            desc="Explore AI assistants for organizing tasks, tracking progress, and managing administrative work."
                        />
                    </TabsContent>

                    <TabsContent value="admins" className="space-y-4">
                        <SessionCard
                            index={0}
                            time="2 Hours"
                            title="Crafting an AI policy for Education"
                            type="Governance"
                            desc="Develop a draft institutional AI policy covering ethics, data privacy, academic integrity, and inclusivity."
                        />
                        <SessionCard
                            index={1}
                            time="2 Hours"
                            title="Designing Curricula Aligned with PSF"
                            type="Strategic Planning"
                            desc="Map programs against Philippine Skills Framework competency levels and national workforce goals."
                        />
                    </TabsContent>
                </Tabs>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center mt-12"
                >
                    <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 h-14 px-10 text-lg font-bold shadow-[0_0_40px_rgba(8,52,159,0.4)] hover:shadow-[0_0_50px_rgba(8,52,159,0.6)] transition-all relative overflow-hidden group rounded-xl">
                        <Link to="/agenda">
                            <span className="relative z-10 flex items-center">
                                View Full Agenda <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}

function SessionCard({ title, type, desc, time, index }: { title: string, type: string, desc: string, time: string, index: number }) {
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
        >
            <Card
                ref={divRef as any}
                onMouseMove={handleMouseMove}
                className="glass-card mb-4 border-white/10 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group relative overflow-hidden gpu-accelerated"
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

                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <CardContent className="p-6 flex flex-col md:flex-row gap-6 md:items-start relative z-10">
                    <motion.div
                        className="flex-shrink-0 flex items-center gap-2 text-blue-400 group-hover:text-accent transition-all text-sm font-bold md:w-32 pt-1 uppercase tracking-wide"
                        whileHover={{ scale: 1.05 }}
                    >
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Clock className="w-5 h-5" />
                        </motion.div>
                        {time}
                    </motion.div>
                    <div className="space-y-2 flex-grow">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <h4 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-300 group-hover:to-teal-300 transition-all">{title}</h4>
                            <Badge variant="outline" className="border-white/20 text-slate-400 group-hover:border-primary/50 group-hover:text-primary group-hover:bg-primary/10 transition-all">{type}</Badge>
                        </div>
                        <p className="text-slate-400 group-hover:text-slate-300 leading-relaxed transition-colors">{desc}</p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
