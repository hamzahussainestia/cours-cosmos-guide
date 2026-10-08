import type { CSSProperties, ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Rang dans une cascade : chaque cran retarde le départ dans le scroll. */
  index?: number;
  /** Translation verticale de départ, en pixels. */
  distance?: number;
  as?: ElementType;
};

/**
 * L'élément se construit quand il traverse l'écran.
 *
 * Aucun JavaScript : tout est porté par la classe `.reveal` et des
 * animations CSS pilotées par le scroll. L'état par défaut est VISIBLE —
 * l'animation n'est ajoutée que si le navigateur sait la piloter.
 */
export function Reveal({
  children,
  className,
  index = 0,
  distance = 70,
  as: Tag = "div",
}: RevealProps) {
  return (
    <Tag
      className={cn("reveal", className)}
      style={
        {
          "--reveal-index": index,
          "--reveal-distance": `${distance}px`,
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
