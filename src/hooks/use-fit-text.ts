import { useLayoutEffect, useState } from 'react';

export const useFitText = <T extends HTMLElement>(ref: React.RefObject<T | null>, maxLines: number) => {
  const [fontSize, setFontSize] = useState(64); // Starting font size

  useLayoutEffect(() => {
    const checkFit = () => {
      if (!ref.current) return;

      const { clientHeight } = ref.current;
      const lineHeight = parseFloat(window.getComputedStyle(ref.current).lineHeight);
      const lines = Math.round(clientHeight / lineHeight);

      if (lines > maxLines) {
        setFontSize((prevSize) => prevSize * 0.9); // Reduce font size by 10%
      }
    };

    checkFit(); // Run on initial render

    const observer = new ResizeObserver(checkFit);
    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, maxLines, ref.current]);

  useLayoutEffect(() => {
    if (!ref.current) return;
    ref.current.style.fontSize = `${fontSize}px`;
    ref.current.style.lineHeight = '1em'; // Set line height to 1em
  }, [fontSize, ref]);
};
