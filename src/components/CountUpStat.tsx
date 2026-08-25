import { useEffect, useRef, useState } from "react";

/**
 * Anime un chiffre de 0 jusqu'à sa valeur cible quand il entre dans l'écran.
 * Accepte des valeurs du type "150+", "95 %", "12", "100 %" — seule la
 * partie numérique de tête est animée, le reste (suffixe) reste statique.
 */
export function CountUpStat({ value }: { value: string }) {
  const match = /^(\d+)(.*)$/.exec(value.trim());
  const target = match?.[1] ? parseInt(match[1], 10) : null;
  const suffix = match?.[2] ?? "";

  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(target === null ? value : "0");

  useEffect(() => {
    if (target === null) return;
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(String(target));
      return;
    }

    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started) return;
        started = true;
        observer.disconnect();

        const duration = 1100;
        const startTime = performance.now();

        function tick(now: number) {
          const progress = Math.min(1, (now - startTime) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(String(Math.round(eased * (target ?? 0))));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  if (target === null) {
    return <span ref={ref}>{value}</span>;
  }

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
