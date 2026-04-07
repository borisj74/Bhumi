import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { HOME_SCROLL_IMAGES } from './homeScrollImages';

const IMG_W = 460;
const IMG_H = 600;

function ScrollImage({
  src,
  index,
  total,
  scrollYProgress,
}: {
  src: string;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const segStart = index / total;
  const segEnd = (index + 1) / total;
  const isFirst = index === 0;

  // Scale from center: card grows from 0.65 → 1 over its scroll segment
  const scale = useTransform(
    scrollYProgress,
    [segStart, segEnd],
    isFirst ? [1, 1] : [0.65, 1],
  );

  // Hard snap: image is invisible before its segment, fully visible after
  const opacity = useTransform(scrollYProgress, (v) => {
    if (isFirst) return 1;
    return v >= segStart ? 1 : 0;
  });

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ zIndex: index, opacity }}
    >
      <a
        href="/work.html"
        className="block"
        aria-label="View work"
      >
        <motion.div
          className="relative overflow-hidden will-change-transform"
          style={{
            scale,
            width: `min(${IMG_W}px, 85vw)`,
            aspectRatio: `${IMG_W} / ${IMG_H}`,
          }}
        >
          <img
            src={src}
            alt=""
            className="block h-full w-full object-cover"
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
          />
        </motion.div>
      </a>
    </motion.div>
  );
}

/**
 * Scroll hero: tall scroll track, single sticky viewport.
 * Each image snaps in and scales from 0.65 → 1 from its center point
 * as you scroll into its segment. Spring-smoothed progress adds inertia.
 */
export function HomeScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const n = HOME_SCROLL_IMAGES.length;
  const { scrollYProgress: rawProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const scrollYProgress = useSpring(rawProgress, {
    stiffness: 80,
    damping: 22,
    restDelta: 0.0005,
  });

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${n * 100}vh` }}
      aria-label="Featured imagery — scroll to explore"
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-[#F4F4F0]">
        {HOME_SCROLL_IMAGES.map((src, i) => (
          <ScrollImage
            key={src}
            src={src}
            index={i}
            total={n}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
}
