import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { AchatFiche, FicheVisuel } from "@/components/fiches/FichesUi";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  estEnVente,
  fichesDuNiveau,
  NIVEAU_INFO,
  POINTS_BREVET,
  prixNumerique,
  trouverFiche,
  type Fiche,
} from "@/data/fiches";
import { SITE_URL } from "@/data/home-content";

export const Route = createFileRoute("/fiches/$slug")({
  loader: ({ params }) => {
    const fiche = trouverFiche(params.slug);
    if (!fiche) throw notFound();
    return fiche;
  },
  // Chaque page produit a son propre titre et sa propre description : c'est ce
  // qui lui permet de remonter dans Google sur sa propre recherche.
  head: ({ loaderData: fiche }) => {
    if (!fiche) return {};
    const url = `${SITE_URL}/fiches/${fiche.slug}`;
    const image = fiche.img ? `${SITE_URL}${fiche.img}` : `${SITE_URL}/og-image.png?v=2`;
    return {
      meta: [
        { title: fiche.seoTitle },
        { name: "description", content: fiche.seoDescription },
        { property: "og:type", content: "website" },
        { property: "og:title", content: fiche.seoTitle },
        { property: "og:description", content: fiche.seoDescription },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      // Données structurées uniquement pour ce qui se vend vraiment.
      scripts: estEnVente(fiche)
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify(donneesProduit(fiche, url, image)),
            },
          ]
        : [],
    };
  },
  component: FicheProduitPage,
});

function donneesProduit(fiche: Fiche & { url: string; prix: string }, url: string, image: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Fiches de révision ${fiche.matiere} ${NIVEAU_INFO[fiche.niveau].long}`,
    description: fiche.seoDescription,
    image,
    brand: { "@type": "Brand", name: "Coursinus" },
    offers: {
      "@type": "Offer",
      url,
      price: prixNumerique(fiche.prix),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  };
}

function FicheProduitPage() {
  const fiche = Route.useLoaderData();
  const info = NIVEAU_INFO[fiche.niveau];
  const enVente = estEnVente(fiche);
  const voisines = fichesDuNiveau(fiche.niveau).filter((f) => f.slug !== fiche.slug);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-14">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/fiches"
            search={{ niveau: fiche.niveau }}
            className="inline-flex items-center gap-2 text-sm text-gold-soft transition hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Toutes les fiches
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-14">
            <div className="overflow-hidden rounded-xl border border-border/60 bg-card/60">
              <FicheVisuel fiche={fiche} eager />
            </div>

            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-gold-soft uppercase">
                {info.long}
                {enVente ? "" : " · bientôt disponible"}
              </p>
              <h1 className="mt-3 font-display text-3xl leading-[1.1] text-gold sm:text-4xl">
                {fiche.matiere}
                <span className="block text-xl text-foreground sm:text-2xl">
                  Fiches de révision · {info.long}
                </span>
              </h1>

              <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                <div>
                  <dt className="text-xs tracking-[0.15em] text-muted-foreground uppercase">
                    Niveau
                  </dt>
                  <dd className="mt-1 text-foreground">{info.long}</dd>
                </div>
                {typeof fiche.fiches === "number" ? (
                  <div>
                    <dt className="text-xs tracking-[0.15em] text-muted-foreground uppercase">
                      Contenu
                    </dt>
                    <dd className="mt-1 text-foreground">{fiche.fiches} fiches</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-xs tracking-[0.15em] text-muted-foreground uppercase">
                    Prix
                  </dt>
                  <dd className="mt-1 flex items-baseline gap-2 text-foreground">
                    {fiche.prix ? (
                      <>
                        <span className="font-display text-2xl">{fiche.prix}</span>
                        {fiche.ancienPrix ? (
                          <span className="text-muted-foreground line-through">
                            {fiche.ancienPrix}
                          </span>
                        ) : null}
                        {fiche.reduction ? (
                          <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-semibold text-gold">
                            {fiche.reduction}
                          </span>
                        ) : null}
                      </>
                    ) : (
                      <span className="text-muted-foreground">À venir</span>
                    )}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 space-y-3 text-base leading-relaxed text-muted-foreground">
                {fiche.paragraphes.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>

              {enVente ? (
                <ul className="mt-6 space-y-2.5">
                  {POINTS_BREVET.map((p) => (
                    <li key={p} className="flex gap-3 text-sm leading-relaxed text-foreground">
                      <span className="mt-0.5 text-gold">✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-8 max-w-sm">
                <AchatFiche fiche={fiche} variante="plein" />
                {enVente ? (
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    Paiement sécurisé par Stripe (carte, Apple Pay…). Téléchargement immédiat après
                    le paiement. Fiches réservées à un usage personnel.
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <section className="mt-16" aria-labelledby="autres-fiches">
            <h2 id="autres-fiches" className="font-display text-xl text-gold sm:text-2xl">
              Autres fiches · {info.long}
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {voisines.map((f) => (
                <li key={f.slug}>
                  <Link
                    to="/fiches/$slug"
                    params={{ slug: f.slug }}
                    className="inline-flex rounded-full border border-gold/30 px-4 py-2 text-sm text-gold-soft transition hover:border-gold/70 hover:bg-gold/10"
                  >
                    {f.matiere}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
