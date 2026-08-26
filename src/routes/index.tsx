import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Mail, MapPin, Monitor, Quote } from "lucide-react";

import { BookingFlow } from "@/components/BookingFlow";
import { CountUpStat } from "@/components/CountUpStat";
import { FormulaBackdrop } from "@/components/FormulaBackdrop";
import { MethodTimeline } from "@/components/MethodTimeline";
import { ScrollReveal, SectionHeading } from "@/components/ScrollReveal";
import { SiteFooter } from "@/components/SiteFooter";
import { RentreeBanner, SiteHeader } from "@/components/SiteHeader";
import { WaveMark } from "@/components/WaveMark";
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

function Index() {
  return (
    <div className="relative min-h-screen">
      <FormulaBackdrop />
      <RentreeBanner />
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-5 pt-14 pb-16 sm:px-8 sm:pt-20">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
            <div>
              <ScrollReveal>
                <span className="chip-outline">COLLÈGE → PRÉPA</span>
                <h1 className="hero-title mt-6 font-display">
                  Progresser vite.
                  <br />
                  Progresser{" "}
                  <span className="relative inline-block">
                    bien.
                    <WaveMark
                      className="absolute -bottom-3 left-0 h-5 w-full sm:h-6"
                      strokeWidth={3}
                      stretch
                      draw
                    />
                  </span>
                </h1>
                <p className="mt-8 max-w-xl text-base text-muted-foreground sm:text-lg">
                  Soutien scolaire et accompagnement académique personnalisé, du collège à la prépa
                  — maths, physique-chimie, sciences de l&apos;ingénieur, avec des profs issus des
                  meilleures écoles.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={120}>
                <div className="mt-9 flex flex-wrap gap-4">
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
              </ScrollReveal>
            </div>

            <ScrollReveal delay={160}>
              <div className="stat-card-float">
                <div className="stat-card-float__primary">
                  <p className="font-display text-5xl sm:text-6xl">
                    {stats[0] && <CountUpStat value={stats[0].value} />}
                  </p>
                  <p className="mt-2 text-sm font-medium text-muted-foreground">
                    {stats[0]?.label}
                  </p>
                </div>
                <div className="stat-card-float__secondary">
                  <p className="font-display text-4xl sm:text-5xl">
                    {stats[1] && <CountUpStat value={stats[1].value} />}
                  </p>
                  <p className="mt-2 text-sm font-medium opacity-85">{stats[1]?.label}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={200}>
            <div className="mx-auto mt-16 flex max-w-6xl flex-wrap justify-center gap-3">
              {subjects.map((s) => (
                <span key={s.name} className="chip-outline">
                  {s.name.toUpperCase()}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* Chiffres clés */}
        <section className="bg-card/30 px-5 py-14 sm:px-8">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s, i) => (
              <ScrollReveal key={s.label} delay={i * 80}>
                <div className="text-center">
                  <p className="font-display text-4xl text-gold-gradient sm:text-5xl">
                    <CountUpStat value={s.value} />
                  </p>
                  <p className="mt-2 text-xs tracking-[0.15em] text-muted-foreground uppercase sm:text-sm">
                    {s.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Offres */}
        <section id="offres" className="offer-band px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <SectionHeading eyebrow="Nos formules" title="Offres & Tarifs" />
            </ScrollReveal>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {offers.map((o, i) => {
                const Icon = o.icon;
                return (
                  <ScrollReveal key={o.level} delay={i * 100}>
                    <article
                      className={`relative flex h-full flex-col rounded-2xl border border-gold/15 bg-white/[0.03] ${
                        o.featured ? "border-gold/60" : ""
                      }`}
                    >
                      {o.featured && (
                        <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-[10px] tracking-[0.2em] text-primary-foreground uppercase">
                          Le plus demandé
                        </span>
                      )}
                      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl p-8">
                        <span className="offer-ghost-numeral">{o.price}</span>
                        <div className="relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gold/30 bg-gold/10">
                          <Icon className="h-6 w-6 text-gold" aria-hidden />
                        </div>
                        <h3 className="relative font-display text-3xl">{o.level}</h3>
                        <p className="relative mt-1 text-sm text-muted-foreground">{o.range}</p>
                        <div className="relative mt-6 inline-flex w-fit items-baseline gap-1 rounded-xl bg-gold px-4 py-2">
                          <span className="font-display text-3xl text-primary-foreground">
                            {o.price}€
                          </span>
                          <span className="text-xs text-primary-foreground/80">/heure</span>
                        </div>
                        <ul className="relative mt-7 flex flex-1 flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
                          {o.points.map((p) => (
                            <li key={p} className="flex gap-3">
                              <span className="mt-1 text-gold">◆</span>
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                        <a
                          href="#rdv"
                          className="tap-scale relative mt-8 rounded-full border border-gold/50 py-3 text-center text-sm tracking-wide text-gold-soft transition hover:bg-gold/10"
                        >
                          Réserver un cours
                        </a>
                      </div>
                    </article>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Comment ça marche */}
        <section id="methode" className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <SectionHeading eyebrow="Notre approche" title="Comment ça marche ?" />
            </ScrollReveal>
            <div className="mt-16">
              <MethodTimeline steps={steps} />
            </div>
          </div>
        </section>

        {/* Prise de RDV */}
        <section id="rdv" className="px-5 py-14 sm:px-8">
          <div className="mx-auto max-w-2xl">
            <ScrollReveal>
              <SectionHeading eyebrow="Prendre rendez-vous" title="Réservez votre créneau" />
            </ScrollReveal>

            <ScrollReveal delay={60}>
              <p className="mx-auto mt-6 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
                Un premier échange{" "}
                <span className="text-gold-soft">gratuit et sans engagement</span> d&apos;environ
                15-20 minutes, pour comprendre le besoin de l&apos;élève, répondre à vos questions
                et vous proposer un accompagnement adapté — par téléphone ou en visio, comme vous
                préférez.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-xs text-gold-soft transition hover:bg-gold/10"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {CONTACT_EMAIL}
                </a>
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-gold/40 px-4 py-2 text-xs text-gold-soft transition hover:bg-gold/10"
                >
                  Rejoindre le Discord
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div className="mt-6">
                <BookingFlow />
              </div>
            </ScrollReveal>
          </div>

          {/* Modalités pratiques : c'est au moment de réserver qu'on veut
              savoir si c'est en présentiel, en visio, et à quels horaires. */}
          <ScrollReveal delay={160}>
            <div className="mx-auto mt-14 grid max-w-4xl gap-8 border-t border-gold/10 pt-10 sm:grid-cols-3">
              {modalities.map((m, i) => (
                <div key={m.title} className="text-center sm:text-left">
                  {i === 0 && <MapPin className="mx-auto h-5 w-5 text-gold sm:mx-0" aria-hidden />}
                  {i === 1 && <Monitor className="mx-auto h-5 w-5 text-gold sm:mx-0" aria-hidden />}
                  {i === 2 && (
                    <CalendarClock className="mx-auto h-5 w-5 text-gold sm:mx-0" aria-hidden />
                  )}
                  <h3 className="mt-3 font-display text-base text-gold-soft">{m.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{m.text}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* Matières */}
        <section id="matieres" className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <ScrollReveal>
              <SectionHeading eyebrow="Nos disciplines" title="Matières & filières" />
            </ScrollReveal>
            <div className="mt-14 grid gap-4 sm:grid-cols-2">
              {subjects.map((s, i) => {
                const Icon = s.icon;
                return (
                  <ScrollReveal key={s.name} delay={i * 70}>
                    <div className="tap-scale flex items-center gap-4 rounded-2xl border-2 border-gold/20 bg-card px-5 py-4 shadow-[0_4px_0_0_color-mix(in_oklab,var(--gold)_45%,black_25%)]">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold">
                        <Icon className="h-6 w-6 text-primary-foreground" aria-hidden />
                      </span>
                      <div className="min-w-0 text-left">
                        <p className="font-display text-lg leading-tight">{s.name}</p>
                        <p className="mt-0.5 text-xs tracking-[0.08em] text-muted-foreground uppercase">
                          {s.levels}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pourquoi nous choisir */}
        <section className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <ScrollReveal>
              <SectionHeading eyebrow="Notre exigence" title="Pourquoi nous choisir ?" />
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <div className="mt-14 text-center">
                <h3 className="font-display text-3xl text-gold-soft sm:text-4xl">
                  {teacherReason.title}
                </h3>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {teacherReason.text}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div className="logo-marquee mt-10 py-4">
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
            </ScrollReveal>

            <div className="mt-14 grid gap-4 sm:grid-cols-2">
              {reasons.map((r, i) => {
                const Icon = r.icon;
                return (
                  <ScrollReveal key={r.title} delay={i * 90}>
                    <div className="h-full rounded-2xl border-2 border-gold/20 bg-card px-6 py-6 shadow-[0_4px_0_0_color-mix(in_oklab,var(--gold)_45%,black_25%)]">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold">
                        <Icon className="h-6 w-6 text-primary-foreground" aria-hidden />
                      </span>
                      <h3 className="mt-4 font-display text-xl text-gold-soft">{r.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Témoignages */}
        <section id="temoignages" className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <SectionHeading eyebrow="Ils nous font confiance" title="Témoignages" />
            </ScrollReveal>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <ScrollReveal key={t.author} delay={i * 90}>
                  <blockquote className="card-lux flex h-full flex-col rounded-2xl p-8">
                    <Quote className="h-8 w-8 text-gold/60" aria-hidden />
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground italic">
                      « {t.quote} »
                    </p>
                    <footer className="mt-6 border-t border-gold/15 pt-4">
                      <p className="font-display text-lg text-gold-soft">{t.author}</p>
                      <p className="text-xs text-muted-foreground">{t.context}</p>
                    </footer>
                  </blockquote>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <ScrollReveal>
              <SectionHeading eyebrow="Questions fréquentes" title="FAQ" />
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <Accordion type="single" collapsible className="mt-14">
                {faqItems.map((item, i) => (
                  <AccordionItem key={item.question} value={`item-${i}`} className="border-gold/20">
                    <AccordionTrigger className="font-display text-base text-gold-soft hover:no-underline sm:text-lg">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
