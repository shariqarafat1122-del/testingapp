import { useState, useEffect } from 'react';

export function useBoardSize(): number {
  const [size, setSize] = useState(360);

  useEffect(() => {
    function calc() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Mobile
      if (vw < 640) {
        const available = Math.min(vw - 24, vh * 0.52);
        setSize(Math.floor(available / 15) * 15);
      }
      // Tablet
      else if (vw < 1024) {
        const available = Math.min(vw * 0.65, vh * 0.55, 480);
        setSize(Math.floor(available / 15) * 15);
      }
      // Desktop
      else {
        const available = Math.min(vw * 0.4, vh * 0.65, 540);
        setSize(Math.floor(available / 15) * 15);
      }
    }

    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  return size;
}
