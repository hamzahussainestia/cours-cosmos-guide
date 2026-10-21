/*
 * Catalogue des fiches de révision d'Azma.
 *
 * Source unique pour la page /fiches, les pages produit /fiches/<slug> et le
 * bloc « Nouveau » de l'accueil.
 *
 * Règle : rien n'est inventé. Les liens Stripe et prix sont recopiés tels quels
 * de ce que Coursinus a fourni. Les nombres de fiches et les chapitres viennent
 * de `chapitres.ts`, releve directement dans le sommaire des PDF. La 1re n'a
 * pas encore de lien de paiement : l'interface affiche « Bientôt disponible ».
 */

import { CHAPITRES } from "./chapitres";

export type Niveau = "3e" | "2de" | "1re";

export const NIVEAUX: readonly Niveau[] = ["3e", "2de", "1re"] as const;

export type Fiche = {
  /** Fragment d'URL : /fiches/<slug>. */
  slug: string;
  niveau: Niveau;
  /** Nom affiché de la matière (ou « Pack complet »). */
  matiere: string;
  /** Forme avec préposition, pour les phrases : « de maths », « d'EMC ». */
  de: string;
  pack: boolean;
  /** Miniature. Absente tant que le visuel n'existe pas. */
  img?: string;
  fiches?: number;
  /** Chapitres couverts, dans l'ordre du PDF. Vide pour les packs. */
  chapitres: readonly string[];
  prix?: string;
  ancienPrix?: string;
  reduction?: string;
  /** Résumé court, utilisé sur les cartes. */
  detail: string;
  /** Description détaillée, un paragraphe par entrée. */
  paragraphes: string[];
  /** Lien de paiement Stripe. Absent = pas encore en vente. */
  url?: string;
  seoTitle: string;
  seoDescription: string;
};

export const NIVEAU_INFO: Record<Niveau, { long: string; classe: string; enVente: boolean }> = {
  "3e": { long: "Brevet 3e", classe: "la classe de 3e", enVente: true },
  "2de": { long: "Seconde", classe: "la classe de seconde", enVente: true },
  "1re": { long: "Première", classe: "la classe de première", enVente: false },
};

/** Ce que contient chaque fiche du brevet (repris de l'ancienne page). */
export const POINTS_BREVET: readonly string[] = [
  "Tout le programme du brevet 2027, chapitre par chapitre",
  "Des schémas, des cartes et des frises dans chaque fiche",
  "Un exercice type brevet corrigé et un quiz par chapitre",
  "Les pièges classiques signalés, pour ne pas perdre de points",
];

/* Les fiches du lycée suivent le même principe, mais ne parlent pas du brevet :
   les arguments sont donc reformulés plutôt que réutilisés tels quels. */
const POINTS_LYCEE: readonly string[] = [
  "Tout le programme de l'année, chapitre par chapitre",
  "Des schémas et des exemples dans chaque fiche",
  "Un exercice corrigé et un quiz par chapitre",
  "Les pièges classiques signalés, pour ne pas perdre de points",
];

export function pointsDuNiveau(niveau: Niveau): readonly string[] {
  return niveau === "3e" ? POINTS_BREVET : POINTS_LYCEE;
}

const MINIATURES = "/fiches-brevet/miniatures";

/**
 * Visuels de couverture de la 2de et de la 1re, dans public/fiches/visuels.
 * La liste est explicite : une fiche sans visuel garde son cartouche de
 * remplacement plutôt que de pointer vers une image absente.
 */
const VISUELS = "/fiches/visuels";

const AVEC_VISUEL: ReadonlySet<string> = new Set([
  "pack-seconde",
  "maths-seconde",
  "physique-chimie-seconde",
  "svt-seconde",
  "ses-seconde",
  "snt-seconde",
  "histoire-geographie-seconde",
  "emc-seconde",
  "francais-seconde",
  "maths-premiere",
  "physique-chimie-premiere",
  "enseignement-scientifique-premiere",
  "histoire-geographie-premiere",
  "emc-premiere",
  "francais-premiere",
]);

function visuelDe(slug: string): string | undefined {
  return AVEC_VISUEL.has(slug) ? `${VISUELS}/${slug}.webp` : undefined;
}

