import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
// import { Robot } from '@/components/Robot';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative font-sans selection:bg-primary/30">

            {/* Background Grid & Ambient Light */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full animate-pulse-slow mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse-slow delay-1000 mix-blend-screen" />
            </div>

            <div className="container mx-auto px-4 h-screen flex flex-col lg:flex-row items-center justify-center relative z-10">

                {/* Left Side: Content */}
                <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1 mt-10 lg:mt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        {/* Glitch 404 */}
                        <div className="relative font-black text-[120px] sm:text-[180px] leading-none tracking-tighter select-none">
                            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
                                404
                            </span>
                            <span className="absolute top-0 left-0 -ml-[2px] text-red-500 opacity-70 mix-blend-screen animate-pulse hidden sm:block">
                                404
                            </span>
                            <span className="absolute top-0 left-0 ml-[2px] text-cyan-500 opacity-70 mix-blend-screen animate-pulse delay-75 hidden sm:block">
                                404
                            </span>
                        </div>

                        <div className="space-y-6 max-w-lg">
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-blue-200">
                                System Malfunction
                            </h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                The requested trajectory leads to an uncharted sector.
                                Our automated scouts could not locate the destination coordinates.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4 items-center lg:items-start">
                                <Link to="/">
                                    <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all group">
                                        <Home className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                                        Return to Base
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="h-14 px-8 text-lg border-white/10 hover:bg-white/5 text-slate-300 hover:text-white backdrop-blur-sm"
                                    onClick={() => window.history.back()}
                                >
                                    <ArrowLeft className="mr-2 h-5 w-5" />
                                    Go Back
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side: Robot */}
                <div className="w-full lg:w-1/2 h-[40vh] lg:h-[80vh] relative order-1 lg:order-2 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full h-full relative"
                    >
                        {/* 
                            We reuse various robot props. 
                            If the user previously had hardcoded values, we can approximate a good '404' pose.
                            Or we just let it float nicely.
                        */}
                        {/* <Robot
                            className="absolute inset-0 z-20"
                            scale={6.5}
                            position={[0, -2, 0]}
                            rotation={[0, -0.5, 0]}
                        /> */}

                        {/* Decorative circles behind robot */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] border border-white/10 rounded-full animate-[spin_60s_linear_infinite]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] border border-dashed border-white/20 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
