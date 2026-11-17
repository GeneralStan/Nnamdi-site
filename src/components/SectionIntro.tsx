import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { fluid } from "@/lib/fluid";
import { Reveal } from "./Reveal";
import { asset } from "@/lib/asset";

type Illustration = {
  /** Square vector line art (traced from the visible Figma fill). */
  src: string;
  /** The layer's box in the design, in px on the 1200 x 480 intro row.
   *  It also acts as a crop window. */
  frame: { x: number; y: number; width: number; height: number };
  /** Where the square art sits relative to that box, and its side length. */
  art: { x: number; y: number; size: number };
};

type SectionIntroProps = {
  title: ReactNode;
  body: string;
  illustration: Illustration;
  /** Mobile frame: the layer's left edge and width on the 361px column. It
   *  keeps the desktop layer's proportions, and may run off the right edge. */
  mobile: { x: number; width: number };
};

/** The mobile illustration row is 361 x 240 in Figma. */
const MOBILE_ROW = { width: 361, height: 240 };

const pct = (value: number, of: number) => `${(value / of) * 100}%`;

/** The art, positioned inside its (cropping) frame using only percentages,
 *  so it holds its composition at any rendered size. */
function Art({ illustration }: { illustration: Illustration }) {
  const { src, frame, art } = illustration;
  const style: CSSProperties = {
    left: pct(art.x, frame.width),
    top: pct(art.y, frame.height),
    width: pct(art.size, frame.width),
  };
  return (
    <div
      className="relative overflow-hidden"
      style={{ aspectRatio: `${frame.width} / ${frame.height}` }}
    >
      <Image
        src={asset(src)}
        alt=""
        width={1024}
        height={1024}
        className="absolute h-auto max-w-none"
        style={style}
      />
    </div>
  );
}

/** Heading + blurb on the left; the illustration slides in from the right. */
export function SectionIntro({
  title,
  body,
  illustration,
  mobile,
}: SectionIntroProps) {
  const { frame } = illustration;

  return (
    <div className="shell">
      {/* Below the desktop layout the illustration sits above the copy, as
          in the mobile frame. Capped on tablets so it does not dominate. */}
      <div
        className="pointer-events-none relative ml-auto max-w-[560px] lg:hidden"
        style={{
          aspectRatio: `${MOBILE_ROW.width} / ${MOBILE_ROW.height}`,
          marginBottom: fluid(44, 44),
        }}
      >
        <div
          className="absolute top-0"
          style={{
            left: pct(mobile.x, MOBILE_ROW.width),
            width: pct(mobile.width, MOBILE_ROW.width),
          }}
        >
          <Reveal variant="right">
            <Art illustration={illustration} />
          </Reveal>
        </div>
      </div>

      {/* Desktop: the 1200x480 design row, kept in proportion to the column. */}
      <div className="relative flex items-center lg:aspect-[1200/480]">
        <div
          className="flex flex-col"
          style={{ maxWidth: fluid(358, 504), gap: fluid(16, 16) }}
        >
          <Reveal as="h2" variant="soft" className="t-display text-ink">
            {title}
          </Reveal>
          <Reveal as="p" delay={100} className="t-body text-body-soft">
            {body}
          </Reveal>
        </div>

        <div
          className="pointer-events-none absolute hidden lg:block"
          style={{
            left: pct(frame.x, 1200),
            top: pct(frame.y, 480),
            width: pct(frame.width, 1200),
          }}
        >
          <Reveal variant="right" delay={120}>
            <Art illustration={illustration} />
          </Reveal>
        </div>
      </div>
    </div>
  );
}
