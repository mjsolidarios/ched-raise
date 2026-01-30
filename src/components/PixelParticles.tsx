import React, { useEffect, useRef } from 'react';

interface PixelParticlesProps {
    targetRef: React.RefObject<HTMLElement>;
}

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;
    life: number;
    maxLife: number;
}

export const PixelParticles: React.FC<PixelParticlesProps> = ({ targetRef }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);
    const animationFrameId = useRef<number | null>(null);

    // Theme colors
    const colors = [
        '#5b8def', // Primary Blue
        '#10b981', // Secondary Teal/Green
        '#ffffff', // White
        '#3b82f6', // Brighter Blue
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const createParticle = (): Particle => {
            const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
            let x, y;

            switch (side) {
                case 0:
                    x = Math.random() * canvas.width;
                    y = -10;
                    break;
                case 1:
                    x = canvas.width + 10;
                    y = Math.random() * canvas.height;
                    break;
                case 2:
                    x = Math.random() * canvas.width;
                    y = canvas.height + 10;
                    break;
                case 3:
                    x = -10;
                    y = Math.random() * canvas.height;
                    break;
                default:
                    x = Math.random() * canvas.width;
                    y = -10;
            }

            return {
                x,
                y,
                size: Math.random() * 2 + 1, // 1px to 3px square
                speedX: 0,
                speedY: 0,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 0,
                maxLife: Math.random() * 100 + 100,
            };
        };

        const updateParticles = () => {
            if (!targetRef.current) return;

            const rect = targetRef.current.getBoundingClientRect();
            // Calculate center of the target element (logo) accounting for scroll
            // Since canvas is fixed/absolute in hero, and hero might be scrolled, we need relative coordinates
            // However, Hero is usually Top of page. If canvas is absolute inset-0 in Hero, 
            // rect.left is relative to viewport. 
            // We need coordinates relative to the canvas.
            // If canvas is absolute in a relative parent, we need to map viewport coords to canvas coords.

            // Assuming canvas fills the viewport or the hero section perfectly
            const canvasRect = canvas.getBoundingClientRect();
            const targetX = rect.left + rect.width / 2 - canvasRect.left;
            const targetY = rect.top + rect.height / 2 - canvasRect.top;

            // Spawn new particles
            if (particles.current.length < 150) {
                particles.current.push(createParticle());
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw center spark/glow
            /*
            const gradient = ctx.createRadialGradient(targetX, targetY, 0, targetX, targetY, 50);
            gradient.addColorStop(0, 'rgba(91, 141, 239, 0.5)'); // Primary glow
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(targetX - 50, targetY - 50, 100, 100);
             */

            for (let i = 0; i < particles.current.length; i++) {
                const p = particles.current[i];

                // Calculate direction to target
                const dx = targetX - p.x;
                const dy = targetY - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // "Black hole" attraction
                // Speed increases as distance decreases, but clamp it to avoid shooting past too fast
                const speed = Math.max(2, 1000 / (dist + 10));

                const angle = Math.atan2(dy, dx);

                p.x += Math.cos(angle) * speed * 0.5; // Tuning speed factor
                p.y += Math.sin(angle) * speed * 0.5;

                // Scale down as it gets closer
                const scale = Math.min(1, dist / 200);
                const currentSize = p.size * scale;

                // Opacity based on distance (fade out really close to center)
                const opacity = Math.min(1, dist / 50);

                if (dist < 5 || p.life > p.maxLife) {
                    particles.current.splice(i, 1);
                    i--;
                    continue; // Skip drawing dead particle
                }

                ctx.fillStyle = p.color;
                ctx.globalAlpha = opacity * 0.5;
                ctx.shadowBlur = 15;
                ctx.shadowColor = p.color;
                ctx.fillRect(p.x, p.y, currentSize, currentSize);
                ctx.shadowBlur = 0; // Reset for performance/other draws
                ctx.globalAlpha = 1.0;

                p.life++;
            }

            animationFrameId.current = requestAnimationFrame(updateParticles);
        };

        updateParticles();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationFrameId.current !== null) cancelAnimationFrame(animationFrameId.current);
        };
    }, [targetRef]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0"
            style={{ width: '100%', height: '100%' }}
        />
    );
};
