"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/content";
import { EASE_ENTER, EASE_FADE } from "@/lib/motion";
import { ProgressiveBlur } from "./ProgressiveBlur";

/**
 * Fixed navigation.
 * Phones follow the Navigation(Mobile) component (Figma 35:1216): a solid
 * 76px bar that grows into a panel with the three links when opened.
 * From 640px: inline links, transparent over the hero until the page scrolls.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    // The panel only exists on phones; close it if the window widens.
    const wide = window.matchMedia("(min-width: 640px)");
    const onWide = () => wide.matches && setOpen(false);
    // Keep the page still behind the open menu.
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      root.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  return (
    <>
      {/* Dim, blurred page behind the open menu; tap it to close. */}
      <AnimatePresence>
        {open && (
          <m.div
            key="menu-scrim"
            className="menu-scrim sm:hidden"
            aria-hidden="true"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.35, ease: EASE_FADE },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.25, ease: EASE_FADE },
            }}
          />
        )}
      </AnimatePresence>

      <header className="site-nav" data-scrolled={scrolled} data-open={open}>
        <div className="site-nav-bar shell flex items-center justify-between">
          <nav
            aria-label="Primary"
            className="hidden items-center gap-[calc(20*var(--k))] sm:flex"
          >
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          </nav>

          {/* 36px button around the 24px icon, as in the component. */}
          <button
            type="button"
            className="flex size-9 cursor-pointer items-center justify-center sm:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="menu-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>

          <a href="#contact" className="btn-outline sm:w-[calc(160*var(--k))]">
            Get in touch
          </a>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <m.nav
              key="mobile-menu"
              id="mobile-menu"
              aria-label="Primary"
              className="overflow-hidden sm:hidden"
              initial={{ height: 0 }}
              animate={{
                height: "auto",
                transition: { duration: 0.4, ease: EASE_ENTER },
              }}
              exit={{
                height: 0,
                transition: { duration: 0.28, ease: EASE_FADE },
              }}
            >
              {/* Links start 20px under the bar, 20px apart, 20px from the
                bottom of the panel. */}
              <ul className="shell flex flex-col items-start gap-5 pt-5 pb-5">
                {navLinks.map((link, i) => (
                  <m.li
                    key={link.href}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.35,
                        ease: EASE_ENTER,
                        delay: 0.08 + i * 0.06,
                      },
                    }}
                    exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="nav-link inline-block"
                      style={{ fontSize: 16 }}
                    >
                      {link.label}
                    </a>
                  </m.li>
                ))}
              </ul>
            </m.nav>
          )}
        </AnimatePresence>

        {/* Scroll edge: content softens as it slides under the bar. */}
        <div className="nav-edge" aria-hidden="true">
          <ProgressiveBlur
            towards="top"
            className="absolute inset-0"
            style={{ ["--pb-max" as string]: "4px" }}
          />
        </div>
      </header>
    </>
  );
}
