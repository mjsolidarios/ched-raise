import { useRef, useLayoutEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowLeft, Linkedin, Twitter, Globe, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useGSAPScroll, staggerFadeIn, fadeInUp } from "@/hooks/useGSAPScroll"

// Mock Data for Resource Persons
const SPEAKERS = [
    {
        name: "Dr. Elena Rivera",
        role: "AI Ethics Researcher",
        org: "Tech Institute",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=b6e3f4",
        topic: "Keynote: AI in Education",
        bio: "Leading expert in ethical AI deployment in educational settings, advocating for inclusive and transparent algorithms."
    },
    {
        name: "Prof. James Chen",
        role: "Director of Innovation",
        org: "Future Learning Lab",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=c0aede",
        topic: "Panel: Future of EdTech",
        bio: "Pioneering research in adaptive learning systems and personalized education pathways driven by machine learning."
    },
    {
        name: "Sarah Al-Fayed",
        role: "Head of Product",
        org: "EduAI Solutions",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=ffdfbf",
        topic: "Workshop: GenAI Tools",
        bio: "Product strategist focused on building intuitive AI tools for teachers, simplifying complex technologies for classroom use."
    },
    {
        name: "Dr. Marcus Thorne",
        role: "Policy Advisor",
        org: "National Education Board",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=d1d4f9",
        topic: "Crafting AI Policy",
        bio: "Advisor to national bodies on integrating AI into curriculum standards and workforce development frameworks."
    },
    {
        name: "Lara Croft",
        role: "Lead Developer",
        org: "Code Academy",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lara&backgroundColor=ffdfbf",
        topic: "Building Smarter Chatbots",
        bio: "Full-stack developer specializing in conversational AI and RAG architectures for educational support bots."
    },
    {
        name: "Ken Ryu",
        role: "Creative Director",
        org: "Digital Arts Uni",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ken&backgroundColor=b6e3f4",
        topic: "From Slides to Stories",
        bio: "Award-winning designer teaching educators how to leverage generative design tools for captivating learning materials."
    }
]

export default function ResourcePersonsPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)
    const { gsap } = useGSAPScroll()

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (headerRef.current) {
                fadeInUp(headerRef.current)
            }
            if (gridRef.current) {
                staggerFadeIn(gridRef.current.children, { delay: 0.2 })
            }
        }, containerRef)

        return () => ctx.revert()
    }, [gsap])

    return (
        <div ref={containerRef} className="min-h-screen bg-slate-950 text-foreground relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />
            <div className="absolute top-[20%] right-[-20%] w-[900px] h-[900px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

            {/* Navigation */}
            <div className="container mx-auto px-4 py-8 relative z-10">
                <Link to="/">
                    <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Home
                    </Button>
                </Link>
            </div>

            <main className="container mx-auto px-4 pb-24 relative z-10">
                <div ref={headerRef} className="max-w-4xl mx-auto text-center space-y-6 mb-20 opacity-0">
                    <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-900/10 uppercase tracking-widest px-4 py-1">World-Class Experts</Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                        Resource <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Persons</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Meet the visionaries, researchers, and practitioners shaping the future of AI in education.
                    </p>
                </div>

                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto opacity-0">
                    {SPEAKERS.map((speaker, index) => (
                        <div key={index} className="h-full">
                            <SpeakerCard {...speaker} />
                        </div>
                    ))}
                </div>

                <div className="mt-24 text-center">
                    <p className="text-slate-400 mb-6">Want to see when they are speaking?</p>
                    <Button asChild variant="outline" size="lg" className="rounded-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 transition-all">
                        <Link to="/agenda" className="gap-2">
                            Check the Agenda <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </main>
        </div>
    )
}

function SpeakerCard({ name, role, org, image, topic, bio }: typeof SPEAKERS[0]) {
    return (
        <Card className="glass-card border-white/5 hover:border-purple-500/30 hover:bg-white/[0.02] transition-all duration-300 group h-full flex flex-col overflow-hidden">
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-colors duration-500 pointer-events-none" />

            <CardContent className="p-0 flex-1 flex flex-col relative z-10">
                <div className="p-6 md:p-8 flex flex-col items-center text-center border-b border-white/5 bg-white/[0.01]">
                    <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-white/10 to-transparent mb-4 group-hover:scale-105 transition-transform duration-500">
                        <img src={image} alt={name} className="w-full h-full rounded-full bg-slate-800 object-cover" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">{name}</h3>
                    <p className="text-sm font-medium text-primary mb-1">{role}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">{org}</p>
                </div>

                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                        <Badge variant="secondary" className="mb-3 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 border-0">
                            Speaking on: {topic.split(':')[0]}
                        </Badge>
                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-4">
                            "{bio}"
                        </p>
                    </div>

                    <div className="flex justify-center gap-4 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 rounded-full">
                            <Linkedin className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 rounded-full">
                            <Twitter className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 rounded-full">
                            <Globe className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
