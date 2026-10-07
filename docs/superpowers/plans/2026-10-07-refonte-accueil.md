# Refonte de la page d'accueil — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rendre la page d'accueil nettement plus animée et deux fois moins longue sur mobile, sans toucher au parcours de RDV.

**Architecture:** Quatre primitives d'animation en CSS natif piloté par le scroll (`animation-timeline`), réutilisées par les dix sections. Les groupes de cartes passent en carrousel tactile sous le point de rupture `md`. Aucun JavaScript n'est ajouté au chemin de rendu : les primitives rendent un élément porteur d'une classe.

**Tech Stack:** React 19, TanStack Start, Tailwind CSS 4, `embla-carousel-react` (déjà installé), TypeScript strict.

**Spec:** `docs/superpowers/specs/2026-10-07-refonte-accueil-design.md`

## Global Constraints

- **Aucune dépendance ajoutée.** `embla-carousel-react` est déjà dans `package.json`, et `src/components/ui/carousel.tsx` l'enveloppe déjà.
- **Le contenu ne change pas.** `src/data/home-content.ts` n'est modifié dans aucune tâche.
- **Le parcours de RDV est hors périmètre.** `src/components/BookingFlow.tsx` n'est jamais modifié. Seul l'habillage de la section qui l'entoure change.
- **Visible par défaut.** Aucune règle CSS ne doit poser `opacity: 0` ou masquer du contenu en dehors d'un bloc `@supports (animation-timeline: view())`. C'est la règle la plus importante du plan : l'enfreindre rend la page blanche sur les navigateurs anciens.
- **Toute animation est coupée** par `prefers-reduced-motion: reduce`.
- **Aucun texte sous 12 px**, aucune cible tactile sous 44 px.
- Commentaires de code et messages de commit **en français**, comme le reste du dépôt.
- Les messages de commit se terminent par `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.

## Note sur la vérification

Le projet **n'a aucun framework de test** (ni vitest, ni jest, ni playwright) et aucun fichier de test. Installer un harnais unitaire contredirait la contrainte « aucune dépendance ajoutée », et tester unitairement un composant qui rend un `div` porteur d'une classe n'apporterait rien.

La vérification de ce plan repose donc sur deux piliers réels :

1. **Les garde-fous du projet**, à chaque tâche : `npx tsc --noEmit -p tsconfig.json`, `npm run lint`, `npm run build`
2. **Un script de mesure** (tâche 1), exécuté dans la console du navigateur, qui produit des chiffres objectifs et vérifie la règle « visible par défaut »

C'est un contrôle scripté mais déclenché à la main, pas une suite automatisée en intégration continue. Le plan ne prétend pas le contraire.

## Chiffres de référence à battre

Mesurés sur https://coursinus.fr le 2026-10-07 à 375 x 812 px :

| Indicateur | Référence | Cible |
|---|---|---|
| Hauteur de page | 11 923 px (14,7 écrans) | ≤ 7 100 px (8,7 écrans) |
| Débordement horizontal | aucun | aucun |
| Textes sous 12 px | 10 px et 12 px présents | aucun sous 12 px |
| Cibles tactiles sous 44 px | 2 sur 18 | 0 |

## Structure des fichiers

| Fichier | Responsabilité |
|---|---|
| `scripts/measure-responsive.js` | Script de mesure, collé dans la console du navigateur |
| `src/components/motion/Reveal.tsx` | L'élément se construit à l'entrée dans l'écran |
| `src/components/motion/Parallax.tsx` | L'élément se déplace à une vitesse différente du scroll |
| `src/components/motion/DrawPath.tsx` | Un tracé SVG se dessine au fil du scroll |
| `src/components/motion/wave-path.ts` | Le tracé de la vague du logo, partagé |
| `src/components/SectionHeading.tsx` | Le titre de section, extrait de `ScrollReveal.tsx` |
| `src/components/MobileCarousel.tsx` | Carrousel sous `md`, grille au-delà |
| `src/components/ScrollReveal.tsx` | **Supprimé** en tâche 2 |
| `src/components/WaveMark.tsx` | **Supprimé** en tâche 4 |
| `src/components/MethodTimeline.tsx` | Réécrit en tâche 9 |
| `src/styles.css` | Accueille la couche de mouvement ; nettoyé en tâche 13 |
| `src/routes/index.tsx` | 492 lignes, dix sections modifiées une par une |

Bornes actuelles des sections dans `src/routes/index.tsx` :

| Section | Lignes |
|---|---|
| Hero | 87–160 |
| Chiffres clés | 162–178 |
| Guide Parcoursup | 180–216 |
| Offres | 218–278 |
| Comment ça marche | 280–290 |
| Prise de RDV | 292–353 |
| Matières | 355–382 |
| Pourquoi nous choisir | 384–438 |
| Témoignages | 440–463 |
| FAQ | 465–486 |

Ces numéros se décalent dès la première tâche qui modifie le fichier. Repérer les sections par leur commentaire (`{/* Hero */}`), jamais par leur numéro de ligne.

---

### Task 1 : Script de mesure et relevé de référence

**Files:**
- Create: `scripts/measure-responsive.js`

**Interfaces:**
- Produces: un script qui, collé dans la console, renvoie un objet JSON avec `hauteurPx`, `ecrans`, `debordement`, `textesSous12px`, `ciblesSous44px`, `contenuInvisible`. Toutes les tâches suivantes s'en servent comme critère de recette.

- [ ] **Step 1 : Créer le script de mesure**

Créer `scripts/measure-responsive.js` :

```js
/**
 * Mesure la page d'accueil pour la refonte 2026-10.
 * À coller dans la console du navigateur, sur la page à mesurer.
 *
 * Le contrôle le plus important est `contenuInvisible` : il attrape le cas
 * où une animation masque du contenu sans jamais le révéler. C'est le seul
 * défaut de cette refonte qui casserait le site au lieu de l'enlaidir.
 */
(() => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const debordement = [];
  document.querySelectorAll("main *").forEach((el) => {
    const b = el.getBoundingClientRect();
    if (b.width > 0 && (b.right > vw + 1 || b.left < -1)) {
      // Les pistes de défilement continu débordent par construction.
      if (el.closest(".logo-marquee, [data-marquee]")) return;
      debordement.push(`${el.tagName}.${(el.className + "").slice(0, 40)}`);
    }
  });

  const textesSous12px = new Set();
  document.querySelectorAll("main p, main span, main li, main a, main h1, main h2, main h3").forEach((el) => {
    if (!el.textContent.trim()) return;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 12) textesSous12px.add(Math.round(fs * 10) / 10);
  });

  const ciblesSous44px = [];
  document.querySelectorAll("main a, main button").forEach((el) => {
    const b = el.getBoundingClientRect();
    if (b.width === 0) return;
    if (b.height < 44) ciblesSous44px.push(el.textContent.trim().slice(0, 30) || el.tagName);
  });

  const contenuInvisible = [];
  document.querySelectorAll("main section").forEach((s) => {
    const texte = s.innerText.trim();
    if (!texte) return;
    const op = parseFloat(getComputedStyle(s).opacity);
    if (op < 0.05) {
      contenuInvisible.push(s.id || texte.slice(0, 30));
      return;
    }
    s.querySelectorAll(".reveal, .parallax").forEach((el) => {
      if (!el.innerText.trim()) return;
      if (parseFloat(getComputedStyle(el).opacity) < 0.05) {
        contenuInvisible.push(el.innerText.trim().slice(0, 30));
      }
    });
  });

  const sections = [...document.querySelectorAll("main > section")].map((s) => ({
    titre: s.querySelector("h2")?.textContent?.trim() || s.id || "(hero)",
    ecrans: +(s.getBoundingClientRect().height / vh).toFixed(1),
  }));

  return {
    largeur: vw,
    hauteurPx: document.body.scrollHeight,
    ecrans: +(document.body.scrollHeight / vh).toFixed(1),
    debordement: debordement.slice(0, 5),
    textesSous12px: [...textesSous12px],
    ciblesSous44px: ciblesSous44px.slice(0, 5),
    contenuInvisible: contenuInvisible.slice(0, 5),
    sections,
  };
})();
```

- [ ] **Step 2 : Relever la référence sur le site en production**

Ouvrir https://coursinus.fr, régler la fenêtre sur 375 x 812, coller le script, noter le résultat.

Attendu : `ecrans` autour de 14,7, `contenuInvisible` vide, `debordement` vide.

- [ ] **Step 3 : Commit**

```bash
git add scripts/measure-responsive.js
git commit -m "Ajoute le script de mesure responsive

Sert de critere de recette chiffre a la refonte de l'accueil. Le controle
contenuInvisible attrape le cas ou une animation masque du contenu sans
jamais le reveler.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2 : Couche de mouvement et primitive `Reveal`

Cette tâche remplace le système d'apparition actuel. C'est la plus risquée du plan : elle touche les 24 points d'appel de `ScrollReveal` dans `index.tsx`.

**Files:**
- Create: `src/components/motion/Reveal.tsx`
- Create: `src/components/SectionHeading.tsx`
- Modify: `src/styles.css`
- Modify: `src/routes/index.tsx`
- Delete: `src/components/ScrollReveal.tsx`

**Interfaces:**
- Produces: `<Reveal index?: number distance?: number className?: string as?: ElementType>` et `<SectionHeading eyebrow title id?>`. Toutes les sections les consomment.
- Consumes: `cn` depuis `@/lib/utils`, `WaveMark` depuis `@/components/WaveMark` (remplacé en tâche 4).

- [ ] **Step 1 : Créer la primitive `Reveal`**

Créer `src/components/motion/Reveal.tsx` :