/**
 * Échantillons gratuits : quatre pages de maths par niveau. Ce sont des
 * extraits, jamais les packs vendus — ceux-là ne sont pas dans public/.
 */
export const ECHANTILLON_MATHS: Record<Niveau, string> = {
  "3e": "/fiches/echantillon-maths-3e.pdf",
  "2de": "/fiches/echantillon-maths-2nde.pdf",
  "1re": "/fiches/echantillon-maths-1re.pdf",
};

/** Chapitres d'une fiche. Un pack n'en a pas : il regroupe les matières. */
function chapitresDe(slug: string): readonly string[] {
  return CHAPITRES[slug] ?? [];
}

/* ----------------------------------------------------------------- 3e */

type Brevet = {
  slug: string;
  matiere: string;
  de: string;
  img: string;
  fiches: number;
  detail: string;
  url: string;
  seoDescription: string;
};

/* Liens de paiement Stripe : après le paiement, Stripe redirige l'acheteur vers
   sa page de téléchargement (réglé dans chaque lien de paiement). */
const BREVET: readonly Brevet[] = [
  {
    slug: "maths-brevet-3e",
    matiere: "Mathématiques",
    de: "de mathématiques",
    img: `${MINIATURES}/maths.jpg`,
    fiches: 15,
    detail:
      "Arithmétique, calcul littéral, fonctions, Pythagore, Thalès, trigo, statistiques, probabilités, Scratch…",
    url: "https://buy.stripe.com/5kQ7sN8Or11Y3BU8ONasg0e",
    seoDescription:
      "15 fiches de révision de maths pour le brevet 3e : calcul littéral, fonctions, Pythagore, Thalès, trigo, probabilités. PDF à 4,99 €.",
  },
  {
    slug: "physique-chimie-brevet-3e",
    matiere: "Physique-Chimie",
    de: "de physique-chimie",
    img: `${MINIATURES}/pc.jpg`,
    fiches: 11,
    detail:
      "Atomes et ions, transformations chimiques, pH, mouvements, forces, énergie, électricité, signaux, Univers.",
    url: "https://buy.stripe.com/4gMcN73u79yua0i8ONasg0f",
    seoDescription:
      "11 fiches de révision de physique-chimie pour le brevet 3e : atomes et ions, forces, énergie, électricité, signaux. PDF à 4,99 €.",
  },
  {
    slug: "svt-brevet-3e",
    matiere: "SVT",
    de: "de SVT",
    img: `${MINIATURES}/svt.jpg`,
    fiches: 11,
    detail:
      "ADN et chromosomes, reproduction, évolution, immunité, système nerveux, nutrition, Terre, climat, écosystèmes.",
    url: "https://buy.stripe.com/9B6cN7fcP9yub4mghfasg0g",
    seoDescription:
      "11 fiches de révision de SVT pour le brevet 3e : ADN, reproduction, évolution, immunité, système nerveux, climat. PDF à 4,99 €.",
  },
  {
    slug: "technologie-brevet-3e",
    matiere: "Technologie",
    de: "de technologie",
    img: `${MINIATURES}/techno.jpg`,
    fiches: 6,
    detail:
      "Besoin et cahier des charges, chaînes d'énergie et d'information, matériaux, programmation, réseaux, projet.",
    url: "https://buy.stripe.com/5kQ4gBggT6mi1tM6GFasg0h",
    seoDescription:
      "6 fiches de révision de technologie pour le brevet 3e : cahier des charges, chaînes d'énergie et d'information, programmation, réseaux. PDF à 4,99 €.",
  },
  {
    slug: "histoire-brevet-3e",
    matiere: "Histoire",
    de: "d'histoire",
    img: `${MINIATURES}/histoire.jpg`,
    fiches: 11,
    detail:
      "Les deux guerres mondiales, totalitarismes, guerre froide, décolonisation, Europe, Ve République…",
    url: "https://buy.stripe.com/eVqfZj0hVfWSfkC2qpasg0i",
    seoDescription:
      "11 fiches de révision d'histoire pour le brevet 3e : guerres mondiales, totalitarismes, guerre froide, décolonisation, Ve République. PDF à 4,99 €.",
  },
  {
    slug: "geographie-brevet-3e",
    matiere: "Géographie",
    de: "de géographie",
    img: `${MINIATURES}/geo.jpg`,
    fiches: 7,
    detail:
      "Aires urbaines, espaces productifs, faible densité, aménagement, outre-mer, UE, la France dans le monde.",
    url: "https://buy.stripe.com/6oU28t6Gj9yu5K26GFasg0j",
    seoDescription:
      "7 fiches de révision de géographie pour le brevet 3e : aires urbaines, espaces productifs, aménagement, outre-mer, UE. PDF à 4,99 €.",
  },
  {
    slug: "emc-brevet-3e",
    matiere: "EMC",
    de: "d'EMC",
    img: `${MINIATURES}/emc.jpg`,
    fiches: 4,
    detail:
      "Nouveau programme 2026 : Constitution et séparation des pouvoirs, Europe, information, engagement.",
    url: "https://buy.stripe.com/cNi28t1lZ4eaegyaWVasg0k",
    seoDescription:
      "4 fiches de révision d'EMC pour le brevet 3e, nouveau programme 2026 : Constitution, séparation des pouvoirs, Europe, information, engagement. PDF à 4,99 €.",
  },
  {
    slug: "francais-brevet-3e",
    matiere: "Français",
    de: "de français",
    img: `${MINIATURES}/francais.jpg`,
    fiches: 11,
    detail:
      "Grammaire, conjugaison, accords, figures de style, et les méthodes pour la dictée, la rédaction et les questions.",
    url: "https://buy.stripe.com/28E9AV9Sv2622xQ2qpasg0l",
    seoDescription:
      "11 fiches de révision de français pour le brevet 3e : grammaire, conjugaison, accords, figures de style, dictée, rédaction. PDF à 4,99 €.",
  },
];

