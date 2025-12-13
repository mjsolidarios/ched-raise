import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { About } from "@/components/About"
import { Objectives } from "@/components/Objectives"
import { Program } from "@/components/Program"
import { Partners } from "@/components/Partners"
import { Footer } from "@/components/Footer"

export default function App() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-accent selection:text-accent-foreground overflow-x-hidden">
            <Navbar />
            <main>
                <Hero />
                <About />
                <Objectives />
                <Program />
                <Partners />
            </main>
            <Footer />
        </div>
    )
}
