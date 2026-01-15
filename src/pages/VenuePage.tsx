import { motion } from 'framer-motion';
import { MapPin, Hotel, Lightbulb, ArrowRight, Building2, Utensils, Car, CameraIcon, Compass, Coffee, Users, Crown, MonitorPlay, Palmtree, CloudSun, Armchair } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { Footer } from '@/components/Footer';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { useGSAPScroll, parallax, staggerFadeIn, fadeInUp, scaleIn } from '@/hooks/useGSAPScroll';

const VenuePage = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const attractionsRef = useRef<HTMLElement>(null);
    const spotsRef = useRef<HTMLDivElement>(null);
    const hotelsRef = useRef<HTMLDivElement>(null);
    const tipsRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const heroBgRef = useRef<HTMLDivElement>(null);
    const spotsBgRef = useRef<HTMLDivElement>(null);
    const tipsBgRef = useRef<HTMLDivElement>(null);

    // Hero content refs for entrance
    const heroLogoRef = useRef<HTMLImageElement>(null);
    const heroContentRef = useRef<HTMLDivElement>(null);

    const { gsap } = useGSAPScroll();

    useEffect(() => {
        // Scroll Animations
        if (heroBgRef.current) parallax(heroBgRef.current, 0.3);
        if (spotsBgRef.current) parallax(spotsBgRef.current, 0.4);
        if (tipsBgRef.current) parallax(tipsBgRef.current, 0.3);

        // Entrance animations for Hero (same as home page)
        if (heroLogoRef.current) {
            scaleIn(heroLogoRef.current, { delay: 0.2 });
        }
        if (heroContentRef.current) {
            const elements = heroContentRef.current.children;
            staggerFadeIn(elements, { stagger: 0.15, delay: 0.4 });
        }

        // Section header reveals
        const headers = document.querySelectorAll('section > div > .text-center:first-child');
        headers.forEach(header => {
            fadeInUp(header, { duration: 0.8 });
        });

        // Stagger reveals for cards
        if (attractionsRef.current) {
            const cards = attractionsRef.current.querySelectorAll('.spotlight-card-wrapper');
            staggerFadeIn(cards, { stagger: 0.1, delay: 0.2 });
        }
        if (spotsRef.current) {
            const cards = spotsRef.current.querySelectorAll('.spotlight-card-wrapper');
            staggerFadeIn(cards, { stagger: 0.1, delay: 0.2 });
        }
        if (hotelsRef.current) {
            const cards = hotelsRef.current.querySelectorAll('.spotlight-card-wrapper');
            staggerFadeIn(cards, { stagger: 0.1, delay: 0.2 });
        }
        if (tipsRef.current) {
            const cards = tipsRef.current.querySelectorAll('.spotlight-card-wrapper');
            staggerFadeIn(cards, { stagger: 0.1, delay: 0.2 });
        }

        if (ctaRef.current) fadeInUp(ctaRef.current);

    }, [gsap]);

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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const venueHighlights = [
        {
            name: 'Grand Ballroom',
            description: 'The massive ground floor main hall capable of accommodating up to 3,700 guests, perfect for large-scale conventions and plenary sessions.',
            icon: Building2,
            category: 'Main Venue',
            highlight: '3,700 Seating Capacity'
        },
        {
            name: 'Function Rooms',
            description: 'Seven versatile function rooms on the second floor, each designed for breakout sessions, workshops, and intimate meetings for 50-100 delegates.',
            icon: Users, // Need to import Users or keep existing if suitable
            category: 'Meeting Spaces',
            highlight: 'Flexible Configurations'
        },
        {
            name: 'Architectural Design',
            description: 'A masterpiece by W.V. Coscolluela, featuring exterior fins inspired by Paraw Regatta sails and glass walls reflecting Dinagyang warriors.',
            icon: Lightbulb,
            category: 'Architecture',
            highlight: 'Paraw & Dinagyang Inspired'
        },
        {
            name: 'Prime Location',
            description: 'Strategically situated in the Iloilo Business Park, walking distance to premier hotels, malls, and the festive walk strip.',
            icon: MapPin,
            category: 'Location',
            highlight: 'Iloilo Business Park'
        },
        {
            name: 'VIP Facilities',
            description: 'Dedicated VIP lounges and preparation rooms ensuring comfort and privacy for distinguished guests and speakers.',
            icon: Crown, // Need to import Crown
            category: 'Amenities',
            highlight: 'Exclusive Access'
        },
        {
            name: 'Modern Technology',
            description: 'State-of-the-art audio-visual equipment and high-speed internet connectivity throughout the venue to support hybrid event formats.',
            icon: MonitorPlay, // Need to import MonitorPlay
            category: 'Tech',
            highlight: 'World-Class AV'
        },
        {
            name: 'Outdoor Roof Deck',
            description: 'A 1,500-square-meter open-air venue on the roof deck, perfect for cocktail receptions and evening events under the stars.',
            icon: CloudSun,
            category: 'Outdoor Venue',
            highlight: 'City Skyline Views'
        },
        {
            name: 'Grand Lobby',
            description: 'Spacious and elegant pre-function area designed for fluid crowd movement, networking, and seamless registration processes.',
            icon: Armchair,
            category: 'Reception',
            highlight: 'Expansive Space'
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
            description: 'Jeepneys (₱13-15 fare) are the iconic public transport. Download Grab app for convenient taxis and private cars. Tricycles available for short distances.',
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
            description: 'December to May offers ideal weather. Visit in February (3rd or 4th week) to witness the colorful Paraw Regatta Festival, the oldest traditional craft event in Asia.',
            tip: 'Pro Tip: Catch the main sailing race at Villa Beach'
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
            <div className="spotlight-card-wrapper">
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
            </div>
        );
    };

    return (
        <div className="min-h-screen">
            {/* Hero and Attractions Section with Shared Background */}
            <div ref={heroRef} className="relative overflow-hidden group/hero">
                {/* Background Image */}
                <div ref={heroBgRef} className="absolute inset-0">
                    <ProgressiveImage
                        src="/icc.webp"
                        alt="Iloilo Convention Center"
                        className="w-full h-full"
                        priority={true}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-background/92 via-background/85 to-background/92" />
                    {/* Photo Credit */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-white/70 z-10 opacity-70 hover:opacity-100 transition-opacity duration-300">
                        <CameraIcon className="inline mr-1 h-4 w-4" /> https://iloiloconventioncenter.com
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
                        <div ref={heroContentRef} className="text-center max-w-4xl mx-auto">
                            <img ref={heroLogoRef} className="h-auto w-48 mx-auto mb-4" src="/icon-logo.png" alt="" />
                            <h1 className="mt-4 text-5xl md:text-7xl font-bold mb-6 text-white bg-clip-text text-transparent leading-tight">
                                Iloilo Convention Center
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-300 mb-4 leading-relaxed">
                                The Premier MICE Destination in Western Visayas
                            </p>
                            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                                Experience world-class facilities inspired by Iloilo's rich culture and heritage, featuring iconic Paraw Regatta sails and Dinagyang warrior designs.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Tourist Attractions */}
                <section ref={attractionsRef} className="relative py-16 lg:py-24 group/attractions">
                    <div className="container mx-auto px-4 relative z-10">
                        <div
                            className="text-center mb-12"
                        >
                            <Compass className="h-12 w-12 mx-auto mb-4 text-white" />
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">Venue Highlights</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Explore the state-of-the-art facilities of the Iloilo Convention Center
                            </p>
                        </div>

                        <div
                            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {venueHighlights.map((attraction, index) => (
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
                        </div>
                    </div>
                </section>
            </div>

            {/* Tourist Spots Section */}
            <section className="py-16 lg:py-24 relative overflow-hidden group/discover">
                <div ref={spotsBgRef} className="absolute inset-0">
                    <ProgressiveImage
                        src="/sail.webp"
                        alt="Iloilo Paraw Regatta Sails"
                        className="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-background/50" />
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03]" />
                <div className="container mx-auto px-4 relative z-10">
                    <div
                        className="text-center mb-12"
                    >
                        <MapPin className="h-12 w-12 mx-auto mb-4 text-primary" />
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Discover Iloilo</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Immerse yourself in the rich history, culture, and natural beauty of the "Heart of the Philippines"
                        </p>
                    </div>

                    <div
                        ref={spotsRef}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
                    >
                        {[
                            {
                                name: 'Islas de Gigantes',
                                category: 'Nature',
                                description: 'A remote group of islands famous for pristine white sand beaches, clear waters, and fresh seafood.',
                                icon: Crown, // Using Crown as a placeholder for "Jewel" of tourism; could substitute if specific icon available
                                highlight: 'Must-visit Paradise'
                            },
                            {
                                name: 'Miagao Church',
                                category: 'Heritage',
                                description: 'A UNESCO World Heritage Site known for its intricate baroque architectural design and sculptural relief.',
                                icon: Building2,
                                highlight: 'UNESCO Heritage Site'
                            },
                            {
                                name: 'Iloilo River Esplanade',
                                category: 'Leisure',
                                description: 'A scenic riverside park perfect for jogging, dining, and enjoying sunset views along the Iloilo River.',
                                icon: Users,
                                highlight: 'Urban Oasis'
                            },
                            {
                                name: 'Calle Real',
                                category: 'Heritage',
                                description: 'The historic district of Iloilo City, lined with restored colonial-era commercial buildings.',
                                icon: CameraIcon,
                                highlight: 'Historic Walk'
                            },
                            {
                                name: 'Molo Church',
                                category: 'Culture',
                                description: 'Known as the "Feminist Church" because of the all-female ensemble of saints residing in it.',
                                icon: Building2,
                                highlight: 'Gothic-Renaissance'
                            },
                            {
                                name: 'Garin Farm',
                                category: 'Agri-Tourism',
                                description: 'An inland resort combining agriculture, leisure, and pilgrimage with a famous "Stairway to Heaven".',
                                icon: Lightbulb, // Symbolic for "enlightenment"/pilgrimage
                                highlight: 'Pilgrimage Site'
                            },
                            {
                                name: 'Jaro Plaza',
                                category: 'Heritage',
                                description: 'A historic plaza with a bell tower across the street and the cathedral nearby, known for its community vibe.',
                                icon: Compass,
                                highlight: 'Cultural Center'
                            },
                            {
                                name: 'Plazuela de Iloilo',
                                category: 'Lifestyle',
                                description: 'A Spanish-Italian inspired dining and entertainment hub with open courtyards and landscaped gardens.',
                                icon: Coffee,
                                highlight: 'Dining & Entertainment'
                            },
                            {
                                name: 'Bucari Pine Forest',
                                category: 'Nature',
                                description: 'Known as the "Summer Capital of Iloilo", offering cool weather, pine trees, and scenic mountain views.',
                                icon: Palmtree, // Using Palmtree as nature proxy if Pine is unavailable
                                highlight: 'Little Baguio'
                            }
                        ].map((spot, index) => (
                            <SpotlightCard key={index}>
                                <Card className="glass-card h-full border-white/10 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    <CardHeader className="relative z-10">
                                        <div className="flex items-start justify-between mb-3">
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5"
                                            >
                                                <spot.icon className="h-6 w-6 text-primary" />
                                            </motion.div>
                                            <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                                                {spot.category}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-xl group-hover:text-primary transition-colors">{spot.name}</CardTitle>
                                        <p className="text-xs text-accent font-semibold">{spot.highlight}</p>
                                    </CardHeader>
                                    <CardContent className="relative z-10">
                                        <CardDescription className="text-sm leading-relaxed">
                                            {spot.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </SpotlightCard>
                        ))}
                    </div>
                </div >

                {/* Photo Credit */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-white/70 z-10 opacity-70 hover:opacity-100 transition-opacity duration-300">
                    <CameraIcon className="inline mr-1 h-4 w-4" /> June Famur Jr. via Pexels
                </div>
            </section>

            {/* Hotels Section */}
            <section className="py-16 lg:py-24 bg-muted/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03]" />
                <div className="container mx-auto px-4 relative z-10">
                    <div
                        className="text-center mb-12"
                    >
                        <Hotel className="h-12 w-12 mx-auto mb-4 text-primary" />
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Where to Stay</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            From luxury hotels to budget-friendly options—find your perfect accommodation
                        </p>
                    </div>

                    <div
                        ref={hotelsRef}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
                    >
                        {hotels.map((hotel, index) => (
                            <SpotlightCard key={index}>
                                <a
                                    href={`https://www.agoda.com/search?text=${encodeURIComponent(hotel.name)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block h-full"
                                >
                                    <Card className="glass-card h-full border-white/10 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 relative overflow-hidden group/card">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000" />
                                        <CardHeader className="relative z-10">
                                            <div className="flex items-start justify-between mb-2">
                                                <span className="text-3xl font-bold text-accent">{hotel.price}</span>
                                                <Badge variant="outline" className="border-accent/30 text-accent text-xs">
                                                    {hotel.category}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-xl group-hover/card:text-accent transition-colors flex items-center gap-2">
                                                {hotel.name}
                                                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover/card:opacity-100 group-hover/card:translate-x-0 transition-all duration-300" />
                                            </CardTitle>
                                            <p className="text-xs text-muted-foreground font-medium mt-1">{hotel.amenities}</p>
                                        </CardHeader>
                                        <CardContent className="relative z-10">
                                            <CardDescription className="text-sm leading-relaxed">
                                                {hotel.description}
                                            </CardDescription>
                                        </CardContent>
                                    </Card>
                                </a>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Travel Tips Section */}
            <section className="py-16 lg:py-24 relative overflow-hidden group/tips">
                <div ref={tipsBgRef} className="absolute inset-x-0 -top-[40%] w-full h-[180%] z-0">
                    <ProgressiveImage
                        src="/iloilo.webp"
                        alt="Iloilo City"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-background/50" />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
                <div className="container mx-auto px-4 relative z-10">
                    <div
                        className="text-center mb-12"
                    >
                        <Lightbulb className="h-12 w-12 mx-auto mb-4 text-primary" />
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Insider Travel Tips</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Essential local knowledge for an unforgettable Iloilo experience
                        </p>
                    </div>

                    <div
                        ref={tipsRef}
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
                    </div>
                </div>
                {/* Photo Credit */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-white/70 z-10 opacity-70 hover:opacity-100 transition-opacity duration-300">
                    <CameraIcon className="inline mr-1 h-4 w-4" /> Janssen Panizales via Pexels
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05]" />
                <div className="container mx-auto px-4 relative z-10">
                    <div
                        ref={ctaRef}
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
                            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 h-14 px-10 text-lg font-bold shadow-[0_0_40px_rgba(8,52,159,0.6)] hover:shadow-[0_0_50px_rgba(8,52,159,0.8)] transition-all relative overflow-hidden group">
                                <Link to="/login" onClick={() => window.scrollTo(0, 0)}>
                                    <span className="relative z-10 flex items-center">
                                        Register Now <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <span className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default VenuePage;
