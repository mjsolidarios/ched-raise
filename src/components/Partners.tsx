import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';

export function Partners() {


    const PARTNERS = [
        { name: "CHED", logo: "/partners/ched-logo.svg", description: "Commission on Higher Education" },
        { name: "DOST", logo: "/partners/dost-logo.svg", description: "Department of Science and Technology" },
        { name: "AAP", logo: null, description: "Analytics & AI Association of the Philippines" },
        { name: "PCORP", logo: null, description: "Private Sector Jobs and Skills Corporation" },
        { name: "TPIS", logo: null, description: "Technical Panel for Information Systems" },
        { name: "IBPAP", logo: "/partners/ibpap-logo.svg", description: "IT & Business Process Association of the Philippines" },
        { name: "CDITE", logo: null, description: "Council of Deans in IT Education - Region 6" },
        { name: "TESDA", logo: "/partners/tesda-logo.svg", description: "Technical Education and Skills Development Authority" },
        { name: "DTI", logo: "/partners/dti-logo.svg", description: "Department of Trade and Industry" },
        { name: "DICT", logo: "/partners/dict-logo.svg", description: "Department of Information and Communications Technology" },
        { name: "Bagong Pilipinas", logo: "/partners/bagong-pilipinas-logo.svg", description: "Bagong Pilipinas" }
    ];

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

                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-center mb-12">In Coordination With</h3>
                    <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-8">
                        <Swiper
                            slidesPerView="auto"
                            spaceBetween={32}
                            centeredSlides={true}
                            loop={true}
                            speed={3000}
                            autoplay={{
                                delay: 0,
                                disableOnInteraction: false,
                            }}
                            modules={[Autoplay]}
                            className="w-full !overflow-visible"
                        >
                            {PARTNERS.map((partner, index) => (
                                <SwiperSlide key={`${partner.name}-${index}`} className="!w-72 !h-auto flex transition-all duration-300 ease-in-out [&.swiper-slide-active]:scale-110 [&:not(.swiper-slide-active)]:scale-90 [&:not(.swiper-slide-active)]:opacity-60 [&:not(.swiper-slide-active)]:grayscale [&.swiper-slide-active]:grayscale-0 [&.swiper-slide-active]:z-10">
                                    <div
                                        className="flex flex-col items-center justify-between p-6 w-full h-full bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/10 backdrop-blur-sm transition-all relative overflow-hidden min-h-[12rem] shadow-lg"
                                        title={partner.description}
                                    >
                                        <div className="flex-1 flex items-center justify-center w-full mb-4">
                                            {partner.logo ? (
                                                <img
                                                    src={partner.logo}
                                                    alt={`${partner.name} Logo`}
                                                    className="h-20 w-auto max-w-[90%] object-contain transition-all duration-300"
                                                />
                                            ) : (
                                                <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                                    <span className="text-sm font-bold text-slate-300">{partner.name}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="w-full text-center mt-auto">
                                            <span className="text-sm font-bold text-white uppercase tracking-wider block mb-1">
                                                {partner.name}
                                            </span>
                                            {partner.description && (
                                                <span className="text-[11px] text-slate-400 leading-tight block line-clamp-2 min-h-[2.5em]">
                                                    {partner.description}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    )
}
