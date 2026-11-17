import type { CSSProperties } from "react";

type ProgressiveBlurProps = {
  /** The edge where the blur is strongest. */
  towards: "top" | "bottom";
  className?: string;
  style?: CSSProperties;
};

/** Four stacked, masked backdrop blurs that ramp up toward one edge. Styles
 *  live under `.pblur` in globals.css; set `--pb-max` for the strongest blur
 *  and `--pb-on` (0..1) to fade it. */
export function ProgressiveBlur({ towards, className, style }: ProgressiveBlurProps) {
  return (
    <div
      aria-hidden="true"
      className={`pblur ${className ?? ""}`}
      data-towards={towards}
      style={style}
    >
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}
