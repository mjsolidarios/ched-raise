import { motion } from 'framer-motion';
import { MapPin, Hotel, Lightbulb, ArrowRight, Church, Building2, TreePine, Waves, Utensils, Car, CameraIcon, Compass, Coffee, ShoppingBag, Palmtree } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useRef, useEffect } from 'react';

const TourismPage = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const attractionsRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const hero = heroRef.current;
        if (!hero) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { left, top } = hero.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;
            hero.style.setProperty("--mouse-x", `${x}px`);
            hero.style.setProperty("--mouse-y", `${y}px`);
        };

        hero.addEventListener("mousemove", handleMouseMove);
        return () => hero.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
        const section = attractionsRef.current;
        if (!section) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { left, top } = section.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;
            section.style.setProperty("--mouse-x", `${x}px`);
            section.style.setProperty("--mouse-y", `${y}px`);
        };

        section.addEventListener("mousemove", handleMouseMove);
        return () => section.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const attractions = [
        {
            name: 'Molo Church',
            description: 'A stunning Gothic-Renaissance masterpiece known as the "Feminist Church," featuring intricate coral stone architecture and statues of all-female saints.',
            icon: Church,
            category: 'Historical',
            highlight: 'UNESCO Heritage Site Nominee'
        },
        {
            name: 'Jaro Cathedral',
            description: 'One of the most important religious sites in Western Visayas, housing the miraculous image of Our Lady of Candles, patron saint of Western Visayas.',
            icon: Church,
            category: 'Historical',
            highlight: 'National Historical Landmark'
        },
        {
            name: 'Iloilo Esplanade',
            description: 'A scenic 1.2-kilometer waterfront promenade along the Iloilo River, perfect for sunset strolls, jogging, and experiencing local life.',
            icon: Waves,
            category: 'Recreational',
            highlight: 'Best Sunset Views'
        },
        {
            name: 'Iloilo Museum',
            description: 'Explore Iloilo\'s rich cultural heritage through extensive collections of artifacts, artworks, and historical exhibits spanning centuries.',
            icon: Building2,
            category: 'Cultural',
            highlight: 'Free Admission'
        },
        {
            name: 'Garin Farm',
            description: 'An eco-tourism pilgrimage resort featuring lush gardens, swimming pools, and spectacular panoramic hilltop views of Iloilo.',
            icon: TreePine,
            category: 'Nature',
            highlight: 'Instagram Worthy'
        },
        {
            name: 'Festive Walk Parade',
            description: 'Iloilo\'s premier lifestyle and entertainment hub with international dining, shopping, and state-of-the-art cinema experience.',
            icon: ShoppingBag,
            category: 'Modern',
            highlight: 'Shopping & Dining'
        },
        {
            name: 'Smallville Complex',
            description: 'The vibrant nightlife district featuring diverse restaurants, bars, and entertainment venues popular with locals and tourists alike.',
            icon: Coffee,
            category: 'Nightlife',
            highlight: 'Food & Entertainment'
        },
        {
            name: 'Guimaras Island',
            description: 'A 15-minute ferry ride away, famous for the world\'s sweetest mangoes, pristine beaches, and stunning island views.',
            icon: Palmtree,
            category: 'Day Trip',
            highlight: 'Must-Visit Island'
        }
    ];

    const hotels = [
        {
            name: 'Richmonde Hotel Iloilo',
            category: 'Luxury',
            description: 'Premium 5-star hotel featuring modern rooms, rooftop infinity pool, international dining, and stunning city skyline views.',
            price: '₱₱₱₱',
            amenities: 'Pool, Gym, Restaurant, Bar'
        },
        {
            name: 'Iloilo Business Hotel',
            category: 'Luxury',
            description: 'Elegant accommodation with spacious conference facilities, fine dining restaurants, and exceptional business traveler amenities.',
            price: '₱₱₱₱',
            amenities: 'Conference Rooms, Restaurant'
        },
        {
            name: 'Seda Atria',
            category: 'Upscale',
            description: 'Modern upscale hotel adjacent to Atria Park District with contemporary design, excellent dining, and premium facilities.',
            price: '₱₱₱',
            amenities: 'Pool, Gym, Restaurant'
        },
        {
            name: 'Circle Inn',
            category: 'Mid-range',
            description: 'Reliable hotel chain offering comfortable rooms, consistent service, and strategic locations throughout the city.',
            price: '₱₱',
            amenities: 'WiFi, Breakfast, Parking'
        },
        {
            name: 'Go Hotels Iloilo',
            category: 'Budget',
            description: 'Clean, efficient, and affordable accommodation with modern minimalist design and essential amenities for budget travelers.',
            price: '₱',
            amenities: 'WiFi, Air Conditioning'
        },
        {
            name: 'RedDoorz Hotels',
            category: 'Budget',
            description: 'Network of budget-friendly accommodations with standardized quality, free WiFi, and multiple convenient locations.',
            price: '₱',
            amenities: 'WiFi, 24/7 Support'
        }
    ];

    const tips = [
        {
            icon: Car,
            title: 'Getting Around',
            description: 'Jeepneys (₱9-12 fare) are the iconic public transport. Download Grab app for convenient taxis and private cars. Tricycles available for short distances.',
            tip: 'Pro Tip: Negotiate tricycle fares before riding'
        },
        {
            icon: Utensils,
            title: 'Must-Try Cuisine',
            description: 'Don\'t miss authentic La Paz Batchoy (noodle soup), Pancit Molo (pork dumplings), KBL (Kadios-Baboy-Langka), and fresh seafood at Breakthrough restaurant.',
            tip: 'Pro Tip: Try "batchoy challenge" at Deco\'s'
        },
        {
            icon: MapPin,
            title: 'Best Time to Visit',
            description: 'December to May offers ideal weather. Visit in January (3rd or 4th week) for the spectacular Dinagyang Festival, one of the Philippines\' biggest celebrations.',
            tip: 'Pro Tip: Book hotels months ahead for Dinagyang'
        },
        {
            icon: Lightbulb,
            title: 'Local Etiquette',
            description: 'Ilonggos are exceptionally warm and hospitable. Learn "Maayong adlaw" (Good day), "Salamat" (Thank you). Dress modestly when visiting churches.',
            tip: 'Pro Tip: Smile and greet locals for warm responses'
        },
        {
            icon: Coffee,
            title: 'Coffee Culture',
            description: 'Iloilo has a thriving café scene. Visit local coffee shops like MO2 Westown Hotel\'s café or Madge Café for quality brews and Wi-Fi.',
            tip: 'Pro Tip: Try local "barako" coffee'
        },
        {
            icon: Compass,
            title: 'Day Trips',
            description: 'Take a 15-minute ferry to Guimaras for world-famous mangoes and beaches. Visit nearby towns like Miag-ao for UNESCO heritage churches.',
            tip: 'Pro Tip: Ferry to Guimaras runs every 30 mins'
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

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

    return (
        <div className="min-h-screen">
            {/* Hero and Attractions Section with Shared Background */}
            <div ref={heroRef} className="relative overflow-hidden group/hero">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src="/iloilo.webp"
                        alt="Iloilo City"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-background/92 via-background/85 to-background/92" />
                    {/* Photo Credit */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-white/40 z-10 opacity-30 hover:opacity-100 transition-opacity duration-300">
                        <CameraIcon className="inline mr-1 h-4 w-4" /> Janssen Panizales via Pexels
                    </div>
                </div>

                {/* Interactive Grid Background */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Base Grid Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03]" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                    {/* Dynamic Spotlight Reveal Effect */}
                    <div
                        className="absolute inset-0 bg-[linear-gradient(to_right,#80808025_1px,transparent_1px),linear-gradient(to_bottom,#80808025_1px,transparent_1px)] bg-[size:40px_40px] opacity-0 transition-opacity duration-300 group-hover/hero:opacity-100 will-change-[mask-image]"
                        style={{
                            maskImage: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), black, transparent)`,
                            WebkitMaskImage: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), black, transparent)`,
                        }}
                    />
                </div>

                {/* Hero Section */}
                <section className="relative py-20 lg:py-32">
                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center max-w-4xl mx-auto"
                        >
                            <h1 className="mt-4 text-5xl md:text-7xl font-bold mb-6 text-white bg-clip-text text-transparent leading-tight">
                                Discover Iloilo
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-300 mb-4 leading-relaxed">
                                Experience the heart of Western Visayas
                            </p>
                            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                                Where rich history, vibrant culture, and modern living blend seamlessly—creating the perfect backdrop for innovation and collaboration
                            </p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="flex flex-wrap gap-4 justify-center"
                            >
                                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/20">
                                    <Link to="/">
                                        Register for Summit <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Tourist Attractions */}
                <section ref={attractionsRef} className="relative py-16 lg:py-24 group/attractions">
                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <Compass className="h-12 w-12 mx-auto mb-4 text-white" />
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">Must-Visit Attractions</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Explore Iloilo's rich heritage, stunning landmarks, and vibrant culture
                            </p>
                        </motion.div>

                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {attractions.map((attraction, index) => (
                                <SpotlightCard key={index}>
                                    <Card className="glass-card h-full border-white/10 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        <CardHeader className="relative z-10">
                                            <div className="flex items-start justify-between mb-3">
                                                <motion.div
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                    className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5"
                                                >
                                                    <attraction.icon className="h-6 w-6 text-primary" />
                                                </motion.div>
                                                <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                                                    {attraction.category}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-xl group-hover:text-primary transition-colors">{attraction.name}</CardTitle>
                                            <p className="text-xs text-accent font-semibold">{attraction.highlight}</p>
                                        </CardHeader>
                                        <CardContent className="relative z-10">
                                            <CardDescription className="text-sm leading-relaxed">
                                                {attraction.description}
                                            </CardDescription>
                                        </CardContent>
                                    </Card>
                                </SpotlightCard>
                            ))}
                        </motion.div>
                    </div>
                </section>
            </div>

            {/* Hotels Section */}
            <section className="py-16 lg:py-24 bg-muted/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03]" />
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <Hotel className="h-12 w-12 mx-auto mb-4 text-primary" />
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Where to Stay</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            From luxury hotels to budget-friendly options—find your perfect accommodation
                        </p>
                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
                    >
                        {hotels.map((hotel, index) => (
                            <SpotlightCard key={index}>
                                <Card className="glass-card h-full border-white/10 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    <CardHeader className="relative z-10">
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="text-3xl font-bold text-accent">{hotel.price}</span>
                                            <Badge variant="outline" className="border-accent/30 text-accent text-xs">
                                                {hotel.category}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-xl group-hover:text-accent transition-colors">{hotel.name}</CardTitle>
                                        <p className="text-xs text-muted-foreground font-medium mt-1">{hotel.amenities}</p>
                                    </CardHeader>
                                    <CardContent className="relative z-10">
                                        <CardDescription className="text-sm leading-relaxed">
                                            {hotel.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </SpotlightCard>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Travel Tips Section */}
            <section className="py-16 lg:py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" />
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <Lightbulb className="h-12 w-12 mx-auto mb-4 text-primary" />
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Insider Travel Tips</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Essential local knowledge for an unforgettable Iloilo experience
                        </p>
                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
                    >
                        {tips.map((tip, index) => (
                            <SpotlightCard key={index}>
                                <Card className="glass-card h-full border-white/10 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    <CardHeader className="relative z-10">
                                        <div className="flex items-center gap-3 mb-3">
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: -5 }}
                                                className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5"
                                            >
                                                <tip.icon className="h-5 w-5 text-primary" />
                                            </motion.div>
                                            <CardTitle className="text-lg">{tip.title}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="relative z-10 space-y-3">
                                        <p className="text-sm text-muted-foreground leading-relaxed">{tip.description}</p>
                                        <div className="pt-2 border-t border-white/10">
                                            <p className="text-xs text-accent font-semibold">{tip.tip}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </SpotlightCard>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05]" />
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                            Ready to Experience Iloilo?
                        </h2>
                        <p className="text-xl text-slate-300 mb-4">
                            Join us at CHED RAISE 2026
                        </p>
                        <p className="text-lg text-muted-foreground mb-10">
                            Register now and discover why Iloilo is the perfect destination for learning, innovation, and cultural immersion
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 h-14 px-10 text-lg font-bold shadow-[0_0_40px_rgba(8,52,159,0.4)] hover:shadow-[0_0_50px_rgba(8,52,159,0.6)] transition-all">
                                <Link to="/">
                                    Register Now <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default TourismPage;