```tsx
import type { CSSProperties, ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Rang dans une cascade : chaque cran retarde le départ dans le scroll. */
  index?: number;
  /** Translation verticale de départ, en pixels. */
  distance?: number;
  as?: ElementType;
};

/**
 * L'élément se construit quand il traverse l'écran.
 *
 * Aucun JavaScript : tout est porté par la classe `.reveal` et des
 * animations CSS pilotées par le scroll. L'état par défaut est VISIBLE —
 * l'animation n'est ajoutée que si le navigateur sait la piloter.
 */
export function Reveal({
  children,
  className,
  index = 0,
  distance = 28,
  as: Tag = "div",
}: RevealProps) {
  return (
    <Tag
      className={cn("reveal", className)}
      style={
        {
          "--reveal-index": index,
          "--reveal-distance": `${distance}px`,
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
```

- [ ] **Step 2 : Ajouter la couche de mouvement au CSS**

Dans `src/styles.css`, remplacer le bloc `.reveal-on-scroll` / `.reveal-on-scroll-visible` (et la règle `prefers-reduced-motion` qui les concerne) par :

```css
/* ---------------------------------------------------------------------
   Couche de mouvement
   ---------------------------------------------------------------------
   Regle absolue : l'etat par defaut est VISIBLE. Les animations ne sont
   ajoutees qu'a l'interieur du bloc @supports. Un navigateur qui ignore
   animation-timeline affiche le site complet, simplement sans animation.
   Poser opacity: 0 en dehors de ce bloc rendrait la page blanche.
   --------------------------------------------------------------------- */

@keyframes reveal-in {
  from {
    opacity: 0;
    transform: translateY(var(--reveal-distance, 28px));
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .reveal {
      animation: reveal-in linear both;
      animation-timeline: view();
      /* La cascade decale la plage dans le scroll plutot que le temps :
         animation-delay n'a pas de sens sur une timeline de vue. */
      animation-range: entry calc(5% + var(--reveal-index, 0) * 5%) cover
        calc(32% + var(--reveal-index, 0) * 5%);
    }
  }
}
```

- [ ] **Step 3 : Extraire `SectionHeading` dans son propre fichier**

Créer `src/components/SectionHeading.tsx` avec le composant `SectionHeading` repris **à l'identique** de `src/components/ScrollReveal.tsx` (il importe `WaveMark` depuis `@/components/WaveMark` ; la tâche 4 changera cet import).

- [ ] **Step 4 : Migrer les points d'appel dans `index.tsx`**

Dans `src/routes/index.tsx` :
- Remplacer l'import `{ ScrollReveal, SectionHeading } from "@/components/ScrollReveal"` par deux imports : `{ Reveal } from "@/components/motion/Reveal"` et `{ SectionHeading } from "@/components/SectionHeading"`
- Remplacer les 24 `<ScrollReveal>` par `<Reveal>`, et `</ScrollReveal>` par `</Reveal>`
- Convertir chaque `delay={N}` en `index={N / 80}` arrondi à l'entier le plus proche (`delay={80}` devient `index={1}`, `delay={160}` devient `index={2}`). Supprimer l'attribut quand il valait 0.

- [ ] **Step 5 : Supprimer l'ancien composant**

```bash
git rm src/components/ScrollReveal.tsx
```

- [ ] **Step 6 : Vérifier**

```bash
npx tsc --noEmit -p tsconfig.json && npm run lint && npm run build
```

Attendu : les trois passent sans erreur. Si `tsc` signale un import restant de `ScrollReveal`, le corriger.

- [ ] **Step 7 : Vérifier la règle « visible par défaut »**

Lancer `npm run dev`, ouvrir la page, coller `scripts/measure-responsive.js`.

Attendu : `contenuInvisible` est **vide**. S'il ne l'est pas, une règle d'opacité a fuité hors du bloc `@supports` — corriger avant de continuer.

Puis, dans les outils de développement, activer l'émulation `prefers-reduced-motion: reduce` et recoller le script. Attendu : `contenuInvisible` toujours vide.

- [ ] **Step 8 : Commit**

```bash
git add -A
git commit -m "Remplace ScrollReveal par la primitive Reveal

Les apparitions passent d'un IntersectionObserver a des animations CSS
pilotees par le scroll : plus aucun JavaScript sur le chemin de rendu, et
les elements progressent au fil du defilement au lieu d'apparaitre d'un
bloc.

L'etat par defaut devient visible : l'ancien .reveal-on-scroll posait
opacity: 0 et dependait du JavaScript pour reveler. Desormais un
navigateur sans animation-timeline affiche la page complete.

SectionHeading sort de ScrollReveal.tsx vers son propre fichier.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3 : Primitive `Parallax`

**Files:**
- Create: `src/components/motion/Parallax.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Produces: `<Parallax shift?: number className?>`. Consommée par le Hero (tâche 6), les Offres (tâche 8) et le Guide (tâche 7).

- [ ] **Step 1 : Créer la primitive**

Créer `src/components/motion/Parallax.tsx` :

```tsx
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
```

- [ ] **Step 2 : Ajouter le CSS**

Dans `src/styles.css`, à la suite de la couche de mouvement :

