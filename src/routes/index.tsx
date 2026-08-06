import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Monitor, Quote } from "lucide-react";

import { ContactForm } from "@/components/ContactForm";
import { ScrollReveal, SectionHeading } from "@/components/ScrollReveal";
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
  offers,
  reasons,
  SITE_URL,
  stats,
  steps,
  schoolLogos,
  subjects,
  teamCards,
  testimonials,
} from "@/data/home-content";

const LOGO_URL = "/coursinus-logo.png";
const QR_URL = "/coursinus-qr.png";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Coursinus",
  description:
    "Soutien scolaire et accompagnement académique personnalisé du collège à la prépa.",
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
          "Cours particuliers du collège à la prépa : maths, physique-chimie, SI. Tarifs clairs dès 20€/h, professeurs agrégés et normaliens, suivi individuel.",
      },
      {
        property: "og:title",
        content: "Coursinus — Vise l'excellence | Soutien scolaire scientifique",
      },
      {
        property: "og:description",
        content:
          "Cours particuliers du collège à la prépa : maths, physique-chimie, SI. Tarifs clairs dès 20€/h, professeurs agrégés et normaliens, suivi individuel.",
      },
      { property: "og:image", content: `${SITE_URL}/coursinus-logo.png` },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:image", content: `${SITE_URL}/coursinus-logo.png` },
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
    <div className="min-h-screen">
      <RentreeBanner />
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-5 pt-10 pb-24 sm:px-8 sm:pt-16">
          <div className="mx-auto max-w-4xl text-center">
            <ScrollReveal>
              <img
                src={LOGO_URL}
                alt="Emblème Coursinus"
                className="mx-auto h-32 w-32 object-contain sm:h-44 sm:w-44"
              />
              <h1 className="mt-6 font-display text-5xl leading-none tracking-[0.12em] sm:text-7xl md:text-8xl">
                <span className="text-gold-gradient">COURSINUS</span>
              </h1>
              <div className="rule-gold mx-auto mt-8 w-3/4 max-w-md" />
              <p className="mt-8 text-base text-muted-foreground sm:text-lg">
                Soutien Scolaire &amp; Accompagnement Académique personnalisé
              </p>
              <p className="mt-6 font-display text-3xl text-gold-soft italic sm:text-4xl">
                « Vise l&apos;excellence »
              </p>
              <p className="mt-4 text-xs tracking-[0.35em] text-muted-foreground uppercase">
                L&apos;écurie d&apos;excellence scientifique
              </p>
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <a
                  href="#offres"
                  className="rounded-full bg-primary px-7 py-3 text-sm font-medium tracking-wide text-primary-foreground shadow-[var(--shadow-gold)] transition hover:brightness-110"
                >
                  Découvrir nos offres
                </a>
                <a
                  href="#contact"
                  className="rounded-full border border-gold/50 px-7 py-3 text-sm tracking-wide text-gold-soft transition hover:bg-gold/10"
                >
                  Nous rejoindre
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Chiffres clés */}
        <section className="border-y border-gold/15 bg-card/30 px-5 py-14 sm:px-8">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s, i) => (
              <ScrollReveal key={s.label} delay={i * 80}>
                <div className="text-center">
                  <p className="font-display text-4xl text-gold-gradient sm:text-5xl">
                    {s.value}
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
        <section id="offres" className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <SectionHeading eyebrow="Nos formules" title="Offres & Tarifs" />
            </ScrollReveal>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {offers.map((o, i) => {
                const Icon = o.icon;
                return (
                  <ScrollReveal key={o.level} delay={i * 100}>
                    <article
                      className={`card-lux flex h-full flex-col rounded-2xl p-8 ${
                        o.featured ? "border-gold/60 md:-translate-y-4" : ""
                      }`}
                    >
                      {o.featured && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-[10px] tracking-[0.2em] text-primary-foreground uppercase">
                          Le plus demandé
                        </span>
                      )}
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gold/30 bg-gold/5">
                        <Icon className="h-6 w-6 text-gold" aria-hidden />
                      </div>
                      <h3 className="font-display text-3xl text-gold">{o.level}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{o.range}</p>
                      <div className="mt-6 flex items-baseline gap-1">
                        <span className="font-display text-6xl text-gold-gradient">
                          {o.price}
                        </span>
                        <span className="text-lg text-gold-soft">€</span>
                        <span className="text-sm text-muted-foreground">/heure</span>
                      </div>
                      <div className="rule-gold my-7" />
                      <ul className="flex flex-1 flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
                        {o.points.map((p) => (
                          <li key={p} className="flex gap-3">
                            <span className="mt-1 text-gold">◆</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                      <a
                        href="#contact"
                        className="mt-8 rounded-full border border-gold/50 py-3 text-center text-sm tracking-wide text-gold-soft transition hover:bg-gold/10"
                      >
                        Réserver un cours
                      </a>
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
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <ScrollReveal key={s.step} delay={i * 90}>
                  <div className="card-lux h-full rounded-2xl p-7">
                    <span className="font-display text-3xl text-gold-gradient">
                      {s.step}
                    </span>
                    <h3 className="mt-4 font-display text-xl text-gold-soft">{s.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {s.text}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Matières */}
        <section id="matieres" className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <SectionHeading eyebrow="Nos disciplines" title="Matières & filières" />
            </ScrollReveal>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((s, i) => {
                const Icon = s.icon;
                return (
                  <ScrollReveal key={s.name} delay={i * 70}>
                    <div className="card-lux flex items-start gap-4 rounded-2xl p-6">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-gold/5">
                        <Icon className="h-5 w-5 text-gold" aria-hidden />
                      </div>
                      <div>
                        <h3 className="font-display text-xl text-gold-soft">{s.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{s.levels}</p>
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
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <SectionHeading eyebrow="Notre exigence" title="Pourquoi nous choisir ?" />
            </ScrollReveal>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {reasons.map((r, i) => (
                <ScrollReveal key={r.title} delay={i * 90}>
                  <div className="card-lux rounded-2xl p-8 text-center">
                    <span className="font-display text-4xl text-gold-gradient">
                      {r.numeral}
                    </span>
                    <h3 className="mt-4 font-display text-2xl text-gold-soft">{r.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {r.text}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Équipe */}
        <section id="equipe" className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <SectionHeading eyebrow="Nos enseignants" title="Une équipe d'exception" />
            </ScrollReveal>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {teamCards.map((card, i) => (
                <ScrollReveal key={card.title} delay={i * 90}>
                  <div className="card-lux h-full rounded-2xl p-8 text-center">
                    <span className="font-display text-4xl text-gold-gradient">
                      {card.numeral}
                    </span>
                    <h3 className="mt-4 font-display text-xl tracking-[0.12em] text-gold-soft uppercase sm:text-2xl">
                      {card.title}
                    </h3>
                    <div className="rule-gold my-5" />
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {card.text}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={120}>
              <div className="mt-16 border-t border-gold/15 pt-14">
                <p className="text-center text-xs tracking-[0.35em] text-gold uppercase">
                  Nos écoles de référence
                </p>
                <div className="school-logo-grid mx-auto mt-10 max-w-4xl">
                  {schoolLogos.map((school) => (
                    <div
                      key={school.name}
                      className="school-logo-cell"
                      title={school.name}
                    >
                      <img
                        src={school.logo}
                        alt={school.name}
                        className="school-logo-mark"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Modalités */}
        <section className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <SectionHeading eyebrow="Où & comment" title="Zone & modalités" />
            </ScrollReveal>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {modalities.map((m, i) => (
                <ScrollReveal key={m.title} delay={i * 90}>
                  <div className="card-lux rounded-2xl p-8 text-center">
                    {i === 0 && (
                      <MapPin className="mx-auto h-8 w-8 text-gold" aria-hidden />
                    )}
                    {i === 1 && (
                      <Monitor className="mx-auto h-8 w-8 text-gold" aria-hidden />
                    )}
                    {i === 2 && (
                      <Mail className="mx-auto h-8 w-8 text-gold" aria-hidden />
                    )}
                    <h3 className="mt-4 font-display text-2xl text-gold-soft">{m.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {m.text}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
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
                  <AccordionItem
                    key={item.question}
                    value={`item-${i}`}
                    className="border-gold/20"
                  >
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

        {/* Contact */}
        <section id="contact" className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <ScrollReveal>
              <SectionHeading eyebrow="Nous contacter" title="Prêt à viser l'excellence ?" />
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-gold-soft transition hover:bg-gold/10"
                >
                  <Mail className="h-4 w-4" />
                  {CONTACT_EMAIL}
                </a>
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-gold/40 px-5 py-2.5 text-gold-soft transition hover:bg-gold/10"
                >
                  Rejoindre le Discord
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div className="mt-10">
                <ContactForm />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={160}>
              <div className="card-lux mx-auto mt-10 grid max-w-5xl gap-10 rounded-3xl p-8 sm:p-14 md:grid-cols-[1.2fr_auto] md:items-center">
                <div>
                  <p className="text-xs tracking-[0.35em] text-gold uppercase">
                    Rejoindre l&apos;écurie
                  </p>
                  <h3 className="mt-3 font-display text-3xl sm:text-4xl">
                    Contact direct
                  </h3>
                  <div className="rule-gold my-6 w-40" />
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Scannez le QR code pour nous contacter directement, échanger sur
                    le profil de l&apos;élève et construire ensemble un programme
                    d&apos;accompagnement sur mesure.
                  </p>
                  <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="text-gold">◆</span> Premier échange
                      personnalisé et sans engagement
                    </li>
                    <li className="flex gap-3">
                      <span className="text-gold">◆</span> Cours en présentiel ou en
                      visioconférence
                    </li>
                    <li className="flex gap-3">
                      <span className="text-gold">◆</span> Réponse rapide par email à{" "}
                      {CONTACT_EMAIL}
                    </li>
                  </ul>
                </div>
                <div className="mx-auto text-center">
                  <div className="rounded-2xl border border-gold/40 bg-foreground/95 p-4 shadow-[var(--shadow-gold)]">
                    <img
                      src={QR_URL}
                      alt="QR code de contact Coursinus"
                      className="h-52 w-52 object-contain sm:h-60 sm:w-60"
                      loading="lazy"
                    />
                  </div>
                  <p className="mt-4 text-xs tracking-[0.3em] text-gold uppercase">
                    Scannez-moi
                  </p>
                  <p className="mt-6 text-sm text-muted-foreground">
                    Ou en rejoignant le serveur Discord :
                  </p>
                  <a
                    href={DISCORD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block rounded-full border border-gold/50 px-6 py-3 text-sm tracking-wide text-gold-soft transition hover:bg-gold/10"
                  >
                    Rejoindre le Discord
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
