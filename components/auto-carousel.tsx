'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Pause, Play } from 'lucide-react';

/**
 * On phones (CSS turns the wrapped grid into a sideways, snapping row), this
 * advances one card every few seconds and loops back at the end. A visible
 * Pause button stops it, and it stops for good once the visitor swipes or
 * taps the row. It waits while the row is focused, off-screen, or the tab is
 * hidden, and never moves for visitors who ask for reduced motion. Larger
 * screens keep the normal grid, so nothing moves there.
 */
export function AutoCarousel({
  className,
  label,
  children,
  interval = 4500,
}: {
  className: string;
  label: string;
  children: ReactNode;
  interval?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const row = ref.current;
    if (!row || !playing) return;
    const phone = window.matchMedia('(max-width: 640px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let onScreen = false;
    const stop = () => setPlaying(false);
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
      },
      { threshold: 0.6 },
    );
    observer.observe(row);
    const timer = window.setInterval(() => {
      if (
        !phone.matches ||
        reducedMotion.matches ||
        !onScreen ||
        document.hidden ||
        row.contains(document.activeElement)
      )
        return;
      const card = row.firstElementChild as HTMLElement | null;
      if (!card) return;
      const step = card.getBoundingClientRect().width + (parseFloat(getComputedStyle(row).columnGap) || 0);
      const atEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4;
      row.scrollTo({ left: atEnd ? 0 : row.scrollLeft + step, behavior: 'smooth' });
    }, interval);
    row.addEventListener('pointerdown', stop);
    row.addEventListener('touchstart', stop, { passive: true });
    row.addEventListener('wheel', stop, { passive: true });
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      row.removeEventListener('pointerdown', stop);
      row.removeEventListener('touchstart', stop);
      row.removeEventListener('wheel', stop);
    };
  }, [interval, playing]);

  return (
    <>
      <section ref={ref} className={className} aria-label={label}>
        {children}
      </section>
      <button
        type="button"
        className="carousel-pause"
        onClick={() => setPlaying((value) => !value)}
      >
        {playing ? <Pause size={14} /> : <Play size={14} />}
        {/* Keyed: translated pages freeze text that changes in place. */}
        <span key={playing ? 'pause' : 'play'}>{playing ? 'Pause' : 'Play'}</span>
      </button>
    </>
  );
}
