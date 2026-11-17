import Image from "next/image";
import { fluid } from "@/lib/fluid";
import { Reveal } from "./Reveal";
import { asset } from "@/lib/asset";

// Figma: desktop 11:264, mobile 22:1122. Sizes are "mobile → desktop".
export function Footer() {
  return (
    <footer className="overflow-hidden bg-oxblood text-[#fefefe]">
      <div className="shell relative" style={{ height: fluid(294, 614) }}>
        <Reveal
          as="h2"
          variant="soft"
          className="t-display relative z-10"
          style={{
            paddingTop: fluid(40, 116),
            maxWidth: fluid(361, 652),
            fontSize: fluid(40, 64),
          }}
        >
          Let’s build your dream home together
        </Reveal>

        {/* Mobile: 288x232, 110 in from the column edge and 103 down.
            Desktop: 1055x850, 458.5 in and 64 down. Both run off the right
            and bottom edges. Rises into place. */}
        <div
          className="pointer-events-none absolute"
          style={{
            left: fluid(110, 458.5),
            top: fluid(103, 64),
            width: fluid(287.9, 1055),
          }}
        >
          <Reveal variant="up" delay={120}>
            <Image
              src={asset("/images/footer-house.webp")}
              alt=""
              width={2048}
              height={1650}
              sizes="(min-width: 1024px) 74vw, (min-width: 640px) 60vw, 74vw"
              className="h-auto w-full"
            />
          </Reveal>
        </div>
      </div>
    </footer>
  );
}
