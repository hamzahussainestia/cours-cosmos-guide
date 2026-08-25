/**
 * Filigrane de formules scientifiques qui dérivent lentement en fond de page.
 *
 * Purement décoratif : masqué sous xl (pas de marges assez larges), sans
 * interaction possible, et invisible pour les lecteurs d'écran. Les formules
 * sont celles du programme collège → prépa que couvre Coursinus (analyse,
 * trigonométrie, algèbre, mécanique, thermodynamique, chimie).
 *
 * Durées et décalages de la dérive sont dérivés de l'index, jamais tirés au
 * hasard : le rendu serveur et le rendu client doivent coïncider.
 */

type Figure = "trig" | "atom" | "parab" | "benzene";

type Item = {
  /** Formule à afficher, ou nom d'une figure dessinée. */
  content: string | Figure;
  /** Position verticale dans la page, en %. */
  top: number;
  side: "left" | "right";
  /** Taille en px pour le texte. */
  size?: number;
  rotate?: number;
};

const FIGURES: Figure[] = ["trig", "atom", "parab", "benzene"];

const ITEMS: Item[] = [
  { content: "a² + b² = c²", top: 1.5, side: "right", size: 21, rotate: -5 },
  { content: "Δ = b² − 4ac", top: 4, side: "left", size: 18, rotate: 4 },
  { content: "eⁱᶿ = cos θ + i sin θ", top: 6.5, side: "right", size: 15, rotate: 3 },
  { content: "trig", top: 9, side: "left", rotate: -6 },
  { content: "(a+b)² = a² + 2ab + b²", top: 11.5, side: "right", size: 14, rotate: -3 },
  { content: "cos²θ + sin²θ = 1", top: 14, side: "left", size: 16, rotate: 5 },
  { content: "E = hν", top: 16.5, side: "right", size: 24, rotate: -4 },
  { content: "uₙ = u₀ · qⁿ", top: 19, side: "left", size: 19, rotate: 3 },
  { content: "parab", top: 21.5, side: "right", rotate: 4 },
  { content: "e^iπ + 1 = 0", top: 24, side: "left", size: 23, rotate: -5 },
  { content: "(u·v)′ = u′v + uv′", top: 26.5, side: "right", size: 16, rotate: 5 },
  { content: "ln(ab) = ln a + ln b", top: 29, side: "left", size: 15, rotate: -3 },
  { content: "E = mc²", top: 31.5, side: "right", size: 26, rotate: -4 },
  { content: "benzene", top: 34, side: "left", rotate: 6 },
  { content: "∫₀¹ x² dx = 1/3", top: 36.5, side: "right", size: 18, rotate: 4 },
  { content: "Eₖ = ½mv²", top: 39, side: "left", size: 20, rotate: -5 },
  { content: "atom", top: 41.5, side: "right", rotate: 0 },
  { content: "(u/v)′ = (u′v − uv′)/v²", top: 44, side: "left", size: 14, rotate: 3 },
  { content: "Σ 1/n² = π²/6", top: 46.5, side: "right", size: 20, rotate: -4 },
  { content: "det(AB) = det A · det B", top: 49, side: "left", size: 14, rotate: 5 },
  { content: "PV = nRT", top: 51.5, side: "right", size: 19, rotate: 4 },
  { content: "U = R · I", top: 54, side: "left", size: 23, rotate: -3 },
  { content: "lim (1 + 1/n)ⁿ = e", top: 56.5, side: "right", size: 16, rotate: 3 },
  { content: "trig", top: 59, side: "left", rotate: 5 },
  { content: "F = G·m₁m₂ / r²", top: 61.5, side: "right", size: 17, rotate: -5 },
  { content: "V = (4/3)πr³", top: 64, side: "left", size: 19, rotate: 4 },
  { content: "d/dx (eˣ) = eˣ", top: 66.5, side: "right", size: 21, rotate: -3 },
  { content: "ΔU = W + Q", top: 69, side: "left", size: 18, rotate: 5 },
  { content: "parab", top: 71.5, side: "right", rotate: -4 },
  { content: "P(A∪B) = P(A) + P(B) − P(A∩B)", top: 74, side: "left", size: 13, rotate: 3 },
  { content: "λ = c / ν", top: 76.5, side: "right", size: 22, rotate: -4 },
  { content: "∫ dx/x = ln|x| + C", top: 79, side: "left", size: 17, rotate: 4 },
  {
    content: "sin(a+b) = sin a cos b + cos a sin b",
    top: 81.5,
    side: "right",
    size: 13,
    rotate: 3,
  },
  { content: "benzene", top: 84, side: "left", rotate: -5 },
  { content: "∇·E = ρ / ε₀", top: 86.5, side: "right", size: 19, rotate: -4 },
  { content: "‖u + v‖ ≤ ‖u‖ + ‖v‖", top: 89, side: "left", size: 15, rotate: 5 },
  { content: "atom", top: 91.5, side: "right", rotate: 0 },
  { content: "p = m · v", top: 94, side: "left", size: 21, rotate: 3 },
  { content: "tan θ = sin θ / cos θ", top: 96.5, side: "right", size: 15, rotate: -4 },
  { content: "F = m · a", top: 98.5, side: "left", size: 23, rotate: 4 },
];