```css
@keyframes parallax-shift {
  from {
    transform: translateY(var(--parallax-shift, 40px));
  }
  to {
    transform: translateY(calc(var(--parallax-shift, 40px) * -1));
  }
}

@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .parallax {
      animation: parallax-shift linear both;
      animation-timeline: view();
      animation-range: cover;
    }
  }
}
```

- [ ] **Step 3 : Vérifier**

```bash
npx tsc --noEmit -p tsconfig.json && npm run lint && npm run build
```

- [ ] **Step 4 : Commit**

```bash
git add -A
git commit -m "Ajoute la primitive Parallax

Deplace un element a une vitesse differente du scroll pour creer de la
profondeur. Comme Reveal, zero JavaScript et neutre par defaut hors du
bloc @supports.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4 : Primitive `DrawPath`, en remplacement de `WaveMark`

**Files:**
- Create: `src/components/motion/DrawPath.tsx`
- Create: `src/components/motion/wave-path.ts`
- Modify: `src/styles.css`
- Modify: `src/components/SectionHeading.tsx`
- Delete: `src/components/WaveMark.tsx`

**Interfaces:**
- Produces: `<DrawPath d viewBox className? strokeWidth? stretch? draw?>` et la constante `WAVE_PATH` avec `WAVE_VIEWBOX`. Consommés par `SectionHeading` et par la scène de la tâche 9.

- [ ] **Step 1 : Extraire le tracé de la vague**

Créer `src/components/motion/wave-path.ts` :

```ts
/**
 * La vague du logo Coursinus, relevée sur le tracé du logo lui-même
 * (public/coursinus-logo.png) : ligne plate, creux, pic haut, creux,
 * bosse plus douce, ligne plate. Les deux extrémités sont horizontales et
 * à la même hauteur — c'est ce qui permet de la raccorder à un filet.
 *
 * Le viewBox est volontairement plus haut que le tracé (0→72 pour un tracé
 * qui va de 3 à 60) afin que les extrémités plates tombent pile au centre
 * vertical : les filets qui la prolongent s'alignent alors parfaitement.
 */
export const WAVE_PATH =
  "M 0 36 H 40 C 47 36 49 59 58 59 C 65 59 68 56 72 48 C 78 31 82 2 87 2 " +
  "C 92 2 97 31 103 44 C 108 53 111 53 116 52 C 124 49 128 19 140 19 " +
  "C 150 19 157 27 162 34 H 167";

export const WAVE_VIEWBOX = "0 0 167 72";
```

- [ ] **Step 2 : Créer la primitive**

Créer `src/components/motion/DrawPath.tsx` :

```tsx
import { cn } from "@/lib/utils";

type DrawPathProps = {
  /** Le tracé SVG. */
  d: string;
  viewBox: string;
  className?: string;
  /** Épaisseur du trait, dans les unités du viewBox. */
  strokeWidth?: number;
  /** Étire le tracé sur toute la largeur, sans conserver ses proportions. */
  stretch?: boolean;
  /** Laisse le tracé se dessiner au fil du scroll. Sinon il est plein. */
  draw?: boolean;
};

/**
 * Un tracé SVG qui se dessine au fil du scroll.
 *
 * Sans support de `animation-timeline`, le tracé s'affiche entier : c'est
 * l'absence de `stroke-dasharray` par défaut qui le garantit.
 */
export function DrawPath({
  d,
  viewBox,
  className,
  strokeWidth = 5,
  stretch = false,
  draw = false,
}: DrawPathProps) {
  return (
    <svg
      viewBox={viewBox}
      className={className}
      preserveAspectRatio={stretch ? "none" : "xMidYMid meet"}
      fill="none"
      aria-hidden
    >
      <path
        className={cn(draw && "draw-path")}
        d={d}
        stroke="var(--gold)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        vectorEffect={stretch ? "non-scaling-stroke" : undefined}
      />
    </svg>
  );
}
```

- [ ] **Step 3 : Ajouter le CSS**

Dans `src/styles.css`, à la suite :

```css
@keyframes draw-in {
  from {
    stroke-dashoffset: 1;
  }
  to {
    stroke-dashoffset: 0;
  }
}

@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .draw-path {
      /* Pose le pointille ICI et nulle part ailleurs : sans support, le
         trace n'a pas de dasharray et s'affiche donc entier. */
      stroke-dasharray: 1;
      animation: draw-in linear both;
      animation-timeline: view();
      animation-range: entry 10% cover 45%;
    }
  }
}
```

- [ ] **Step 4 : Basculer `SectionHeading` sur `DrawPath`**

Dans `src/components/SectionHeading.tsx`, remplacer l'import et l'usage de `WaveMark` par :

```tsx
import { DrawPath } from "@/components/motion/DrawPath";
import { WAVE_PATH, WAVE_VIEWBOX } from "@/components/motion/wave-path";
```

et le `<WaveMark className="h-7 w-auto shrink-0 sm:h-8" draw />` par :

```tsx
<DrawPath
  d={WAVE_PATH}
  viewBox={WAVE_VIEWBOX}
  className="h-7 w-auto shrink-0 sm:h-8"
  draw
