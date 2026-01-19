import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook for GSAP scroll-based animations
 * Provides utilities for common scroll-triggered effects
 */
export const useGSAPScroll = () => {
    const isRegistered = useRef(false);

    useEffect(() => {
        if (!isRegistered.current) {
            gsap.registerPlugin(ScrollTrigger);
            isRegistered.current = true;
        }

        // Force refresh to ensure positions are calculated correctly
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);

        return () => {
            clearTimeout(timer);
            // Cleanup all ScrollTriggers on unmount
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return {
        gsap,
        ScrollTrigger,
    };
};

/**
 * Fade in and slide up animation
 */
export const fadeInUp = (element: gsap.DOMTarget, options?: gsap.TweenVars) => {
    return gsap.fromTo(
        element,
        {
            opacity: 0,
            y: 60,
        },
        {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: element,
                start: 'top 95%', // Trigger earlier (when element is near bottom of screen)
                end: 'bottom top',
                toggleActions: 'play none none none', // Play once and stay
            },
            ...options,
        }
    );
};

/**
 * Stagger animation for multiple elements
 */
export const staggerFadeIn = (elements: gsap.DOMTarget, options?: gsap.TweenVars) => {
    return gsap.fromTo(
        elements,
        {
            opacity: 0,
            y: 50,
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: elements,
                start: 'top 95%', // Trigger earlier
                toggleActions: 'play none none none', // Play once and stay
            },
            ...options,
        }
    );
};

/**
 * Scale and fade animation
 */
export const scaleIn = (element: gsap.DOMTarget, options?: gsap.TweenVars) => {
    return gsap.fromTo(
        element,
        {
            opacity: 0,
            scale: 0.8,
        },
        {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'back.out(1.2)',
            scrollTrigger: {
                trigger: element,
                start: 'top 90%',
                toggleActions: 'play none none none',
            },
            ...options,
        }
    );
};

/**
 * Parallax effect
 */
export const parallax = (element: gsap.DOMTarget, speed: number = 0.5, options?: gsap.TweenVars) => {
    return gsap.to(element, {
        y: () => window.innerHeight * speed,
        ease: 'none',
        scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
        },
        ...options,
    });
};

/**
 * Slide in from left
 */
export const slideInLeft = (element: gsap.DOMTarget, options?: gsap.TweenVars) => {
    return gsap.fromTo(
        element,
        {
            opacity: 0,
            x: -100,
        },
        {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: element,
                start: 'top 90%',
                toggleActions: 'play none none none',
            },
            ...options,
        }
    );
};

/**
 * Slide in from right
 */
export const slideInRight = (element: gsap.DOMTarget, options?: gsap.TweenVars) => {
    return gsap.fromTo(
        element,
        {
            opacity: 0,
            x: 100,
        },
        {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: element,
                start: 'top 90%',
                toggleActions: 'play none none none',
            },
            ...options,
        }
    );
};

/**
 * Clip path reveal animation
 */
export const clipReveal = (element: gsap.DOMTarget, options?: gsap.TweenVars) => {
    return gsap.fromTo(
        element,
        {
            clipPath: 'inset(0 100% 0 0)',
        },
        {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.2,
            ease: 'power2.inOut',
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            ...options,
        }
    );
};
