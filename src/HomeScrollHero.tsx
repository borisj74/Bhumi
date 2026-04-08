import { useCallback, useEffect, useRef, useState } from 'react';
import { HOME_SCROLL_IMAGES } from './homeScrollImages';
import { renderCarouselFrame } from './lib/editorialCarouselCanvas';
import {
  EDITORIAL_TRANSITION_MS,
  useEditorialCarousel,
} from './hooks/useEditorialCarousel';

const IMG_W = 460;
const IMG_H = 600;

export function HomeScrollHero() {
  const n = HOME_SCROLL_IMAGES.length;

  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const rafRef = useRef<number | null>(null);

  const [imagesReady, setImagesReady] = useState(false);
  const [committedIndex, setCommittedIndex] = useState(0);
  const committedRef = useRef(0);
  const [cssSize, setCssSize] = useState({ w: IMG_W, h: IMG_H });

  const transitionRef = useRef<{ from: number; to: number; start: number } | null>(null);
  const [transitionToken, setTransitionToken] = useState(0);

  const interactionRef = useRef({
    transitioning: false,
    lastSlideCompletedAt: 0,
  });

  const onIndexChange = useCallback((next: number) => {
    if (interactionRef.current.transitioning) return;
    const from = committedRef.current;
    if (from === next) return;
    interactionRef.current.transitioning = true;
    transitionRef.current = { from, to: next, start: performance.now() };
    setTransitionToken((t) => t + 1);
  }, []);

  const { goNext, goPrev } = useEditorialCarousel(sectionRef, {
    imageCount: n,
    onIndexChange,
    isReady: imagesReady && n > 0,
    interactionRef,
  });

  useEffect(() => {
    let active = true;
    const imgs: HTMLImageElement[] = HOME_SCROLL_IMAGES.map((src) => {
      const img = new Image();
      img.src = src;
      img.decoding = 'async';
      return img;
    });
    imagesRef.current = imgs;

    let remaining = imgs.length;
    const check = () => {
      remaining -= 1;
      if (remaining <= 0 && active) setImagesReady(true);
    };

    imgs.forEach((img) => {
      if (img.complete && img.naturalWidth > 0) {
        check();
      } else {
        img.onload = () => check();
        img.onerror = () => check();
      }
    });

    return () => {
      active = false;
      imgs.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, []);

  useEffect(() => {
    const wrap = containerRef.current;
    if (!wrap) return;

    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (!cr) return;
      setCssSize({ w: cr.width, h: cr.height });
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imagesReady) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const { w: cw, h: ch } = cssSize;

    canvas.width = Math.max(1, Math.round(cw * dpr));
    canvas.height = Math.max(1, Math.round(ch * dpr));

    const drawStatic = () => {
      const imgs = imagesRef.current;
      const img = imgs[committedRef.current] ?? null;
      renderCarouselFrame(ctx, {
        cssWidth: cw,
        cssHeight: ch,
        transitionT: 0,
        isTransitioning: false,
        staticImg: img,
        outgoingImg: null,
        incomingImg: null,
      });
    };

    const loop = () => {
      const tr = transitionRef.current;
      if (!tr) {
        drawStatic();
        rafRef.current = null;
        return;
      }

      const elapsed = performance.now() - tr.start;
      const linearT = Math.min(1, elapsed / EDITORIAL_TRANSITION_MS);
      const imgs = imagesRef.current;

      renderCarouselFrame(ctx, {
        cssWidth: cw,
        cssHeight: ch,
        transitionT: linearT,
        isTransitioning: true,
        staticImg: null,
        outgoingImg: imgs[tr.from] ?? null,
        incomingImg: imgs[tr.to] ?? null,
      });

      if (linearT >= 1) {
        committedRef.current = tr.to;
        setCommittedIndex(tr.to);
        transitionRef.current = null;
        interactionRef.current.transitioning = false;
        interactionRef.current.lastSlideCompletedAt = performance.now();
        renderCarouselFrame(ctx, {
          cssWidth: cw,
          cssHeight: ch,
          transitionT: 0,
          isTransitioning: false,
          staticImg: imgs[committedRef.current] ?? null,
          outgoingImg: null,
          incomingImg: null,
        });
        rafRef.current = null;
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (transitionRef.current) {
      rafRef.current = requestAnimationFrame(loop);
    } else {
      drawStatic();
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [cssSize, imagesReady, transitionToken]);

  useEffect(() => {
    const onResize = () => {
      const wrap = containerRef.current;
      if (!wrap) return;
      const r = wrap.getBoundingClientRect();
      setCssSize({ w: r.width, h: r.height });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const hero = sectionRef.current;
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const vh = window.innerHeight;
      const visible = rect.top < vh * 0.85 && rect.bottom > vh * 0.15;
      if (!visible) return;
      e.preventDefault();
      if (e.key === 'ArrowRight') goNext();
      else goPrev();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  const labelId = 'home-scroll-hero-label';

  return (
    <section
      ref={sectionRef}
      tabIndex={0}
      className="relative flex min-h-[100dvh] min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-[#F4F4F0] py-24 md:py-32"
      aria-labelledby={labelId}
    >
      <h2 id={labelId} className="sr-only">
        Featured imagery — use scroll wheel, swipe, or arrow keys to explore
      </h2>
      <p className="sr-only" aria-live="polite">
        Slide {committedIndex + 1} of {n}
      </p>
      <div
        ref={containerRef}
        className="relative w-[min(460px,85vw)]"
        style={{ aspectRatio: `${IMG_W} / ${IMG_H}` }}
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Editorial image ${committedIndex + 1} of ${n}`}
          className="block h-full w-full"
        />
        <a
          href="/work.html"
          className="absolute inset-0 z-10 block"
          aria-label="View work"
        >
          <span className="sr-only">View work</span>
        </a>
      </div>
    </section>
  );
}
