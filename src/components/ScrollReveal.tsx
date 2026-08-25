import { useEffect, useRef, useState, type ReactNode } from "react";

import { WaveMark } from "@/components/WaveMark";
import { cn } from "@/lib/utils";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal-on-scroll", visible && "reveal-on-scroll-visible", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  id,
}: {
  eyebrow: string;
  title: string;
  id?: string;
}) {
  return (
    <div className="text-center">
      <p className="text-xs tracking-[0.35em] text-gold uppercase">{eyebrow}</p>
      <h2 id={id} className="mt-3 font-display text-4xl sm:text-5xl">
        {title}
      </h2>
      <div className="mt-6 flex items-center justify-center" aria-hidden>
        <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold/50 sm:w-20" />
        <WaveMark className="h-7 w-auto shrink-0 sm:h-8" draw />
        <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold/50 sm:w-20" />
      </div>
    </div>
  );
}
