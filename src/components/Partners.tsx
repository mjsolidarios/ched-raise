import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"

export function Partners() {
    const PartnerLogo = ({ name, index }: { name: string, index: number }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -4 }}
            className="flex items-center justify-center p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/10 hover:border-primary/40 hover:from-white/15 hover:to-white/10 hover:shadow-xl hover:shadow-primary/10 transition-all cursor-pointer group relative overflow-hidden"
        >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            
            <span className="text-slate-400 font-bold group-hover:text-white text-center relative z-10 transition-colors">{name}</span>
        </motion.div>
    )

    return (
        <section id="partners" className="py-20 bg-background border-t border-white/5">
            <div className="container px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">Strategic Partners</h2>
                    <p className="text-slate-400">Collaborating for a future-ready Philippines</p>
                </div>

                <div className="mb-12">
                    <h3 className="text-sm font-semibold text-accent uppercase tracking-widest text-center mb-6">Lead Institutions</h3>
                    <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                        <motion.a
                            href="https://nisu.edu.ph"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-4 group cursor-pointer"
                        >
                            <motion.img
                                src="/nisu-logo.png"
                                alt="NISU Logo"
                                className="h-20 w-auto drop-shadow-[0_0_20px_rgba(8,52,159,0.3)]"
                                whileHover={{ rotate: [0, -5, 5, 0] }}
                                transition={{ duration: 0.5 }}
                            />
                            <span className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-blue-300 transition-all">Northern Iloilo State University</span>
                        </motion.a>
                        <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                        <motion.a
                            href="https://wvsu.edu.ph"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-4 group cursor-pointer"
                        >
                            <motion.img
                                src="/wvsu-logo.png"
                                alt="WVSU Logo"
                                className="h-20 w-auto drop-shadow-[0_0_20px_rgba(20,184,166,0.3)]"
                                whileHover={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 0.5 }}
                            />
                            <span className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-teal-300 group-hover:to-cyan-300 transition-all">West Visayas State University</span>
                        </motion.a>
                    </div>
                </div>

                <Separator className="bg-white/5 my-12" />

                <div className="max-w-5xl mx-auto">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-center mb-8">In Coordination With</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {["CHED", "DOST", "AAP", "IBPAP", "TESDA", "DTI", "DICT", "PSF"].map((name, index) => (
                            <PartnerLogo key={name} name={name} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
