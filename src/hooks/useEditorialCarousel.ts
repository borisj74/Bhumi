import { useCallback, useEffect, useRef, type MutableRefObject, type RefObject } from 'react';

export const EDITORIAL_WHEEL_THRESHOLD = 100;
export const EDITORIAL_COOLDOWN_MS = 800;
export const EDITORIAL_WHEEL_RESET_MS = 150;
export const EDITORIAL_SWIPE_THRESHOLD_PX = 50;
export const EDITORIAL_AUTO_MS = 5000;
/** Canvas slide crossfade / reveal duration (ease-out quint applied in renderer). */
export const EDITORIAL_TRANSITION_MS = 700;

export type EditorialInteractionState = {
  /** True while canvas transition is running — block wheel/swipe */
  transitioning: boolean;
  /** Set when a slide transition completes; used for cooldown */
  lastSlideCompletedAt: number;
};

export type EditorialCarouselOptions = {
  imageCount: number;
  onIndexChange: (index: number) => void;
  isReady: boolean;
  /** Updated by the canvas layer when transitions start/end */
  interactionRef: MutableRefObject<EditorialInteractionState>;
  /** Current slide index (must match canvas after each transition) */
  getCommittedIndex: () => number;
  /**
   * Sticky hero section — when in view, wheel advances slides instead of the page
   * until the last slide; then scroll reaches Selected Clients.
   */
  scrollLockSectionRef: RefObject<HTMLElement | null>;
};

export type EditorialCarouselControls = {
  goNext: () => void;
  goPrev: () => void;
  resetAutoAdvance: () => void;
};

function isHeroScrollLockActive(section: HTMLElement): boolean {
  const rect = section.getBoundingClientRect();
  const vh = window.innerHeight;
  return rect.top <= 12 && rect.bottom >= vh * 0.52;
}

/**
 * Wheel capture, accumulation + threshold, cooldown, touch swipe, auto-advance.
 * With `scrollLockSectionRef`, document wheel is captured while the sticky hero
 * dominates the viewport so the page does not scroll until the last slide.
 */
export function useEditorialCarousel(
  containerRef: RefObject<HTMLElement | null>,
  {
    imageCount,
    onIndexChange,
    isReady,
    interactionRef,
    getCommittedIndex,
    scrollLockSectionRef,
  }: EditorialCarouselOptions
): EditorialCarouselControls {
  const indexRef = useRef(0);
  const wheelAccumRef = useRef(0);
  const lastWheelEventAtRef = useRef(0);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const clearAutoTimer = useCallback(() => {
    if (autoTimerRef.current !== null) {
      clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }, []);

  const scheduleAutoAdvance = useCallback(() => {
    clearAutoTimer();
    if (imageCount <= 1 || !isReady) return;

    const tick = (): void => {
      indexRef.current = getCommittedIndex();
      const { transitioning } = interactionRef.current;
      if (transitioning) {
        autoTimerRef.current = window.setTimeout(tick, 80);
        return;
      }
      if (indexRef.current >= imageCount - 1) {
        autoTimerRef.current = window.setTimeout(tick, EDITORIAL_AUTO_MS);
        return;
      }
      const next = indexRef.current + 1;
      indexRef.current = next;
      onIndexChange(next);
      autoTimerRef.current = window.setTimeout(tick, EDITORIAL_AUTO_MS);
    };

    autoTimerRef.current = window.setTimeout(tick, EDITORIAL_AUTO_MS);
  }, [clearAutoTimer, getCommittedIndex, imageCount, interactionRef, isReady, onIndexChange]);

  const resetAutoAdvance = useCallback(() => {
    scheduleAutoAdvance();
  }, [scheduleAutoAdvance]);

  useEffect(() => {
    if (!isReady || imageCount <= 0) return;
    scheduleAutoAdvance();
    return clearAutoTimer;
  }, [clearAutoTimer, imageCount, isReady, scheduleAutoAdvance]);

  const canNavigate = useCallback(() => {
    const { transitioning, lastSlideCompletedAt } = interactionRef.current;
    if (transitioning || imageCount <= 1) return false;
    const now = performance.now();
    if (lastSlideCompletedAt > 0 && now - lastSlideCompletedAt < EDITORIAL_COOLDOWN_MS) {
      return false;
    }
    return true;
  }, [imageCount, interactionRef]);

  const tryNavigate = useCallback(
    (delta: -1 | 1) => {
      if (!isReady || !canNavigate()) return false;
      const idx = getCommittedIndex();
      const next = idx + delta;
      if (next < 0 || next >= imageCount) return false;
      indexRef.current = next;
      onIndexChange(next);
      resetAutoAdvance();
      return true;
    },
    [canNavigate, getCommittedIndex, imageCount, isReady, onIndexChange, resetAutoAdvance]
  );

  const goNext = useCallback(() => {
    void tryNavigate(1);
  }, [tryNavigate]);

  const goPrev = useCallback(() => {
    void tryNavigate(-1);
  }, [tryNavigate]);

  useEffect(() => {
    const section = scrollLockSectionRef.current;
    if (!isReady || !section) return;

    const onWheel = (e: WheelEvent): void => {
      if (!isHeroScrollLockActive(section)) return;

      const idx = getCommittedIndex();
      indexRef.current = idx;

      if (interactionRef.current.transitioning) {
        e.preventDefault();
        return;
      }

      const downIntent = e.deltaY > 0;
      const upIntent = e.deltaY < 0;

      if (downIntent && idx >= imageCount - 1) return;
      if (upIntent && idx <= 0) return;

      e.preventDefault();

      if (!canNavigate()) return;

      const now = performance.now();
      if (now - lastWheelEventAtRef.current > EDITORIAL_WHEEL_RESET_MS) {
        wheelAccumRef.current = 0;
      }
      lastWheelEventAtRef.current = now;
      wheelAccumRef.current += e.deltaY;

      if (Math.abs(wheelAccumRef.current) < EDITORIAL_WHEEL_THRESHOLD) return;

      const dir = wheelAccumRef.current > 0 ? 1 : -1;
      wheelAccumRef.current = 0;

      const next = idx + dir;
      if (next < 0 || next >= imageCount || next === idx) return;
      indexRef.current = next;
      onIndexChange(next);
      resetAutoAdvance();
    };

    window.addEventListener('wheel', onWheel, { passive: false, capture: true });

    return () => {
      window.removeEventListener('wheel', onWheel, { capture: true });
    };
  }, [
    canNavigate,
    getCommittedIndex,
    imageCount,
    interactionRef,
    isReady,
    onIndexChange,
    resetAutoAdvance,
    scrollLockSectionRef,
  ]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isReady) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchStartYRef.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartYRef.current === null) return;
      const endY = e.changedTouches[0]?.clientY;
      if (endY === undefined) {
        touchStartYRef.current = null;
        return;
      }
      const dy = touchStartYRef.current - endY;
      touchStartYRef.current = null;
      if (Math.abs(dy) < EDITORIAL_SWIPE_THRESHOLD_PX) return;
      if (!canNavigate()) return;

      const idx = getCommittedIndex();
      indexRef.current = idx;
      const dir = dy > 0 ? 1 : -1;
      const next = idx + dir;
      if (next < 0 || next >= imageCount) return;
      indexRef.current = next;
      onIndexChange(next);
      resetAutoAdvance();
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [canNavigate, containerRef, getCommittedIndex, imageCount, isReady, onIndexChange, resetAutoAdvance]);

  return {
    goNext,
    goPrev,
    resetAutoAdvance,
  };
}
