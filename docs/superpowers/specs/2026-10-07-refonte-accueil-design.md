# Refonte de la page d'accueil : plus visuelle, plus animée, plus courte sur mobile

Date : 2026-10-07

## Contexte

La page d'accueil présente le bon contenu mais le donne à lire d'une manière
uniforme : presque chaque section est une grille de cartes à icône. Le site
paraît plat malgré un contenu solide, et l'animation se limite à des
apparitions en fondu déclenchées à l'entrée dans l'écran.

### Ce que la mesure a montré

Mesure faite sur https://coursinus.fr à 375 x 812 px, le 2026-10-07 :

- Aucun débordement horizontal, cibles tactiles correctes (2 sur 18 sous 44 px)
- **La page fait 11 923 px, soit 14,7 écrans de haut sur un téléphone**

| Section | Écrans sur mobile |
|---|---|
| Offres & Tarifs | 2,5 |
| Réservez votre créneau | 2,0 |
| Témoignages | 1,6 |
| Hero | 1,4 |
| Pourquoi nous choisir | 1,4 |
| Comment ça marche | 1,2 |
| Matières & filières | 1,1 |
| FAQ | 1,1 |
| Guide Parcoursup | 0,7 |
| Chiffres clés | 0,4 |

La somme des sections (13,4 écrans) est inférieure au total de la page : la
différence tient au bandeau de rentrée, à l'en-tête et au pied de page.

La cause est systématique : chaque grille multi-colonnes du desktop devient
une pile verticale sur mobile. Trois cartes côte à côte deviennent trois
écrans à faire défiler.

**Conclusion : la demande « plus responsive » ne décrit pas un défaut
d'affichage mais cette longueur. C'est elle qu'il faut corriger.**

## Objectifs et critères de succès

1. **Longueur mobile** : passer de 14,7 à **8,7 écrans ou moins** à 375 px
2. **Animation** : chaque section possède une scène pilotée par le scroll —
   l'élément progresse au fil du défilement, il n'apparaît plus d'un bloc
3. **Identité visuelle** : chaque section a un dispositif graphique propre,
   au lieu du motif unique « grille de cartes à icône »
4. **Aucune régression** : pas de débordement horizontal, aucun texte sous
   12 px, cibles tactiles d'au moins 44 px, à 375 / 768 / 1280 px
5. **Aucune dépendance ajoutée** — les carrousels s'appuient sur
   `embla-carousel-react`, déjà présent dans `package.json` et aujourd'hui
   inutilisé

## Périmètre

**Inclus** — les dix sections de `src/routes/index.tsx` : Hero, Chiffres clés,
Guide Parcoursup, Offres & Tarifs, Comment ça marche, Réservez votre créneau
(habillage seulement), Matières & filières, Pourquoi nous choisir,
Témoignages, FAQ.

**Exclu** — la logique du parcours de RDV (`BookingFlow.tsx` : étapes,
validation, envoi email, Google Sheets), la page Guide Parcoursup, les pages
légales. Ces pages héritent des jetons de couleur et de typographie sans
refonte.

Le contenu ne change pas : `src/data/home-content.ts` n'est pas modifié.

## Architecture de la couche d'animation

### Principe

Quatre primitives réutilisées dans toutes les sections. Aucune section
n'invente son propre vocabulaire d'animation — c'est ce qui distingue un
site conçu d'un site accumulé.

### Les primitives

| Composant | Rôle | JavaScript |
|---|---|---|
| `Reveal` | L'élément se construit à l'entrée (opacité, translation, échelle) | Aucun |
| `Parallax` | L'élément se déplace à une vitesse différente du scroll | Aucun |
| `DrawPath` | Un tracé SVG se dessine au fil du scroll | Aucun |
| `CountUpStat` | Un nombre monte jusqu'à sa valeur | Oui (interpolation) |

### Technique

Animations CSS pilotées par le scroll : `animation-timeline: view()` pour les
éléments liés à leur propre entrée, `animation-timeline: scroll()` pour le
parallaxe. Ces animations tournent sur le compositeur du navigateur et non
sur le fil principal : elles restent fluides sur un téléphone modeste.

Conséquence importante : `Reveal`, `Parallax` et `DrawPath` ne contiennent
**aucun JavaScript**. Ils rendent un élément porteur d'une classe, et le CSS
fait le reste. Cela supprime l'`IntersectionObserver` actuel du chemin de
rendu et élimine tout risque de clignotement à l'hydratation.

### Dégradation

Deux replis, tous deux vers un site **statique mais complet** :

