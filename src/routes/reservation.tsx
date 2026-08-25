import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mail, Phone, CalendarCheck, Loader2 } from "lucide-react";

import { ContactForm } from "@/components/ContactForm";
import { ScrollReveal, SectionHeading } from "@/components/ScrollReveal";
import { SiteFooter } from "@/components/SiteFooter";
import { RentreeBanner, SiteHeader } from "@/components/SiteHeader";
import { CONTACT_EMAIL, SITE_URL } from "@/data/home-content";

const BOOKING_URL = "https://coursinus.youcanbook.me/";
const PHONE_NUMBER = "0767215953";
const PHONE_HREF = "+33767215953";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Réservation de cours — Coursinus",
  serviceType: "Soutien scolaire et accompagnement académique",
  provider: {
    "@type": "EducationalOrganization",
    name: "Coursinus",
    url: SITE_URL,
  },
  areaServed: "FR",
  telephone: PHONE_NUMBER,
  email: CONTACT_EMAIL,
};

export const Route = createFileRoute("/reservation")({
  head: () => ({
    meta: [
      { title: "Réservez votre premier cours — Coursinus" },
      {
        name: "description",
        content:
          "Réservez en ligne votre premier cours de soutien scolaire avec Coursinus. Premier échange gratuit, réponse rapide. Téléphone et email disponibles.",
      },
      {
        property: "og:title",
        content: "Réservez votre premier cours — Coursinus",
      },
      {
        property: "og:description",
        content:
          "Réservez en ligne votre premier cours de soutien scolaire avec Coursinus. Premier échange gratuit, réponse rapide.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/reservation` },
      { property: "og:image", content: `${SITE_URL}/coursinus-logo.png` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Réservez votre premier cours — Coursinus" },
      {
        name: "twitter:description",
        content:
          "Réservez en ligne votre premier cours de soutien scolaire avec Coursinus.",
      },
      { name: "twitter:image", content: `${SITE_URL}/coursinus-logo.png` },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(jsonLd) },
    ],
  }),
  component: ReservationPage,
});

function ReservationPage() {
  return (
    <div className="min-h-screen">
      <RentreeBanner />
      <SiteHeader />

      <main>
        {/* En-tête */}
        <section className="px-5 pt-12 pb-6 text-center sm:px-8 sm:pt-16">
          <ScrollReveal>
            <SectionHeading
              eyebrow="Première séance"
              title="Réservez votre premier cours"
            />
            <p className="mx-auto mt-6 max-w-xl text-sm text-muted-foreground sm:text-base">
              Choisissez directement un créneau dans notre agenda en ligne.
              Premier échange gratuit et sans engagement — réponse en moins de 24 h.
            </p>
          </ScrollReveal>
        </section>

        {/* Calendrier YouCanBook.me */}
        <section className="px-5 pb-16 sm:px-8 sm:pb-20">
          <div className="mx-auto max-w-5xl">
            <BookingFrame />
          </div>
        </section>

        {/* Appel à l'action complémentaire */}
        <section className="px-5 pb-20 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <ScrollReveal>
              <div className="card-lux rounded-3xl p-8 sm:p-12">
                <div className="grid gap-8 md:grid-cols-2 md:items-center">
                  <div>
                    <p className="text-xs tracking-[0.35em] text-gold uppercase">
                      Préférez en parler ?
                    </p>
                    <h3 className="mt-3 font-display text-3xl text-gold-soft sm:text-4xl">
                      Contactez-nous directement
                    </h3>
                    <div className="rule-gold my-6 w-40" />
                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                      Si vous préférez ne pas réserver en ligne, écrivez-nous
                      ou appelez-nous : nous adapterons le créneau à vos
                      disponibilités et au profil de l'élève.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <a
                      href={`tel:${PHONE_HREF}`}
                      className="flex items-center gap-4 rounded-2xl border border-gold/30 bg-gold/5 p-5 transition hover:border-gold/60 hover:bg-gold/10"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/5">
                        <Phone className="h-5 w-5 text-gold" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs tracking-[0.2em] text-muted-foreground uppercase">
                          Téléphone
                        </span>
                        <span className="block font-display text-xl text-gold-soft">
                          {PHONE_NUMBER}
                        </span>
                      </span>
                    </a>

                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="flex items-center gap-4 rounded-2xl border border-gold/30 bg-gold/5 p-5 transition hover:border-gold/60 hover:bg-gold/10"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/5">
                        <Mail className="h-5 w-5 text-gold" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs tracking-[0.2em] text-muted-foreground uppercase">
                          Email
                        </span>
                        <span className="block truncate font-display text-lg text-gold-soft">
                          {CONTACT_EMAIL}
                        </span>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Formulaire de contact alternatif */}
        <section id="contact" className="px-5 pb-24 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <ScrollReveal>
              <SectionHeading
                eyebrow="Ou laissez-nous un message"
                title="Décrivez votre besoin"
              />
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <div className="mt-10">
                <ContactForm />
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

/** Encadrement responsive de l'iframe YouCanBook.me avec état de chargement. */
function BookingFrame() {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // Filet de sécurité : si l'iframe ne déclenche pas onLoad après 12 s,
  // on affiche un message invitant à utiliser les contacts directs.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!loaded) setFailed(true);
    }, 12000);
    return () => window.clearTimeout(timer);
  }, [loaded]);

  return (
    <ScrollReveal>
      <div className="card-lux overflow-hidden rounded-3xl">
        {/* Bandeau de contexte */}
        <div className="flex items-center gap-3 border-b border-gold/15 bg-gold/5 px-5 py-4 sm:px-7">
          <CalendarCheck className="h-5 w-5 shrink-0 text-gold" aria-hidden />
          <p className="text-xs tracking-[0.18em] text-gold-soft sm:text-sm">
            Agenda en ligne — Coursinus via YouCanBook.me
          </p>
        </div>

        {/* Conteneur de l'iframe — hauteur responsive, pas de valeur en dur */}
        <div className="relative w-full">
          {!loaded && !failed && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-card/80 px-6 py-24 text-center backdrop-blur-sm">
              <Loader2 className="h-8 w-8 animate-spin text-gold" aria-hidden />
              <p className="text-sm text-muted-foreground">
                Chargement du calendrier de réservation…
              </p>
              <p className="text-xs text-muted-foreground/70">
                YouCanBook.me peut nécessiter quelques secondes au premier
                affichage.
              </p>
            </div>
          )}

          {failed && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-card/95 px-6 py-20 text-center backdrop-blur-sm">
              <p className="font-display text-2xl text-gold-soft">
                Le calendrier tarde à s'afficher
              </p>
              <p className="max-w-md text-sm text-muted-foreground">
                Vous pouvez réouvrir la page dans un instant, ou nous contacter
                directement par téléphone ou email.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href={`tel:${PHONE_HREF}`}
                  className="rounded-full border border-gold/50 px-5 py-2.5 text-sm text-gold-soft transition hover:bg-gold/10"
                >
                  {PHONE_NUMBER}
                </a>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="rounded-full border border-gold/50 px-5 py-2.5 text-sm text-gold-soft transition hover:bg-gold/10"
                >
                  {CONTACT_EMAIL}
                </a>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground transition hover:brightness-110"
                >
                  Ouvrir l'agenda
                </a>
              </div>
            </div>
          )}

          {/*
            Hauteur responsive : sur mobile, 70vh minimum pour que le
            calendrier tienne sans bloquer le scroll de page (l'iframe gère
            son propre défilement interne). Sur grands écrans, on laisse
            YouCanBook.me dimensionner le contenu.
          */}
          <iframe
            ref={frameRef}
            src={BOOKING_URL}
            title="Réservation d'un cours avec Coursinus"
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className="block w-full border-0 bg-background"
            style={{ minHeight: "70vh", height: "720px" }}
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </ScrollReveal>
  );
}
