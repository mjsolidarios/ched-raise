import { Link } from "react-router-dom"

export function Footer() {
    return (
        <footer className="py-12 bg-slate-950 border-t border-white/10 relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-900/20 blur-[100px] pointer-events-none" />

            <div className="container px-4 text-center relative z-10">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <img src="/logo-light.svg" alt="Logo" className="h-8 w-auto opacity-90" />
                </div>
                <p className="text-lg md:text-xl text-slate-300 font-medium mb-8 italic">
                    "Raising Education. Empowering Society."
                </p>

                <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-slate-500 mb-10 font-medium">
                    <Link to="/privacy-policy" className="hover:text-accent hover:underline hover:underline-offset-4 transition-all">Privacy Policy</Link>
                    <a href="#" className="hover:text-accent hover:underline hover:underline-offset-4 transition-all">Contact Us</a>
                </div>

                <div className="text-xs text-slate-600 border-t border-white/5 pt-8">
                    <p>&copy; 2026 Northern Iloilo State University & West Visayas State University. All rights reserved.</p>
                    <p className="mt-2 text-slate-700">Designed for Societal Empowerment.</p>
                </div>
            </div>
        </footer>
    )
}
