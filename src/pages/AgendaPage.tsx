import { useRef, useLayoutEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { useGSAPScroll, fadeInUp } from "@/hooks/useGSAPScroll"

const AGENDA_DAYS = [
    {
        title: "Day 1: Connection & Strategy",
        monthDay: "February 25",
        year: "2026",
        weekday: "Wednesday",
        events: [
            { time: "08:00 AM", title: "Registration", resourcePerson: "Secretariat" },
            { time: "09:00 AM", title: "Preliminaries", resourcePerson: "Secretariat" },
            { time: "09:05 AM", title: "CHED RAISE 2026 Video Presentation", resourcePerson: "Secretariat" },
            { time: "09:18 AM", title: "Welcome Remarks from Host Institution", resourcePerson: "Dr. Bobby Gerardo" },
            { time: "09:24 AM", title: "Fireside Chat Introduction: National AI Upskilling Roadmap", resourcePerson: "Sherwin Pelayo" },
            { time: "09:29 AM", title: "Fireside Chat: AI in Education Government-Private Partnership", resourcePerson: "Chair Shirley Agrupis, Sec. Sonny Angara, DG Kiko Benitez, Fred Ayala, Michelle Alarcon" },
            { time: "10:48 AM", title: "Turnover of Philippine Skills Framework for Analytics & AI", resourcePerson: "CHED, DepEd, TESDA, Host Universities" },
            { time: "10:53 AM", title: "Turnover of CHEDx 2024 Coffee Table Book", resourcePerson: "CHED Officials & Presidents" },
            { time: "10:59 AM", title: "Keynote: The National AI Strategy of the Philippines (NAIS-PH)", resourcePerson: "Sec. Renato Solidum, Jr." },
            { time: "11:36 AM", title: "Launch of HUSAY Projects", resourcePerson: "Secretariat" },
            { time: "11:50 AM", title: "Ribbon-Cutting of Exhibit Area", resourcePerson: "Chair Agrupis, Dr. Muyong, Dr. Gerardo, Dr. Villaruz" },
            { time: "12:00 PM", title: "Lunch (Exhibitors' Videos)", resourcePerson: "Secretariat" },
            { time: "01:30 PM", title: "Breakout Sessions Start", resourcePerson: "Various Speakers" },
            { time: "04:45 PM", title: "Transition back to Plenary", resourcePerson: "Host" },
            { time: "05:00 PM", title: "Day 1 Highlights", resourcePerson: "(TBD) CHED" },
            { time: "05:15 PM", title: "Closing Spiel", resourcePerson: "Host" },
        ]
    },
    {
        title: "Day 2: Breakouts & Deep Dives",
        monthDay: "February 26",
        year: "2026",
        weekday: "Thursday",
        events: [
            { time: "08:00 AM", title: "Registration", resourcePerson: "Secretariat" },
            { time: "09:00 AM", title: "Opening & Day 1 Recap", resourcePerson: "Host & Dr. Joselito Villaruz" },
            { time: "09:14 AM", title: "Panel Discussion: AI Requirements in the Industry", resourcePerson: "Jonathan De Luzuriaga, Arup Maity, Fulbert Woo, Michelle Alarcon" },
            { time: "10:30 AM", title: "Breakout Sessions (Admins, Teachers, Students)", resourcePerson: "Various Speakers" },
            { time: "12:00 PM", title: "Lunch (Exhibitors' Videos)", resourcePerson: "Secretariat" },
            { time: "01:15 PM", title: "Breakout Sessions Continue", resourcePerson: "Various Speakers" },
            { time: "03:00 PM", title: "Breakout Sessions Continue", resourcePerson: "Various Speakers" },
            { time: "04:30 PM", title: "Transition back to Plenary", resourcePerson: "Host" },
            { time: "04:40 PM", title: "Day 2 Highlights", resourcePerson: "(TBD) CHED" },
            { time: "04:55 PM", title: "Closing Spiel", resourcePerson: "Host" },
        ]
    },
    {
        title: "Day 3: Policy & Commitments",
        monthDay: "February 27",
        year: "2026",
        weekday: "Friday",
        events: [
            { time: "08:00 AM", title: "Registration", resourcePerson: "Secretariat" },
            { time: "09:00 AM", title: "Opening & Day 2 Recap", resourcePerson: "Host & (TBD)" },
            { time: "09:13 AM", title: "Presentation: Draft AI Policy in Education", resourcePerson: "Dir. Jimmy Catanes, CHED OPSD" },
            { time: "09:43 AM", title: "Q&A: Draft AI Policy", resourcePerson: "Host" },
            { time: "09:55 AM", title: "Commitment Signing", resourcePerson: "Selected HEIs, Students, Industry" },
            { time: "10:01 AM", title: "Closing Remarks", resourcePerson: "Dr. Raul Muyong" },
            { time: "10:15 AM", title: "Company/HEI Tours", resourcePerson: "Secretariat" },
            { time: "12:15 PM", title: "Lunch", resourcePerson: "Secretariat" },
        ]
    }
];

export default function AgendaPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const daysContainerRef = useRef<HTMLDivElement>(null)
    const { gsap } = useGSAPScroll()

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (headerRef.current) {
                fadeInUp(headerRef.current)
            }
            // Animate each day section as it comes into view
            if (daysContainerRef.current) {
                const daySections = daysContainerRef.current.children;
                Array.from(daySections).forEach((section) => {
                    fadeInUp(section as HTMLElement, { start: "top 80%" })
                })
            }
        }, containerRef)

        return () => ctx.revert()
    }, [gsap])

    return (
        <div ref={containerRef} className="min-h-screen bg-slate-950 text-foreground relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />
            <div className="absolute top-[10%] left-[-10%] w-[700px] h-[700px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[-10%] w-[700px] h-[700px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

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
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-900/10 uppercase tracking-widest px-4 py-1">Official Schedule</Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                        Summit <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Agenda</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Three days of immersive innovation, collaborative workshops, and visionary keynotes.
                    </p>
                </div>

                <div ref={daysContainerRef} className="space-y-12 max-w-5xl mx-auto">
                    {AGENDA_DAYS.map((day, index) => (
                        <div key={index} className="">
                            <DaySection day={day} />
                        </div>
                    ))}
                </div>

                <div className="mt-24 text-center">
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Button asChild variant="default" size="lg" className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/20">
                            <Link to="/program" className="gap-2">
                                Explorer Detailed Tracks <ArrowRight className="w-4 h-4" />
                            </Link>
                        </Button>
                    </div>
                </div>

            </main>
        </div>
    )
}

