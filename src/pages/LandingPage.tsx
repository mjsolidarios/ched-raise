

// Assuming the original App.tsx content was the landing page content.
// I need to recreate the original App.tsx content here but without the Router wrapper.
// Since I overwrote App.tsx, I should have read it first or I need to reconstruct it.
// Wait, I copied App.tsx to LandingPage.tsx BEFORE overwriting it in the previous turn?
// No, I overwrote App.tsx THEN copied it. That was a mistake. 
// I need to try to restore the original content if possible or create a new Landing Page based on previous context.
// Actually, I can see the previous App.tsx content in the `read_file` history or I can just create a nice Landing Page now.
// The previous App.tsx looked like it had a Navbar, Hero, etc. 
// I will create a new Landing Page structure based on the project theme.

import { Hero } from "@/components/Hero"
import { About } from "@/components/About"
import { Objectives } from "@/components/Objectives"
import { Program } from "@/components/Program"
import { ExploreIloilo } from "@/components/ExploreIloilo"
import { Partners } from "@/components/Partners"
import { Footer } from "@/components/Footer"

const LandingPage = () => {
    return (
        <>
            <main>
                <Hero />
                <About />
                <Objectives />
                <Program />
                <ExploreIloilo />
                <Partners />
            </main>
            <Footer />
        </>
    );
};

export default LandingPage;