/** Cercle trigonométrique : rayon, angle et projections. */
function TrigFigure() {
  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24" fill="none" stroke="currentColor">
      <circle cx="60" cy="60" r="44" strokeWidth="1.5" />
      <path d="M16 60 H104 M60 16 V104" strokeWidth="1" />
      <path d="M60 60 L91 29" strokeWidth="1.5" />
      <path d="M91 29 V60" strokeWidth="1" strokeDasharray="3 3" />
      <path d="M91 29 H60" strokeWidth="1" strokeDasharray="3 3" />
      <path d="M78 60 A18 18 0 0 0 73 47" strokeWidth="1.2" />
    </svg>
  );
}

/** Schéma d'atome : noyau et orbitales croisées. */
function AtomFigure() {
  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24" fill="none" stroke="currentColor">
      <circle cx="60" cy="60" r="7" strokeWidth="1.5" />
      <ellipse cx="60" cy="60" rx="46" ry="18" strokeWidth="1.3" />
      <ellipse cx="60" cy="60" rx="46" ry="18" strokeWidth="1.3" transform="rotate(60 60 60)" />
      <ellipse cx="60" cy="60" rx="46" ry="18" strokeWidth="1.3" transform="rotate(120 60 60)" />
    </svg>
  );
}

/** Repère et parabole, avec sa tangente au sommet. */
function ParabolaFigure() {
  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24" fill="none" stroke="currentColor">
      <path d="M18 104 H108 M24 14 V110" strokeWidth="1" />
      <path d="M30 22 Q 64 128 104 30" strokeWidth="1.6" />
      <path d="M34 82 H96" strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  );
}

/** Cycle benzénique. */
function BenzeneFigure() {
  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24" fill="none" stroke="currentColor">
      <path d="M60 16 L98 38 V82 L60 104 L22 82 V38 Z" strokeWidth="1.6" />
      <circle cx="60" cy="60" r="22" strokeWidth="1.3" />
    </svg>
  );
}

function renderFigure(name: Figure) {
  if (name === "trig") return <TrigFigure />;
  if (name === "atom") return <AtomFigure />;
  if (name === "parab") return <ParabolaFigure />;
  return <BenzeneFigure />;
}

const DRIFT_CLASSES = ["drift-a", "drift-b", "drift-c", "drift-d"];

export function FormulaBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 hidden overflow-hidden text-gold select-none xl:block"
      aria-hidden
    >
      {ITEMS.map((item, i) => {
        const positional =
          item.side === "left"
            ? { left: "clamp(0.5rem, 3vw, 4rem)" }
            : { right: "clamp(0.5rem, 3vw, 4rem)" };

        const isFigure = (FIGURES as string[]).includes(item.content);

        return (
          <div
            key={i}
            className="absolute opacity-[0.14]"
            style={{ top: `${item.top}%`, ...positional }}
          >
            <div
              className={`drift ${DRIFT_CLASSES[i % DRIFT_CLASSES.length]}`}
              style={{
                animationDuration: `${16 + (i % 7) * 2.5}s`,
                animationDelay: `-${(i % 11) * 1.7}s`,
              }}
            >
              <div style={{ transform: `rotate(${item.rotate ?? 0}deg)` }}>
                {isFigure ? (
                  renderFigure(item.content as Figure)
                ) : (
                  <span
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontStyle: "italic",
                      fontSize: `${item.size ?? 16}px`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.content}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
