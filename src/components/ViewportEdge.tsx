"use client";

import { useEffect, useState } from "react";
import { ProgressiveBlur } from "./ProgressiveBlur";

/** How close to the end of the page the blur switches off, in px. */
const END_ZONE = 24;

/** Fixed strip at the bottom of the viewport where content blurs out as it
 *  leaves the screen. It fades away at the very end of the page so the
 *  footer can finish crisp. */
export function ViewportEdge() {
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const doc = document.documentElement;
      setAtEnd(window.scrollY + window.innerHeight >= doc.scrollHeight - END_ZONE);
    };
    const onChange = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, []);

  return (
    <div className="viewport-edge" data-off={atEnd}>
      <ProgressiveBlur towards="bottom" className="absolute inset-0" />
    </div>
  );
}
