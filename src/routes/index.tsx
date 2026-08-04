import { createFileRoute } from "@tanstack/react-router";
import logoAsset from "@/assets/coursinus-logo.png.asset.json";
import qrAsset from "@/assets/coursinus-qr.png.asset.json";
import { ContactForm } from "@/components/ContactForm";


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
    ],
  }),
  component: Index,
});

const offers = [
  {
    level: "Collège",
    range: "6ème à la 3ème",
    price: "20",
    points: [
      "Renforcement solide des bases",
      "Acquisition d'une méthode de travail rigoureuse",
      "Réussite au brevet avec mention",
    ],
  },
  {
    level: "Lycée",
    range: "2nde à la Terminale",
    price: "25",
    featured: true,
    points: [
      "Maîtrise des spécialités scientifiques (maths, physique-chimie, SI)",
      "Préparation du bac et du grand oral",
      "Dossier Parcoursup d'excellence",
      "Bac blanc en conditions réelles",
    ],
  },
  {
    level: "Prépa",
    range: "MPSI, PCSI, TSI, ATS, ECE, ECG",
    price: "35",
    points: [
      "Préparation aux exigences des concours",
      "Développement de la performance",
      "Khôlles personnalisées",
      "Concours blanc",
    ],
  },
];

const reasons = [
  {
    title: "Professeurs d'exception",
    text: "Des enseignants sélectionnés avec exigence : agrégés, normaliens et experts de leur discipline.",
    numeral: "I",
  },
  {
    title: "Suivi individuel transparent",
    text: "Un accompagnement sur mesure, avec un point de progression clair et régulier pour l'élève et sa famille.",
    numeral: "II",
  },
  {
    title: "Flexibilité & tarifs clairs",
    text: "Des horaires adaptés à votre rythme et une tarification annoncée à l'heure, sans frais cachés.",
    numeral: "III",
  },
];

function Index() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={logoAsset.url}
            alt="Logo Coursinus"
            className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12"
          />
          <span className="truncate font-display text-xl tracking-[0.35em] text-gold sm:text-2xl">
            COURSINUS
          </span>
        </div>
        <a
          href="#contact"
          className="shrink-0 rounded-full border border-gold/50 px-4 py-2 text-xs tracking-[0.2em] text-gold-soft uppercase transition hover:bg-gold/10 sm:text-sm"
        >
          Contact
        </a>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-5 pt-10 pb-24 sm:px-8 sm:pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <img
              src={logoAsset.url}
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
              « Vise l'excellence »
            </p>
            <p className="mt-4 text-xs tracking-[0.35em] text-muted-foreground uppercase">
              L'écurie d'excellence scientifique
            </p>
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
          </div>
        </section>

        {/* Offres */}
        <section id="offres" className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs tracking-[0.35em] text-gold uppercase">
                Nos formules
              </p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">
                Offres &amp; Tarifs
              </h2>
              <div className="rule-gold mx-auto mt-6 w-40" />
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {offers.map((o) => (
                <article
                  key={o.level}
                  className={`card-lux flex flex-col rounded-2xl p-8 ${
                    o.featured ? "border-gold/60 md:-translate-y-4" : ""
                  }`}
                >
                  {o.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-[10px] tracking-[0.2em] text-primary-foreground uppercase">
                      Le plus demandé
                    </span>
                  )}
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
              ))}
            </div>
          </div>
        </section>

        {/* Pourquoi nous choisir */}
        <section className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs tracking-[0.35em] text-gold uppercase">
                Notre exigence
              </p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">
                Pourquoi nous choisir ?
              </h2>
              <div className="rule-gold mx-auto mt-6 w-40" />
            </div>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {reasons.map((r) => (
                <div
                  key={r.title}
                  className="card-lux rounded-2xl p-8 text-center"
                >
                  <span className="font-display text-4xl text-gold-gradient">
                    {r.numeral}
                  </span>
                  <h3 className="mt-4 font-display text-2xl text-gold-soft">
                    {r.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {r.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="px-5 py-20 sm:px-8">
          <div className="card-lux mx-auto grid max-w-5xl gap-10 rounded-3xl p-8 sm:p-14 md:grid-cols-[1.2fr_auto] md:items-center">
            <div>
              <p className="text-xs tracking-[0.35em] text-gold uppercase">
                Rejoindre l'écurie
              </p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">
                Prêt à viser l'excellence ?
              </h2>
              <div className="rule-gold my-6 w-40" />
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Scannez le QR code pour nous contacter directement, échanger sur
                le profil de l'élève et construire ensemble un programme
                d'accompagnement sur mesure.
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
              </ul>
            </div>
            <div className="mx-auto text-center">
              <div className="rounded-2xl border border-gold/40 bg-foreground/95 p-4 shadow-[var(--shadow-gold)]">
                <img
                  src={qrAsset.url}
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
                href="https://discord.gg/U5w5qYZ4RZ"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block rounded-full border border-gold/50 px-6 py-3 text-sm tracking-wide text-gold-soft transition hover:bg-gold/10"
              >
                Rejoindre le Discord
              </a>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-5xl">
            <ContactForm />
          </div>
        </section>

      </main>

      <footer className="border-t border-gold/20 px-5 py-10 text-center sm:px-8">
        <img
          src={logoAsset.url}
          alt=""
          aria-hidden="true"
          className="mx-auto h-10 w-10 object-contain opacity-80"
        />
        <p className="mt-3 font-display tracking-[0.3em] text-gold">COURSINUS</p>
        <p className="mt-2 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Coursinus — L'écurie d'excellence
          scientifique
        </p>
      </footer>
    </div>
  );
}
