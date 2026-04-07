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

  /**
   * Jules Mesnil–style: clip-path wipe from bottom to top.
   * inset(100% 0% 0% 0%) = element fully hidden (top inset = 100%)
   * inset(0%   0% 0% 0%) = element fully visible
   * As the top inset decreases from 100% → 0% the visible area
   * grows upward from the bottom edge — exactly the curtain-rise feel.
   */
  const clipPath = useTransform(
    scrollYProgress,
    [segStart, segEnd],
    isFirst
      ? ['inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)']
      : ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
  );

  /**
   * The image inside the clip region scales from slightly zoomed-in
   * to 1:1 as it settles into place — gives a weighted, cinematic feel.
   */
  const imgScale = useTransform(
    scrollYProgress,
    [segStart, segEnd],
    isFirst ? [1, 1] : [1.12, 1],
  );

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ zIndex: index }}
    >
      <a
        href="/work.html"
        className="block"
        aria-label="View work"
      >
        <motion.div
          className="relative overflow-hidden will-change-transform"
          style={{
            clipPath,
            width: `min(${IMG_W}px, 85vw)`,
            aspectRatio: `${IMG_W} / ${IMG_H}`,
          }}
        >
          <motion.img
            src={src}
            alt=""
            className="block h-full w-full object-cover"
            style={{ scale: imgScale }}
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
 * Each image reveals with a bottom-to-top clip-path wipe as you scroll into
 * its segment, with the inner image scaling from 1.12 → 1 for a cinematic settle.
 * Spring-smoothed scroll progress adds natural inertia throughout.
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
