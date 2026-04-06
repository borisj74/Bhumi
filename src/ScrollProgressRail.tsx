import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { useState } from 'react';

/**
 * Full-viewport vertical progress on the right edge — fills with scroll (Framer Motion).
 * Mirrors the editorial “scroll rail” pattern; pairs with optional hero scroll cue.
 */
export function ScrollProgressRail() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 38,
    restDelta: 0.0005,
  });
  const [percent, setPercent] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setPercent(Math.round(v * 100));
  });

  return (
    <div className="pointer-events-none fixed inset-y-0 right-0 z-[9990] flex w-[2px] justify-center md:w-[3px]">
      <div
        className="relative h-full w-full max-w-[3px] bg-ink/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="Page scroll progress"
      >
        <motion.div
          className="absolute inset-x-0 top-0 h-full origin-top bg-gold"
          style={{ scaleY }}
        />
      </div>
    </div>
  );
}
