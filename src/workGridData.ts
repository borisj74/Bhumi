import { WORK_PROJECTS } from './workProjects';

export type WorkSlot = {
  articleClass: string;
  imgClass: string;
  /** Optional frame scale — `.work-frame--*` in work.html; empty = default */
  frameClass: string;
  slug: string;
  thumbnail: string;
};

/**
 * Asymmetric 6-col editorial rhythm: mixed spans, staggered vertical offsets,
 * and varied frame scales so tiles do not read as one uniform grid.
 */
const SLOT_LAYOUTS: { articleClass: string; imgClass: string; frameClass: string }[] = [
  { articleClass: 'work-item group md:col-span-2 md:col-start-1 md:mt-0', imgClass: 'w-full aspect-[3/4] object-cover', frameClass: 'work-frame--s' },
  { articleClass: 'work-item group md:col-span-2 md:col-start-5 md:mt-12 lg:mt-28', imgClass: 'w-full aspect-[4/5] object-cover', frameClass: 'work-frame--xl' },
  { articleClass: 'work-item group md:col-span-2 md:col-start-2 md:mt-8 lg:mt-12', imgClass: 'w-full aspect-[2/3] object-cover', frameClass: '' },
  { articleClass: 'work-item group md:col-span-3 md:col-start-4 md:mt-20 lg:mt-28', imgClass: 'w-full aspect-[3/4] object-cover object-top', frameClass: 'work-frame--l' },
  { articleClass: 'work-item group md:col-span-2 md:col-start-1 md:mt-2', imgClass: 'w-full aspect-[3/4] object-cover', frameClass: '' },
  { articleClass: 'work-item group md:col-span-2 md:col-start-3 md:mt-24 lg:mt-36', imgClass: 'w-full aspect-[3/4] object-cover', frameClass: 'work-frame--s' },
  { articleClass: 'work-item group md:col-span-6 md:col-start-1 md:mt-10 lg:mt-16', imgClass: 'w-full aspect-[3/4] object-cover', frameClass: 'work-frame--xl' },
  { articleClass: 'work-item group md:col-span-2 md:col-start-1 md:mt-6', imgClass: 'w-full aspect-[3/4] object-cover', frameClass: 'work-frame--l' },
  { articleClass: 'work-item group md:col-span-2 md:col-start-5 md:mt-0 lg:mt-10', imgClass: 'w-full aspect-[5/7] object-cover', frameClass: 'work-frame--xs' },
  { articleClass: 'work-item group md:col-span-2 md:col-start-3 md:mt-16 lg:mt-24', imgClass: 'w-full aspect-[2/3] object-cover object-top', frameClass: '' },
  { articleClass: 'work-item group md:col-span-4 md:col-start-2 md:mt-28 lg:mt-40', imgClass: 'w-full aspect-[3/4] object-cover', frameClass: 'work-frame--l' },
  { articleClass: 'work-item group md:col-span-2 md:col-start-1 md:mt-0', imgClass: 'w-full aspect-[4/5] object-cover', frameClass: 'work-frame--s' },
  { articleClass: 'work-item group md:col-span-2 md:col-start-3 md:mt-16 lg:mt-24', imgClass: 'w-full aspect-[4/5] object-cover', frameClass: '' },
  { articleClass: 'work-item group md:col-span-2 md:col-start-5 md:mt-10 lg:mt-20', imgClass: 'w-full aspect-[3/4] object-cover', frameClass: 'work-frame--xl' },
];

/** Projects that have a named thumbnail — these appear on the work grid. */
const GRID_PROJECTS = WORK_PROJECTS.slice(0, SLOT_LAYOUTS.length);

export const WORK_GRID_SLOTS: WorkSlot[] = GRID_PROJECTS.map((project, i) => ({
  ...SLOT_LAYOUTS[i],
  slug: project.slug,
  thumbnail: project.thumbnail,
}));

/** Home page preview — same layout language as /work, fewer tiles */
const HOME_GRID_COUNT = 6;
export const HOME_WORK_GRID_SLOTS: WorkSlot[] = GRID_PROJECTS.slice(0, HOME_GRID_COUNT).map((project, i) => ({
  ...SLOT_LAYOUTS[i],
  slug: project.slug,
  thumbnail: project.thumbnail,
}));

export function shuffleArray<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
