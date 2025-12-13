import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary blur-[150px] rounded-full mix-blend-screen animate-pulse" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary blur-[150px] rounded-full mix-blend-screen animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 text-center max-w-2xl px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 relative inline-block"
                >
                    <div className="text-[150px] md:text-[200px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-white/10 to-transparent select-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center text-4xl md:text-6xl font-bold text-white">
                        <span className="flex items-center gap-4">
                            <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-red-500" />
                            Oops!
                        </span>
                    </div>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-2xl md:text-4xl font-bold text-white mb-4"
                >
                    Page not found
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-slate-400 text-lg mb-8 max-w-md mx-auto"
                >
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link to="/">
                        <Button size="lg" className="bg-primary hover:bg-primary/90 text-white min-w-[200px] h-12 text-base font-semibold shadow-lg shadow-primary/25">
                            <Home className="mr-2 h-5 w-5" />
                            Back to Home
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFoundPage;