/>
```

- [ ] **Step 5 : Remplacer les usages restants et supprimer `WaveMark`**

Chercher les usages restants, les convertir de la même manière, puis supprimer le fichier :

```bash
grep -rn "WaveMark" src --include=*.tsx
git rm src/components/WaveMark.tsx
```

- [ ] **Step 6 : Vérifier**

```bash
npx tsc --noEmit -p tsconfig.json && npm run lint && npm run build
```

Puis, dans le navigateur, vérifier qu'une vague est visible sous chaque titre de section (8 titres). Attendu : 8 vagues pleines ou en cours de tracé, aucune invisible.

- [ ] **Step 7 : Commit**

```bash
git add -A
git commit -m "Remplace WaveMark par la primitive DrawPath

Generalise le trace anime : DrawPath accepte n'importe quel chemin SVG, et
le trace de la vague du logo part dans sa propre constante partagee. Le
pointille n'est pose qu'a l'interieur du bloc @supports, donc sans support
le trace s'affiche entier au lieu de disparaitre.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5 : Composant `MobileCarousel`

**Files:**
- Create: `src/components/MobileCarousel.tsx`

**Interfaces:**
- Consumes: `Carousel`, `CarouselContent`, `CarouselItem` depuis `@/components/ui/carousel`
- Produces: `<MobileCarousel items={T[]} renderItem={(item, i) => ReactNode} gridClassName itemClassName label>`. Consommé par les Offres (tâche 8) et les Témoignages (tâche 12).

- [ ] **Step 1 : Créer le composant**

Créer `src/components/MobileCarousel.tsx` :

```tsx
import { useEffect, useState, type ReactNode } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type MobileCarouselProps<T> = {
  items: readonly T[];
  renderItem: (item: T, index: number) => ReactNode;
  /** Classes de la grille affichée à partir de `md`. */
  gridClassName?: string;
  /** Classes appliquées à chaque élément, dans les deux dispositions. */
  itemClassName?: string;
  /** Étiquette accessible du carrousel. */
  label: string;
};

/**
 * Carrousel tactile sous `md`, grille classique au-delà.
 *
 * Les deux dispositions sont rendues et l'une est masquée en CSS, plutôt
 * que de choisir en JavaScript : un choix au montage provoquerait un saut
 * de mise en page, puisque le serveur ne connaît pas la largeur de l'écran.
 * `display: none` retire aussi la copie masquée de l'arbre d'accessibilité,
 * donc aucun contenu n'est annoncé deux fois.
 *
 * Les points de navigation sont indispensables, pas décoratifs : sans eux,
 * le contenu ne serait atteignable qu'au glissement tactile — inaccessible
 * à qui navigue au clavier ou ne devine pas le geste.
 */
export function MobileCarousel<T>({
  items,
  renderItem,
  gridClassName,
  itemClassName,
  label,
}: MobileCarouselProps<T>) {
  const [api, setApi] = useState<CarouselApi>();
  const [actif, setActif] = useState(0);

  useEffect(() => {
    if (!api) return;
    const maj = () => setActif(api.selectedScrollSnap());
    maj();
    api.on("select", maj);
    return () => {
      api.off("select", maj);
    };
  }, [api]);

  return (
    <>
      <div className="md:hidden">
        <Carousel
          setApi={setApi}
          opts={{ align: "start", containScroll: "trimSnaps" }}
          aria-label={label}
        >
          <CarouselContent className="-ml-3">
            {items.map((item, i) => (
              <CarouselItem key={i} className={cn("basis-[85%] pl-3", itemClassName)}>
                {renderItem(item, i)}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-5 flex justify-center gap-2" role="tablist" aria-label={label}>
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === actif}
              aria-label={`Élément ${i + 1} sur ${items.length}`}
              onClick={() => api?.scrollTo(i)}
              /* La cible fait 44 px de haut via le padding ; le point visible
                 reste petit. On ne sacrifie pas l'accessibilité au style. */
              className="flex h-11 w-6 items-center justify-center"
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  i === actif ? "bg-gold" : "bg-gold/30",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className={cn("hidden md:grid", gridClassName)}>
        {items.map((item, i) => (
          <div key={i} className={itemClassName}>
            {renderItem(item, i)}
          </div>
        ))}
      </div>
    </>
  );
}
```

`basis-[85%]` laisse dépasser la carte suivante : c'est ce qui signale au visiteur qu'il y a une suite à faire défiler.

`src/components/ui/carousel.tsx` exporte déjà `CarouselApi` et accepte `setApi` — vérifié, rien à y modifier.

- [ ] **Step 2 : Vérifier**

```bash
npx tsc --noEmit -p tsconfig.json && npm run lint && npm run build
```

- [ ] **Step 3 : Commit**

