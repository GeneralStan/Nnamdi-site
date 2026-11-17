import { about } from "@/lib/content";
import { fluid } from "@/lib/fluid";
import { Reveal } from "./Reveal";

// Figma: desktop 6:1006, mobile 22:987. Sizes are "mobile → desktop".
// Paragraphs are #ebe0e0 at 90%; the stat cards stay #f3f2f2.
export function About() {
  return (
    <section id="about" className="bg-oxblood text-linen">
      <div
        className="shell flex flex-col items-center"
        style={{
          paddingTop: fluid(64, 100),
          paddingBottom: fluid(64, 100),
          gap: fluid(64, 100),
        }}
      >
        <h2 className="sr-only">About</h2>

        <div
          className="t-body flex flex-col text-center text-rose/90"
          style={{ maxWidth: fluid(361, 672), gap: fluid(40, 40) }}
        >
          {about.paragraphs.map((text, i) => (
            <Reveal as="p" key={i} variant="soft" delay={i * 110}>
              {text}
            </Reveal>
          ))}
        </div>

        {/* Phones: one full-width row per stat, number left and label right,
            both pinned to the bottom of the row. From 640px: three cards,
            number above label, pinned bottom-left. */}
        <dl
          className="grid w-full grid-cols-1 gap-1 sm:grid-cols-3"
          style={{ maxWidth: fluid(361, 790) }}
        >
          {about.metrics.map((metric, i) => (
            <Reveal
              key={metric.label}
              delay={i * 110}
              className="flex flex-row-reverse flex-wrap content-end items-end justify-between bg-oxblood-card text-left sm:flex-col-reverse sm:flex-nowrap sm:items-start sm:justify-start"
              style={{
                height: fluid(79, 140),
                gap: fluid(8, 8),
                padding: fluid(20, 20),
                borderRadius: "var(--radius)",
              }}
            >
              <dt
                className="t-label text-linen/90"
                style={{ fontSize: fluid(12, 16), lineHeight: fluid(16, 20) }}
              >
                {metric.label}
              </dt>
              <dd
                className="t-stat whitespace-nowrap text-linen"
                style={{ fontSize: fluid(32, 44) }}
              >
                {metric.value}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
