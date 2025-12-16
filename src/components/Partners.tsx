import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"

export function Partners() {


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

                            />
                            <span className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-teal-300 group-hover:to-cyan-300 transition-all">West Visayas State University</span>
                        </motion.a>
                    </div>
                </div>

                <Separator className="bg-white/5 my-12" />

                <div className="max-w-5xl mx-auto">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-center mb-8">In Coordination With</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: "CHED", logo: "/partners/ched-logo.svg", description: "Commission on Higher Education" },
                            { name: "DOST", logo: "/partners/dost-logo.svg", description: "Department of Science and Technology" },
                            { name: "AAP", logo: null, description: "Association of Academic Programmers" },
                            { name: "PCORP", logo: null, description: "Private Sector Jobs and Skills Corporation" },
                            { name: "TPIS", logo: null, description: "Technical Panel for Information Systems" },
                            { name: "IBPAP", logo: "/partners/ibpap-logo.svg", description: "IT & Business Process Association of the Philippines" },
                            { name: "CDITE", logo: null, description: "Council of Deans in IT Education - Region 6" },
                            { name: "TESDA", logo: "/partners/tesda-logo.svg", description: "Technical Education and Skills Development Authority" },
                            { name: "DTI", logo: "/partners/dti-logo.svg", description: "Department of Trade and Industry" },
                            { name: "DICT", logo: "/partners/dict-logo.svg", description: "Department of Information and Communications Technology" },
                            { name: "Bagong Pilipinas", logo: "/partners/bagong-pilipinas-logo.svg", description: "Bagong Pilipinas" }
                        ].map((partner, index) => (
                            <motion.div
                                key={partner.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                whileHover={{ scale: 1.05, y: -4 }}
                                className="flex flex-col items-center justify-between p-4 bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/10 hover:border-primary/40 hover:from-white/15 hover:to-white/10 hover:shadow-xl hover:shadow-primary/10 transition-all cursor-pointer group relative overflow-hidden h-40"
                                title={partner.description}
                            >
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                                <div className="flex-1 flex items-center justify-center w-full">
                                    {partner.logo ? (
                                        <img
                                            src={partner.logo}
                                            alt={`${partner.name} Logo`}
                                            className="h-16 w-auto max-w-[80%] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100"
                                        />
                                    ) : (
                                        <div className="h-14 w-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors">
                                            <span className="text-sm font-bold text-slate-300 group-hover:text-primary transition-colors">{partner.name}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-2 w-full text-center">
                                    <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors uppercase tracking-wider block truncate">
                                        {partner.name}
                                    </span>
                                    {partner.description && (
                                        <span className="text-[10px] text-slate-500 group-hover:text-slate-300 transition-colors block truncate mt-0.5">
                                            {partner.description}
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
