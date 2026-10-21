import { Link } from "@tanstack/react-router";

import { estEnVente, NIVEAU_INFO, type Fiche } from "@/data/fiches";
import { cn } from "@/lib/utils";

/**
 * Miniature d'une fiche. Quand le visuel n'existe pas encore (2de et 1re),
 * un cartouche aux couleurs du site tient la place : aucune image n'est
 * inventée.
 */
export function FicheVisuel({
  fiche,
  className,
  eager = false,
}: {
  fiche: Fiche;
  className?: string;
  eager?: boolean;
}) {
  if (fiche.img) {
    return (
      <img
        src={fiche.img}
        alt={
          fiche.pack
            ? `Les 8 matières du pack complet de fiches de révision ${NIVEAU_INFO[fiche.niveau].long}`
            : `Fiches de révision ${fiche.matiere} ${NIVEAU_INFO[fiche.niveau].long}`
        }
        loading={eager ? "eager" : "lazy"}
        className={cn("aspect-[4/3] w-full object-cover", className)}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`Fiches de révision ${fiche.matiere} ${NIVEAU_INFO[fiche.niveau].long}, bientôt disponibles`}
      className={cn(
        "flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-gold/15 via-card to-primary/10 p-4 text-center",
        className,
      )}
    >
      <span className="font-display text-xl leading-tight text-gold sm:text-2xl">
        {fiche.matiere}
      </span>
      <span className="text-xs font-semibold tracking-[0.18em] text-gold-soft uppercase">
        {NIVEAU_INFO[fiche.niveau].long}
      </span>
    </div>
  );
}

/** Mention affichée à la place du bouton d'achat tant qu'aucun lien n'existe. */
export function BientotDisponible({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex cursor-not-allowed items-center justify-center rounded-full border border-dashed border-gold/40 px-4 py-2.5 text-sm font-semibold text-gold-soft",
        className,
      )}
    >
      Bientôt disponible
    </span>
  );
}

/**
 * Bouton d'achat : lien Stripe si la fiche est en vente, « Bientôt disponible »
 * sinon. Le lien est celui du catalogue, jamais reconstruit.
 */
export function AchatFiche({
  fiche,
  variante = "carte",
  className,
}: {
  fiche: Fiche;
  variante?: "carte" | "plein";
  className?: string;
}) {
  if (!estEnVente(fiche)) {
    return <BientotDisponible className={cn("w-full", className)} />;
  }
  if (variante === "plein") {
    return (
      <a
        href={fiche.url}
        className={cn(
          "btn-press inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3.5 text-[15px] font-semibold text-primary-foreground",
          className,
        )}
      >
        {fiche.pack ? "Acheter le pack complet" : "Acheter"} · {fiche.prix}
      </a>
    );
  }
  return (
    <a
      href={fiche.url}
      className={cn(
        "inline-flex w-full items-center justify-center rounded-full border border-gold/40 bg-gold/5 px-4 py-2.5 text-sm font-semibold text-gold transition hover:-translate-y-px hover:border-gold/70 hover:bg-gold/15",
        className,
      )}
    >
      Acheter · {fiche.prix}
    </a>
  );
}

/** Carte d'une matière dans la grille de /fiches. */
export function FicheCarte({ fiche }: { fiche: Fiche }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card/60">
      <Link to="/fiches/$slug" params={{ slug: fiche.slug }} aria-label={`Voir ${fiche.matiere}`}>
        <FicheVisuel fiche={fiche} />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-xl text-foreground">
            <Link to="/fiches/$slug" params={{ slug: fiche.slug }} className="hover:text-gold">
              {fiche.matiere}
            </Link>
          </h3>
          {typeof fiche.fiches === "number" ? (
            <span className="shrink-0 text-xs text-muted-foreground">{fiche.fiches} fiches</span>
          ) : null}
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{fiche.detail}</p>
        <div className="mt-4">
          <AchatFiche fiche={fiche} />
        </div>
        <Link
          to="/fiches/$slug"
          params={{ slug: fiche.slug }}
          className="mt-3 text-center text-xs text-gold-soft underline-offset-4 hover:underline"
        >
          Voir le détail
        </Link>
      </div>
    </div>
  );
}
