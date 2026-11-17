import { testimonials } from "@/lib/content";
import { fluid } from "@/lib/fluid";
import { DragScroll } from "./DragScroll";
import { Reveal } from "./Reveal";
import { SectionIntro } from "./SectionIntro";

/** The opening quote mark, from the mobile frame's vector (21 x 18). On
 *  desktop it matches the 80px Geist SemiBold glyph's ink (27.6 x 23.8). */
function QuoteMark() {
  return (
    <svg
      viewBox="0 0 21 18"
      fill="currentColor"
      aria-hidden="true"
      className="block h-auto shrink-0"
      style={{ width: fluid(21, 27.6), marginLeft: fluid(0, 3.4) }}
    >
      <path d="M8.4 0L5.23 9.58H8.89V18H0V10.48L4.02 0H8.4ZM20.45 0L17.29 9.58H21V18H12.11V10.48L16.13 0H20.45Z" />
    </svg>
  );
}

// Figma: desktop 6:1113 ("Let's Talk"), mobile 28:341.
export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="overflow-hidden bg-paper"
      style={{ paddingTop: fluid(64, 100), paddingBottom: fluid(64, 100) }}
    >
      <SectionIntro
        title={
          <>
            From our partners <br />
            &amp; homeowners
          </>
        }
        body="Perspectives from the homebuyers, joint-venture investors, and build partners from past projects."
        illustration={{
          src: "/images/illustration-testimonial.svg",
          // 400x480 layer that crops the art: Figma shows 62.3% x 74.8% of the
          // image, starting 18.8% in and 12.6% down, so the square renders at
          // 641.7px and is offset up and to the left of the layer.
          frame: { x: 975, y: 0, width: 400, height: 480 },
          art: { x: -120.9, y: -80.7, size: 641.7 },
        }}
        mobile={{ x: 205, width: 200 }}
      />

      {/* The mobile frame's intro box is 4px taller than its contents, so the
          cards sit 68px under the copy there. */}
      <DragScroll label="Testimonials" style={{ marginTop: fluid(68, 100) }}>
        {testimonials.map((item, i) => (
          <Reveal
            as="figure"
            key={item.name}
            delay={Math.min(i, 2) * 110}
            className="flex flex-col justify-between bg-mist"
            style={{
              width: fluid(320, 680),
              minHeight: fluid(340, 398),
              // Figma fixes the cards at 340/398 and lets the gap above the
              // name shrink when a quote runs long; a smaller minimum gap
              // keeps every card at that height.
              gap: fluid(24, 40),
              padding: fluid(20, 40),
              paddingTop: fluid(20, 33.9),
            }}
          >
            <div
              className="flex flex-col text-maroon"
              style={{ gap: fluid(8, 22.3) }}
            >
              <QuoteMark />
              <blockquote className="t-quote">
                {item.quote}
              </blockquote>
            </div>
            <figcaption className="flex flex-col" style={{ gap: fluid(8, 8) }}>
              <span className="t-name text-oxblood">{item.name}</span>
              <span
                className="t-label text-oxblood/70"
                style={{ fontSize: fluid(14, 16), lineHeight: fluid(16, 24) }}
              >
                {item.title}
              </span>
            </figcaption>
          </Reveal>
        ))}
      </DragScroll>
    </section>
  );
}
