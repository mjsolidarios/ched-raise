
import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";

const PrivacyPolicyPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-primary selection:text-white flex flex-col">
            <main className="flex-grow pt-32 pb-20 container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 border-b border-white/10 pb-6">Privacy Policy</h1>

                    <div className="space-y-8 text-lg leading-relaxed text-slate-300">
                        <section>
                            <p className="mb-4">
                                Last Updated: February 2026
                            </p>
                            <p>
                                Welcome to the official website of the <strong>CHED RAISE 2026 Summit</strong> ("we," "us," or "our"), organized by the <strong>Commission on Higher Education (CHED) of the Philippines</strong> in partnership with West Visayas State University and Northern Iloilo State University. We are committed to protecting your personal information and your right to privacy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
                            <p className="mb-4">
                                We collect personal information that you voluntarily provide to us when you register for the summit, express an interest in obtaining information about us or our products and services, when you participate in activities on the Website, or otherwise when you contact us.
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Personal Information:</strong> Names, email addresses, phone numbers, institutional affiliations, and job titles.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
                            <p className="mb-4">
                                We use the information we collect or receive:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>To facilitate event registration and account creation.</li>
                                <li>To send you administrative information, such as event updates, agenda changes, and confirmations.</li>
                                <li>To respond to your inquiries and offer support.</li>
                                <li>To ensure the security of our services and prevent fraud.</li>
                                <li>For statistical analysis to improve future CHED events.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">3. Sharing Your Information</h2>
                            <p>
                                We do not share, sell, rent, or trade your information with third parties for their promotional purposes. We may share your data with our partner universities (West Visayas State University and Northern Iloilo State University) solely for the purpose of organizing and managing the CHED RAISE 2026 Summit. We may also disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
                            <p>
                                We implement appropriate technical and organizational security measures to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our Website is at your own risk.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">5. Your Privacy Rights</h2>
                            <p>
                                In accordance with the <strong>Data Privacy Act of 2012 (Republic Act No. 10173)</strong> of the Philippines, you have the right to access, correct, obstruct, and object to the processing of your personal data. You also have the right to lodge a complaint before the National Privacy Commission (NPC).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">6. Contact Us</h2>
                            <p>
                                If you have questions or comments about this policy, you may email us at <a href="mailto:helpdesk.chedraise@gmail.com" className="text-primary hover:underline">helpdesk.chedraise@gmail.com</a> or contact the Commission on Higher Education directly.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicyPage;
