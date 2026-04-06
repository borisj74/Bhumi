/** Hover preview + parallax for #work-grid (bind after React mounts the grid). */
const TRANSPARENT_PIXEL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

let workPreviewClosing = false;
let workPreviewCloseGen = 0;
let pinnedActiveFrame: HTMLElement | null = null;
let pinnedActiveItem: HTMLElement | null = null;

let parallaxTarget = { x: 0, y: 0 };
let parallaxCurrent = { x: 0, y: 0 };
let parallaxRafId: number | null = null;
const lastMouse = { x: 0, y: 0 };
const PARALLAX_LERP = 0.032;
const PARALLAX_EXTENT = 0.9;
const PARALLAX_MAX_PX = 42;
const BG_SCALE = 1.06;

function getWorkItems(workGrid: HTMLElement): HTMLElement[] {
  return Array.from(workGrid.querySelectorAll<HTMLElement>('.work-item'));
}

function unpinActiveThumbnail(): void {
  if (pinnedActiveFrame) {
    pinnedActiveFrame.classList.remove('work-frame--pinned');
    pinnedActiveFrame.style.cssText = '';
  }
  if (pinnedActiveItem) {
    pinnedActiveItem.style.minHeight = '';
    pinnedActiveItem.style.boxSizing = '';
  }
  pinnedActiveFrame = null;
  pinnedActiveItem = null;
}

function pinActiveThumbnail(frame: HTMLElement): void {
  unpinActiveThumbnail();
  const item = frame.closest('.work-item');
  if (!item || !(item instanceof HTMLElement)) return;
  const rect = frame.getBoundingClientRect();
  item.style.boxSizing = 'border-box';
  item.style.minHeight = `${rect.height}px`;
  frame.classList.add('work-frame--pinned');
  frame.style.position = 'fixed';
  frame.style.top = `${rect.top}px`;
  frame.style.left = `${rect.left}px`;
  frame.style.width = `${rect.width}px`;
  frame.style.height = `${rect.height}px`;
  frame.style.zIndex = '55';
  frame.style.marginLeft = '0';
  frame.style.marginRight = '0';
  frame.style.maxWidth = 'none';
  pinnedActiveFrame = frame;
  pinnedActiveItem = item;
}

function resetParallax(): void {
  parallaxTarget.x = parallaxTarget.y = 0;
  parallaxCurrent.x = parallaxCurrent.y = 0;
  if (parallaxRafId !== null) {
    cancelAnimationFrame(parallaxRafId);
    parallaxRafId = null;
  }
}

function applyBackdropTransform(workBackdropImg: HTMLImageElement): void {
  const mx = -parallaxCurrent.x * PARALLAX_EXTENT * PARALLAX_MAX_PX;
  const my = -parallaxCurrent.y * PARALLAX_EXTENT * PARALLAX_MAX_PX;
  workBackdropImg.style.transform = `translate(calc(-50% + ${mx}px), calc(-50% + ${my}px)) scale(${BG_SCALE})`;
}

function tickParallax(workBackdrop: HTMLElement, workBackdropImg: HTMLImageElement): void {
  parallaxRafId = null;
  if (!workBackdrop.classList.contains('is-visible')) return;
  const t = PARALLAX_LERP;
  parallaxCurrent.x += (parallaxTarget.x - parallaxCurrent.x) * t;
  parallaxCurrent.y += (parallaxTarget.y - parallaxCurrent.y) * t;
  applyBackdropTransform(workBackdropImg);
  const dx = parallaxTarget.x - parallaxCurrent.x;
  const dy = parallaxTarget.y - parallaxCurrent.y;
  if (dx * dx + dy * dy > 1e-6) {
    parallaxRafId = requestAnimationFrame(() => tickParallax(workBackdrop, workBackdropImg));
  }
}

function scheduleParallaxTick(workBackdrop: HTMLElement, workBackdropImg: HTMLImageElement): void {
  if (parallaxRafId === null) {
    parallaxRafId = requestAnimationFrame(() => tickParallax(workBackdrop, workBackdropImg));
  }
}

function setParallaxFromClient(
  workBackdrop: HTMLElement,
  workBackdropImg: HTMLImageElement,
  clientX: number,
  clientY: number
): void {
  parallaxTarget.x = (clientX / window.innerWidth - 0.5) * 2;
  parallaxTarget.y = (clientY / window.innerHeight - 0.5) * 2;
  scheduleParallaxTick(workBackdrop, workBackdropImg);
}

