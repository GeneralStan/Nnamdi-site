"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";

const RailContext = createContext<RefObject<HTMLDivElement | null> | null>(
  null,
);

/** The scrolling rail element, for cards whose motion follows its scroll. */
export function useRail() {
  return useContext(RailContext);
}

type DragScrollProps = {
  label: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * Horizontal rail. Touch devices use native swipe + snap; with a mouse the
 * rail can be dragged and glides to a stop. Arrow keys work when focused.
 */
export function DragScroll({
  label,
  className = "",
  style,
  children,
}: DragScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let pressed = false;
    let dragged = false;
    let startX = 0;
    let startLeft = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0; // px per ms
    let raf = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      cancelAnimationFrame(raf);
      pressed = true;
      dragged = false;
      startX = lastX = e.clientX;
      startLeft = el.scrollLeft;
      lastT = performance.now();
      velocity = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pressed) return;
      const dx = e.clientX - startX;
      if (!dragged) {
        if (Math.abs(dx) < 5) return;
        dragged = true;
        el.setPointerCapture(e.pointerId);
        el.dataset.dragging = "true";
      }
      el.scrollLeft = startLeft - dx;

      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) {
        velocity = 0.75 * ((e.clientX - lastX) / dt) + 0.25 * velocity;
        lastX = e.clientX;
        lastT = now;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!pressed) return;
      pressed = false;
      if (!dragged) return;
      delete el.dataset.dragging;
      if (el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId);
      }
      // No glide if the pointer had come to rest before release.
      if (reduceMotion || performance.now() - lastT > 80) return;

      velocity = Math.max(-2.5, Math.min(2.5, velocity));
      let prev = performance.now();
      const glide = (t: number) => {
        const dt = t - prev;
        prev = t;
        el.scrollLeft -= velocity * dt;
        velocity *= Math.pow(0.995, dt);
        if (Math.abs(velocity) > 0.02) raf = requestAnimationFrame(glide);
      };
      raf = requestAnimationFrame(glide);
    };

    // A drag should not also count as a click on whatever was under it.
    const onClickCapture = (e: MouseEvent) => {
      if (!dragged) return;
      e.preventDefault();
      e.stopPropagation();
      dragged = false;
    };

    const onDragStart = (e: DragEvent) => e.preventDefault();

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("click", onClickCapture, true);
    el.addEventListener("dragstart", onDragStart);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("click", onClickCapture, true);
      el.removeEventListener("dragstart", onDragStart);
    };
  }, []);

  return (
    <RailContext.Provider value={ref}>
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={`rail ${className}`}
        style={style}
      >
        {children}
      </div>
    </RailContext.Provider>
  );
}
