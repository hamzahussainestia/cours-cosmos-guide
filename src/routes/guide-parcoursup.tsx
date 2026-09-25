import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { subscribeToGuide } from "@/lib/guide.functions";

export const Route = createFileRoute("/guide-parcoursup")({
  head: () => ({
    meta: [
      { title: "Guide Parcoursup gratuit — Coursinus" },
      {
        name: "description",
        content:
          "Douze pages sur ce que personne n'explique : répartir ses dix vœux, les sous-vœux non plafonnés, ce que lisent vraiment les commissions.",
      },
      { property: "og:title", content: "Parcoursup sans se planter — guide gratuit" },
      {
        property: "og:description",
        content:
          "Par Hamza (@azmaoff), prépa TSI puis école d'ingénieur. Accepté partout où il avait demandé.",
      },
    ],
  }),
  component: GuideParcoursupPage,
});

const GUIDE_FILE = "/guide-parcoursup.pdf";

const CHAPITRES = [
  {
    n: "01",
    t: "Le calendrier",
    d: "Les deux échéances que les élèves confondent chaque année, et le mois de décembre que personne n'utilise.",
  },
  {
    n: "02",
    t: "La stratégie des vœux",
    d: "La règle 3/4/3, le rang du dernier appelé, et les sous-vœux non plafonnés que presque personne ne connaît.",
  },
  {
    n: "03",
    t: "La lettre de motivation",
    d: "Les quatre phrases qui tuent un dossier, et la structure en quatre blocs qui fonctionne.",
  },
  {
    n: "04",
    t: "La rubrique laissée vide",
    d: "Ton job d'été et ton sport du matin valent plus que tu ne crois. Comment les écrire.",
  },
  {
    n: "05",
    t: "L'admission",
    d: "Pourquoi ton rang descend tout seul, et la seule erreur irréversible de toute la procédure.",
  },
];

function GuideParcoursupPage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [emailed, setEmailed] = useState(true);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setError("");
    try {
      const result = await subscribeToGuide({ data: { email, firstName, lastName, website } });
      setEmailed(Boolean(result?.emailed));
      setState("done");
    } catch (caught) {
      console.error(caught);
      setError(
        caught instanceof Error && caught.message
          ? caught.message
          : "Quelque chose n'a pas marché. Réessaie dans un instant.",
      );
      setState("error");
    }
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        {/* ---------------------------------------------------------- hero */}
        <section className="px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">
                Guide gratuit · 12 pages
              </p>
              <h1 className="mt-4 font-display text-4xl leading-[1.05] text-gold sm:text-5xl">
                Parcoursup
                <br />
                sans se planter
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Parcoursup n&apos;est pas un formulaire difficile à remplir. C&apos;est un
                formulaire facile à remplir mal, et la différence se joue sur des choses que
                personne n&apos;écrit nulle part.
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Écrit par <strong className="text-foreground">Hamza</strong>, créateur de{" "}
                <strong className="text-foreground">@azmaoff</strong> sur TikTok. Prépa TSI, puis
                école d&apos;ingénieur, aujourd&apos;hui apprenti ingénieur chez Safran.{" "}
                <span className="text-gold-soft">Accepté partout où il avait demandé.</span>
              </p>
            </div>

            {/* ------------------------------------------------ formulaire */}
            <div className="rounded-xl border border-border/60 bg-card/60 p-6 shadow-sm sm:p-8">
              {state === "done" ? (
                <div>
                  <h2 className="font-display text-2xl text-gold">
                    {emailed ? "C'est envoyé." : "C'est à toi."}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {emailed ? (
                      <>
                        Le guide part aussi dans ta boîte mail, à{" "}
                        <strong className="text-foreground">{email}</strong>. Si tu ne le vois pas,
                        regarde dans les spams.
                      </>
                    ) : (
                      <>
                        Le téléchargement est juste en dessous. L&apos;envoi par mail n&apos;a pas
                        pu se faire à l&apos;instant, mais ton adresse est bien enregistrée : tu
                        recevras les dates officielles de la session 2027 dès leur sortie.
                      </>
                    )}
                  </p>
                  <a
                    href={GUIDE_FILE}
                    download
                    className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                  >
                    Télécharger le guide maintenant
                  </a>
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    S&apos;il t&apos;a servi, envoie-le à quelqu&apos;un de ta classe.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2 className="font-display text-2xl text-gold">Reçois-le maintenant</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Ton adresse, et c&apos;est à toi.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="guide-prenom" className="block text-sm font-medium">
                        Prénom
                      </label>
                      <input
                        id="guide-prenom"
                        name="firstName"
                        type="text"
                        required
                        autoComplete="given-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-gold-soft focus:ring-1 focus:ring-gold-soft"
                      />
                    </div>
                    <div>
                      <label htmlFor="guide-nom" className="block text-sm font-medium">
                        Nom <span className="text-muted-foreground">(facultatif)</span>
                      </label>
                      <input
                        id="guide-nom"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-gold-soft focus:ring-1 focus:ring-gold-soft"
                      />
                    </div>
                  </div>

                  <label htmlFor="guide-email" className="mt-4 block text-sm font-medium">
                    Adresse email
                  </label>
                  <input
                    id="guide-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="prenom@exemple.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-gold-soft focus:ring-1 focus:ring-gold-soft"
                  />

                  {/* Honeypot : invisible pour un humain, rempli par les robots. */}
                  <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                    <label htmlFor="guide-website">Site web</label>
                    <input
                      id="guide-website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={state === "sending"}
                    className="mt-6 w-full rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {state === "sending" ? "Envoi…" : "Recevoir le guide"}
                  </button>

                  {state === "error" ? (
                    <p role="alert" className="mt-3 text-sm text-destructive">
                      {error}
                    </p>
                  ) : null}

                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    Ton adresse sert à t&apos;envoyer le guide, puis les dates officielles de la
                    session 2027 quand elles sortiront. Rien d&apos;autre, jamais revendue, et tu te
                    désabonnes en répondant STOP.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- ce qu'il y a dedans */}
        <section className="border-t border-border/50 px-5 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display text-2xl text-gold sm:text-3xl">
              Ce qu&apos;il y a dedans
            </h2>
            <div className="rule-gold my-6 w-24" />
            <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
              {CHAPITRES.map((c) => (
                <div key={c.n} className="flex gap-4">
                  <span className="font-display text-2xl leading-none text-gold-soft/70">
                    {c.n}
                  </span>
                  <div>
                    <h3 className="font-display text-lg text-foreground">{c.t}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- honnêteté */}
        <section className="px-5 pb-16 sm:px-8 sm:pb-24">
          <div className="mx-auto max-w-3xl rounded-xl border border-border/60 bg-card/40 p-6 sm:p-8">
            <h2 className="font-display text-xl text-gold-soft">Ce que ce guide n&apos;est pas</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Il ne remplace pas{" "}
              <a
                href="https://www.parcoursup.gouv.fr"
                target="_blank"
                rel="noreferrer"
                className="text-gold-soft hover:underline"
              >
                parcoursup.gouv.fr
              </a>
              . Le site officiel est gratuit, complet, et tout ce qui est réglementaire s&apos;y
              trouve mieux expliqué. Ce guide parle d&apos;autre chose : là où les gens se plantent.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Les dates officielles de la session 2027 ne sont pas encore publiées. Le guide
              contient le rythme de la session précédente comme repère, et tu recevras les vraies
              dates par mail dès leur sortie.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