function DaySection({ day }: { day: typeof AGENDA_DAYS[0] }) {
    return (
        <div className="relative pl-4 md:pl-0">
            {/* Timeline Line (Desktop) */}
            <div className="hidden md:block absolute left-[200px] top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-blue-500/10 to-transparent" />

            <div className="md:flex gap-16">
                {/* Date Col */}
                <div className="md:w-[200px] flex-shrink-0 mb-6 md:mb-0 md:text-right relative">
                    <div className="sticky top-24">
                        <div className="flex flex-col items-start md:items-end text-white font-semibold pr-4">
                            <div className="flex items-center gap-2 whitespace-nowrap mb-1">
                                <Calendar className="h-4 w-4 flex-shrink-0 text-blue-400" />
                                <span className="text-lg">{day.monthDay}</span>
                            </div>
                            <div className="text-sm text-slate-400 font-normal whitespace-nowrap bg-white/5 px-2 py-0.5 rounded-full">
                                {day.year} • {day.weekday}
                            </div>
                        </div>
                        {/* Dot */}
                        <div className="md:hidden absolute -left-[21px] top-1.5 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-slate-950" />
                        <div className="hidden md:block absolute -right-[5px] top-2 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-slate-950 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    </div>
                </div>

                {/* Content Col */}
                <div className="flex-1 space-y-6">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2 md:hidden mb-4">
                        {day.title}
                    </h3>
                    <div className="hidden md:block mb-6">
                        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                            {day.title}
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {day.events.map((event, eIndex) => (
                            <EventCard key={eIndex} event={event} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function EventCard({ event }: { event: any }) {
    return (
        <motion.div
            whileHover={{ scale: 1.01, x: 4 }}
            className="group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-blue-500/30 rounded-xl p-5 transition-all duration-300 backdrop-blur-sm"
        >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-28 flex-shrink-0 flex items-center gap-2 text-blue-400/80 group-hover:text-blue-400 text-sm font-mono font-medium transition-colors">
                    <Clock className="h-3.5 w-3.5" />
                    {event.time}
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-slate-200 group-hover:text-white text-lg transition-colors">{event.title}</h4>
                    {event.resourcePerson && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 group-hover:text-slate-400 transition-colors">
                            <MapPin className="h-3 w-3 text-slate-600 group-hover:text-blue-500/70" />
                            {event.resourcePerson}
                        </div>
                    )}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-1/2 -translate-y-1/2 text-blue-500/50">
                    <ArrowRight className="w-5 h-5" />
                </div>
            </div>
        </motion.div>
    )
}
