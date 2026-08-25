import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  ExternalLink,
  GraduationCap,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
} from "lucide-react";
import { toast } from "sonner";

import { submitBookingRequest } from "@/lib/booking.functions";
import {
  BOOKING_URL_STUDENT,
  BOOKING_URL_TEACHER,
  CONTACT_EMAIL,
  subjects,
} from "@/data/home-content";

const levels = ["Collège", "Lycée", "Prépa"] as const;
type Role = "eleve_parent" | "prof";
type ContactMethod = "telephone" | "visio";

const fieldClass =
  "w-full rounded-xl border border-gold/30 bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition focus:border-gold/70 focus:ring-1 focus:ring-gold/40";

const labelClass = "mb-2 block text-xs tracking-[0.2em] text-gold-soft uppercase";

type FormState = {
  name: string;
  email: string;
  phone: string;
  level: (typeof levels)[number];
  subject: string;
  school: string;
  message: string;
  website: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  level: "Lycée",
  subject: subjects[0]?.name ?? "",
  school: "",
  message: "",
  website: "",
};

/** Petite salve de confettis aux couleurs du site, à la validation du RDV. */
async function fireConfetti(): Promise<void> {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  try {
    const { default: confetti } = await import("canvas-confetti");
    const colors = ["#e8c874", "#f4e2ab", "#2d4a9e"];
    confetti({
      particleCount: 90,
      spread: 75,
      startVelocity: 38,
      origin: { y: 0.65 },
      colors,
      zIndex: 60,
    });
    confetti({
      particleCount: 50,
      spread: 100,
      startVelocity: 28,
      origin: { y: 0.65 },
      colors,
      zIndex: 60,
      scalar: 0.8,
    });
  } catch (err) {
    console.error("confetti failed to load:", err);
  }
}

function ProgressBar({ step }: { step: 1 | 2 | 3 | 4 }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 text-xs tracking-[0.15em] text-gold-soft uppercase">
        <span>Étape {step} sur 4</span>
        <span className="h-px flex-1 bg-gold/20" />
        <span className="text-muted-foreground">~1 min</span>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-colors ${
              s <= step ? "bg-primary" : "bg-gold/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function ReassuranceStrip() {
  const items = [
    { icon: ShieldCheck, label: "Sans engagement" },
    { icon: Clock3, label: "Réponse sous 24h" },
    { icon: Sparkles, label: "100% gratuit" },
  ];
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-gold/15 pt-4">
      {items.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
        >
          <Icon className="h-3.5 w-3.5 text-gold" aria-hidden />
          {label}
        </div>
      ))}
    </div>
  );
}

