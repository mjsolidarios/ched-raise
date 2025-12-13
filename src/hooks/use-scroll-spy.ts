import { useState, useEffect } from "react"

export function useScrollSpy(ids: string[], offset: number = 0) {
    const [activeId, setActiveId] = useState<string>("")

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            {
                // Create a "trigger zone" near the top/center of the viewport
                // This essentially says: Trigger when the element crosses the line at 50% from top and 50% from bottom
                // Effectively checking what is currently in the middle of the screen
                rootMargin: "-40% 0px -60% 0px"
            }
        )

        ids.forEach((id) => {
            const element = document.getElementById(id)
            if (element) {
                observer.observe(element)
            }
        })

        return () => {
            ids.forEach((id) => {
                const element = document.getElementById(id)
                if (element) {
                    observer.unobserve(element)
                }
            })
        }
    }, [ids, offset])

    return activeId
}
