import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
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
  const scale = useTransform(
    scrollYProgress,
    [segStart, segEnd],
    isFirst ? [1, 1] : [0.5, 1],
  );
  const borderRadius = useTransform(
    scrollYProgress,
    [segStart, segEnd],
    isFirst ? [0, 0] : [12, 0],
  );

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
            borderRadius,
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
 * Jules Mesnil–style scroll hero: tall scroll track, single sticky viewport.
 * Images layer and grow from ~50 % → 100 % scale at a fixed 460 × 600 target
 * size, centered on an off-white (#F4F4F0) background.
 */
export function HomeScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const n = HOME_SCROLL_IMAGES.length;
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
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
