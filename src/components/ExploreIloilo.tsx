import { motion } from 'framer-motion';
import { MapPin, Hotel, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { Badge } from '@/components/ui/badge';

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const SpotlightCard = ({ children }: { children: React.ReactNode }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardRef.current.style.setProperty("--mouse-x", `${x}px`);
        cardRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    return (
        <motion.div variants={item}>
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                className="relative h-full group"
                style={{
                    // @ts-ignore
                    "--mouse-x": "0px",
                    "--mouse-y": "0px",
                } as React.CSSProperties}
            >
                <div className="absolute inset-0 z-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none rounded-lg"
                    style={{
                        background: "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), hsl(var(--primary) / 0.15), transparent 40%)"
                    }}
                />
                {children}
            </div>
        </motion.div>
    );
};

export const ExploreIloilo = () => {
    const highlights = [
        {
            icon: MapPin,
            title: 'Historic Sites',
            description: 'Visit iconic landmarks like Molo Church and Jaro Cathedral',
            category: 'Attraction'
        },
        {
            icon: Hotel,
            title: 'Comfortable Stays',
            description: 'From luxury hotels to budget-friendly accommodations',
            category: 'Accommodation'
        },
        {
            icon: ArrowRight,
            title: 'Local Experiences',
            description: 'Taste authentic La Paz Batchoy and explore the Esplanade',
            category: 'Experience'

        }
    ];

    return (
        <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Explore Iloilo
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Experience the heart of Western Visayas while attending the summit. Discover rich heritage, modern attractions, and warm Ilonggo hospitality.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {highlights.map((highlight, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <SpotlightCard key={index}>
                                <Card className="glass-card h-full border-white/10 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    <CardHeader className="relative z-10">
                                        <div className="flex items-start justify-between mb-3">
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5"
                                            >
                                                <highlight.icon className="h-6 w-6 text-primary" />
                                            </motion.div>
                                            <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                                                {highlight.category}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-xl group-hover:text-primary transition-colors">{highlight.title}</CardTitle>
                                        <p className="text-xs text-accent font-semibold">{highlight.category}</p>
                                    </CardHeader>
                                    <CardContent className="relative z-10">
                                        <CardDescription className="text-sm leading-relaxed">
                                            {highlight.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center"
                >
                    <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                        <Link to="/tourism">
                            Discover More <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};
