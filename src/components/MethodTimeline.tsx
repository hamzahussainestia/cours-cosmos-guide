import type { CSSProperties } from "react";

import { DrawPath } from "@/components/motion/DrawPath";

type Step = { step: string; title: string; text: string };

/** Tracé vertical qui relie les quatre étapes (valable pour quatre étapes). */
const TIMELINE_PATH = "M 20 0 V 600";
const TIMELINE_VIEWBOX = "0 0 40 600";

/**
 * Timeline en zigzag pour "Comment ça marche ?" : le trait central se
 * dessine au fil du scroll, et chaque étape s'allume quand elle entre à
 * l'écran. Tout est porté par le CSS (`.draw-path`, `.step-lit`) : aucun
 * JavaScript, et sans support de `animation-timeline` la frise s'affiche
 * entière et allumée. En dessous de md, ça repasse en simple colonne alignée
 * à gauche (la disposition alternée gauche/droite n'a pas la place).
 */
export function MethodTimeline({ steps }: { steps: readonly Step[] }) {
  return (
    <div className="relative mx-auto max-w-4xl">
      {/* Rail pâle : visible dès le départ, le trait doré se dessine dessus. */}
      <div
        className="absolute top-0 bottom-0 left-5 w-px bg-gold/15 md:left-1/2 md:-translate-x-1/2"
        aria-hidden
      />
      {/* Le viewBox fait 40 de large : le trait vertical (x = 20) tombe au
          centre de la colonne des pastilles, qui fait elle aussi 2,5 rem. */}
      <DrawPath
        d={TIMELINE_PATH}
        viewBox={TIMELINE_VIEWBOX}
        strokeWidth={1.5}
        stretch
        draw
        className="absolute top-0 left-0 h-full w-10 md:left-1/2 md:-translate-x-1/2"
      />

      <div className="flex flex-col gap-6 md:gap-16">
        {steps.map((s, i) => {
          const isLeft = i % 2 === 0;
          return (
            <div
              key={s.step}
              style={{ "--step-index": i } as CSSProperties}
              className="step-lit grid grid-cols-[2.5rem_1fr] items-start gap-x-4 md:grid-cols-[1fr_3rem_1fr] md:items-center md:gap-x-8"
            >
              <span className="relative z-10 col-start-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-gold bg-gold font-display text-base text-primary-foreground md:col-start-2 md:h-12 md:w-12 md:text-lg">
                {s.step}
              </span>
              <div
                className={`col-start-2 row-start-1 ${
                  isLeft ? "md:col-start-1 md:text-right" : "md:col-start-3"
                }`}
              >
                <h3 className="font-display text-lg text-gold-soft md:text-xl">{s.title}</h3>
                <p className="mt-1 text-sm leading-snug text-muted-foreground md:mt-2 md:leading-relaxed">
                  {s.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