export function BookingFlow() {
  const submit = useServerFn(submitBookingRequest);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [role, setRole] = useState<Role | null>(null);
  const [contactMethod, setContactMethod] = useState<ContactMethod | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  function chooseRole(r: Role) {
    setRole(r);
    setStep(2);
  }

  function handleContinueStep2(): void {
    if (!role) return;

    if (form.name.trim().length < 2) {
      toast.error("Merci d'indiquer votre nom.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast.error("Merci d'indiquer un email valide.");
      return;
    }
    if (form.phone.trim().length < 6) {
      toast.error("Merci d'indiquer un numéro de téléphone.");
      return;
    }
    if (role === "prof" && form.school.trim().length < 2) {
      toast.error("Merci d'indiquer votre école ou filière.");
      return;
    }

    setStep(3);
  }

  async function chooseContactMethod(method: ContactMethod): Promise<void> {
    if (!role || pending) return;
    setContactMethod(method);
    setPending(true);
    try {
      await submit({
        data: {
          role,
          contactMethod: method,
          name: form.name,
          email: form.email,
          phone: form.phone,
          level: role === "eleve_parent" ? form.level : undefined,
          subject: role === "eleve_parent" ? form.subject : undefined,
          school: role === "prof" ? form.school : undefined,
          message: form.message,
          website: form.website,
        },
      });
      setSubmitted(true);
      setStep(4);
      void fireConfetti();
    } catch (err) {
      console.error(err);
      toast.error("L'envoi a échoué. Réessayez dans un instant.");
      setContactMethod(null);
    } finally {
      setPending(false);
    }
  }

  const bookingUrl = role === "prof" ? BOOKING_URL_TEACHER : BOOKING_URL_STUDENT;

  return (
    <div
      className="card-lux mx-auto rounded-2xl p-5 sm:p-7"
      style={{ maxWidth: step === 4 && contactMethod === "visio" ? "42rem" : "32rem" }}
    >
      <ProgressBar step={step} />

      {step === 1 && (
        <div>
          <h3 className="font-display text-2xl sm:text-3xl">Qui êtes-vous ?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Pour vous proposer le bon type de rendez-vous, directement dans notre agenda.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => chooseRole("eleve_parent")}
              className={`tap-scale relative rounded-2xl border-2 p-5 text-left transition ${
                role === "eleve_parent"
                  ? "border-primary bg-primary/10"
                  : "border-gold/20 hover:border-gold/50"
              }`}
            >
              {role === "eleve_parent" && (
                <span className="absolute top-4 right-4 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" aria-hidden />
                </span>
              )}
              <GraduationCap className="h-7 w-7 text-gold" aria-hidden />
              <p className="mt-3 font-display text-lg">Élève / Parent</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Je cherche un accompagnement scolaire
              </p>
            </button>

            <button
              type="button"
              onClick={() => chooseRole("prof")}
              className={`tap-scale relative rounded-2xl border-2 p-5 text-left transition ${
                role === "prof"
                  ? "border-primary bg-primary/10"
                  : "border-gold/20 hover:border-gold/50"
              }`}
            >
              {role === "prof" && (
                <span className="absolute top-4 right-4 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" aria-hidden />
                </span>
              )}
              <Users className="h-7 w-7 text-gold" aria-hidden />
              <p className="mt-3 font-display text-lg">Je suis prof</p>
              <p className="mt-1 text-xs text-muted-foreground">Je veux rejoindre l'équipe</p>
            </button>
          </div>

          <ReassuranceStrip />
        </div>
      )}

      {step === 2 && role && (
        <div>
          <h3 className="font-display text-2xl sm:text-3xl">
            {role === "eleve_parent" ? "Votre besoin" : "Votre profil"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Quelques informations pour préparer votre échange.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="bf-name">
                Nom et prénom
              </label>
              <input
                id="bf-name"
                className={fieldClass}
                value={form.name}
                onChange={update("name")}
                maxLength={100}
                autoComplete="name"
                placeholder="Marie Dupont"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="bf-email">
                Email
              </label>
              <input
                id="bf-email"
                type="email"
                className={fieldClass}
                value={form.email}
                onChange={update("email")}
                maxLength={255}
                autoComplete="email"
                placeholder="marie.dupont@email.com"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="bf-phone">
                Téléphone
              </label>
              <input
                id="bf-phone"
                type="tel"
                className={fieldClass}
                value={form.phone}
                onChange={update("phone")}
                maxLength={30}
                autoComplete="tel"
                placeholder="06 12 34 56 78"
              />
            </div>

            {role === "eleve_parent" ? (
              <>
                <div>
                  <label className={labelClass} htmlFor="bf-level">
                    Niveau
                  </label>
                  <select
                    id="bf-level"
                    className={fieldClass}
                    value={form.level}
                    onChange={update("level")}
                  >
                    {levels.map((l) => (
                      <option key={l} value={l} className="bg-background text-foreground">
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="bf-subject">
                    Matière principale
                  </label>
                  <select
                    id="bf-subject"
                    className={fieldClass}
                    value={form.subject}
                    onChange={update("subject")}
                  >
                    {subjects.map((s) => (
                      <option key={s.name} value={s.name} className="bg-background text-foreground">
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="bf-school">
                  École / filière
                </label>
                <input
                  id="bf-school"
                  className={fieldClass}
                  value={form.school}
                  onChange={update("school")}
                  maxLength={120}
                  placeholder="Ex. CentraleSupélec, MPSI…"
                />
              </div>
            )}

            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="bf-message">
                Message (optionnel)
              </label>
              <textarea
                id="bf-message"
                rows={3}
                className={fieldClass}
                value={form.message}
                onChange={update("message")}
                maxLength={1000}
                placeholder={
                  role === "eleve_parent"
                    ? "Objectifs, disponibilités…"
                    : "Votre parcours, vos disponibilités…"
                }
              />
            </div>
          </div>

          {/* Champ anti-spam, masqué aux visiteurs */}
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={update("website")}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-gold-soft"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Retour
            </button>
            <button
              type="button"
              onClick={handleContinueStep2}
              className="btn-press flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium tracking-wide text-primary-foreground"
            >
              Continuer
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <ReassuranceStrip />
        </div>
      )}

      {step === 3 && role && (
        <div>
          <h3 className="font-display text-2xl sm:text-3xl">Comment souhaitez-vous échanger ?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Un premier échange gratuit d&apos;environ 15-20 minutes, comme vous préférez.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => void chooseContactMethod("telephone")}
              className="tap-scale relative rounded-2xl border-2 border-gold/20 p-5 text-left transition hover:border-gold/50 disabled:opacity-60"
            >
              <Phone className="h-7 w-7 text-gold" aria-hidden />
              <p className="mt-3 font-display text-lg">Téléphone</p>
              <p className="mt-1 text-xs text-muted-foreground">On vous appelle directement</p>
            </button>

            <button
              type="button"
              disabled={pending}
              onClick={() => void chooseContactMethod("visio")}
              className="tap-scale relative rounded-2xl border-2 border-gold/20 p-5 text-left transition hover:border-gold/50 disabled:opacity-60"
            >
              <Video className="h-7 w-7 text-gold" aria-hidden />
              <p className="mt-3 font-display text-lg">Appel vidéo</p>
              <p className="mt-1 text-xs text-muted-foreground">Rendez-vous par Google Meet</p>
            </button>
          </div>

          {pending && (
            <p className="mt-4 text-center text-xs text-muted-foreground">Envoi en cours…</p>
          )}

          <div className="mt-6">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-gold-soft"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Retour
            </button>
          </div>
        </div>
      )}

      {step === 4 && role && contactMethod === "visio" && (
        <div>
          <h3 className="font-display text-2xl sm:text-3xl">
            {submitted ? "Merci ! Réservez votre créneau" : "Réservez votre créneau"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Votre demande est bien transmise à l&apos;équipe Coursinus. Choisissez maintenant un
            créneau dans notre agenda.
          </p>

          {bookingUrl ? (
            <div className="mt-5 overflow-hidden rounded-2xl border border-gold/20 bg-white">
              {/* La page Google Agenda a un fond blanc/transparent conçu pour un
                  hébergeur clair : on force donc un fond blanc ici plutôt que
                  d'hériter du thème sombre du site, sinon le texte devient
                  illisible. */}
              <iframe
                src={bookingUrl}
                title="Prendre rendez-vous"
                className="h-[560px] w-full bg-white"
                loading="lazy"
              />
              <div className="border-t border-black/10 bg-white p-3 text-center">
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-[oklch(0.36_0.19_265)] hover:underline"
                >
                  Ouvrir dans un nouvel onglet
                  <ExternalLink className="h-3 w-3" aria-hidden />
                </a>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-gold/30 bg-card/30 p-6 text-center">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Le calendrier de réservation en ligne arrive très bientôt. En attendant, l'équipe
                Coursinus vous recontacte directement au numéro indiqué sous 24h, ou écrivez-nous à{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold-soft hover:underline">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>
          )}
        </div>
      )}

      {step === 4 && contactMethod === "telephone" && (
        <div className="text-center">
          <h3 className="font-display text-2xl sm:text-3xl">Merci, c&apos;est noté !</h3>
          <div className="mt-5 rounded-2xl border border-gold/30 bg-card/30 p-6">
            <Phone className="mx-auto h-8 w-8 text-gold" aria-hidden />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              L&apos;équipe Coursinus vous appelle au{" "}
              <span className="font-medium text-foreground">{form.phone}</span> pour un échange
              gratuit d&apos;environ 15-20 minutes, généralement sous 24h. Une confirmation vient
              aussi de partir par email.
            </p>
          </div>
          <ReassuranceStrip />
        </div>
      )}
    </div>
  );
}
