import './index.css';
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { WorkGrid } from './WorkGrid';
import { initWorkMenu, initWorkPage } from './work-hover';
import { initNavClock } from './nav-clock';

/** Menu must not depend on React — initWorkMenu only ran in useEffect before, so a failed mount meant no menu. */
initWorkMenu();
initNavClock();

function WorkApp() {
  useEffect(() => {
    let cleanupGrid: (() => void) | undefined;
    const id = window.requestAnimationFrame(() => {
      cleanupGrid = initWorkPage();
    });
    return () => {
      window.cancelAnimationFrame(id);
      cleanupGrid?.();
    };
  }, []);

  return <WorkGrid />;
}

const root = document.getElementById('work-grid-root');
if (root) {
  createRoot(root).render(<WorkApp />);
}
