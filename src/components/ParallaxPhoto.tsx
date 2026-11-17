"use client";

import * as m from "motion/react-m";
import {
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, type ReactNode } from "react";
import { useRail } from "./DragScroll";

/** How far the photo drifts inside its card, each way, as a share of the
 *  card's width. The photo is scaled up just enough to cover it. */
const DRIFT = 0.05;

/**
 * The photo inside a project card drifts slightly against the rail's scroll,
 * so the image appears to sit a little behind its frame as cards pass.
 * Per the installed skills: transform only (60fps-animation), a critically
 * damped spring with no overshoot (motion-art-direction, Premium), and
 * removed entirely for reduced motion (accessible-animation, Tier 1).
 */
export function ParallaxPhoto({ children }: { children: ReactNode }) {
  const rail = useRail();
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // 0 when the card's leading edge enters the rail on the right, 1 when its
  // trailing edge leaves on the left.
  const { scrollXProgress } = useScroll({
    container: rail ?? undefined,
    target: ref,
    axis: "x",
    offset: ["start end", "end start"],
  });
  // Smooths out wheel steps and drag jitter; damped so it never overshoots.
  const smooth = useSpring(scrollXProgress, {
    stiffness: 140,
    damping: 32,
    mass: 0.6,
    restDelta: 0.0005,
  });
  const x = useTransform(
    smooth,
    [0, 1],
    [`${DRIFT * 100}%`, `${-DRIFT * 100}%`],
  );

  return (
    <m.div
      ref={ref}
      className="absolute inset-0"
      style={
        reduceMotion ? undefined : { x, scale: 1 + DRIFT * 2 + 0.01 }
      }
    >
      {children}
    </m.div>
  );
}