const PRIX_MATIERE_BREVET = "4,99 €";

const PARAGRAPHE_FORMAT =
  "Format PDF, à lire sur ton téléphone ou à imprimer. Téléchargement immédiat après le paiement.";

const fichesBrevet: Fiche[] = BREVET.map((b) => ({
  slug: b.slug,
  niveau: "3e",
  matiere: b.matiere,
  de: b.de,
  pack: false,
  img: b.img,
  fiches: b.fiches,
  chapitres: chapitresDe(b.slug),
  prix: PRIX_MATIERE_BREVET,
  detail: b.detail,
  paragraphes: [`${b.fiches} fiches ${b.de} pour le brevet : ${b.detail}`, PARAGRAPHE_FORMAT],
  url: b.url,
  seoTitle: `Fiches de révision ${b.matiere} Brevet 3e — Coursinus`,
  seoDescription: b.seoDescription,
}));

const packBrevet: Fiche = {
  slug: "pack-brevet-3e",
  niveau: "3e",
  matiere: "Pack complet",
  de: "du pack complet",
  pack: true,
  img: `${MINIATURES}/pack.jpg`,
  fiches: 76,
  chapitres: [],
  prix: "19,99 €",
  ancienPrix: "39,92 €",
  reduction: "-50 %",
  detail: "Les 76 fiches dans un seul PDF, plus chaque matière en fichier séparé.",
  paragraphes: [
    "Les 76 fiches des 8 matières du brevet dans un seul PDF, plus chaque matière en fichier séparé.",
    "19,99 € au lieu de 39,92 €.",
    PARAGRAPHE_FORMAT,
  ],
  url: "https://buy.stripe.com/fZudRb2q37qmegyfdbasg0d",
  seoTitle: "Pack complet fiches de révision Brevet 3e (76 fiches) — Coursinus",
  seoDescription:
    "Pack complet brevet 3e : 76 fiches de révision dans les 8 matières, plus chaque matière en fichier séparé. 19,99 € au lieu de 39,92 €.",
};

/* ------------------------------------------------- 2de et 1re (bientôt) */

type MatiereBientot = { cle: string; matiere: string; de: string };

