import { useRef, useLayoutEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowLeft, BookOpen, Users, Award, Clock, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { useGSAPScroll, fadeInUp, staggerFadeIn } from "@/hooks/useGSAPScroll"

export default function ProgramPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const tabsRef = useRef<HTMLDivElement>(null)
    const { gsap } = useGSAPScroll()

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (headerRef.current) {
                fadeInUp(headerRef.current)
            }
            if (tabsRef.current) {
                fadeInUp(tabsRef.current, { delay: 0.2 })
            }
        }, containerRef)

        return () => ctx.revert()
    }, [gsap])

    return (
        <div ref={containerRef} className="min-h-screen bg-slate-950 text-foreground relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Header / Navigation */}
            <div className="container mx-auto px-4 py-8 relative z-10">
                <Link to="/">
                    <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Home
                    </Button>
                </Link>
            </div>

            <main className="container mx-auto px-4 pb-24 relative z-10">
                <div ref={headerRef} className="max-w-4xl mx-auto text-center space-y-6 mb-16 opacity-0">
                    <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-900/10 uppercase tracking-widest px-4 py-1">Comprehensive Tracks</Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                        Summit <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Program</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Explore our tailored sessions designed for every role in the education ecosystem. From foundational AI concepts to advanced policy making.
                    </p>
                </div>

                <div ref={tabsRef} className="opacity-0">
                    <Tabs defaultValue="students" className="max-w-6xl mx-auto">
                        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-slate-900/50 border border-white/10 p-1.5 h-auto rounded-xl mb-12 backdrop-blur-md sticky top-4 z-50 shadow-2xl shadow-black/50">
                            <TabsTrigger value="students" className="data-[state=active]:bg-primary data-[state=active]:text-white py-4 font-semibold rounded-lg transition-all text-slate-400 data-[state=active]:shadow-lg hover:text-white">
                                <span className="flex items-center justify-center gap-2">
                                    <BookOpen className="w-4 h-4" /> Students
                                </span>
                            </TabsTrigger>
                            <TabsTrigger value="teachers" className="data-[state=active]:bg-primary data-[state=active]:text-white py-4 font-semibold rounded-lg transition-all text-slate-400 data-[state=active]:shadow-lg hover:text-white">
                                <span className="flex items-center justify-center gap-2">
                                    <Users className="w-4 h-4" /> Teachers
                                </span>
                            </TabsTrigger>
                            <TabsTrigger value="admins" className="data-[state=active]:bg-primary data-[state=active]:text-white py-4 font-semibold rounded-lg transition-all text-slate-400 data-[state=active]:shadow-lg hover:text-white">
                                <span className="flex items-center justify-center gap-2">
                                    <Award className="w-4 h-4" /> Administrators
                                </span>
                            </TabsTrigger>
                        </TabsList>

                        <div className="min-h-[400px]">
                            <TabsContent value="students" className="space-y-6 focus-visible:outline-none">
                                <SessionTrack
                                    title="Student Track: Future-Ready Skills"
                                    description="Equipping the next generation with AI literacy and practical skills."
                                    sessions={[
                                        { title: "Demystifying the AI World", time: "10:30 AM - 11:30 AM", type: "Foundational", desc: "Distinguish between AI, Machine Learning (ML), and Deep Learning (DL) through practical solutions." },
                                        { title: "Teaching Machines to See", time: "01:00 PM - 02:00 PM", type: "Computer Vision", desc: "Understanding classification, object detection, and segmentation to solve societal problems." },
                                        { title: "The Next Frontier: AI Agents", time: "02:30 PM - 03:30 PM", type: "Advanced", desc: "Defining AI Agents and showcasing how they address real-world problems." },
                                        { title: "Building Smarter Chatbots", time: "04:00 PM - 05:00 PM", type: "RAG & LLMs", desc: "Understanding limitations of pre-trained LLMs and learning about Retrieval-Augmented Generation." }
                                    ]}
                                />
                            </TabsContent>

                            <TabsContent value="teachers" className="space-y-6 focus-visible:outline-none">
                                <SessionTrack
                                    title="Teacher Track: Pedrogogical Innovation"
                                    description="Empowering educators to integrate AI tools effectively in the classroom."
                                    sessions={[
                                        { title: "Teaching Smarter with AI", time: "10:30 AM - 11:30 AM", type: "Pedagogy Tools", desc: "Learn to use tools like ChatGPT and Canva for lesson planning and prompt engineering." },
                                        { title: "Assessments in the Age of AI", time: "01:00 PM - 02:00 PM", type: "Evaluation", desc: "Automate quizzes, ethically detect AI-assisted work, and explore authentic assessment models." },
                                        { title: "From Slides to Stories", time: "02:30 PM - 03:30 PM", type: "Content Creation", desc: "Create compelling materials using Canva, Gamma, and NotebookLM." },
                                        { title: "Your AI Teaching Companion", time: "04:00 PM - 05:00 PM", type: "Productivity", desc: "Explore AI assistants for organizing tasks, tracking progress, and managing administrative work." }
                                    ]}
                                />
                            </TabsContent>

                            <TabsContent value="admins" className="space-y-6 focus-visible:outline-none">
                                <SessionTrack
                                    title="Admin Track: Strategic Leadership"
                                    description="Guiding institutions through the digital transformation policy and strategy."
                                    sessions={[
                                        { title: "Crafting an AI policy for Education", time: "10:30 AM - 12:30 PM", type: "Governance", desc: "Develop a draft institutional AI policy covering ethics, data privacy, academic integrity, and inclusivity." },
                                        { title: "Designing Curricula Aligned with PSF", time: "02:00 PM - 04:00 PM", type: "Strategic Planning", desc: "Map programs against Philippine Skills Framework competency levels and national workforce goals." }
                                    ]}
                                />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>

                {/* Agenda Link */}
                <div className="mt-24 text-center">
                    <p className="text-slate-400 mb-6">Looking for the detailed daily schedule?</p>
                    <Button asChild variant="outline" size="lg" className="rounded-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 transition-all">
                        <Link to="/agenda" className="gap-2">
                            View Full Agenda <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </main>
        </div>
    )
}

function SessionTrack({ title, description, sessions }: { title: string, description: string, sessions: any[] }) {
    return (
        <div className="space-y-8">
            <div className="text-center md:text-left mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-400">{description}</p>
            </div>
            <div className="grid gap-4">
                {sessions.map((session, i) => (
                    <ProgramCard key={i} index={i} {...session} />
                ))}
            </div>
        </div>
    )
}

function ProgramCard({ title, time, type, desc, index }: { title: string, time: string, type: string, desc: string, index: number }) {
    // We handle animation within the card for staggering
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Card className="glass-card border-white/5 hover:border-primary/30 hover:bg-white/[0.02] transition-colors group">
                <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0 md:w-48 flex flex-col justify-center border-l-2 border-primary/20 pl-4 py-1">
                        <div className="flex items-center gap-2 text-primary font-mono text-sm mb-1">
                            <Clock className="w-4 h-4" />
                            {time}
                        </div>
                        <Badge variant="outline" className="w-fit border-white/10 text-xs text-slate-400 mt-2 group-hover:border-primary/30 group-hover:text-primary transition-colors">
                            {type}
                        </Badge>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{title}</h4>
                        <p className="text-slate-400 leading-relaxed">{desc}</p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
