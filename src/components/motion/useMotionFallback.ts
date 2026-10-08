import { useEffect } from "react";

/**
 * Repli JavaScript pour les navigateurs sans `animation-timeline`.
 *
 * Les animations de la page sont portées par le CSS (`.reveal`, `.draw-path`)
 * et pilotées par le scroll. Là où ce mécanisme n'existe pas, ce hook rejoue
 * la même mise en scène avec un IntersectionObserver.
 *
 * Règle qui prime : sans JavaScript, ou si ce hook échoue, rien n'est masqué.
 * La classe `js-reveal` conditionne tout masquage dans styles.css ; elle n'est
 * posée ici QUE si le navigateur est reconnu comme incapable de piloter
 * l'animation. Dans un navigateur moderne, le hook ne fait rien.
 *
 * `Parallax` n'a volontairement pas de repli : sans support, il reste statique.
 */
export function useMotionFallback(): void {
  useEffect(() => {
    // Le test n'a de sens qu'au montage, côté client.
    if (typeof CSS === "undefined" || typeof CSS.supports !== "function") return;
    if (CSS.supports("animation-timeline", "view()")) return;
    if (typeof IntersectionObserver === "undefined") return;

    const root = document.documentElement;
    const targets = document.querySelectorAll<Element>(".reveal, .draw-path");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          // L'élément est révélé une fois pour toutes : on cesse de l'observer.
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    root.classList.add("js-reveal");
    targets.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      root.classList.remove("js-reveal");
    };
  }, []);
}
