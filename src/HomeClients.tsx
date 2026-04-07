import { motion, useReducedMotion } from 'framer-motion';
import { HOME_CLIENT_NAMES } from './homeClientNames';
import { CLIENT_HOVER_IMAGES } from './clientHoverImages';
import { revealEase } from './motionPresets';

const gridClass =
  'grid grid-cols-1 sm:grid-cols-3 gap-x-16 gap-y-5 md:gap-y-6 font-sans text-xs tracking-widest uppercase text-gray-900 sm:w-fit';

function ClientNamePeek({ name, imageSrc }: { name: string; imageSrc: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      className="group relative inline-block cursor-default"
      title={name}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      transition={{ duration: 0.38, ease: revealEase }}
    >
      <span className="relative z-10">{name}</span>
      {!reduceMotion && (
        <span
          className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 block h-[135px] w-[108px] -translate-x-1/2 overflow-hidden opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 translate-y-1"
          aria-hidden
        >
          <img
            src={imageSrc}
            alt=""
            width={108}
            height={135}
            className="block h-[135px] w-[108px] scale-105 object-cover object-center transition-transform duration-500 ease-out group-hover:scale-100"
            loading="eager"
            decoding="async"
          />
        </span>
      )}
    </motion.span>
  );
}

/**
 * Selected clients — hover reveals a small image peek from `public/imgs/` (no shadow).
 */
export function HomeClients() {
  return (
    <div className={gridClass}>
      {HOME_CLIENT_NAMES.map((name, i) => (
        <ClientNamePeek key={name} name={name} imageSrc={CLIENT_HOVER_IMAGES[i]!} />
      ))}
    </div>
  );
}