function resetWorkPreviewState(
  workBackdrop: HTMLElement,
  workGrid: HTMLElement,
  workBackdropImg: HTMLImageElement
): void {
  unpinActiveThumbnail();
  resetParallax();
  workBackdrop.setAttribute('aria-hidden', 'true');
  workGrid.classList.remove('work-grid--hover');
  document.body.classList.remove('work-preview-active');
  getWorkItems(workGrid).forEach((el) => {
    el.classList.remove('work-item--dimmed', 'work-item--active');
  });
  workBackdropImg.style.transform = `translate(-50%, -50%) scale(${BG_SCALE})`;
  workBackdropImg.src = TRANSPARENT_PIXEL;
}

function closeWorkPreviewAnimated(
  workBackdrop: HTMLElement,
  workGrid: HTMLElement,
  workBackdropImg: HTMLImageElement
): void {
  if (!workBackdrop.classList.contains('is-visible') || workPreviewClosing) return;
  workPreviewClosing = true;
  const myGen = ++workPreviewCloseGen;

  function finish(): void {
    if (myGen !== workPreviewCloseGen) return;
    workPreviewClosing = false;
    resetWorkPreviewState(workBackdrop, workGrid, workBackdropImg);
  }

  function onEnd(e: TransitionEvent): void {
    if (e.propertyName !== 'opacity') return;
    workBackdrop.removeEventListener('transitionend', onEnd);
    window.clearTimeout(fallbackId);
    finish();
  }

  const fallbackId = window.setTimeout(() => {
    workBackdrop.removeEventListener('transitionend', onEnd);
    finish();
  }, 800);

  workBackdrop.addEventListener('transitionend', onEnd);
  workBackdrop.classList.remove('is-visible');
}

export function closeWorkPreviewInstant(
  workBackdrop: HTMLElement,
  workGrid: HTMLElement,
  workBackdropImg: HTMLImageElement
): void {
  workPreviewCloseGen++;
  workPreviewClosing = false;
  if (workBackdrop.classList.contains('is-visible')) {
    workBackdrop.classList.add('work-hover-backdrop--instant');
    workBackdrop.classList.remove('is-visible');
    void workBackdrop.offsetHeight;
  }
  resetWorkPreviewState(workBackdrop, workGrid, workBackdropImg);
  requestAnimationFrame(() => {
    workBackdrop.classList.remove('work-hover-backdrop--instant');
  });
}

function updateBackdropParallax(
  workBackdrop: HTMLElement,
  workBackdropImg: HTMLImageElement,
  e: MouseEvent
): void {
  if (!workBackdrop.classList.contains('is-visible')) return;
  setParallaxFromClient(workBackdrop, workBackdropImg, e.clientX, e.clientY);
}

let teardown: (() => void) | undefined;

