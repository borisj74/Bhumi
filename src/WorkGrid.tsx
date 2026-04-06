import { motion, useReducedMotion } from 'framer-motion';
import type { WorkSlot } from './workGridData';
import { WORK_GRID_SLOTS } from './workGridData';
import { revealEase } from './motionPresets';

const gridSectionClass =
  'w-full max-w-none mx-auto px-6 md:px-10 lg:px-14 grid grid-cols-1 md:grid-cols-6 gap-x-5 md:gap-x-8 lg:gap-x-12 gap-y-16 md:gap-y-[4.25rem] lg:gap-y-28';

const STAGGER = 0.052;
const TILE_DURATION = 0.68;

export type WorkGridProps = {
  id?: string;
  slots?: WorkSlot[];
  className?: string;
};

function TileLink({ slot }: { slot: WorkSlot }) {
  return (
    <a
      href={`work-item.html?project=${encodeURIComponent(slot.slug)}`}
      className="block"
      aria-label={`View ${slot.slug} project`}
    >
      <div className={['work-frame relative overflow-hidden', slot.frameClass].filter(Boolean).join(' ')}>
        <img src={slot.thumbnail} alt={slot.slug} className={slot.imgClass} loading="eager" decoding="async" />
      </div>
    </a>
  );
}

export function WorkGrid({ id = 'work-grid', slots = WORK_GRID_SLOTS, className = '' }: WorkGridProps) {
  const prefersReducedMotion = useReducedMotion();
  const sectionClass = [gridSectionClass, className].filter(Boolean).join(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: STAGGER,
        delayChildren: 0.08,
      },
    },
  };

  const tileVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: TILE_DURATION,
        ease: revealEase,
      },
    },
  };

  if (prefersReducedMotion) {
    return (
      <section id={id} className={sectionClass}>
        {slots.map((slot) => (
          <article key={slot.slug} className={slot.articleClass}>
            <TileLink slot={slot} />
          </article>
        ))}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      className={sectionClass}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-8% 0px -12% 0px', amount: 0.12 }}
    >
      {slots.map((slot) => (
        <motion.article key={slot.slug} variants={tileVariants} className={slot.articleClass}>
          <TileLink slot={slot} />
        </motion.article>
      ))}
    </motion.section>
  );
}
