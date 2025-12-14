import { motion } from 'framer-motion';
import { MapPin, Hotel, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export const ExploreIloilo = () => {
    const highlights = [
        {
            icon: MapPin,
            title: 'Historic Sites',
            description: 'Visit iconic landmarks like Molo Church and Jaro Cathedral'
        },
        {
            icon: Hotel,
            title: 'Comfortable Stays',
            description: 'From luxury hotels to budget-friendly accommodations'
        },
        {
            icon: ArrowRight,
            title: 'Local Experiences',
            description: 'Taste authentic La Paz Batchoy and explore the Esplanade'
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
                            <Card className="glass-card h-full text-center hover:border-primary/50 transition-all">
                                <CardHeader>
                                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-3">
                                        <highlight.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-lg">{highlight.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>{highlight.description}</CardDescription>
                                </CardContent>
                            </Card>
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
