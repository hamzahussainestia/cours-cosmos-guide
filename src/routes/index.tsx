import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, Mail, MapPin, Monitor, Quote } from "lucide-react";

import { BookingFlow } from "@/components/BookingFlow";
import { CountUpStat } from "@/components/CountUpStat";
import { FormulaBackdrop } from "@/components/FormulaBackdrop";
import { MethodTimeline } from "@/components/MethodTimeline";
import { MobileCarousel } from "@/components/MobileCarousel";
import { DrawPath } from "@/components/motion/DrawPath";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { useMotionFallback } from "@/components/motion/useMotionFallback";
import { WAVE_PATH, WAVE_VIEWBOX } from "@/components/motion/wave-path";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteFooter } from "@/components/SiteFooter";
import { RentreeBanner, SiteHeader } from "@/components/SiteHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CONTACT_EMAIL,
  DISCORD_URL,
  faqItems,
  modalities,
  type Offer,
  offers,
  reasons,
  schools,
  SITE_URL,
  stats,
  steps,
  subjects,
  teacherReason,
  testimonials,
} from "@/data/home-content";

/*
 * Arc qui entoure chaque chiffre clé. C'est une ellipse et non un cercle :
 * un cercle assez large pour contenir « 150+ » déborderait de 25 px au-dessus
 * et en dessous du chiffre et grossirait la section. L'ellipse reste dans sa
 * hauteur de ligne. Le tracé n'est pas étiré (pas de `stretch`) : la
 * proportion vient du viewBox, ce qui garde un trait d'épaisseur constante.
 */
const ARC_PATH = "M 3 28 A 61 25 0 1 1 125 28 A 61 25 0 1 1 3 28";
const ARC_VIEWBOX = "0 0 128 56";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Coursinus",
  description: "Soutien scolaire et accompagnement académique personnalisé du collège à la prépa.",
  url: SITE_URL,
  email: CONTACT_EMAIL,
  areaServed: "FR",
  sameAs: [DISCORD_URL],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Coursinus — Vise l'excellence | Soutien scolaire scientifique" },
      {
        name: "description",
        content:
          "Cours particuliers du collège à la prépa : maths, physique-chimie, SI. Tarifs clairs dès 28€/h, professeurs agrégés et normaliens, suivi individuel.",
      },
      {
        property: "og:title",
        content: "Coursinus — Vise l'excellence | Soutien scolaire scientifique",
      },
      {
        property: "og:description",
        content:
          "Cours particuliers du collège à la prépa : maths, physique-chimie, SI. Tarifs clairs dès 28€/h, professeurs agrégés et normaliens, suivi individuel.",
      },
      { property: "og:image", content: `${SITE_URL}/og-image.png` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:image", content: `${SITE_URL}/og-image.png` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(jsonLd),
      },
    ],
  }),
  component: Index,
});

/*
 * Carte d'une offre. Extraite pour servir aux deux dispositions (carrousel
 * sous `md`, grille au-delà) sans duplication. Les valeurs sans préfixe sont
 * celles du mobile, compactées pour que la carte tienne dans l'écran ; les
 * valeurs `md:` sont celles d'origine de la grille.
 */
function TestimonialCard({ testimonial: t }: { testimonial: (typeof testimonials)[number] }) {
  return (
    <blockquote className="card-lux flex h-full flex-col rounded-2xl p-5 sm:p-8">
      <Quote className="h-6 w-6 text-gold/60 sm:h-8 sm:w-8" aria-hidden />
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground italic sm:mt-4">
        « {t.quote} »
      </p>
      <footer className="mt-4 border-t border-gold/15 pt-3 sm:mt-6 sm:pt-4">
        <p className="font-display text-lg text-gold-soft">{t.author}</p>
        <p className="text-xs text-muted-foreground">{t.context}</p>
      </footer>
    </blockquote>
  );
}

