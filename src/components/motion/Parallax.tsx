import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /**
   * Amplitude du décalage, en pixels. Positif = l'élément prend du retard
   * sur le scroll : il monte moins vite que la page et paraît en arrière-plan.
   * Négatif = il devance le scroll et paraît au premier plan.
   *
   * La course totale vaut `2 × shift` (de `-shift` à `+shift` pendant la
   * traversée de l'écran) ; l'écart maximal à la position nominale vaut
   * `shift`.
   */
  shift?: number;
};

/**
 * Déplace l'élément à une vitesse différente du scroll, pour la profondeur.
 *
 * ATTENTION : l'animation pose un `transform` sur l'élément. Un `className`
 * passé par un consommateur qui porterait sa propre transformation
 * (rotation, échelle, translation) serait écrasé. Pour combiner les deux,
 * placer l'élément transformé à l'intérieur du `Parallax`, pas dessus.
 */
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
