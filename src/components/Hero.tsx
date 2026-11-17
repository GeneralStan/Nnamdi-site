"use client";

import * as m from "motion/react-m";
import { useReducedMotion, type Variants } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { EASE_ENTER, EASE_FADE, EASE_LETTER, HERO } from "@/lib/motion";
import { asset } from "@/lib/asset";

const WORDS = ["NNAMDI", "AKAJIOBI"] as const;

/** Longest the load-in will wait for images and fonts before starting anyway. */
const MAX_WAIT_MS = 2500;

function whenPainted(img: HTMLImageElement): Promise<void> {
  return new Promise((resolve) => {
    const decoded = () => {
      // decode() resolves once the bitmap is ready to draw, so the image
      // cannot pop in part-way through the animation.
      if (typeof img.decode === "function") {
        img.decode().then(resolve, () => resolve());
      } else {
        resolve();
      }
    };
    if (img.complete && img.naturalWidth > 0) {
      decoded();
    } else {
      img.addEventListener("load", decoded, { once: true });
      img.addEventListener("error", () => resolve(), { once: true });
    }
  });
}

/**
 * Splitting a word into one box per letter drops the font's kerning pairs
 * (A-K, A-J…). Measure each pair once and return the correction, in em, to
 * apply as a left margin on the second letter of the pair.
 */
function measureKerning(fontFamily: string, fontWeight: string): number[][] {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return WORDS.map((w) => Array.from(w, () => 0));
  const SIZE = 200;
  ctx.font = `${fontWeight} ${SIZE}px ${fontFamily}`;
  const width = (s: string) => ctx.measureText(s).width;
  return WORDS.map((word) =>
    Array.from(word, (ch, i) => {
      if (i === 0) return 0;
      const prev = word[i - 1];
      return (width(prev + ch) - width(prev) - width(ch)) / SIZE;
    }),
  );
}

// Layer by layer: the man rises in first and is fully solid before anything
// else appears; the banner behind him follows, growing up from the bottom.
const portraitVariants: Variants = {
  hidden: { opacity: 0, y: "6%" },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: HERO.portraitRise,
      ease: EASE_ENTER,
      opacity: { duration: HERO.portraitFade, ease: EASE_FADE },
    },
  },
};

const bandVariants: Variants = {
  hidden: { opacity: 0, scaleY: 0.82 },
  show: {
    opacity: 1,
    scaleY: 1,
    transition: {
      duration: HERO.bandRise,
      ease: EASE_ENTER,
      delay: HERO.bandDelay,
      opacity: {
        duration: HERO.bandFade,
        ease: EASE_FADE,
        delay: HERO.bandDelay,
      },
    },
  },
};

// Letters rise through the word's mask, one after another.
const letterVariants: Variants = {
  hidden: { y: "112%" },
  show: (index: number) => ({
    y: 0,
    transition: {
      duration: HERO.letter,
      ease: EASE_LETTER,
      delay: HERO.lettersStart + index * HERO.letterOffset,
    },
  }),
};

const LETTER_COUNT = WORDS.join("").length;
const NAME_END =
  HERO.lettersStart + (LETTER_COUNT - 1) * HERO.letterOffset + HERO.letter;

const tagVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: (order: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: EASE_ENTER,
      // Land with the last few letters.
      delay: NAME_END - 0.7 + order * 0.1,
    },
  }),
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const [kerning, setKerning] = useState<number[][] | null>(null);
  const reduceMotion = useReducedMotion();

  // Hold the whole load-in until the backdrop and portrait are decoded and
  // the display font is in, then release everything on the same frame.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;

    const images = Array.from(
      el.querySelectorAll<HTMLImageElement>(".hero-art img"),
    );
    const name = el.querySelector<HTMLElement>(".hero-name");
    const { fontFamily, fontWeight } = name
      ? getComputedStyle(name)
      : { fontFamily: "serif", fontWeight: "400" };

    const fonts = document.fonts
      .load(`${fontWeight} 100px ${fontFamily}`, WORDS.join(""))
      .then(() => document.fonts.ready)
      .then(
        () => {
          if (!cancelled) setKerning(measureKerning(fontFamily, fontWeight));
        },
        () => undefined,
      );

    const timeout = new Promise<void>((resolve) =>
      setTimeout(resolve, MAX_WAIT_MS),
    );

    Promise.race([
      Promise.all([...images.map(whenPainted), fonts]),
      timeout,
    ]).then(() => {
      if (cancelled) return;
      requestAnimationFrame(() => {
        if (!cancelled) setReady(true);
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const state = ready ? "show" : "hidden";
  let letterIndex = 0;

  return (
    <section ref={ref} className="hero" data-ready={ready}>
      <h1 className="hero-name" aria-label="Nnamdi Akajiobi">
        {WORDS.map((word, w) => (
          <span key={word}>
            <span className="hero-word" aria-hidden="true">
              {Array.from(word, (ch, i) => {
                // With reduced motion the name arrives together, not in turn.
                const index = reduceMotion ? 0 : letterIndex++;
                const kern = kerning?.[w]?.[i] ?? 0;
                return (
                  <m.span
                    key={i}
                    className="hero-char"
                    style={kern ? { marginLeft: `${kern}em` } : undefined}
                    custom={index}
                    variants={letterVariants}
                    initial="hidden"
                    animate={state}
                  >
                    {ch}
                  </m.span>
                );
              })}
            </span>
            {w === 0 && (
              <>
                {" "}
                <br className="sm:hidden" aria-hidden="true" />
              </>
            )}
          </span>
        ))}
      </h1>

      <div className="hero-stage">
        <div className="hero-art">
          <m.div
            className="hero-band"
            variants={bandVariants}
            initial="hidden"
            animate={state}
          >
            {/* Stretched to the band, as in Figma: on the tall phone band
                this keeps the dark edges and the glow behind his head. */}
            <Image
              src={asset("/images/hero-backdrop.webp")}
              alt=""
              fill
              preload
              sizes="100vw"
              className="object-fill"
            />
          </m.div>

          <m.div
            className="hero-portrait"
            variants={portraitVariants}
            initial="hidden"
            animate={state}
          >
            <Image
              src={asset("/images/portrait.webp")}
              alt="Nnamdi Akajiobi, seated, in a navy pinstripe suit"
              width={1422}
              height={1500}
              preload
              sizes="(min-width: 640px) 50vw, 92vw"
              className="h-auto w-full"
            />
          </m.div>
        </div>

        <p className="hero-tags">
          {["REAL ESTATE DEVELOPER", "PROPERTY ADVISOR"].map((tag, order) => (
            <m.span
              key={tag}
              className="hero-tag"
              custom={order}
              variants={tagVariants}
              initial="hidden"
              animate={state}
            >
              {tag}
            </m.span>
          ))}
        </p>
      </div>
    </section>
  );
}
