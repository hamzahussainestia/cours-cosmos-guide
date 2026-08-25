import { useEffect, useRef, useState } from "react";

type Step = { step: string; title: string; text: string };

/**
 * Timeline en zigzag pour "Comment ça marche ?" : une ligne centrale se
 * dessine au fil du scroll, et chaque étape s'allume quand la ligne
 * l'atteint. En dessous de md, ça repasse en simple colonne alignée à
 * gauche (la disposition alternée gauche/droite n'a pas la place).
 */
export function MethodTimeline({ steps }: { steps: readonly Step[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [lineHeight, setLineHeight] = useState(0);
  const [litCount, setLitCount] = useState(0);

  useEffect(() => {
    let ticking = false;

    function update() {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const start = viewportH * 0.82;
      const end = viewportH * 0.35;
      const total = rect.height + (start - end);
      const traveled = start - rect.top;
      const progress = total > 0 ? Math.min(1, Math.max(0, traveled / total)) : 0;
      const px = progress * rect.height;
      setLineHeight(px);

      let lit = 0;
      rowRefs.current.forEach((row) => {
        if (!row) return;
        const marker = row.querySelector<HTMLElement>("[data-marker]");
        if (!marker) return;
        const markerCenter = marker.offsetTop + marker.offsetHeight / 2;
        if (px >= markerCenter) lit += 1;
      });
      setLitCount(lit);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative mx-auto max-w-4xl">
      <div
        className="absolute top-0 bottom-0 left-6 w-px bg-gold/15 md:left-1/2 md:-translate-x-1/2"
        aria-hidden
      />
      <div
        className="absolute top-0 left-6 w-px bg-gold transition-[height] duration-150 ease-out md:left-1/2 md:-translate-x-1/2"
        style={{ height: lineHeight }}
        aria-hidden
      />

      <div className="flex flex-col gap-12 md:gap-16">
        {steps.map((s, i) => {
          const isLeft = i % 2 === 0;
          const lit = i < litCount;
          return (
            <div
              key={s.step}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              className="grid grid-cols-[3rem_1fr] items-start gap-x-5 md:grid-cols-[1fr_3rem_1fr] md:items-center md:gap-x-8"
            >
              <span
                data-marker
                className={`relative z-10 col-start-1 flex h-12 w-12 items-center justify-center rounded-full border-2 font-display text-lg transition-colors duration-300 md:col-start-2 ${
                  lit
                    ? "border-gold bg-gold text-primary-foreground"
                    : "border-gold/30 bg-background text-gold/50"
                }`}
              >
                {s.step}
              </span>
              <div
                className={`col-start-2 row-start-1 transition-opacity duration-500 ${
                  lit ? "opacity-100" : "opacity-55"
                } ${isLeft ? "md:col-start-1 md:text-right" : "md:col-start-3"}`}
              >
                <h3 className="font-display text-xl text-gold-soft">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
