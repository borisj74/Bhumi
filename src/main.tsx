import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HomeClients } from './HomeClients';
import { HomeScrollHero } from './HomeScrollHero';
import { ManifestoText } from './ManifestoText';
import { ScrollProgressRail } from './ScrollProgressRail';
import { initNavClock } from './nav-clock';

initNavClock();

const scrollRailRoot = document.getElementById('scroll-progress-root');
if (scrollRailRoot) {
  createRoot(scrollRailRoot).render(
    <StrictMode>
      <ScrollProgressRail />
    </StrictMode>
  );
}

const homeHeroRoot = document.getElementById('home-scroll-hero-root');
if (homeHeroRoot) {
  createRoot(homeHeroRoot).render(
    <StrictMode>
      <HomeScrollHero />
    </StrictMode>
  );
}

const manifestoRoot = document.getElementById('manifesto-text-root');
if (manifestoRoot) {
  createRoot(manifestoRoot).render(
    <StrictMode>
      <ManifestoText />
    </StrictMode>
  );
}

const homeClientsRoot = document.getElementById('home-clients-root');
if (homeClientsRoot) {
  createRoot(homeClientsRoot).render(
    <StrictMode>
      <HomeClients />
    </StrictMode>
  );
}

