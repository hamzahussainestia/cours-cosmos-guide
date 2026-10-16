import { createFileRoute } from "@tanstack/react-router";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/fiches-brevet")({
  head: () => ({
    meta: [
      { title: "Fiches de révision Brevet 3e — Coursinus" },
      {
        name: "description",
        content:
          "76 fiches de révision pour tout le brevet : maths, physique-chimie, SVT, techno, histoire, géo, EMC et français. Schémas, cartes, exercices corrigés. Dès 4,99 €.",
      },
      { property: "og:title", content: "Fiches de révision Brevet 3e — Coursinus" },
      {
        property: "og:description",
        content:
          "Tout le programme du brevet en fiches claires, avec schémas, cartes, exercices type brevet corrigés et quiz.",
      },
      { property: "og:image", content: "https://coursinus.fr/fiches-brevet/miniatures/pack.jpg" },
    ],
  }),
  component: FichesBrevetPage,
});

/* Liens de paiement Stripe. Après le paiement, Stripe redirige l'acheteur
   vers sa page de téléchargement (réglé dans chaque lien de paiement). */
const PACK = {
  url: "https://buy.stripe.com/fZudRb2q37qmegyfdbasg0d",
  price: "19,99 €",
  old: "39,92 €",
};

const MATIERES = [
  { nom: "Mathématiques", img: "/fiches-brevet/miniatures/maths.jpg", fiches: 15, detail: "Arithmétique, calcul littéral, fonctions, Pythagore, Thalès, trigo, statistiques, probabilités, Scratch…", url: "https://buy.stripe.com/5kQ7sN8Or11Y3BU8ONasg0e" },
  { nom: "Physique-Chimie", img: "/fiches-brevet/miniatures/pc.jpg", fiches: 11, detail: "Atomes et ions, transformations chimiques, pH, mouvements, forces, énergie, électricité, signaux, Univers.", url: "https://buy.stripe.com/4gMcN73u79yua0i8ONasg0f" },
  { nom: "SVT", img: "/fiches-brevet/miniatures/svt.jpg", fiches: 11, detail: "ADN et chromosomes, reproduction, évolution, immunité, système nerveux, nutrition, Terre, climat, écosystèmes.", url: "https://buy.stripe.com/9B6cN7fcP9yub4mghfasg0g" },
  { nom: "Technologie", img: "/fiches-brevet/miniatures/techno.jpg", fiches: 6, detail: "Besoin et cahier des charges, chaînes d'énergie et d'information, matériaux, programmation, réseaux, projet.", url: "https://buy.stripe.com/5kQ4gBggT6mi1tM6GFasg0h" },
  { nom: "Histoire", img: "/fiches-brevet/miniatures/histoire.jpg", fiches: 11, detail: "Les deux guerres mondiales, totalitarismes, guerre froide, décolonisation, Europe, Ve République…", url: "https://buy.stripe.com/eVqfZj0hVfWSfkC2qpasg0i" },
  { nom: "Géographie", img: "/fiches-brevet/miniatures/geo.jpg", fiches: 7, detail: "Aires urbaines, espaces productifs, faible densité, aménagement, outre-mer, UE, la France dans le monde.", url: "https://buy.stripe.com/6oU28t6Gj9yu5K26GFasg0j" },
  { nom: "EMC", img: "/fiches-brevet/miniatures/emc.jpg", fiches: 4, detail: "Nouveau programme 2026 : Constitution et séparation des pouvoirs, Europe, information, engagement.", url: "https://buy.stripe.com/cNi28t1lZ4eaegyaWVasg0k" },
  { nom: "Français", img: "/fiches-brevet/miniatures/francais.jpg", fiches: 11, detail: "Grammaire, conjugaison, accords, figures de style, et les méthodes pour la dictée, la rédaction et les questions.", url: "https://buy.stripe.com/28E9AV9Sv2622xQ2qpasg0l" },
];

const APERCUS = [
  { src: "/fiches-brevet/apercu-maths.jpg", alt: "Aperçu d'une fiche de maths : le théorème de Pythagore" },
  { src: "/fiches-brevet/apercu-histoire.jpg", alt: "Aperçu d'une fiche d'histoire : la guerre froide, avec une carte" },
  { src: "/fiches-brevet/apercu-svt.jpg", alt: "Aperçu d'une fiche de SVT : la division cellulaire, avec des schémas" },
];

