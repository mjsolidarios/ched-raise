import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageSquareText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const faqs = [
    {
        question: "What is the event about?",
        answer: "CHED RAISE 2026 is a catalytic conference operationalizing the National AI Strategy (NAIS-PH) to ensure every Filipino is AI-ready. It focuses on leveraging Artificial Intelligence not just for efficiency, but for equity and societal empowerment.",
    },
    {
        question: "Who can attend?",
        answer: "The event is open to higher education executives, faculty, students, researchers, industry partners, and government stakeholders who are committed to advancing AI in Philippine higher education and nation-building.",
    },
    {
        question: "How to register?",
        answer: "You can register by clicking the 'Register Now' button in the navigation bar or the call-to-action buttons throughout the site. Follow the instructions on the registration page to secure your spot.",
    },
    {
        question: "Is it free to attend?",
        answer: "Yes, participation in CHED RAISE 2026 is completely free of charge. This includes access to all keynote sessions, breakout workshops, and digital conference materials.",
    },
];

export function FAQ() {
    return (
        <section id="faq" className="py-24 relative overflow-hidden bg-slate-950/30">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/50" />
            <div className="container px-4 relative z-10 max-w-4xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        Got Questions?
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white">
                        Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Questions</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Find answers to common questions about CHED RAISE 2026.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} faq={faq} index={index} />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <div className="inline-flex items-center gap-2 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300">
                        <MessageSquareText className="w-5 h-5" />
                        <p>
                            Still have questions? Use our <span className="font-bold text-blue-200">AI Chatbot</span> for instant answers!
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function FAQItem({ faq, index }: { faq: { question: string; answer: string }; index: number }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
        >
            <Card
                className={`glass-card border-white/10 transition-all duration-300 ${isOpen ? 'bg-white/10' : 'bg-white/5 hover:bg-white/10'}`}
            >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4 focus:outline-none"
                >
                    <span className={`font-semibold text-lg transition-colors ${isOpen ? 'text-blue-300' : 'text-white'}`}>
                        {faq.question}
                    </span>
                    <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-300' : ''}`}
                    />
                </button>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <CardContent className="px-6 pb-6 pt-0">
                                <p className="text-slate-300 leading-relaxed border-t border-white/10 pt-4">
                                    {faq.answer}
                                </p>
                            </CardContent>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </motion.div>
    );
}
