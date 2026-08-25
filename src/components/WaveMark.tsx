import { useEffect, useRef, useState } from "react";

/**
 * La vague du logo Coursinus, relevée sur le tracé du logo lui-même
 * (public/coursinus-logo.png) : ligne plate, creux, pic haut, creux,
 * bosse plus douce, ligne plate. Les deux extrémités sont horizontales et
 * à la même hauteur — c'est ce qui permet de la raccorder à un filet.
 *
 * Le viewBox est volontairement plus haut que le tracé (0→72 pour un tracé
 * qui va de 3 à 60) afin que les extrémités plates tombent pile au centre
 * vertical : les filets qui la prolongent s'alignent alors parfaitement.
 */
const WAVE_PATH =
  "M 0 36 H 40 C 47 36 49 59 58 59 C 65 59 68 56 72 48 C 78 31 82 2 87 2 " +
  "C 92 2 97 31 103 44 C 108 53 111 53 116 52 C 124 49 128 19 140 19 " +
  "C 150 19 157 27 162 34 H 167";

type WaveMarkProps = {
  className?: string;
  /** Épaisseur du trait, dans les unités du viewBox (167 × 72). */
  strokeWidth?: number;
  /** Laisse la vague se dessiner quand elle entre dans l'écran. */
  draw?: boolean;
  /** Étire la vague sur toute la largeur, sans conserver ses proportions. */
  stretch?: boolean;
};

export function WaveMark({
  className,
  strokeWidth = 5,
  draw = false,
  stretch = false,
}: WaveMarkProps) {
  const ref = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(!draw);

  useEffect(() => {
    if (!draw) return;
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [draw]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 167 72"
      className={className}
      preserveAspectRatio={stretch ? "none" : "xMidYMid meet"}
      fill="none"
      aria-hidden
    >
      <path
        d={WAVE_PATH}
        stroke="var(--gold)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        vectorEffect={stretch ? "non-scaling-stroke" : undefined}
        style={
          draw
            ? {
                strokeDasharray: 1,
                strokeDashoffset: drawn ? 0 : 1,
                // Le bloc parent (ScrollReveal) fait son fondu en 0,7 s : on
                // attend qu'il soit lisible avant de tracer, sinon la vague
                // est déjà dessinée quand elle devient visible.
                transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.5s",
              }
            : undefined
        }
      />
    </svg>
  );
}
