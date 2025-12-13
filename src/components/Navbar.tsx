import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

import { useScrollSpy } from "@/hooks/use-scroll-spy"
import { cn } from "@/lib/utils"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const activeId = useScrollSpy(["hero", "about", "objectives", "program", "partners"], 100)

    const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
        const id = href.replace("#", "")
        const isActive = activeId === id

        return (
            <a
                href={href}
                className={cn(
                    "text-sm font-medium transition-all duration-300 relative py-1 px-2 rounded-md hover:bg-white/5",
                    isActive ? "text-accent" : "text-slate-300 hover:text-white"
                )}
                onClick={() => setIsOpen(false)}
            >
                {children}
                {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent shadow-[0_0_10px_rgba(251,191,36,0.5)] rounded-full" />
                )}
            </a>
        )
    }

    const NavLinks = () => (
        <>
            <NavLink href="#hero">Home</NavLink>
            <NavLink href="#about">About</NavLink>
            <NavLink href="#objectives">Objectives</NavLink>
            <NavLink href="#program">Program</NavLink>
            <NavLink href="#partners">Partners</NavLink>
        </>
    )

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/60 backdrop-blur-xl">
            <div className="container mx-auto flex items-center justify-between px-4 h-16">
                <div className="flex items-center gap-3">
                    {/* Logo path assuming it's in public folder */}
                    <img src="/logo-light.svg" alt="CHED RAISE Logo" className="h-8 w-auto" />
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8 text-foreground/80">
                    <NavLinks />
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold">
                        Register Now
                    </Button>
                </div>

                {/* Mobile Nav */}
                <div className="md:hidden flex items-center gap-4">
                    <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">It's Free</Button>
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-background/95 backdrop-blur-xl border-l border-white/10">
                            <div className="flex flex-col gap-6 mt-10">
                                <NavLinks />
                                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 w-full">
                                    Register Now
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    )
}