/** Call once after #work-grid exists in the DOM. Returns cleanup for StrictMode / HMR. */
export function initWorkPage(): () => void {
  teardown?.();

  const workGridWrap = document.getElementById('work-grid-wrap');
  const workGrid = document.getElementById('work-grid');
  const workBackdrop = document.getElementById('work-hover-backdrop');
  const workBackdropImg = document.getElementById('work-hover-backdrop-img');

  if (!workGrid || !workBackdrop || !workBackdropImg || !(workBackdropImg instanceof HTMLImageElement)) {
    return () => undefined;
  }

  workBackdropImg.style.transform = `translate(-50%, -50%) scale(${BG_SCALE})`;

  const onMouseOver = (e: MouseEvent): void => {
    const frame = (e.target as Element | null)?.closest?.('.work-frame');
    if (!frame || !(frame instanceof HTMLElement)) return;
    const item = frame.closest('.work-item');
    if (!item) return;
    const thumb = frame.querySelector('img');
    if (!thumb || !thumb.src) return;
    workBackdropImg.src = thumb.currentSrc || thumb.src;
    const cx = typeof e.clientX === 'number' ? e.clientX : lastMouse.x;
    const cy = typeof e.clientY === 'number' ? e.clientY : lastMouse.y;
    parallaxTarget.x = (cx / window.innerWidth - 0.5) * 2;
    parallaxTarget.y = (cy / window.innerHeight - 0.5) * 2;
    parallaxCurrent.x = parallaxTarget.x;
    parallaxCurrent.y = parallaxTarget.y;
    applyBackdropTransform(workBackdropImg);
    workBackdrop.classList.add('is-visible');
    workBackdrop.setAttribute('aria-hidden', 'false');
    workGrid.classList.add('work-grid--hover');
    document.body.classList.add('work-preview-active');
    getWorkItems(workGrid).forEach((el) => {
      if (el === item) {
        el.classList.add('work-item--active');
        el.classList.remove('work-item--dimmed');
      } else {
        el.classList.add('work-item--dimmed');
        el.classList.remove('work-item--active');
      }
    });
    requestAnimationFrame(() => {
      pinActiveThumbnail(frame);
    });
  };

  const onMouseOut = (e: MouseEvent): void => {
    if (!workBackdrop.classList.contains('is-visible')) return;
    if (!(e.target as Element | null)?.closest?.('.work-frame')) return;
    const rel = e.relatedTarget as Node | null;
    if (rel) {
      if (workBackdrop.contains(rel)) return;
      if (rel instanceof Element && rel.closest?.('.work-frame')) return;
    }
    closeWorkPreviewAnimated(workBackdrop, workGrid, workBackdropImg);
  };

  const onDocClick = (): void => {
    if (!workBackdrop.classList.contains('is-visible')) return;
    closeWorkPreviewAnimated(workBackdrop, workGrid, workBackdropImg);
  };

  const onWrapLeave = (): void => {
    if (workBackdrop.classList.contains('is-visible')) {
      closeWorkPreviewAnimated(workBackdrop, workGrid, workBackdropImg);
    }
  };

  const cursorDot = document.querySelector<HTMLElement>('.cursor-dot');
  const cursorOutline = document.querySelector<HTMLElement>('.cursor-outline');

  const onMouseMove = (e: MouseEvent): void => {
    lastMouse.x = e.clientX;
    lastMouse.y = e.clientY;
    const posX = e.clientX;
    const posY = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;
    }
    if (cursorOutline) {
      cursorOutline.animate(
        { left: `${posX}px`, top: `${posY}px` },
        { duration: 500, fill: 'forwards' }
      );
    }
    updateBackdropParallax(workBackdrop, workBackdropImg, e);
  };

  workGrid.addEventListener('mouseover', onMouseOver);
  workGrid.addEventListener('mouseout', onMouseOut);
  document.addEventListener('click', onDocClick);
  workGridWrap?.addEventListener('mouseleave', onWrapLeave);
  window.addEventListener('mousemove', onMouseMove);

  teardown = (): void => {
    workGrid.removeEventListener('mouseover', onMouseOver);
    workGrid.removeEventListener('mouseout', onMouseOut);
    document.removeEventListener('click', onDocClick);
    workGridWrap?.removeEventListener('mouseleave', onWrapLeave);
    window.removeEventListener('mousemove', onMouseMove);
    closeWorkPreviewInstant(workBackdrop, workGrid, workBackdropImg);
    teardown = undefined;
  };

  return () => teardown?.();
}

/** Menu + Escape; closes work preview when opening menu (preview refs optional). */
export function initWorkMenu(): () => void {
  const siteMenuEl = document.getElementById('site-menu');
  const menuOpenBtn = document.getElementById('menu-open');
  const menuCloseBtn = document.getElementById('menu-close');

  if (!siteMenuEl || !menuOpenBtn || !menuCloseBtn) {
    return () => undefined;
  }

  const siteMenu = siteMenuEl;

  const workBackdrop = document.getElementById('work-hover-backdrop');
  const workGrid = document.getElementById('work-grid');
  const workBackdropImg = document.getElementById('work-hover-backdrop-img');
  const canClosePreview =
    workBackdrop !== null &&
    workGrid !== null &&
    workBackdropImg instanceof HTMLImageElement;

  function openSiteMenu(): void {
    if (canClosePreview) {
      closeWorkPreviewInstant(workBackdrop, workGrid, workBackdropImg);
    }
    siteMenu.classList.add('menu-visible');
    siteMenu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
    menuOpenBtn?.setAttribute('aria-expanded', 'true');
    menuCloseBtn?.focus();
  }

  function closeSiteMenu(): void {
    siteMenu.classList.remove('menu-visible');
    siteMenu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    menuOpenBtn?.setAttribute('aria-expanded', 'false');
    menuOpenBtn?.focus();
  }

  const onMenuOpen = (): void => openSiteMenu();
  const onMenuClose = (): void => closeSiteMenu();
  const onLinkClick = (): void => closeSiteMenu();
  const onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && siteMenu.classList.contains('menu-visible')) {
      closeSiteMenu();
    }
  };

  menuOpenBtn?.addEventListener('click', onMenuOpen);
  menuCloseBtn?.addEventListener('click', onMenuClose);
  siteMenu.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', onLinkClick);
  });
  document.addEventListener('keydown', onKey);

  return () => {
    menuOpenBtn?.removeEventListener('click', onMenuOpen);
    menuCloseBtn?.removeEventListener('click', onMenuClose);
    siteMenu.querySelectorAll('a[href]').forEach((link) => {
      link.removeEventListener('click', onLinkClick);
    });
    document.removeEventListener('keydown', onKey);
  };
}
