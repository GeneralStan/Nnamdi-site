import type { Transition, Variants } from "motion/react";

/**
 * Shared motion values for the whole site, so every animation speaks the same
 * language. See .claude/skills/site-motion/SKILL.md for the rules behind them.
 */

/** Entrances: fast start, long gentle settle (easeOutExpo). */
export const EASE_ENTER = [0.16, 1, 0.3, 1] as const;
/** Opacity: a plain decelerating fade reads cleaner than expo on alpha. */
export const EASE_FADE = [0.33, 0, 0.2, 1] as const;

export type RevealVariant = "rise" | "soft" | "scale" | "right" | "up";

/** Scroll-reveal states. `hidden` is also what the server renders. */
export const revealVariants: Record<RevealVariant, Variants> = {
  // Default: small lift.
  rise: {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0 },
  },
  // Headings and paragraphs: lift with a slight focus-pull.
  soft: {
    hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } },
  },
  // Photos and cards: lift with a touch of scale.
  scale: {
    hidden: { opacity: 0, y: 24, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1 },
  },
  // Section illustrations: slide in from the right-hand edge.
  right: {
    hidden: { opacity: 0, x: "45%" },
    show: { opacity: 1, x: 0 },
  },
  // Footer house: rise from the bottom edge.
  up: {
    hidden: { opacity: 0, y: "16%" },
    show: { opacity: 1, y: 0 },
  },
};

const LONG: RevealVariant[] = ["right", "up"];

export function revealTransition(
  variant: RevealVariant,
  delayMs: number,
): Transition {
  const delay = delayMs / 1000;
  const long = LONG.includes(variant);
  return {
    duration: long ? 1.5 : 0.9,
    ease: EASE_ENTER,
    delay,
    opacity: { duration: long ? 1.1 : 0.9, ease: EASE_FADE, delay },
  };
}

/** Letters use a softer ease-out (easeOutCubic) so neighbouring letters are
 *  visibly in motion together rather than popping one at a time. */
export const EASE_LETTER = [0.33, 1, 0.68, 1] as const;

/** Hero load-in timings, in seconds. Layers come in one after another:
 *  the man, then the banner behind him, then his name. */
export const HERO = {
  /** The man: fully opaque by `portraitFade`, settled by `portraitRise`. */
  portraitFade: 0.45,
  portraitRise: 1.2,
  /** The orange-brown banner follows the man. */
  bandDelay: 0.3,
  bandFade: 0.6,
  bandRise: 1.1,
  /** Letters start once the man is solid. */
  lettersStart: 0.5,
  /** Each letter's own duration: 60% shorter than before (0.84s), so the
   *  whole name now takes about 1.0s instead of 2.5s. */
  letter: 0.335,
  /** Gap between one letter starting and the next. On EASE_LETTER a letter is
   *  50% of the way into the frame 20.6% through its duration and 15% of the
   *  way 5.3% through, so an offset of 15.3% puts the next letter at 15% when
   *  the previous one is at 50%. */
  letterOffset: 0.335 * 0.153,
} as const;
