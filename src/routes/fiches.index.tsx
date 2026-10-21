import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Download } from "lucide-react";

import { AchatFiche, FicheCarte, FicheVisuel } from "@/components/fiches/FichesUi";
import { ouvrirNewsletter } from "@/components/NewsletterPopup";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ECHANTILLON_MATHS,
  fichesDuNiveau,
  NIVEAU_INFO,
  NIVEAUX,
  pointsDuNiveau,
  trouverFiche,
  type Fiche,
  type Niveau,
} from "@/data/fiches";
import { SITE_URL } from "@/data/home-content";

type FichesSearch = { niveau?: Niveau };

/** Nombre de fiches du pack de seconde, pour la description de la page. */
const TOTAL_2DE = trouverFiche("pack-seconde")?.fiches ?? 0;

export const Route = createFileRoute("/fiches/")({
  // Onglet actif dans l'URL (?niveau=2de) : on peut partager un niveau précis
  // et le lien « retour » d'une page produit retombe sur le bon onglet.
  validateSearch: (search: Record<string, unknown>): FichesSearch => {
    const niveau = NIVEAUX.find((n) => n === search["niveau"]);
    return niveau ? { niveau } : {};
  },
  head: () => ({
    meta: [
      { title: "Les fiches d'Azma — fiches de révision 3e, 2de, 1re — Coursinus" },
      {
        name: "description",
        content: `Fiches de révision du brevet (76 fiches, dès 4,99 €) et de seconde (${TOTAL_2DE} fiches, dès 5,99 €) : maths, physique-chimie, SVT, SES, SNT, histoire-géo, EMC, français. Première bientôt.`,
      },
      { property: "og:title", content: "Les fiches d'Azma — fiches de révision — Coursinus" },
      {
        property: "og:description",
        content:
          "Tout le programme en fiches claires, avec schémas, exercices corrigés et quiz. Brevet 3e et seconde disponibles, première bientôt.",
      },
      { property: "og:image", content: `${SITE_URL}/fiches-brevet/miniatures/pack.jpg` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/fiches` }],
  }),
  component: FichesPage,
});

const APERCUS = [
  {
    src: "/fiches-brevet/apercu-maths.jpg",
    alt: "Aperçu d'une fiche de maths : le théorème de Pythagore",
  },
  {
    src: "/fiches-brevet/apercu-histoire.jpg",
    alt: "Aperçu d'une fiche d'histoire : la guerre froide, avec une carte",
  },
  {
    src: "/fiches-brevet/apercu-svt.jpg",
    alt: "Aperçu d'une fiche de SVT : la division cellulaire, avec des schémas",
  },
];

/** Carte du pack complet : mise en avant, un achat pour tout le niveau. */
function CartePack({ fiche }: { fiche: Fiche }) {
  const enVente = typeof fiche.url === "string";
  return (
    <div className="rounded-xl border border-gold/40 bg-card/60 p-6 shadow-sm sm:p-8">
      <Link to="/fiches/$slug" params={{ slug: fiche.slug }} aria-label="Voir le pack complet">
        <FicheVisuel fiche={fiche} eager className="-mx-2 mb-5 w-[calc(100%+1rem)] rounded-lg" />
      </Link>
      <p className="text-xs font-semibold tracking-[0.18em] text-gold-soft uppercase">
        {enVente ? "Le plus avantageux" : "En préparation"}
      </p>
      <h2 className="mt-2 font-display text-2xl text-gold">
        <Link to="/fiches/$slug" params={{ slug: fiche.slug }}>
          Pack complet{enVente ? " · 8 matières" : ""}
        </Link>
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{fiche.detail}</p>
      {fiche.prix ? (
        <p className="mt-5 flex items-baseline gap-3">
          <span className="font-display text-4xl text-foreground">{fiche.prix}</span>
          {fiche.ancienPrix ? (
            <span className="text-sm text-muted-foreground line-through">{fiche.ancienPrix}</span>
          ) : null}
          {fiche.reduction ? (
            <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-semibold text-gold">
              {fiche.reduction}
            </span>
          ) : null}
        </p>
      ) : null}
      <div className="mt-6">
        <AchatFiche fiche={fiche} variante="plein" />
      </div>
      {enVente ? (
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Paiement sécurisé par Stripe (carte, Apple Pay…). Téléchargement immédiat après le
          paiement.
        </p>
      ) : null}
    </div>
  );
}

/** Les quatre pages de maths offertes, proposées à chaque niveau. */
function EchantillonGratuit({ niveau }: { niveau: Niveau }) {
  const info = NIVEAU_INFO[niveau];
  return (
    <div className="mt-14 rounded-xl border border-gold/40 bg-gold/5 p-6 sm:p-8">
      <p className="text-xs font-semibold tracking-[0.18em] text-gold-soft uppercase">Gratuit</p>
      <h2 className="mt-2 font-display text-2xl text-gold sm:text-3xl">
        Teste les fiches de maths, gratuitement
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Quatre pages des fiches de maths de {info.classe}, offertes : le vrai format, les vrais
        schémas. Télécharge-les tout de suite, ou reçois-les par mail.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={ECHANTILLON_MATHS[niveau]}
          download
          className="btn-press inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          <Download className="h-4 w-4" aria-hidden />
          Télécharger les 4 pages de maths
        </a>
        <button
          type="button"
          onClick={ouvrirNewsletter}
          className="inline-flex items-center justify-center rounded-full border border-gold/40 px-5 py-3 text-sm font-semibold text-gold transition hover:border-gold/70 hover:bg-gold/10"
        >
          Les recevoir par mail
        </button>
      </div>
    </div>
  );
}

function PanneauNiveau({ niveau }: { niveau: Niveau }) {
  const toutes = fichesDuNiveau(niveau);
  const pack = toutes.find((f) => f.pack);
  const matieres = toutes.filter((f) => !f.pack);
  const info = NIVEAU_INFO[niveau];
  /* Le prix affiché vient du catalogue : 4,99 € en 3e, 5,99 € en 2de. */
  const prixMatiere = matieres.find((f) => f.prix)?.prix;

  return (
    <div>
      {!info.enVente ? (
        <p className="rounded-xl border border-dashed border-gold/40 bg-gold/5 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-gold-soft">Bientôt disponible.</strong> Les fiches de{" "}
          {info.long.toLowerCase()} sont écrites, matière par matière. Les prix et la date de mise
          en vente seront annoncés ici.
        </p>
      ) : null}

      {info.enVente && pack ? (
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-14">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-gold-soft uppercase">
              {niveau === "3e"
                ? "Brevet 2027 · Classe de 3e"
                : `Classe de ${info.long.toLowerCase()}`}
            </p>
            <h2 className="mt-4 font-display text-3xl leading-[1.05] text-gold sm:text-4xl">
              {niveau === "3e"
                ? "Fiches de révision du brevet"
                : `Fiches de révision de ${info.long.toLowerCase()}`}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {pack.fiches} fiches claires pour réviser toutes les matières{" "}
              {niveau === "3e" ? "du brevet" : `de ${info.long.toLowerCase()}`}, au format PDF, à
              lire sur ton téléphone ou à imprimer.
            </p>
            <ul className="mt-6 space-y-2.5">
              {pointsDuNiveau(niveau).map((p) => (
                <li key={p} className="flex gap-3 text-sm leading-relaxed text-foreground">
                  <span className="mt-0.5 text-gold">✓</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <CartePack fiche={pack} />
        </div>
      ) : pack ? (
        <div className="mt-6 max-w-md">
          <CartePack fiche={pack} />
        </div>
      ) : null}

      {niveau === "3e" ? (
        <div className="mt-14">
          <h2 className="font-display text-2xl text-gold sm:text-3xl">
            À quoi ressemblent les fiches
          </h2>
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
      ) : null}

      <div className="mt-14">
        <h2 className="font-display text-2xl text-gold sm:text-3xl">
          {info.enVente ? "Ou par matière" : "Les matières"}
        </h2>
        {info.enVente && prixMatiere ? (
          <p className="mt-2 text-sm text-muted-foreground">{prixMatiere} la matière.</p>
        ) : null}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {matieres.map((f) => (
            <FicheCarte key={f.slug} fiche={f} />
          ))}
        </div>
      </div>

      <EchantillonGratuit niveau={niveau} />

      {info.enVente ? (
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
      ) : null}
    </div>
  );
}

function FichesPage() {
  const { niveau = "3e" } = Route.useSearch();
  const navigate = useNavigate({ from: "/fiches/" });

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-gold-soft uppercase">
            Fiches de révision
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] text-gold sm:text-5xl">
            Les fiches d&apos;Azma
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Le programme en fiches claires, matière par matière, au format PDF. Le brevet et la
            seconde sont disponibles dès maintenant ; la première arrive.
          </p>

          <Tabs
            value={niveau}
            onValueChange={(v) => {
              const suivant = NIVEAUX.find((n) => n === v);
              if (suivant) void navigate({ search: { niveau: suivant }, replace: true });
            }}
            className="mt-10"
          >
            <TabsList className="grid h-auto w-full max-w-md grid-cols-3 gap-1 rounded-full border border-gold/20 bg-card/60 p-1">
              {NIVEAUX.map((n) => (
                <TabsTrigger
                  key={n}
                  value={n}
                  className="flex-col gap-0.5 rounded-full py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
                >
                  <span className="text-base font-semibold">{n}</span>
                  <span className="text-[10px] font-medium tracking-[0.12em] uppercase opacity-80">
                    {NIVEAU_INFO[n].enVente ? "En vente" : "Bientôt"}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Les trois panneaux restent dans le HTML (forceMount) : les liens
                vers les pages produit de la 2de et de la 1re sont ainsi
                visibles des moteurs de recherche, sans JavaScript. */}
            {NIVEAUX.map((n) => (
              <TabsContent
                key={n}
                value={n}
                forceMount
                className="mt-10 data-[state=inactive]:hidden"
              >
                <PanneauNiveau niveau={n} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
