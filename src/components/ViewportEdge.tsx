"use client";

import { useEffect, useRef, useState } from "react";
import { ProgressiveBlur } from "./ProgressiveBlur";

/** How close to the end of the page the blur switches off, in px. */
const END_ZONE = 24;
/** Scroll distance that counts as a change of direction, in px. */
const DIRECTION_THRESHOLD = 6;
/** Matches the --pb-on fade in globals.css. */
const FADE_MS = 400;
/** The phone nav bar; the hero counts as "on screen" while any of it shows
 *  below the bar. */
const NAV_HEIGHT = 76;

/**
 * Fixed strip at the bottom of the viewport where content blurs out as it
 * leaves the screen.
 *
 * Desktop: always on, except at the very end of the page.
 * Touch devices: only while scrolling down, and never while the hero is on
 * screen. iOS Safari colours the area behind its floating toolbar from any
 * fixed element at the bottom edge, which hid the About section's dark red
 * there; when the strip is not needed it is removed entirely, so Safari shows
 * the page through its toolbar. Scrolling down also shrinks Safari's toolbar,
 * which is when the strip reads best.
 */
export function ViewportEdge() {
  const [atEnd, setAtEnd] = useState(false);
  // Read on the first client render so a phone never briefly gets the strip
  // (the value is only used in effects, so it cannot cause a hydration
  // mismatch).
  const [touch, setTouch] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches,
  );
  const [scrollingDown, setScrollingDown] = useState(false);
  const [heroOnScreen, setHeroOnScreen] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  // Touch-device detection (phones and tablets).
  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    const update = () => setTouch(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // End of page and scroll direction.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const doc = document.documentElement;
      setAtEnd(y + window.innerHeight >= doc.scrollHeight - END_ZONE);
      const dy = y - lastY;
      if (Math.abs(dy) >= DIRECTION_THRESHOLD) {
        setScrollingDown(dy > 0);
        lastY = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Whether any of the hero is still visible below the nav bar.
  useEffect(() => {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const io = new IntersectionObserver(
      ([entry]) => setHeroOnScreen(entry.isIntersecting),
      { rootMargin: `-${NAV_HEIGHT}px 0px 0px 0px` },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  const visible = !atEnd && (!touch || (scrollingDown && !heroOnScreen));

  // Show: put it back in the page, then fade in on the next frame.
  // Hide: fade out, then (on touch devices) remove it from the page.
  // Driven on the element directly so the fade can finish before removal.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (visible) {
      el.dataset.gone = "false";
      const frame = requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          el.dataset.off = "false";
        }),
      );
      return () => cancelAnimationFrame(frame);
    }
    el.dataset.off = "true";
    if (!touch) return;
    const timer = setTimeout(() => {
      el.dataset.gone = "true";
    }, FADE_MS);
    return () => clearTimeout(timer);
  }, [visible, touch]);

  return (
    // Starts hidden and removed; the effect above brings it in when wanted,
    // so a phone opening on the hero never has the strip at all.
    <div ref={ref} className="viewport-edge" data-off="true" data-gone="true">
      <ProgressiveBlur towards="bottom" className="absolute inset-0" />
    </div>
  );
}