const POINTS = [
  "Tout le programme du brevet 2027, chapitre par chapitre",
  "Des schémas, des cartes et des frises dans chaque fiche",
  "Un exercice type brevet corrigé et un quiz par chapitre",
  "Les pièges classiques signalés, pour ne pas perdre de points",
];

function FichesBrevetPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        {/* ---------------------------------------------------------- hero */}
        <section className="px-5 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-16">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">
                Brevet 2027 · Classe de 3e
              </p>
              <h1 className="mt-4 font-display text-4xl leading-[1.05] text-gold sm:text-5xl">
                Fiches de révision
                <br />
                du brevet
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                76 fiches claires pour réviser toutes les matières du brevet, au format PDF, à
                lire sur ton téléphone ou à imprimer.
              </p>
              <ul className="mt-6 space-y-2.5">
                {POINTS.map((p) => (
                  <li key={p} className="flex gap-3 text-sm leading-relaxed text-foreground">
                    <span className="mt-0.5 text-gold">✓</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ------------------------------------------------ carte pack */}
            <div className="rounded-xl border border-gold/40 bg-card/60 p-6 shadow-sm sm:p-8">
              <img
                src="/fiches-brevet/miniatures/pack.jpg"
                alt="Les 8 matières du pack complet de fiches de révision du brevet"
                className="-mx-2 mb-5 w-[calc(100%+1rem)] rounded-lg"
              />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">
                Le plus avantageux
              </p>
              <h2 className="mt-2 font-display text-2xl text-gold">Pack complet · 8 matières</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Les 76 fiches dans un seul PDF, plus chaque matière en fichier séparé.
              </p>
              <p className="mt-5 flex items-baseline gap-3">
                <span className="font-display text-4xl text-foreground">{PACK.price}</span>
                <span className="text-sm text-muted-foreground line-through">{PACK.old}</span>
                <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-semibold text-gold">
                  -50 %
                </span>
              </p>
              <a
                href={PACK.url}
                className="btn-press mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3.5 text-[15px] font-semibold text-primary-foreground"
              >
                Acheter le pack complet
              </a>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Paiement sécurisé par Stripe (carte, Apple Pay…). Téléchargement immédiat après le
                paiement.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- aperçus */}
        <section className="px-5 pb-14 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display text-2xl text-gold sm:text-3xl">À quoi ressemblent les fiches</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {APERCUS.map((a) => (
                <img
                  key={a.src}
                  src={a.src}
                  alt={a.alt}
                  loading="lazy"
                  className="w-full rounded-lg border border-border/60 shadow-sm"
                />
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ matières */}
        <section className="px-5 pb-16 sm:px-8 sm:pb-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display text-2xl text-gold sm:text-3xl">Ou par matière</h2>
            <p className="mt-2 text-sm text-muted-foreground">4,99 € la matière.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {MATIERES.map((m) => (
                <div
                  key={m.nom}
                  className="flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card/60"
                >
                  <img
                    src={m.img}
                    alt={`Fiches de révision brevet : ${m.nom}`}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-xl text-foreground">{m.nom}</h3>
                    <span className="text-xs text-muted-foreground">{m.fiches} fiches</span>
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {m.detail}
                  </p>
                  <a
                    href={m.url}
                    className="mt-4 inline-flex items-center justify-center rounded-full border border-gold/40 bg-gold/5 px-4 py-2.5 text-sm font-semibold text-gold transition hover:-translate-y-px hover:border-gold/70 hover:bg-gold/15"
                  >
                    Acheter · 4,99 €
                  </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-xl border border-border/60 bg-card/40 p-6 text-sm leading-relaxed text-muted-foreground">
              <p>
                <strong className="text-foreground">Comment ça marche ?</strong> Tu paies sur la page
                sécurisée de Stripe, puis tu arrives directement sur ta page de téléchargement.
                Enregistre tes fichiers tout de suite. Un souci ? Écris-nous à{" "}
                <a className="text-gold-soft underline" href="mailto:coursinus.aide@gmail.com">
                  coursinus.aide@gmail.com
                </a>{" "}
                avec l&apos;adresse mail utilisée pour le paiement.
              </p>
              <p className="mt-3">
                Fiches réservées à un usage personnel. Contenu numérique fourni immédiatement après
                l&apos;achat.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
