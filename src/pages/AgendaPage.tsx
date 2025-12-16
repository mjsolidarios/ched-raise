import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const AgendaPage = () => {
    const days = [
        {
            date: "January 28, 2026",
            title: "Day 1: Opening & Keynotes",
            events: [
                { time: "08:00 AM", title: "Registration & Breakfast", location: "Grand Foyer" },
                { time: "09:00 AM", title: "Opening Ceremony", location: "Main Hall" },
                { time: "10:30 AM", title: "Keynote: AI in Education", location: "Main Hall" },
                { time: "12:00 PM", title: "Networking Lunch", location: "Banquet Hall" },
                { time: "01:30 PM", title: "Panel Discussion: Future of ASEAN EdTech", location: "Main Hall" },
                { time: "03:00 PM", title: "Breakout Sessions (Tracks A, B, C)", location: "Meeting Rooms 1-3" },
                { time: "05:00 PM", title: "Welcome Dinner Reception", location: "Courtyard" },
            ]
        },
        {
            date: "January 29, 2026",
            title: "Day 2: Workshops & Collaboration",
            events: [
                { time: "09:00 AM", title: "Hands-on Workshop: Generative AI Tools", location: "Lab A" },
                { time: "11:00 AM", title: "Research Presentations", location: "Meeting Rooms 1-5" },
                { time: "12:30 PM", title: "Lunch Break", location: "Banquet Hall" },
                { time: "02:00 PM", title: "Project Collaboration Sessions", location: "Innovation Hub" },
                { time: "04:00 PM", title: "Industry Partner Showcase", location: "Exhibition Hall" },
            ]
        },
        {
            date: "January 30, 2026",
            title: "Day 3: Closing & Awards",
            events: [
                { time: "09:00 AM", title: "Final Project Pitches", location: "Main Hall" },
                { time: "11:30 AM", title: "Closing Keynote", location: "Main Hall" },
                { time: "12:30 PM", title: "Awards Ceremony & Closing Remarks", location: "Main Hall" },
                { time: "01:30 PM", title: "Farewell Lunch", location: "Banquet Hall" },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Simple Header */}
            <div className="container mx-auto px-4 py-8">
                <Link to="/">
                    <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary">
                        <ArrowLeft className="h-4 w-4" /> Back to Home
                    </Button>
                </Link>
            </div>

            <main className="container mx-auto px-4 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto space-y-12"
                >
                    <div className="text-center space-y-4">
                        <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">Official Schedule</Badge>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Agenda</h1>
                        <p className="text-lg text-muted-foreground">Three days of innovation, learning, and collaboration.</p>
                    </div>

                    <div className="grid gap-8">
                        {days.map((day, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative pl-8 md:pl-0"
                            >
                                <div className="hidden md:block absolute left-[150px] top-0 bottom-0 w-px bg-border" />

                                <div className="md:flex gap-16">
                                    <div className="md:w-[150px] flex-shrink-0 mb-6 md:mb-0 md:text-right relative">
                                        <div className="sticky top-24">
                                            <div className="flex items-center gap-2 justify-start md:justify-end text-primary font-semibold">
                                                <Calendar className="h-4 w-4" />
                                                <span>{day.date.split(',')[0]}</span>
                                            </div>
                                            <div className="md:hidden absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                                            <div className="hidden md:block absolute -right-[5px] top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                                            <p className="text-sm text-muted-foreground mt-1">{day.title.split(':')[0]}</p>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-6">
                                        <h3 className="text-xl font-bold flex items-center gap-2 md:hidden">
                                            {day.title}
                                        </h3>
                                        <div className="space-y-4">
                                            {day.events.map((event, eIndex) => (
                                                <div key={eIndex} className="group relative bg-card/40 hover:bg-card/60 border border-white/5 rounded-xl p-4 transition-colors">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                        <div className="w-24 flex-shrink-0 flex items-center gap-2 text-muted-foreground text-sm font-mono">
                                                            <Clock className="h-3 w-3" />
                                                            {event.time}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-foreground">{event.title}</h4>
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                                <MapPin className="h-3 w-3 text-primary/70" />
                                                                {event.location}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default AgendaPage;