const MATIERES_2DE: readonly MatiereBientot[] = [
  { cle: "maths", matiere: "Mathématiques", de: "de mathématiques" },
  { cle: "physique-chimie", matiere: "Physique-Chimie", de: "de physique-chimie" },
  { cle: "svt", matiere: "SVT", de: "de SVT" },
  { cle: "ses", matiere: "SES", de: "de SES" },
  { cle: "snt", matiere: "SNT", de: "de SNT" },
  { cle: "histoire-geographie", matiere: "Histoire-Géographie", de: "d'histoire-géographie" },
  { cle: "emc", matiere: "EMC", de: "d'EMC" },
  { cle: "francais", matiere: "Français", de: "de français" },
];

const MATIERES_1RE: readonly MatiereBientot[] = [
  { cle: "maths", matiere: "Mathématiques", de: "de mathématiques" },
  { cle: "physique-chimie", matiere: "Physique-Chimie", de: "de physique-chimie" },
  {
    cle: "enseignement-scientifique",
    matiere: "Enseignement scientifique",
    de: "d'enseignement scientifique",
  },
  { cle: "histoire-geographie", matiere: "Histoire-Géographie", de: "d'histoire-géographie" },
  { cle: "emc", matiere: "EMC", de: "d'EMC" },
  { cle: "francais", matiere: "Français", de: "de français" },
];

const PACK_BIENTOT: MatiereBientot = {
  cle: "pack",
  matiere: "Pack complet",
  de: "du pack complet",
};

/**
 * Fiche « bientôt » : les fiches sont écrites (d'où le visuel, le nombre de
 * fiches et les chapitres), mais aucun lien de paiement n'existe encore.
 */
function bientot(
  niveau: Exclude<Niveau, "3e">,
  suffixe: string,
  m: MatiereBientot,
  pack = false,
): Fiche {
  const { long, classe } = NIVEAU_INFO[niveau];
  const niveauMinuscule = long.toLowerCase();
  const slug = `${m.cle}-${suffixe}`;
  const chapitres = chapitresDe(slug);
  const img = visuelDe(slug);
  return {
    slug,
    niveau,
    matiere: m.matiere,
    de: m.de,
    pack,
    ...(img ? { img } : {}),
    ...(chapitres.length ? { fiches: chapitres.length } : {}),
    chapitres,
    detail: pack
      ? `Toutes les matières de ${niveauMinuscule} réunies dans un seul pack.`
      : `Les fiches ${m.de} pour ${classe}, bientôt en vente.`,
    paragraphes: pack
      ? [
          `Le pack complet de ${niveauMinuscule} réunira les fiches des 8 matières dans un seul achat.`,
          "Il est en préparation : le prix et la date de sortie seront annoncés ici.",
        ]
      : [
          chapitres.length
            ? `${chapitres.length} fiches ${m.de} pour ${classe}, déjà écrites : le programme chapitre par chapitre.`
            : `Les fiches ${m.de} pour ${classe} sont en préparation.`,
          "Même principe que celles du brevet : des schémas, les pièges signalés, à lire sur téléphone ou à imprimer.",
          "Le prix et la date de mise en vente seront annoncés ici.",
        ],
    seoTitle: pack
      ? `Pack complet fiches de révision ${long} — bientôt — Coursinus`
      : `Fiches de révision ${m.matiere} ${long} — bientôt — Coursinus`,
    seoDescription: pack
      ? `Le pack complet de fiches de révision de ${niveauMinuscule} arrive bientôt chez Coursinus : toutes les matières réunies.`
      : `${chapitres.length ? `${chapitres.length} fiches` : "Les fiches"} de révision ${m.de} pour ${classe}, bientôt chez Coursinus : le programme chapitre par chapitre, en PDF.`,
  };
}

/** Liens de paiement Stripe de la seconde, fournis par Coursinus. */
const STRIPE_2DE: Record<string, string> = {
  pack: "https://buy.stripe.com/bJe5kFe8L2623BU8ONasg0u",
  maths: "https://buy.stripe.com/bJebJ3fcP9yuegy9SRasg0p",
  "physique-chimie": "https://buy.stripe.com/5kQeVf7Knh0W2xQ0ihasg0q",
  svt: "https://buy.stripe.com/bJedRb7Knh0WegyaWVasg0t",
  ses: "https://buy.stripe.com/5kQaEZ8Or2620pI6GFasg0r",
  snt: "https://buy.stripe.com/8x2dRb6GjcKGa0i5CBasg0s",
  "histoire-geographie": "https://buy.stripe.com/28E14pggT4eab4m9SRasg0o",
  emc: "https://buy.stripe.com/8x24gBe8L9yu6O66GFasg0m",
  francais: "https://buy.stripe.com/aFa28t9SvbGC8We3utasg0n",
};

