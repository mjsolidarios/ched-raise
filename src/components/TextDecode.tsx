import { useState, useEffect } from 'react';

interface TextDecodeProps {
    text: string;
    className?: string;
    delay?: number;
    duration?: number;
    trigger?: any;
}

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';

export function TextDecode({ text, className = "", delay = 0, duration = 800, trigger }: TextDecodeProps) {
    const [displayText, setDisplayText] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        let timeout: any;
        let interval: any;

        const startAnimation = () => {
            setIsAnimating(true);
            setDisplayText('');

            timeout = setTimeout(() => {
                const startTime = Date.now();

                interval = setInterval(() => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    const revealedCount = Math.floor(progress * text.length);
                    let result = '';

                    for (let i = 0; i < text.length; i++) {
                        if (i < revealedCount) {
                            result += text[i];
                        } else {
                            result += characters[Math.floor(Math.random() * characters.length)];
                        }
                    }

                    setDisplayText(result);

                    if (progress >= 1) {
                        clearInterval(interval);
                        setIsAnimating(false);
                    }
                }, 30);
            }, delay);
        };

        startAnimation();

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, [text, delay, duration, trigger]);

    return (
        <span className={className}>
            {displayText || (isAnimating ? '' : text)}
        </span>
    );
}