1. **Navigateur sans `animation-timeline`** (Safari antérieur à 26) — tout le
   CSS d'animation vit dans un bloc `@supports (animation-timeline: view())`.
   Sans support, les éléments s'affichent à leur état final, sans animation.
2. **`prefers-reduced-motion: reduce`** — les animations sont désactivées et
   les éléments s'affichent à leur état final.

Dans les deux cas le contenu est intégralement lisible et utilisable. Aucun
contenu n'est jamais masqué par défaut en attendant une animation.

### Composants touchés

| Fichier | Action |
|---|---|
| `src/components/motion/Reveal.tsx` | Créé |
| `src/components/motion/Parallax.tsx` | Créé |
| `src/components/motion/DrawPath.tsx` | Créé |
| `src/components/motion/Carousel.tsx` | Créé — enveloppe `embla`, actif sous `md` seulement |
| `src/components/ScrollReveal.tsx` | Supprimé, remplacé par `Reveal` |
| `src/components/WaveMark.tsx` | Supprimé, absorbé par `DrawPath` |
| `src/components/MethodTimeline.tsx` | Réécrit en scène vitrine |
| `src/components/FormulaBackdrop.tsx` | Conservé, passe à trois profondeurs de parallaxe |
| `src/components/CountUpStat.tsx` | Conservé tel quel |
| `src/styles.css` | Les classes d'animation à usage unique sont remplacées par le vocabulaire des primitives |

## Traitement par section

| Section | Dispositif graphique | Compression mobile |
|---|---|---|
| Hero | La vague du logo se trace sous le titre ; les mots montent en séquence ; les formules dérivent à trois profondeurs | Les deux cartes chiffrées deviennent une ligne compacte (1,4 → 1,1) |
| Chiffres clés | Chaque nombre monte pendant qu'un arc se remplit autour de lui | Inchangé, déjà compact (0,4) |
| Guide Parcoursup | Le document s'incline et se compose à l'entrée | Inchangé (0,7 → 0,6) |
| Offres & Tarifs | Les trois cartes se distribuent ; le prix compte ; le chiffre en filigrane défile à contre-sens | **Carrousel tactile**, une offre visible, la suivante qui dépasse (2,5 → 0,9) |
| Comment ça marche | **Scène vitrine** : le trait reliant les 4 étapes se dessine au scroll, chaque étape s'allume quand le trait l'atteint | Espacements resserrés (1,2 → 0,9) |
| Réservez votre créneau | Habillage seulement, révélation simple | Modalités resserrées (2,0 → 1,6) |
| Matières & filières | Pastilles en cascade, icônes tracées | Grille 2 colonnes (1,1 → 0,6) |
| Pourquoi nous choisir | Le défilement des écoles accélère à l'entrée puis se stabilise | Espacements resserrés (1,4 → 0,9) |
| Témoignages | Révélation en cascade | **Carrousel tactile** (1,6 → 0,7) |
| FAQ | Questions en cascade | Inchangé (1,1 → 1,0) |

Les carrousels ne s'activent qu'en dessous du point de rupture `md`. Au-delà,
les grilles actuelles restent en place : le problème est propre au mobile.

## Accessibilité

- Les carrousels restent navigables au clavier et annoncent la position
- Les tracés SVG décoratifs portent `aria-hidden`
- Aucun contenu n'est accessible uniquement par le geste : les carrousels
  gardent des points de navigation cliquables
- Contraste et tailles de texte inchangés, minimum 12 px

## Vérification

Script de mesure rejoué à 375, 768 et 1280 px, avant et après :

- Hauteur totale de page et hauteur par section, en écrans
- Débordement horizontal (`scrollWidth` contre `innerWidth`)
- Tailles de texte sous 12 px
- Cibles tactiles sous 44 px

Plus deux contrôles manuels :

- Rendu avec `prefers-reduced-motion: reduce` actif
- Rendu sans support de `animation-timeline`, en désactivant le bloc
  `@supports`

Le critère de réussite est chiffré : **8,7 écrans ou moins à 375 px**, contre
14,7 aujourd'hui.

## Risques

| Risque | Parade |
|---|---|
| `animation-timeline` non supporté sur d'anciens appareils | Bloc `@supports`, repli statique vérifié explicitement |
| Un carrousel masque du contenu que les visiteurs ne découvrent pas | Débordement de la carte suivante et points de navigation, pour signaler qu'il y a une suite |
| Régression du parcours de RDV, qui apporte les demandes réelles | Sa logique est hors périmètre ; seul l'habillage change |
| Trop d'animation nuit à la crédibilité auprès des parents | Direction validée « généreux mais maîtrisé » ; tout est coupé par `prefers-reduced-motion` |