const PRIX_MATIERE_2DE = "5,99 €";
const PRIX_PACK_2DE = "24,99 €";

/** Fiche de seconde en vente. */
function enVente2de(m: MatiereBientot, pack = false): Fiche {
  const { long, classe } = NIVEAU_INFO["2de"];
  const niveauMinuscule = long.toLowerCase();
  const lien = STRIPE_2DE[m.cle];
  const slug = `${m.cle}-seconde`;
  const chapitres = chapitresDe(slug);
  const img = visuelDe(slug);
  /* Le pack ne porte pas de chapitres : son total est la somme des matières. */
  const nombre = pack ? TOTAL_FICHES_2DE : chapitres.length;
  return {
    slug,
    niveau: "2de",
    matiere: m.matiere,
    de: m.de,
    pack,
    ...(img ? { img } : {}),
    ...(nombre ? { fiches: nombre } : {}),
    chapitres,
    /* Le lien n'est ajouté que s'il existe : sans lui, la fiche retombe
       automatiquement sur l'affichage « Bientôt disponible ». */
    ...(lien ? { url: lien } : {}),
    prix: pack ? PRIX_PACK_2DE : PRIX_MATIERE_2DE,
    detail: pack
      ? `Les ${TOTAL_FICHES_2DE} fiches des 8 matières de ${niveauMinuscule}, plus chaque matière à part.`
      : `${nombre} fiches ${m.de} pour ${classe}, chapitre par chapitre.`,
    paragraphes: pack
      ? [
          `Les ${TOTAL_FICHES_2DE} fiches des 8 matières de ${niveauMinuscule} dans un seul achat, plus chaque matière en fichier séparé.`,
          PARAGRAPHE_FORMAT,
        ]
      : [`${nombre} fiches ${m.de} pour ${classe}, chapitre par chapitre.`, PARAGRAPHE_FORMAT],
    seoTitle: pack
      ? `Pack complet fiches de révision ${long} (${TOTAL_FICHES_2DE} fiches) — Coursinus`
      : `Fiches de révision ${m.matiere} ${long} — Coursinus`,
    seoDescription: pack
      ? `Pack complet seconde : ${TOTAL_FICHES_2DE} fiches de révision dans les 8 matières, plus chaque matière en fichier séparé. ${PRIX_PACK_2DE}.`
      : `${nombre} fiches de révision ${m.de} pour ${classe} : le programme chapitre par chapitre. PDF à ${PRIX_MATIERE_2DE}.`,
  };
}

/** Total du pack de seconde : la somme réelle des fiches des 8 matières. */
const TOTAL_FICHES_2DE = MATIERES_2DE.reduce(
  (total, m) => total + chapitresDe(`${m.cle}-seconde`).length,
  0,
);

const fiches2de: Fiche[] = [
  enVente2de(PACK_BIENTOT, true),
  ...MATIERES_2DE.map((m) => enVente2de(m)),
];

/* La première n'a volontairement pas de pack complet. */
const fiches1re: Fiche[] = MATIERES_1RE.map((m) => bientot("1re", "premiere", m));

/* ------------------------------------------------------------- export */

/** Packs en tête de chaque niveau, puis les matières. */
export const FICHES: readonly Fiche[] = [packBrevet, ...fichesBrevet, ...fiches2de, ...fiches1re];

export function fichesDuNiveau(niveau: Niveau): Fiche[] {
  return FICHES.filter((f) => f.niveau === niveau);
}

export function trouverFiche(slug: string): Fiche | undefined {
  return FICHES.find((f) => f.slug === slug);
}

export function estEnVente(fiche: Fiche): fiche is Fiche & { url: string; prix: string } {
  return typeof fiche.url === "string" && typeof fiche.prix === "string";
}

/** « 4,99 € » devient « 4.99 » (pour les données structurées). */
export function prixNumerique(prix: string): string {
  return prix.replace(/[^\d,]/g, "").replace(",", ".");
}
