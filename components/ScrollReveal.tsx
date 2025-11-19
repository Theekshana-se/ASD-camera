"use client";
import { useEffect } from "react";

const ScrollReveal = () => {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const type = (el.dataset.reveal || "up").toLowerCase();
            const delay = el.dataset.revealDelay;
            const base = type === "down" ? "fade-down" : "fade-up";

            el.classList.add(base);
            if (delay === "150") el.classList.add("delay-150");
            else if (delay === "300") el.classList.add("delay-300");

            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
};

export default ScrollReveal;