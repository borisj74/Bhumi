import { motion, useReducedMotion } from 'framer-motion';
import { revealEase } from './motionPresets';

const LINE_1 = 'Cultivating the next era of sartorial expression.';
const LINE_2 =
  'We operate at the intersection of raw aesthetic tension and commercial dominance.';

const STAGGER = 0.045;

const wordClass =
  'inline-block !text-[#111827] font-sans text-sm sm:text-base md:text-lg lg:text-xl uppercase tracking-[0.15em] md:tracking-[0.2em] leading-[1.65] font-medium drop-shadow-sm';

const hidden = { opacity: 0, y: 18, filter: 'blur(8px)' as const };
const visible = { opacity: 1, y: 0, filter: 'blur(0px)' as const };

function WordLine({
  words,
  startIndex,
  className,
}: {
  words: string[];
  startIndex: number;
  className?: string;
}) {
  return (
    <p
      className={['flex flex-wrap justify-center gap-x-[0.35em] gap-y-2 md:gap-x-[0.4em]', className ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      {words.map((word, i) => {
        const globalIndex = startIndex + i;
        return (
          <motion.span
            key={`${word}-${globalIndex}`}
            className={wordClass}
            style={{ color: '#111827' }}
            initial={hidden}
            whileInView={visible}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              duration: 0.55,
              ease: revealEase,
              delay: globalIndex * STAGGER,
            }}
          >
            {word}
          </motion.span>
        );
      })}
    </p>
  );
}

function ScrollCue() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col items-center gap-3 pb-10 pt-6 md:pb-12 md:pt-8">
      <p className="sr-only">More content below. Scroll the page to continue.</p>
      <span
        className="font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-400"
        aria-hidden
      >
        Scroll
      </span>
      <motion.span
        className="block h-7 w-px origin-top bg-neutral-300"
        aria-hidden
        animate={reduceMotion ? undefined : { scaleY: [0.35, 1, 0.35] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 2.2, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }
        }
      />
    </div>
  );
}

export function ManifestoText() {
  const words1 = LINE_1.trim().split(/\s+/);
  const words2 = LINE_2.trim().split(/\s+/);

  return (
    <div className="relative flex min-h-[100svh] w-full flex-col">
      <div className="flex flex-1 flex-col justify-center px-6 py-16 md:px-12 md:py-24">
        <div
          className="relative mx-auto max-w-[min(100%,42rem)] text-center !text-[#111827] md:max-w-[52rem]"
          style={{ color: '#111827' }}
        >
          <WordLine words={words1} startIndex={0} />
          <WordLine words={words2} startIndex={words1.length} className="mt-8 md:mt-10" />
        </div>
      </div>
      <ScrollCue />
    </div>
  );
}
