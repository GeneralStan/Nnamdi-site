import Image from "next/image";
import { projects, type Project } from "@/lib/content";
import { fluid } from "@/lib/fluid";
import { DragScroll } from "./DragScroll";
import { ParallaxPhoto } from "./ParallaxPhoto";
import { Reveal } from "./Reveal";
import { SectionIntro } from "./SectionIntro";
import { asset } from "@/lib/asset";

// Figma: desktop 6:1026, mobile 22:1007. Sizes are "mobile → desktop".
export function Projects() {
  return (
    <section
      id="projects"
      className="overflow-hidden bg-paper"
      style={{ paddingTop: fluid(64, 100), paddingBottom: fluid(64, 96) }}
    >
      <SectionIntro
        title="Completed projects"
        body="Completed residential and mixed-use developments across key neighbourhoods in Lagos."
        illustration={{
          src: "/images/illustration-house.svg",
          // 490x480 layer; the square art is fitted inside it, 5px in.
          frame: { x: 921, y: 0, width: 490, height: 480 },
          art: { x: 5, y: 0, size: 480 },
        }}
        mobile={{ x: 113, width: 245 }}
      />

      {projects.map((project) => (
        <ProjectBlock key={project.name} project={project} />
      ))}
    </section>
  );
}

function ProjectBlock({ project }: { project: Project }) {
  return (
    <article style={{ marginTop: fluid(64, 100) }}>
      <div className="shell">
        <Reveal as="p" className="t-date text-muted">
          <time>[{project.date}]</time>
        </Reveal>

        <div
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between lg:pl-[calc(103*var(--d))]"
          style={{ marginTop: fluid(24, 40), gap: fluid(20, 64) }}
        >
          {/* The mobile frame sets this copy block at 80% opacity. */}
          <div
            className="flex min-w-0 flex-col opacity-80 lg:flex-1 lg:opacity-100"
            style={{ maxWidth: fluid(345, 517), gap: fluid(8, 16) }}
          >
            <Reveal
              as="h3"
              variant="soft"
              delay={80}
              className="t-title text-ink"
            >
              {project.name}
            </Reveal>
            <Reveal
              as="p"
              delay={160}
              className="t-body text-body"
              style={{ fontSize: fluid(14, 18), lineHeight: fluid(20, 24) }}
            >
              {project.description}
            </Reveal>
          </div>

          {/* Stats sit on the copy's baseline (bottom-aligned) on desktop. */}
          <Reveal
            as="dl"
            delay={240}
            className="flex shrink-0 items-stretch"
            style={{ gap: fluid(20, 20) }}
          >
            {project.metrics.map((metric, i) => (
              <div
                key={metric.label}
                className={`flex flex-col-reverse ${
                  i > 0 ? "border-l border-[#a6a6a6]/60 lg:border-[#a6a6a6]" : ""
                }`}
                style={{
                  gap: fluid(8, 8),
                  paddingLeft: i > 0 ? fluid(20, 20) : undefined,
                }}
              >
                <dt
                  className="t-label text-muted"
                  style={{ lineHeight: fluid(16, 24) }}
                >
                  {metric.label}
                </dt>
                <dd
                  className="t-stat text-ink-soft"
                  style={{ letterSpacing: fluid(-0.32, -2) }}
                >
                  {metric.value}
                </dd>
              </div>
            ))}
          </Reveal>
        </div>
      </div>

      <DragScroll
        label={`${project.name} photos`}
        className="rail-indented"
        style={{ marginTop: fluid(24, 40) }}
      >
        {project.images.map((image, i) => (
          <Reveal
            key={image.src}
            variant="scale"
            delay={Math.min(i, 2) * 110}
            className="photo"
          >
            <ParallaxPhoto>
              <Image
                src={asset(image.src)}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 60vw, (min-width: 640px) 68vw, 90vw"
                className="object-cover"
                draggable={false}
              />
            </ParallaxPhoto>
          </Reveal>
        ))}
      </DragScroll>
    </article>
  );
}
