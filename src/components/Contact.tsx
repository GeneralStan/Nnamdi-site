import type { ReactNode } from "react";
import { contact } from "@/lib/content";
import { fluid } from "@/lib/fluid";
import { ContactForm } from "./ContactForm";
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from "./Icons";
import { Reveal } from "./Reveal";

const detailLink =
  "underline decoration-transparent underline-offset-4 transition-colors duration-300 hover:decoration-current";

const iconStyle = { width: 16, height: 16 };

// Figma: desktop 6:1077, mobile 22:1058.
// Phones and tablets stack intro → form → details (64 under the intro, 68
// under the form). From 1024px: intro and details on the left (504 of the
// 1200 column), form on the right (584).
export function Contact() {
  return (
    <section id="contact" className="bg-sand">
      <div
        className="shell grid grid-cols-1 [grid-template-areas:'intro'_'form'_'details'] lg:grid-cols-[42%_48.667%] lg:justify-between lg:[grid-template-areas:'intro_form'_'details_form'] lg:grid-rows-[auto_1fr]"
        style={{ paddingTop: fluid(64, 128), paddingBottom: fluid(64, 127) }}
      >
        <div
          className="flex flex-col [grid-area:intro]"
          style={{ gap: fluid(16, 16) }}
        >
          <Reveal as="h2" variant="soft" className="t-display text-ink">
            Get in touch
          </Reveal>
          <Reveal as="p" delay={100} className="t-body text-body">
            Ready to discuss a property, investment, or partnership? Leave us a
            message.
          </Reveal>
        </div>

        <Reveal
          delay={160}
          className="mt-16 [grid-area:form] lg:mt-[calc(55*var(--d))]"
        >
          <ContactForm />
        </Reveal>

        {/* Switzer 14/16 on phones, 16/24 on desktop. */}
        <ul
          className="mt-[68px] flex flex-col font-body tracking-[-0.02em] text-oxblood [grid-area:details] lg:mt-[calc(41*var(--k))]"
          style={{
            gap: fluid(20, 20),
            fontSize: fluid(14, 16),
            lineHeight: fluid(16, 24),
          }}
        >
          <Detail icon={<EnvelopeIcon style={iconStyle} />} delay={180}>
            <a
              href={`mailto:${contact.email}`}
              className={`${detailLink} break-all`}
            >
              {contact.email}
            </a>
          </Detail>
          <Detail icon={<PhoneIcon style={iconStyle} />} delay={260}>
            {contact.phones.map((phone, i) => (
              <span key={phone}>
                {i > 0 && ", "}
                <a href={`tel:${phone}`} className={detailLink}>
                  {phone}
                </a>
              </span>
            ))}
          </Detail>
          <Detail icon={<MapPinIcon style={iconStyle} />} delay={340}>
            <address
              className="not-italic"
              style={{ maxWidth: fluid(312, 352) }}
            >
              {contact.address}
            </address>
          </Detail>
        </ul>
      </div>
    </section>
  );
}

function Detail({
  icon,
  delay,
  children,
}: {
  icon: ReactNode;
  delay: number;
  children: ReactNode;
}) {
  return (
    <Reveal
      as="li"
      delay={delay}
      className="flex items-center"
      style={{ gap: fluid(12, 12) }}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brass/30">
        {icon}
      </span>
      <span className="min-w-0">{children}</span>
    </Reveal>
  );
}
