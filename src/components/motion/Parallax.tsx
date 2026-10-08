import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /**
   * Amplitude du décalage, en pixels. Positif = l'élément monte moins vite
   * que le scroll (il semble en arrière). Négatif = il devance le scroll.
   */
  shift?: number;
};

/** Déplace l'élément à une vitesse différente du scroll, pour la profondeur. */
export function Parallax({ children, className, shift = 40 }: ParallaxProps) {
  return (
    <div
      className={cn("parallax", className)}
      style={{ "--parallax-shift": `${shift}px` } as CSSProperties}
    >
      {children}
    </div>
  );
}
