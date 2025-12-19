import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressiveImageProps {
    src: string;
    alt: string;
    className?: string;
    placeholderClassName?: string;
    priority?: boolean;
    blur?: boolean;
}

export function ProgressiveImage({
    src,
    alt,
    className,
    placeholderClassName,
    priority = false,
    blur = true,
}: ProgressiveImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // If priority is true, we want to load it faster or it might already be preloaded
        const img = new Image();
        img.src = src;
        img.onload = () => {
            setIsLoaded(true);
        };
    }, [src]);

    return (
        <div className={cn("relative overflow-hidden", className)}>
            {/* Low-quality/Placeholder layer */}
            <AnimatePresence>
                {!isLoaded && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className={cn(
                            "absolute inset-0 bg-muted/20",
                            blur && "backdrop-blur-xl scale-110",
                            placeholderClassName
                        )}
                    />
                )}
            </AnimatePresence>

            {/* Main image layer */}
            <motion.img
                src={src}
                alt={alt}
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                loading={priority ? "eager" : "lazy"}
                className={cn(
                    "w-full h-full object-cover",
                    isLoaded ? "opacity-100" : "opacity-0"
                )}
            />
        </div>
    );
}
