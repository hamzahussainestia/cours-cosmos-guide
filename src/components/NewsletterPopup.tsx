import { useEffect, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, GraduationCap, Users } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { subscribeToNewsletter } from "@/lib/newsletter.functions";

/** Délai avant l'apparition de la fenêtre, en millisecondes. */
const DELAI_MS = 8000;

/** Repousse l'ouverture de ce délai tant que le visiteur écrit dans un champ. */
const DELAI_REPORT_MS = 3000;

const CLE_STOCKAGE = "coursinus:newsletter-popup";

/**
 * Évènement qui ouvre la fenêtre à la demande. La fenêtre vit dans la racine
 * du site : un bouton de page passe par cet évènement plutôt que de remonter
 * un état à travers tout l'arbre.
 */
const EVENEMENT_OUVERTURE = "coursinus:ouvrir-newsletter";

/** Ouvre la fenêtre d'inscription, même si le visiteur l'a déjà vue. */
export function ouvrirNewsletter(): void {
  window.dispatchEvent(new Event(EVENEMENT_OUVERTURE));
}

const NIVEAUX = ["3e", "2de", "1re"] as const;
type Niveau = (typeof NIVEAUX)[number];
type Profil = "parent" | "eleve";

/*
 * Le stockage peut lever une exception (navigation privée, données de site
 * bloquées, quota) : chaque accès est enveloppé, et la fenêtre fonctionne sans.
 */
function dejaVue(): boolean {
  try {
    return window.localStorage.getItem(CLE_STOCKAGE) !== null;
  } catch {
    return false;
  }
}

function marquerVue(): void {
  try {
    window.localStorage.setItem(CLE_STOCKAGE, new Date().toISOString());
  } catch {
    // Sans stockage, la fenêtre pourra revenir au prochain chargement : tant pis.
  }
}

function champActif(): boolean {
  const el = document.activeElement;
  if (!el) return false;
  return el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT";
}

const fieldClass =
  "w-full rounded-xl border border-gold/30 bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition focus:border-gold/70 focus:ring-1 focus:ring-gold/40";

const labelClass = "mb-2 block text-xs tracking-[0.2em] text-gold-soft uppercase";

/** Bouton de choix, dans le style des cartes de BookingFlow. */
function Choix({
  actif,
  onClick,
  children,
  className = "",
}: {
  actif: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={actif}
      onClick={onClick}
      className={`tap-scale relative rounded-2xl border-2 text-left transition ${
        actif ? "border-primary bg-primary/10" : "border-gold/20 hover:border-gold/50"
      } ${className}`}
    >
      {actif && (
        <span className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-3 w-3" aria-hidden />
        </span>
      )}
      {children}
    </button>
  );
}