```bash
git add -A
git commit -m "Ajoute MobileCarousel

Carrousel tactile sous md, grille au-dela. Les deux dispositions sont
rendues et l'une est masquee en CSS plutot que choisie en JavaScript : un
choix au montage provoquerait un saut de mise en page, le serveur ne
connaissant pas la largeur de l'ecran.

S'appuie sur ui/carousel.tsx, deja present et jusqu'ici inutilise.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6 : Section Hero

**Files:**
- Modify: `src/routes/index.tsx` (section `{/* Hero */}`)
- Modify: `src/components/FormulaBackdrop.tsx`

**Interfaces:**
- Consumes: `Reveal`, `Parallax`, `DrawPath`, `WAVE_PATH`

- [ ] **Step 1 : Étager les formules en profondeur**

Dans `src/components/FormulaBackdrop.tsx`, répartir les formules sur trois plans : envelopper les groupes dans `<Parallax shift={20}>`, `<Parallax shift={45}>` et `<Parallax shift={70}>`. Les formules les plus petites prennent le décalage le plus fort — c'est ce qui donne la sensation de profondeur.

- [ ] **Step 2 : Faire monter le titre en séquence**

Dans la section Hero, découper le titre en deux `<Reveal>` successifs (`index={0}` pour « Progresser vite. », `index={1}` pour « Progresser bien. ») au lieu d'un seul bloc.

- [ ] **Step 3 : Compacter les cartes chiffrées sur mobile**

Les deux cartes chiffrées passent en ligne horizontale sous `sm` (`flex` + `gap-3`, chiffre et libellé côte à côte) et conservent leur disposition actuelle à partir de `sm`.

- [ ] **Step 4 : Vérifier**

```bash
npx tsc --noEmit -p tsconfig.json && npm run lint && npm run build
```

Puis mesurer à 375 px. Attendu : section Hero à **1,1 écran ou moins** (référence 1,4), `contenuInvisible` vide.

- [ ] **Step 5 : Commit**

```bash
git add -A
git commit -m "Refond la section Hero

Le titre monte en deux temps, les formules de fond se repartissent sur
trois plans de parallaxe, et les deux cartes chiffrees passent en ligne
compacte sous sm.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7 : Sections Chiffres clés et Guide Parcoursup

**Files:**
- Modify: `src/routes/index.tsx` (sections `{/* Chiffres clés */}` et `{/* Guide Parcoursup */}`)
- Modify: `src/styles.css`

- [ ] **Step 1 : Entourer chaque chiffre d'un arc qui se remplit**

Pour chaque statistique, ajouter derrière le nombre un `<DrawPath>` en arc de cercle, avec `draw`. Utiliser le tracé :

```tsx
const ARC_PATH = "M 4 32 A 28 28 0 1 1 60 32 A 28 28 0 1 1 4 32";
const ARC_VIEWBOX = "0 0 64 64";
```

Le composant `CountUpStat` reste inchangé : le nombre monte toujours en JavaScript, l'arc se remplit en CSS.

- [ ] **Step 2 : Composer le bloc Guide à l'entrée**

Envelopper la carte du guide dans `<Parallax shift={25}>` et incliner légèrement son visuel au repos (`rotate-[-2deg]`), de sorte qu'il se redresse en entrant dans l'écran.

- [ ] **Step 3 : Vérifier**

```bash
npx tsc --noEmit -p tsconfig.json && npm run lint && npm run build
```

Mesurer à 375 px. Attendu : Chiffres clés à 0,4 écran (inchangé), Guide à **0,6 écran ou moins** (référence 0,7).

- [ ] **Step 4 : Commit**

```bash
git add -A
git commit -m "Anime les sections Chiffres cles et Guide Parcoursup

Chaque chiffre se remplit d'un arc pendant qu'il monte, et la carte du
guide se redresse en entrant dans l'ecran.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 8 : Section Offres — le gain principal

C'est la section la plus longue sur mobile : 2,5 écrans pour trois cartes empilées.

**Files:**
- Modify: `src/routes/index.tsx` (section `{/* Offres */}`)

**Interfaces:**
- Consumes: `MobileCarousel`, `Reveal`, `Parallax`

- [ ] **Step 1 : Extraire la carte d'offre**

Dans `index.tsx`, extraire le corps de la carte d'offre dans une fonction locale `OfferCard({ offer }: { offer: Offer })`, pour qu'elle serve aux deux dispositions sans duplication.

- [ ] **Step 2 : Brancher le carrousel**

Remplacer la grille par :

```tsx
<MobileCarousel
  items={offers}
  label="Nos formules"
  gridClassName="gap-6 md:grid-cols-3"
  renderItem={(offer) => <OfferCard offer={offer} />}
