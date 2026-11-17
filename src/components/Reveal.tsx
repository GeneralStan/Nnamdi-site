"use client";

import * as m from "motion/react-m";
import type { CSSProperties, ReactNode } from "react";
import {
  revealTransition,
  revealVariants,
  type RevealVariant,
} from "@/lib/motion";

const tags = {
  div: m.div,
  p: m.p,
  h2: m.h2,
  h3: m.h3,
  li: m.li,
  figure: m.figure,
  span: m.span,
  dl: m.dl,
} as const;

type RevealProps = {
  as?: keyof typeof tags;
  /** Stagger in milliseconds. */
  delay?: number;
  /** See revealVariants in src/lib/motion.ts. */
  variant?: RevealVariant;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/** Animates its content in the first time it scrolls into view. */
export function Reveal({
  as = "div",
  delay = 0,
  variant = "rise",
  className,
  style,
  children,
}: RevealProps) {
  // Every tag takes the same props here; typing as m.div keeps JSX simple.
  const Tag = tags[as] as typeof m.div;

  return (
    <Tag
      data-reveal=""
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -8% 0px", amount: 0.05 }}
      variants={revealVariants[variant]}
      transition={revealTransition(variant, delay)}
      className={className}
      style={style}
    >
      {children}
    </Tag>
  );
}
