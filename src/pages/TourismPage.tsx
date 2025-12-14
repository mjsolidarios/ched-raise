import { motion } from 'framer-motion';
import { MapPin, Hotel, Lightbulb, ArrowRight, Church, Building2, TreePine, Waves, Utensils, Car } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TourismPage = () => {
    const attractions = [
        {
            name: 'Molo Church',
            description: 'Gothic-Renaissance church known as the "Feminist Church" featuring all-female saints.',
            icon: Church,
            category: 'Historical'
        },
        {
            name: 'Jaro Cathedral',
            description: 'Historic shrine housing the miraculous image of Our Lady of Candles.',
            icon: Church,
            category: 'Historical'
        },
        {
            name: 'Iloilo Esplanade',
            description: 'Scenic 1.2km waterfront promenade perfect for evening walks and river views.',
            icon: Waves,
            category: 'Recreational'
        },
        {
            name: 'Iloilo Museum',
            description: 'Cultural heritage museum showcasing Ilonggo history and artifacts.',
            icon: Building2,
            category: 'Cultural'
        },
        {
            name: 'Garin Farm',
            description: 'Pilgrimage resort with gardens, pools, and breathtaking hilltop views.',
            icon: TreePine,
            category: 'Nature'
        },
        {
            name: 'Festive Walk Parade',
            description: 'Modern lifestyle hub with shops, restaurants, and entertainment options.',
            icon: Building2,
            category: 'Recreational'
        }
    ];

    const hotels = [
        {
            name: 'Richmonde Hotel Iloilo',
            category: 'Luxury',
            description: 'Premium hotel with modern amenities, rooftop bar, and excellent city views.',
            price: '₱₱₱'
        },
        {
            name: 'Iloilo Business Hotel',
            category: 'Luxury',
            description: 'Elegant accommodation with conference facilities and fine dining.',
            price: '₱₱₱'
        },
        {
            name: 'Circle Inn',
            category: 'Mid-range',
            description: 'Comfortable hotel chain with reliable service and convenient locations.',
            price: '₱₱'
        },
        {
            name: 'Go Hotels Iloilo',
            category: 'Budget',
            description: 'Clean, no-frills accommodation perfect for budget-conscious travelers.',
            price: '₱'
        },
        {
            name: 'RedDoorz Hotels',
            category: 'Budget',
            description: 'Affordable stays with essential amenities across multiple locations.',
            price: '₱'
        }
    ];

    const tips = [
        {
            icon: Car,
            title: 'Transportation',
            description: 'Jeepneys are the primary mode of transport. Taxis and ride-sharing apps (Grab) are also available. Minimum fare starts at ₱40.'
        },
        {
            icon: Utensils,
            title: 'Local Cuisine',
            description: "Don't miss La Paz Batchoy, Pancit Molo, and fresh seafood. Visit Breakthrough for seafood dining by the shore."
        },
        {
            icon: MapPin,
            title: 'Best Time to Visit',
            description: 'December to May offers the best weather. January features the spectacular Dinagyang Festival.'
        },
        {
            icon: Lightbulb,
            title: 'Cultural Etiquette',
            description: 'Ilonggos are warm and friendly. A smile and "Maayong adlaw" (Good day) go a long way!'
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-primary/20 via-background to-background">
                <div className="absolute inset-0 bg-grid-white/5" />
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                            Discover Iloilo
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Experience the heart of Western Visayas - where history, culture, and modern living blend seamlessly
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                                <Link to="/">
                                    Register for Summit <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Tourist Attractions */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <MapPin className="h-12 w-12 mx-auto mb-4 text-primary" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Must-Visit Attractions</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Explore Iloilo's rich heritage and vibrant culture
                        </p>
                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {attractions.map((attraction, index) => (
                            <motion.div key={index} variants={item}>
                                <Card className="glass-card h-full hover:border-primary/50 transition-all duration-300">
                                    <CardHeader>
                                        <div className="flex items-start justify-between mb-2">
                                            <attraction.icon className="h-8 w-8 text-primary" />
                                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                                {attraction.category}
                                            </span>
                                        </div>
                                        <CardTitle className="text-xl">{attraction.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base">
                                            {attraction.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Hotels */}
            <section className="py-16 lg:py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <Hotel className="h-12 w-12 mx-auto mb-4 text-primary" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Where to Stay</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Comfortable accommodations for every budget
                        </p>
                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
                    >
                        {hotels.map((hotel, index) => (
                            <motion.div key={index} variants={item}>
                                <Card className="glass-card h-full hover:border-primary/50 transition-all duration-300">
                                    <CardHeader>
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="text-2xl">{hotel.price}</span>
                                            <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">
                                                {hotel.category}
                                            </span>
                                        </div>
                                        <CardTitle className="text-xl">{hotel.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base">
                                            {hotel.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Travel Tips */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <Lightbulb className="h-12 w-12 mx-auto mb-4 text-primary" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Travel Tips</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Essential information for a smooth visit
                        </p>
                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
                    >
                        {tips.map((tip, index) => (
                            <motion.div key={index} variants={item}>
                                <Card className="glass-card h-full">
                                    <CardHeader>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <tip.icon className="h-5 w-5 text-primary" />
                                            </div>
                                            <CardTitle className="text-lg">{tip.title}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{tip.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to Experience Iloilo?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Register for the CHED RAISE Summit 2025 and explore everything Iloilo has to offer
                        </p>
                        <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                            <Link to="/">
                                Register Now <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default TourismPage;