function OfferCard({ offer: o }: { offer: Offer }) {
  const Icon = o.icon;
  return (
    <article
      className={`relative flex h-full flex-col rounded-2xl border border-gold/15 bg-white/[0.03] ${
        o.featured ? "border-gold/60" : ""
      }`}
    >
      {o.featured && (
        <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-xs tracking-[0.15em] text-primary-foreground uppercase">
          Le plus demandé
        </span>
      )}
      {/* `overflow-clip` et non `overflow-hidden` : `hidden` établit un
          conteneur de défilement et détournerait l'animation du Parallax
          qu'il contient. `clip` rogne de la même façon sans cet effet. */}
      <div className="relative flex h-full flex-col overflow-clip rounded-2xl p-5 md:p-8">
        {/* Le chiffre en filigrane traîne derrière le contenu (shift positif :
            arrière-plan). Le Parallax couvre toute la carte pour que le
            positionnement du chiffre reste relatif à elle : son transform en
            fait le bloc conteneur du chiffre absolu. */}
        <Parallax shift={30} className="pointer-events-none absolute inset-0">
          <span className="offer-ghost-numeral">{o.price}</span>
        </Parallax>
        {/* Icône à gauche du titre sur mobile (gain d'une ligne), au-dessus
            à partir de `md`. */}
        <div className="relative flex items-center gap-3 md:flex-col md:items-start md:gap-0">
          <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 md:mb-4 md:h-12 md:w-12">
            <Icon className="h-5 w-5 text-gold md:h-6 md:w-6" aria-hidden />
          </div>
          <div className="md:contents">
            <h3 className="font-display text-2xl md:text-3xl">{o.level}</h3>
            <p className="text-sm text-muted-foreground md:mt-1">{o.range}</p>
          </div>
        </div>
        {/* Le prix et le pack sont côte à côte sur mobile, empilés à partir de
            `md`. */}
        <div className="relative mt-3 flex items-center gap-3 md:mt-0 md:flex-col md:items-start md:gap-0">
          <div className="inline-flex w-fit shrink-0 items-baseline gap-1 rounded-xl bg-gold px-4 py-2 md:mt-6">
            <span className="font-display text-3xl text-primary-foreground">{o.price}€</span>
            <span className="text-xs text-primary-foreground/80">/heure</span>
          </div>
          <p className="text-xs text-muted-foreground md:mt-3">
            Pack 10 heures <span className="text-gold-soft">{o.pack} €</span>{" "}
            <span className="line-through opacity-60">{o.packFull} €</span>
          </p>
        </div>
        <ul className="relative mt-3 flex flex-1 flex-col gap-1.5 text-sm leading-relaxed text-muted-foreground md:mt-7 md:gap-4">
          {o.points.map((p) => (
            <li key={p} className="flex gap-3">
              <span className="mt-1 text-gold">◆</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <a
          href="#rdv"
          className="tap-scale relative mt-4 rounded-full border border-gold/50 py-3 text-center text-sm tracking-wide text-gold-soft transition hover:bg-gold/10 md:mt-8"
        >
          Réserver un cours
        </a>
      </div>
    </article>
  );
}

function Index() {
  useMotionFallback();

  return (
    <div className="relative min-h-screen">
      <FormulaBackdrop />
      <RentreeBanner />
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-clip px-5 pt-10 pb-10 sm:px-8 sm:pt-20 sm:pb-16">
          <div className="mx-auto grid max-w-6xl gap-8 sm:gap-12 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
            <div>
              <Reveal>
                <span className="chip-outline">COLLÈGE → PRÉPA</span>
              </Reveal>
              {/* Le titre monte en deux temps : une ligne par Reveal, rangs 0 puis 1. */}
              <h1 className="hero-title mt-4 font-display sm:mt-6">
                <Reveal as="span" className="block">
                  Progresser vite.
                </Reveal>
                <Reveal as="span" index={1} className="block">
                  Progresser{" "}
                  <span className="relative inline-block">
                    bien.
                    <DrawPath
                      d={WAVE_PATH}
                      viewBox={WAVE_VIEWBOX}
                      className="absolute -bottom-3 left-0 h-5 w-full sm:h-6"
                      strokeWidth={3}
                      stretch
                      draw
                    />
                  </span>
                </Reveal>
              </h1>
              <Reveal index={2}>
                <p className="mt-5 max-w-xl text-base text-muted-foreground sm:mt-8 sm:text-lg">
                  Soutien scolaire et accompagnement académique personnalisé, du collège à la prépa
                  — maths, physique-chimie, sciences de l&apos;ingénieur, avec des profs issus des
                  meilleures écoles.
                </p>
              </Reveal>
              <Reveal index={2}>
                <div className="mt-6 flex flex-wrap gap-3 sm:mt-9 sm:gap-4">
                  <a
                    href="#rdv"
                    className="btn-press rounded-full bg-primary px-7 py-3 text-sm font-medium tracking-wide text-primary-foreground"
                  >
                    Réserver un cours
                  </a>
                  <a
                    href="#offres"
                    className="rounded-full border border-gold/50 px-7 py-3 text-sm tracking-wide text-gold-soft transition hover:bg-gold/10"
                  >
                    Nos tarifs
                  </a>
                </div>
              </Reveal>
            </div>

            <Reveal index={2}>
              <div className="stat-card-float">
                <div className="stat-card-float__primary">
                  <p className="font-display text-4xl sm:text-6xl">
                    {stats[0] && <CountUpStat value={stats[0].value} />}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground sm:mt-2">
                    {stats[0]?.label}
                  </p>
                </div>
                <div className="stat-card-float__secondary">
                  <p className="font-display text-3xl sm:text-5xl">
                    {stats[1] && <CountUpStat value={stats[1].value} />}
                  </p>
                  <p className="text-sm font-medium opacity-85 sm:mt-2">{stats[1]?.label}</p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal index={3}>
            <div className="mx-auto mt-6 flex max-w-6xl flex-wrap justify-center gap-2 sm:mt-16 sm:gap-3">
              {subjects.map((s) => (
                <span key={s.name} className="chip-outline">
                  {s.name.toUpperCase()}
                </span>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Chiffres clés */}
        <section className="bg-card/30 px-5 py-8 sm:px-8 sm:py-14">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-5 sm:gap-8 md:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} index={i}>
                <div className="text-center">
                  {/* L'arc est posé en absolu derrière le chiffre : il ne
                      prend aucune place, la hauteur de la section ne bouge
                      pas. Le nombre monte en JavaScript (CountUpStat),
                      l'arc se remplit en CSS pendant ce temps. */}
                  <div className="relative">
                    <DrawPath
                      d={ARC_PATH}
                      viewBox={ARC_VIEWBOX}
                      strokeWidth={2}
                      draw
                      className="pointer-events-none absolute top-1/2 left-1/2 h-14 w-32 -translate-x-1/2 -translate-y-1/2 opacity-60 sm:h-[4.375rem] sm:w-40"
                    />
                    <p className="relative font-display text-4xl text-gold-gradient sm:text-5xl">
                      <CountUpStat value={s.value} />
                    </p>
                  </div>
                  <p className="mt-3 text-xs tracking-[0.15em] text-muted-foreground uppercase sm:text-sm">
                    {s.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Guide Parcoursup */}
        <section id="guide" className="px-5 py-6 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-5xl">
            {/* Le Parallax enveloppe le Reveal : tous deux posent un
                transform, ils ne peuvent pas partager le même élément. */}
            <Parallax shift={25}>
              <Reveal>
                {/* `guide-card` : incliné de 2° au repos, il se redresse en
                    entrant dans l'écran (voir styles.css). */}
                <div className="guide-card grid gap-4 rounded-2xl border border-border/60 bg-card/40 p-5 sm:gap-8 sm:p-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-gold-soft uppercase">
                      Guide gratuit &middot; 12 pages
                    </p>
                    <h2 className="mt-2 font-display text-2xl text-gold sm:mt-3 sm:text-4xl">
                      Parcoursup sans se planter
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">
                      Comment répartir ses dix vœux, les sous-vœux que presque personne
                      n&apos;utilise, ce que les commissions lisent vraiment dans une lettre de
                      motivation, et la seule erreur irréversible de la phase d&apos;admission.
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground">
                      Écrit par Hamza, prépa TSI puis école d&apos;ingénieur.{" "}
                      <span className="text-gold-soft">Accepté partout où il avait demandé.</span>
                    </p>
                  </div>
                  <div>
                    <Link
                      to="/guide-parcoursup"
                      className="inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                    >
                      Recevoir le guide
                    </Link>
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      Gratuit. Ton adresse, et c&apos;est à toi.
                    </p>
                  </div>
                </div>
              </Reveal>
            </Parallax>
          </div>
        </section>

        {/* Offres */}
        <section id="offres" className="offer-band px-5 py-8 sm:px-8 sm:py-10 md:py-20">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionHeading eyebrow="Nos formules" title="Offres & Tarifs" />
            </Reveal>

            {/* Le Reveal est AUTOUR du carrousel, jamais dans `renderItem` :
                le conteneur interne d'embla porte `overflow: hidden`, qui
                détourne les animations pilotées par le scroll de tout ce
                qu'il contient. Un Reveal posé sur une carte ne jouerait
                jamais sur mobile. La cascade par carte est donc perdue sur
                la grille de bureau, c'est le prix de cette règle. */}
            <Reveal className="mt-5 md:mt-14">
              <MobileCarousel
                items={offers}
                label="Nos formules"
                gridClassName="gap-6 md:grid-cols-3"
                /* `pt-4` laisse la place à l'étiquette « Le plus demandé »,
                   qui dépasse de la carte vers le haut et serait rognée par
                   le carrousel. Inutile (et retiré) dans la grille. */
                itemClassName="pt-4 md:pt-0"
                renderItem={(offer) => <OfferCard offer={offer} />}
              />
            </Reveal>
          </div>
        </section>

        {/* Comment ça marche */}
        <section id="methode" className="px-5 py-8 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionHeading eyebrow="Notre approche" title="Comment ça marche ?" />
            </Reveal>
            <div className="mt-6 sm:mt-16">
              <MethodTimeline steps={steps} />
            </div>
          </div>
        </section>

        {/* Prise de RDV */}
        <section id="rdv" className="px-5 py-6 sm:px-8 sm:py-14">
          <div className="mx-auto max-w-2xl">
            <Reveal>
              <SectionHeading eyebrow="Prendre rendez-vous" title="Réservez votre créneau" />
            </Reveal>

            <Reveal index={1}>
              <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-snug text-muted-foreground sm:mt-6 sm:leading-relaxed">
                Un premier échange{" "}
                <span className="text-gold-soft">gratuit et sans engagement</span> d&apos;environ
                15-20 minutes, pour comprendre le besoin de l&apos;élève, répondre à vos questions
                et vous proposer un accompagnement adapté — par téléphone ou en visio, comme vous
                préférez.
              </p>
            </Reveal>

            <Reveal index={1}>
              <div className="mt-3 flex flex-wrap justify-center gap-2 text-sm sm:mt-6 sm:gap-3">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gold/40 px-3 py-2 sm:px-4 text-xs text-gold-soft transition hover:bg-gold/10"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {CONTACT_EMAIL}
                </a>
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center rounded-full border border-gold/40 px-3 py-2 sm:px-4 text-xs text-gold-soft transition hover:bg-gold/10"
                >
                  Rejoindre le Discord
                </a>
              </div>
            </Reveal>

            <Reveal index={2}>
              <div className="mt-3 sm:mt-6">
                <BookingFlow />
              </div>
            </Reveal>
          </div>

          {/* Modalités pratiques : c'est au moment de réserver qu'on veut
              savoir si c'est en présentiel, en visio, et à quels horaires. */}
          <Reveal index={2}>
            <div className="mx-auto mt-5 grid max-w-4xl gap-2.5 border-t border-gold/10 pt-4 sm:mt-14 sm:grid-cols-3 sm:gap-8 sm:pt-10">
              {modalities.map((m, i) => (
                <div
                  key={m.title}
                  className="flex flex-wrap items-center gap-x-2.5 text-left sm:block"
                >
                  {i === 0 && <MapPin className="h-5 w-5 shrink-0 text-gold" aria-hidden />}
                  {i === 1 && <Monitor className="h-5 w-5 shrink-0 text-gold" aria-hidden />}
                  {i === 2 && <CalendarClock className="h-5 w-5 shrink-0 text-gold" aria-hidden />}
                  <h3 className="font-display text-base text-gold-soft sm:mt-3">{m.title}</h3>
                  <p className="mt-1 basis-full text-xs leading-snug text-muted-foreground sm:mt-1.5 sm:leading-relaxed">
                    {m.text}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Matières */}
        <section id="matieres" className="px-4 py-6 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <SectionHeading eyebrow="Nos disciplines" title="Matières & filières" />
            </Reveal>
            <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-14 sm:gap-4">
              {subjects.map((s, i) => {
                const Icon = s.icon;
                return (
                  <Reveal key={s.name} index={i}>
                    <div className="tap-scale flex h-full items-center gap-2 rounded-2xl border-2 border-gold/20 bg-card px-2 py-2.5 shadow-[0_4px_0_0_color-mix(in_oklab,var(--gold)_45%,black_25%)] sm:gap-4 sm:px-5 sm:py-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold sm:h-12 sm:w-12">
                        <Icon
                          className="h-5 w-5 text-primary-foreground sm:h-6 sm:w-6"
                          aria-hidden
                        />
                      </span>
                      <div className="min-w-0 text-left">
                        <p className="font-display text-[0.8125rem] leading-tight sm:text-lg">
                          {s.name}
                        </p>
                        <p className="mt-0.5 text-xs tracking-[0.02em] text-muted-foreground uppercase sm:tracking-[0.08em]">
                          {s.levels}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pourquoi nous choisir */}
        <section className="px-5 py-6 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <SectionHeading eyebrow="Notre exigence" title="Pourquoi nous choisir ?" />
            </Reveal>

            <Reveal index={1}>
              <div className="mt-6 text-center sm:mt-14">
                <h3 className="font-display text-2xl text-gold-soft sm:text-4xl">
                  {teacherReason.title}
                </h3>
                <p className="mx-auto mt-2 max-w-2xl text-sm leading-snug text-muted-foreground sm:mt-3 sm:text-base sm:leading-relaxed">
                  {teacherReason.text}
                </p>
              </div>
            </Reveal>

            <Reveal index={2}>
              <div className="logo-marquee mt-4 py-2 sm:mt-10 sm:py-4">
                <div className="logo-marquee__track">
                  {[...schools, ...schools].map((school, i) => (
                    <div
                      key={`${school.name}-${i}`}
                      className="school-mark shrink-0"
                      // La seconde moitié n'est qu'un doublon pour boucler le
                      // défilement : on l'écarte des lecteurs d'écran.
                      aria-hidden={i >= schools.length}
                    >
                      <span className="school-mark__initials">{school.mark}</span>
                      <span className="school-mark__name">{school.sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <div className="mt-4 grid gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-4">
              {reasons.map((r, i) => {
                const Icon = r.icon;
                return (
                  <Reveal key={r.title} index={i}>
                    <div className="h-full rounded-2xl border-2 border-gold/20 bg-card px-4 py-4 shadow-[0_4px_0_0_color-mix(in_oklab,var(--gold)_45%,black_25%)] sm:px-6 sm:py-6">
                      {/* Icône à côté du titre sur mobile (gain de hauteur),
                          au-dessus à partir de `sm`. */}
                      <div className="flex items-center gap-3 sm:block">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold sm:h-12 sm:w-12">
                          <Icon
                            className="h-5 w-5 text-primary-foreground sm:h-6 sm:w-6"
                            aria-hidden
                          />
                        </span>
                        <h3 className="font-display text-lg text-gold-soft sm:mt-4 sm:text-xl">
                          {r.title}
                        </h3>
                      </div>
                      <p className="mt-2 text-sm leading-snug text-muted-foreground sm:leading-relaxed">
                        {r.text}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Témoignages */}
        <section id="temoignages" className="px-5 py-6 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionHeading eyebrow="Ils nous font confiance" title="Témoignages" />
            </Reveal>
            {/* Le Reveal est AUTOUR du carrousel, jamais dans `renderItem` :
                `ui/carousel.tsx` garde un `overflow-hidden` interne. */}
            <Reveal className="mt-5 md:mt-14">
              <MobileCarousel
                items={testimonials}
                label="Témoignages"
                gridClassName="gap-6 md:grid-cols-3"
                renderItem={(t) => <TestimonialCard testimonial={t} />}
              />
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="px-5 py-6 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <SectionHeading eyebrow="Questions fréquentes" title="FAQ" />
            </Reveal>
            <Accordion type="single" collapsible className="mt-4 sm:mt-14">
              {faqItems.map((item, i) => (
                <Reveal key={item.question} index={i}>
                  <AccordionItem value={`item-${i}`} className="border-gold/20">
                    <AccordionTrigger className="py-3 font-display text-base text-gold-soft hover:no-underline sm:py-4 sm:text-lg">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </Reveal>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