export function NewsletterPopup() {
  const envoyer = useServerFn(subscribeToNewsletter);
  const [ouverte, setOuverte] = useState(false);
  const [profil, setProfil] = useState<Profil | null>(null);
  const [niveau, setNiveau] = useState<Niveau | null>(null);
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");
  const [envoye, setEnvoye] = useState(false);

  // Apparition unique, 8 secondes après l'arrivée. Le montage n'a lieu qu'une
  // fois par chargement de page (le composant vit dans la racine), donc les
  // navigations internes ne relancent pas le compte à rebours.
  useEffect(() => {
    if (dejaVue()) return;

    let minuteur: ReturnType<typeof setTimeout>;
    const afficher = () => {
      // Le visiteur a pu l'ouvrir lui-même entre-temps : on ne la rouvre pas.
      if (dejaVue()) return;
      // Ne jamais voler le focus à quelqu'un qui remplit déjà un formulaire
      // (par exemple la demande de rendez-vous) : on retente un peu plus tard.
      if (champActif()) {
        minuteur = setTimeout(afficher, DELAI_REPORT_MS);
        return;
      }
      // Marquée dès l'affichage : elle n'apparaît qu'une seule fois, même si le
      // visiteur recharge la page sans la fermer.
      marquerVue();
      setOuverte(true);
    };
    // Le délai court depuis l'arrivée sur la page, pas depuis l'hydratation :
    // on retranche le temps déjà écoulé.
    minuteur = setTimeout(afficher, Math.max(0, DELAI_MS - performance.now()));
    return () => clearTimeout(minuteur);
  }, []);

  // Ouverture à la demande, depuis le bouton « Les recevoir par mail » : ici on
  // ignore `dejaVue`, puisque c'est le visiteur lui-même qui la réclame.
  useEffect(() => {
    const ouvrir = () => {
      setEnvoye(false);
      setOuverte(true);
    };
    window.addEventListener(EVENEMENT_OUVERTURE, ouvrir);
    return () => window.removeEventListener(EVENEMENT_OUVERTURE, ouvrir);
  }, []);

  function fermer(): void {
    marquerVue();
    setOuverte(false);
  }

  async function soumettre(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (enCours) return;
    if (!profil) {
      setErreur("Indiquez si vous êtes parent ou élève.");
      return;
    }
    if (!niveau) {
      setErreur("Choisissez le niveau pour recevoir le bon échantillon.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErreur("Merci d'indiquer un email valide.");
      return;
    }
    setErreur("");
    setEnCours(true);
    try {
      await envoyer({ data: { email: email.trim(), profil, niveau, website } });
      setEnvoye(true);
    } catch (err) {
      // Le mail est le seul accusé de réception : on laisse le visiteur
      // réessayer plutôt que de lui faire croire que c'est parti.
      console.error(err);
      setErreur("L'envoi a échoué. Réessayez dans un instant.");
    } finally {
      setEnCours(false);
    }
  }

  return (
    <Dialog open={ouverte} onOpenChange={(o) => (o ? setOuverte(true) : fermer())}>
      <DialogContent className="max-h-[92dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border-gold/30 p-5 sm:p-7">
        {envoye ? (
          <div className="py-4 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-6 w-6" aria-hidden />
            </span>
            <DialogTitle className="mt-4 font-display text-2xl leading-tight">
              C&apos;est envoyé !
            </DialogTitle>
            <DialogDescription className="mt-2">
              Votre échantillon de maths arrive dans votre boîte mail. Pensez à regarder dans les
              courriers indésirables si vous ne le voyez pas.
            </DialogDescription>
            <button
              type="button"
              onClick={fermer}
              className="btn-press mt-6 w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={soumettre} noValidate>
            <DialogHeader>
              <DialogTitle className="pr-6 font-display text-2xl leading-tight sm:text-3xl">
                Testez nos fiches de maths, gratuitement
              </DialogTitle>
              <DialogDescription>
                Quatre pages offertes, adaptées à la classe, directement dans votre boîte mail.
              </DialogDescription>
            </DialogHeader>

            <fieldset className="mt-5">
              <legend className={labelClass}>Parent ou élève ?</legend>
              <div className="grid grid-cols-2 gap-3">
                <Choix
                  actif={profil === "parent"}
                  onClick={() => setProfil("parent")}
                  className="p-3.5"
                >
                  <Users className="h-5 w-5 text-gold" aria-hidden />
                  <span className="mt-2 block font-display text-base">Parent</span>
                </Choix>
                <Choix
                  actif={profil === "eleve"}
                  onClick={() => setProfil("eleve")}
                  className="p-3.5"
                >
                  <GraduationCap className="h-5 w-5 text-gold" aria-hidden />
                  <span className="mt-2 block font-display text-base">Élève</span>
                </Choix>
              </div>
            </fieldset>

            <fieldset className="mt-5">
              <legend className={labelClass}>Votre niveau</legend>
              <div className="grid grid-cols-3 gap-3">
                {NIVEAUX.map((n) => (
                  <Choix
                    key={n}
                    actif={niveau === n}
                    onClick={() => setNiveau(n)}
                    className="px-3 py-3 text-center"
                  >
                    <span className="block font-display text-lg">{n}</span>
                  </Choix>
                ))}
              </div>
            </fieldset>

            <div className="mt-5">
              <label className={labelClass} htmlFor="nl-email">
                Email
              </label>
              <input
                id="nl-email"
                type="email"
                required
                autoComplete="email"
                maxLength={255}
                placeholder="prenom@exemple.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass}
              />
            </div>

            {/* Honeypot : invisible pour un humain, rempli par les robots. */}
            <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="nl-website">Site web</label>
              <input
                id="nl-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={enCours}
              className="btn-press mt-6 w-full rounded-full bg-primary px-5 py-3.5 text-[15px] font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
            >
              {enCours ? "Envoi…" : "Recevoir mon échantillon"}
            </button>

            {erreur ? (
              <p role="alert" className="mt-3 text-sm text-destructive">
                {erreur}
              </p>
            ) : null}

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Votre adresse sert à envoyer l&apos;échantillon, puis des nouvelles des fiches. Rien
              d&apos;autre, jamais revendue, et vous vous désabonnez en répondant STOP.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