/>
```

- [ ] **Step 3 : Faire défiler le chiffre en filigrane à contre-sens**

Envelopper le grand chiffre de fond de chaque carte dans `<Parallax shift={-30}>`.

- [ ] **Step 4 : Vérifier**

```bash
npx tsc --noEmit -p tsconfig.json && npm run lint && npm run build
```

Mesurer à 375 px puis à 1280 px. Attendu :
- 375 px : section Offres à **0,9 écran ou moins** (référence 2,5)
- 1280 px : la grille trois colonnes est inchangée visuellement
- `contenuInvisible` vide aux deux largeurs

Vérifier aussi, à 375 px, que les trois points de navigation sont présents sous le carrousel, qu'un clic sur le troisième amène bien à l'offre Prépa, et qu'ils sont atteignables au clavier par `Tab`. C'est le seul moyen d'atteindre les offres 2 et 3 sans savoir glisser du doigt.

- [ ] **Step 5 : Commit**

```bash
git add -A
git commit -m "Passe les offres en carrousel tactile sur mobile

La section passait 2,5 ecrans a empiler trois cartes. Elle tient desormais
sur moins d'un ecran, la carte suivante depassant pour signaler qu'il y a
une suite. La grille trois colonnes est conservee a partir de md.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 9 : Section Comment ça marche — la scène vitrine

**Files:**
- Modify: `src/components/MethodTimeline.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `DrawPath`, `steps` depuis `@/data/home-content`

- [ ] **Step 1 : Réécrire la frise**

Réécrire `MethodTimeline.tsx` de sorte que le trait reliant les quatre étapes soit un `<DrawPath>` avec `draw`, et que chaque étape porte la classe `.step-lit` avec `--step-index` valant son rang.

Le tracé vertical, pour quatre étapes :

```tsx
const TIMELINE_PATH = "M 20 0 V 600";
const TIMELINE_VIEWBOX = "0 0 40 600";
```

- [ ] **Step 2 : Allumer chaque étape quand le trait l'atteint**

Dans `src/styles.css` :

```css
@keyframes step-light {
  from {
    opacity: 0.35;
  }
  to {
    opacity: 1;
  }
}

@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .step-lit {
      animation: step-light linear both;
      animation-timeline: view();
      animation-range: entry calc(10% + var(--step-index, 0) * 12%) cover
        calc(30% + var(--step-index, 0) * 12%);
    }
  }
}
```

L'opacité de départ est 0,35 et non 0 : même pendant l'animation, l'étape reste lisible.

- [ ] **Step 3 : Resserrer les espacements sur mobile**

Réduire l'espacement vertical entre étapes sous `sm`.

- [ ] **Step 4 : Vérifier**

```bash
npx tsc --noEmit -p tsconfig.json && npm run lint && npm run build
```

Mesurer à 375 px. Attendu : section à **0,9 écran ou moins** (référence 1,2), `contenuInvisible` vide.

Vérifier visuellement en faisant défiler lentement : le trait se dessine et les étapes s'allument l'une après l'autre.

- [ ] **Step 5 : Commit**

```bash
git add -A
git commit -m "Transforme Comment ca marche en scene au scroll

Le trait reliant les quatre etapes se dessine au fil du defilement et
chaque etape s'allume quand le trait l'atteint. L'opacite de depart est
0,35 et non 0 : l'etape reste lisible meme pendant l'animation.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 10 : Section Prise de RDV — habillage seulement

**Files:**
- Modify: `src/routes/index.tsx` (section `{/* Prise de RDV */}`, hors `<BookingFlow />`)

**Contrainte absolue :** `src/components/BookingFlow.tsx` n'est pas modifié. C'est le chemin qui apporte les demandes réelles.

- [ ] **Step 1 : Resserrer le bloc des modalités**

Les trois modalités passent en ligne compacte sous `sm` (icône et titre côte à côte, texte en dessous en `text-xs`), au lieu de trois blocs empilés.

- [ ] **Step 2 : Vérifier que le formulaire est intact**

```bash
git diff --stat src/components/BookingFlow.tsx
```

Attendu : **aucune sortie**. Si le fichier apparaît, annuler ses modifications.

- [ ] **Step 3 : Vérifier**

```bash
npx tsc --noEmit -p tsconfig.json && npm run lint && npm run build
```

Mesurer à 375 px. Attendu : section à **1,6 écran ou moins** (référence 2,0).

Puis dérouler le parcours de RDV jusqu'à l'étape 3 dans le navigateur, pour confirmer qu'il fonctionne toujours.

- [ ] **Step 4 : Commit**

