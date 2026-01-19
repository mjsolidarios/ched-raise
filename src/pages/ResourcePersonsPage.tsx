import { useRef, useLayoutEffect } from "react"

import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useGSAPScroll, staggerFadeIn, fadeInUp } from "@/hooks/useGSAPScroll"
import { UserAvatar, getDeterministicAvatarColor } from "@/components/UserAvatar"
import { cn } from "@/lib/utils"

// Mock Data for Resource Persons
const SPEAKERS = [
    {
        name: "Dr. Bobby Gerardo",
        role: "President",
        org: "Northern Iloilo State University",
        image: "",
        topic: "Welcome Remarks",
        bio: "Also presenting: Turnover of Philippine Skills Framework, Coffee Table Book, and Exhibit Ribbon-Cutting."
    },
    {
        name: "Sherwin Pelayo",
        role: "Executive Director",
        org: "Analytics & AI Association of the Philippines",
        image: "",
        topic: "Fireside Chat Introduction",
        bio: "Leading sessions on 'National AI Upskilling Roadmap', Government-Private Sector Partnership, AI Policy, and Student Open Forum."
    },
    {
        name: "Chair Shirley Agrupis",
        role: "Chair",
        org: "CHED",
        image: "",
        topic: "Fireside Chat Panel",
        bio: "Participating in: AI in Education Partnership, Turnover of Skills Framework, Coffee Table Book, and Ribbon-Cutting."
    },
    {
        name: "Sec. Juan Edgardo \"Sonny\" Angara",
        role: "Secretary",
        org: "DepEd",
        image: "",
        topic: "Fireside Chat Panel",
        bio: "Participating in: AI in Education Partnership and Turnover of Skills Framework."
    },
    {
        name: "Dir. Gen. Jose Francisco \"Kiko\" Benitez",
        role: "Director General",
        org: "TESDA",
        image: "",
        topic: "Fireside Chat Panel",
        bio: "Participating in: AI in Education Partnership and Turnover of Skills Framework."
    },
    {
        name: "Fred Ayala",
        role: "Chair",
        org: "Private Sector Jobs and Skills Corp.",
        image: "",
        topic: "Fireside Chat Panel",
        bio: "Participating in: AI in Education Partnership and Turnover of Skills Framework."
    },
    {
        name: "Michelle Alarcon",
        role: "President",
        org: "Analytics & AI Association of the Philippines",
        image: "",
        topic: "Fireside Chat Panel",
        bio: "Participating in: AI in Education Partnership, Turnover of Skills Framework, and Industry AI Requirements Panel."
    },
    {
        name: "Dr. Joselito Villaruz",
        role: "President",
        org: "West Visayas State University",
        image: "",
        topic: "Welcome Remarks",
        bio: "Participating in: Turnover of Skills Framework, Coffee Table Book, and Exhibit Ribbon-Cutting."
    },
    {
        name: "Dr. Maricar Casquejo",
        role: "Director",
        org: "CHED Region 9",
        image: "",
        topic: "Turnover Ceremony",
        bio: "Participating in the turnover of the CHEDx 2024 Coffee Table Book."
    },
    {
        name: "Dr. Raul Muyong",
        role: "Regional Director",
        org: "CHED Region 6",
        image: "",
        topic: "Closing Remarks",
        bio: "Participating in: Turnover of Coffee Table Book and Exhibit Ribbon-Cutting."
    },
    {
        name: "Dr. Bonifacio Gabales Jr.",
        role: "President",
        org: "University of Southeastern Philippines",
        image: "",
        topic: "Turnover Ceremony",
        bio: "Participating in the turnover of the CHEDx 2024 Coffee Table Book."
    },
    {
        name: "Sec. Renato Solidum, Jr.",
        role: "Secretary",
        org: "DOST",
        image: "",
        topic: "Keynote: NAIS-PH",
        bio: "Presenting 'The National AI Strategy of the Philippines (NAIS-PH)'."
    },
    {
        name: "Batangas State University",
        role: "Facilitators",
        org: "Batangas State University",
        image: "",
        topic: "Workshop Facilitator",
        bio: "Facilitating 'Prompting Literacy: Building the Foundation for AI-Enhanced Teaching'."
    },
    {
        name: "Polytechnic University of the Philippines",
        role: "Facilitators",
        org: "Polytechnic University of the Philippines",
        image: "",
        topic: "Workshop Facilitator",
        bio: "Facilitating 'Teaching Smarter with AI: Lesson Planning Made Simple'."
    },
    {
        name: "Dr. Chris Jordan Aliac",
        role: "AI FabLab Manager",
        org: "Cebu Institute of Technology University",
        image: "",
        topic: "Workshop Facilitator",
        bio: "Facilitating 'Machine Learning Made Simple: From Concepts to Applications'."
    },
    {
        name: "Dr. Ace Lagman",
        role: "Senior Director",
        org: "FEU Institute of Technology",
        image: "",
        topic: "Workshop Facilitator",
        bio: "Facilitating 'Demystifying the AI World: Core Concepts of AI, ML, DL'."
    },
    {
        name: "Jonathan De Luzuriaga",
        role: "President",
        org: "Spring Valley Tech Corp. / PSIA",
        image: "",
        topic: "Panelist",
        bio: "Participating in the panel 'AI Requirements in the Industry'."
    },
    {
        name: "Arup Maity",
        role: "President",
        org: "Xamun / PSIA",
        image: "",
        topic: "Panelist",
        bio: "Participating in the panel 'AI Requirements in the Industry'."
    },
    {
        name: "Fulbert Woo",
        role: "Regional Governor",
        org: "PCCI Western Visayas",
        image: "",
        topic: "Panelist",
        bio: "Participating in the panel 'AI Requirements in the Industry'."
    },
    {
        name: "Jaime Noel Santos",
        role: "President",
        org: "Thames International Business School",
        image: "",
        topic: "Moderator",
        bio: "Moderating the panel 'AI Requirements in the Industry'."
    },
    {
        name: "Dr. Prospero Naval",
        role: "Professor",
        org: "University of the Philippines",
        image: "",
        topic: "Workshop Facilitator",
        bio: "Facilitating 'Setting Up the Infrastructure for an AI Program'."
    },
    {
        name: "Oliver Malabanan",
        role: "Professor",
        org: "De La Salle University",
        image: "",
        topic: "Workshop Facilitator",
        bio: "Facilitating 'Designing Curricula Aligned with the Philippine Skills Framework for Analytics & AI'."
    },
    {
        name: "Dr. Jaime Caro",
        role: "Chief Academic Officer",
        org: "Techfactors Inc.",
        image: "",
        topic: "Workshop Facilitator",
        bio: "Facilitating 'Developing a Research Agenda in the Age of Intelligence'."
    },
    {
        name: "National Teachers College",
        role: "Facilitators",
        org: "National Teachers College",
        image: "",
        topic: "Workshop Facilitator",
        bio: "Facilitating 'Assessments in the Age of AI: Creating, Checking, and Curating with Confidence'."
    },
    {
        name: "Iloilo State University of Fisheries Science and Technology",
        role: "Facilitators",
        org: "Iloilo State University of Fisheries Science and Technology",
        image: "",
        topic: "Workshop Facilitator",
        bio: "Facilitating 'From Slides to Stories: Enhancing Presentations with AI Tools'."
    },
    {
        name: "Bulacan State University",
        role: "Facilitators",
        org: "Bulacan State University",
        image: "",
        topic: "Workshop Facilitator",
        bio: "Facilitating 'Your AI Teaching Companion: Personal Productivity and Reflective Practice'."
    },
    {
        name: "Dr. Gregg Gabison",
        role: "Country Manager",
        org: "Raybiz Technologies, Inc.",
        image: "",
        topic: "Workshop Facilitator",
        bio: "Facilitating 'Automating Intelligence: The Power of RAG in Document Processing'."
    },
    {
        name: "Dr. Dave Marcial",
        role: "Director",
        org: "Siliman University",
        image: "",
        topic: "Workshop Facilitator",
        bio: "Facilitating 'Think Before You Prompt: A Framework for Responsible AI-Supported Learning'."
    },
    {
        name: "Dr. Jimmy Catanes",
        role: "Director",
        org: "CHED OPSD",
        image: "",
        topic: "Presentation",
        bio: "Presenting the 'Draft AI Policy in Education'."
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
                staggerFadeIn(gridRef.current.children, {
                    delay: 0.2,
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: 'top 85%',
                    }
                })
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
                <div ref={headerRef} className="max-w-4xl mx-auto text-center space-y-6 mb-20">
                    <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-900/10 uppercase tracking-widest px-4 py-1">World-Class Experts</Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                        Resource <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Persons</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Meet the visionaries, researchers, and practitioners shaping the future of AI in education.
                    </p>
                </div>

                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
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
                    <div className={cn(
                        "w-24 h-24 p-1 bg-gradient-to-br from-white/10 to-transparent mb-4 group-hover:scale-105 transition-transform duration-500",
                        image ? "rounded-full" : "rounded-xl"
                    )}>
                        {image ? (
                            <img src={image} alt={name} className="w-full h-full rounded-full bg-slate-800 object-cover" />
                        ) : (
                            <UserAvatar
                                seed={name}
                                size={96} // 24 * 4px = 96px
                                className="w-full h-full"
                                color={getDeterministicAvatarColor(name)}
                            />
                        )}
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


                </div>
            </CardContent>
        </Card>
    )
}
