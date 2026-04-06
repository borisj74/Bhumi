/** Shared manifesto / work-grid reveal */
export const revealEase = [0.22, 1, 0.36, 1] as const;

export const revealContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.12,
      when: 'beforeChildren' as const,
    },
  },
};

export const revealItem = {
  hidden: {
    opacity: 0,
    y: 28,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.85, ease: revealEase },
  },
};

