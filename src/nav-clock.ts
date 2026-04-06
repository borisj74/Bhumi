/** Paris & New York local times for #site-nav-times (24h, HH:mm). */

const SLOTS = [
  { id: 'site-time-paris', timeZone: 'Europe/Paris' },
  { id: 'site-time-ny', timeZone: 'America/New_York' },
] as const;

const formatter = (timeZone: string) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

const formatters = SLOTS.map((s) => ({ id: s.id, fmt: formatter(s.timeZone) }));

function tick(): void {
  const now = new Date();
  for (const { id, fmt } of formatters) {
    const el = document.getElementById(id);
    if (el) el.textContent = fmt.format(now);
  }
}

export function initNavClock(): void {
  if (!document.getElementById('site-time-paris')) return;
  tick();
  window.setInterval(tick, 1000);
}
