import { cn } from "@/lib/utils";

type DrawPathProps = {
  /** Le tracé SVG. */
  d: string;
  viewBox: string;
  className?: string;
  /** Épaisseur du trait, dans les unités du viewBox. */
  strokeWidth?: number;
  /** Étire le tracé sur toute la largeur, sans conserver ses proportions. */
  stretch?: boolean;
  /** Laisse le tracé se dessiner au fil du scroll. Sinon il est plein. */
  draw?: boolean;
};

/**
 * Un tracé SVG qui se dessine au fil du scroll.
 *
 * Sans support de `animation-timeline`, le tracé s'affiche entier : c'est
 * l'absence de `stroke-dasharray` par défaut qui le garantit. Ne jamais
 * poser `stroke-dasharray` en ligne ici : il ne vit que dans le CSS, sous
 * `@supports`.
 */
export function DrawPath({
  d,
  viewBox,
  className,
  strokeWidth = 5,
  stretch = false,
  draw = false,
}: DrawPathProps) {
  return (
    <svg
      viewBox={viewBox}
      className={className}
      preserveAspectRatio={stretch ? "none" : "xMidYMid meet"}
      fill="none"
      aria-hidden
    >
      <path
        className={cn(draw && "draw-path")}
        d={d}
        stroke="var(--gold)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        vectorEffect={stretch ? "non-scaling-stroke" : undefined}
      />
    </svg>
  );
}
