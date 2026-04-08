/** Ease-out quint: t ∈ [0,1] → [0,1] */
export function easeOutQuint(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return 1 - (1 - x) ** 5;
}

export type CoverRect = { x: number; y: number; w: number; h: number };

/**
 * Object-fit: cover — image centered in container (CSS pixel space).
 */
export function computeCoverRect(
  imgW: number,
  imgH: number,
  containerW: number,
  containerH: number
): CoverRect {
  if (imgW <= 0 || imgH <= 0 || containerW <= 0 || containerH <= 0) {
    return { x: 0, y: 0, w: containerW, h: containerH };
  }
  const s = Math.max(containerW / imgW, containerH / imgH);
  const w = imgW * s;
  const h = imgH * s;
  const x = (containerW - w) / 2;
  const y = (containerH - h) / 2;
  return { x, y, w, h };
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  iw: number,
  ih: number,
  containerW: number,
  containerH: number,
  globalAlpha = 1
): void {
  const { x, y, w, h } = computeCoverRect(iw, ih, containerW, containerH);
  const prev = ctx.globalAlpha;
  ctx.globalAlpha = prev * globalAlpha;
  ctx.drawImage(img, x, y, w, h);
  ctx.globalAlpha = prev;
}

export type CarouselRenderArgs = {
  cssWidth: number;
  cssHeight: number;
  /** Linear 0–1 time within transition; eased inside renderer */
  transitionT: number;
  isTransitioning: boolean;
  /** Current slide when idle */
  staticImg: HTMLImageElement | null;
  outgoingImg: HTMLImageElement | null;
  incomingImg: HTMLImageElement | null;
};

/**
 * Renders one frame: idle = single cover image; transition = outgoing fade + incoming reveal (clip + scale).
 */
export function renderCarouselFrame(ctx: CanvasRenderingContext2D, args: CarouselRenderArgs): void {
  const {
    cssWidth: cw,
    cssHeight: ch,
    transitionT,
    isTransitioning,
    staticImg,
    outgoingImg,
    incomingImg,
  } = args;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const dpr = ctx.canvas.width / cw;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  ctx.fillStyle = '#F4F4F0';
  ctx.fillRect(0, 0, cw, ch);

  if (!isTransitioning) {
    if (staticImg?.complete && staticImg.naturalWidth > 0) {
      drawCoverImage(ctx, staticImg, staticImg.naturalWidth, staticImg.naturalHeight, cw, ch, 1);
    }
    return;
  }

  if (!outgoingImg || !incomingImg) return;

  const ow = outgoingImg.naturalWidth;
  const oh = outgoingImg.naturalHeight;
  const iw = incomingImg.naturalWidth;
  const ih = incomingImg.naturalHeight;

  if (ow <= 0 || oh <= 0 || iw <= 0 || ih <= 0) return;

  const p = easeOutQuint(transitionT);

  drawCoverImage(ctx, outgoingImg, ow, oh, cw, ch, 1 - p);

  const insetEach = 0.5 * (1 - p);
  const clipX = cw * insetEach;
  const clipY = ch * insetEach;
  const clipW = cw - 2 * clipX;
  const clipH = ch - 2 * clipY;

  ctx.save();
  ctx.beginPath();
  ctx.rect(clipX, clipY, clipW, clipH);
  ctx.clip();

  const scale = 1.3 + (1 - 1.3) * p;
  ctx.translate(cw / 2, ch / 2);
  ctx.scale(scale, scale);
  ctx.translate(-cw / 2, -ch / 2);
  drawCoverImage(ctx, incomingImg, iw, ih, cw, ch, 1);
  ctx.restore();
}