```bash
git add -A
git commit -m "Resserre les modalites de la section RDV

Les trois modalites passent en ligne compacte sous sm. Le formulaire
lui-meme n'est pas touche : c'est lui qui apporte les demandes.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 11 : Sections Matières et Pourquoi nous choisir

**Files:**
- Modify: `src/routes/index.tsx` (sections `{/* Matières */}` et `{/* Pourquoi nous choisir */}`)

- [ ] **Step 1 : Passer les matières en grille deux colonnes sur mobile**

La grille des six matières passe de une à **deux colonnes** sous `sm`. Réduire la pastille d'icône à `h-9 w-9` et le titre à `text-sm` dans cette disposition, pour que deux tiennent en largeur sans que le texte ne se coupe.

- [ ] **Step 2 : Mettre les matières en cascade**

Donner à chaque matière `index={i}` sur son `<Reveal>`.

- [ ] **Step 3 : Resserrer « Pourquoi nous choisir »**

Réduire les espacements verticaux sous `sm` et mettre les raisons en cascade avec `index={i}`.

- [ ] **Step 4 : Vérifier**

```bash
npx tsc --noEmit -p tsconfig.json && npm run lint && npm run build
```

Mesurer à 375 px. Attendu : Matières à **0,6 écran ou moins** (référence 1,1), Pourquoi nous à **0,9 écran ou moins** (référence 1,4). Vérifier qu'aucun nom de matière n'est tronqué.

- [ ] **Step 5 : Commit**

```bash
git add -A
git commit -m "Compacte les sections Matieres et Pourquoi nous choisir

Les six matieres passent sur deux colonnes sous sm, et les deux sections
revelent leurs elements en cascade.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 12 : Sections Témoignages et FAQ

**Files:**
- Modify: `src/routes/index.tsx` (sections `{/* Témoignages */}` et `{/* FAQ */}`)

**Interfaces:**
- Consumes: `MobileCarousel`

- [ ] **Step 1 : Extraire la carte de témoignage**

Extraire le corps du témoignage dans une fonction locale `TestimonialCard({ testimonial })`.

- [ ] **Step 2 : Brancher le carrousel**

```tsx
<MobileCarousel
  items={testimonials}
  label="Témoignages"
  gridClassName="gap-6 md:grid-cols-3"
  renderItem={(t) => <TestimonialCard testimonial={t} />}
/>
```

- [ ] **Step 3 : Mettre la FAQ en cascade**

Donner à chaque question `index={i}` sur son `<Reveal>`.

- [ ] **Step 4 : Vérifier**

```bash
npx tsc --noEmit -p tsconfig.json && npm run lint && npm run build
```

Mesurer à 375 px. Attendu : Témoignages à **0,7 écran ou moins** (référence 1,6), FAQ à 1,0 écran ou moins.

Vérifier que l'accordéon de la FAQ s'ouvre et se ferme toujours.

- [ ] **Step 5 : Commit**

```bash
git add -A
git commit -m "Passe les temoignages en carrousel et met la FAQ en cascade

Les trois temoignages empiles occupaient 1,6 ecran sur mobile ; ils
tiennent desormais sur moins d'un.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 13 : Nettoyage du CSS et recette finale

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1 : Retirer les règles devenues mortes**

Chercher chaque classe à usage unique de `styles.css` dans le code, et supprimer celles qui ne sont plus référencées :

```bash
for c in stat-card-float offer-ghost-numeral school-mark drift chip-outline hero-title; do
  echo "--- $c : $(grep -rn "$c" src --include=*.tsx | wc -l) usage(s)"
done
```

Supprimer uniquement les classes à **zéro usage**. Ne pas toucher à celles qui servent encore.

- [ ] **Step 2 : Recette finale aux trois largeurs**

Lancer `npm run dev` et mesurer à 375, 768 puis 1280 px.

Attendu à 375 px :
- `ecrans` ≤ **8,7** (référence 14,7)
- `debordement` vide
- `textesSous12px` vide
- `ciblesSous44px` vide
- `contenuInvisible` vide

Attendu à 768 et 1280 px : `debordement`, `contenuInvisible` et `ciblesSous44px` vides.

- [ ] **Step 3 : Vérifier les deux replis**

Dans les outils de développement :
1. Émuler `prefers-reduced-motion: reduce`, recharger, mesurer. Attendu : `contenuInvisible` vide, page entièrement lisible.
2. Dans l'inspecteur, désactiver la règle `@supports (animation-timeline: view())`, recharger, mesurer. Attendu : `contenuInvisible` vide, page entièrement lisible, sans animation.

**Si l'un de ces deux contrôles échoue, le site est cassé pour une partie des visiteurs.** Corriger avant de livrer.

- [ ] **Step 4 : Vérifier**

```bash
npx tsc --noEmit -p tsconfig.json && npm run lint && npm run build
```

- [ ] **Step 5 : Commit**

```bash
git add -A
git commit -m "Nettoie les regles CSS devenues mortes et valide la recette

Mesure finale a 375 px : la page passe de 14,7 a moins de 8,7 ecrans.
Les deux replis sont verifies : sans animation-timeline et avec
prefers-reduced-motion, la page reste entierement lisible.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Ce que ce plan ne fait pas

- Il ne modifie ni `src/data/home-content.ts`, ni `BookingFlow.tsx`, ni la page Guide Parcoursup, ni les pages légales
- Il ne déploie pas. Le déploiement se fait par `npm run deploy` : la connexion automatique entre GitHub et Cloudflare ne fonctionne plus depuis le 7 août 2026
- Il n'installe aucun framework de test : la vérification repose sur `tsc`, `lint`, `build` et le script de mesure
