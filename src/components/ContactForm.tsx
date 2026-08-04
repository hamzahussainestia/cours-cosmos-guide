import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { submitContactRequest } from "@/lib/contact.functions";

const levels = ["Collège", "Lycée", "Prépa"] as const;

const fieldClass =
  "w-full rounded-xl border border-gold/30 bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition focus:border-gold/70 focus:ring-1 focus:ring-gold/40";

const labelClass =
  "mb-2 block text-xs tracking-[0.2em] text-gold-soft uppercase";

export function ContactForm() {
  const submit = useServerFn(submitContactRequest);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    level: "Lycée" as (typeof levels)[number],
    message: "",
    website: "",
  });

  const update =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;

    if (form.name.trim().length < 2) return toast.error("Merci d'indiquer votre nom.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      return toast.error("Merci d'indiquer un email valide.");
    if (form.phone.trim().length < 6)
      return toast.error("Merci d'indiquer un numéro de téléphone.");

    setPending(true);
    try {
      await submit({ data: form });
      setDone(true);
      toast.success("Demande envoyée ! Nous vous rappelons très vite.");
    } catch (err) {
      console.error(err);
      toast.error("L'envoi a échoué. Réessayez dans un instant.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="card-lux rounded-2xl p-8 text-center">
        <p className="font-display text-3xl text-gold-gradient">Merci !</p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Votre demande a bien été transmise à l'équipe Coursinus. Nous vous
          rappelons rapidement au numéro indiqué.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-6 rounded-full border border-gold/50 px-6 py-2 text-sm text-gold-soft transition hover:bg-gold/10"
        >
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card-lux rounded-2xl p-8" noValidate>
      <h3 className="font-display text-3xl text-gold">Être rappelé</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Laissez vos coordonnées, nous vous contactons pour définir ensemble le
        programme adapté.
      </p>
      <div className="rule-gold my-6" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="name">
            Nom et prénom
          </label>
          <input
            id="name"
            name="name"
            className={fieldClass}
            value={form.name}
            onChange={update("name")}
            maxLength={100}
            required
            autoComplete="name"
            placeholder="Marie Dupont"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={fieldClass}
            value={form.email}
            onChange={update("email")}
            maxLength={255}
            required
            autoComplete="email"
            placeholder="marie.dupont@email.com"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">
            Téléphone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className={fieldClass}
            value={form.phone}
            onChange={update("phone")}
            maxLength={30}
            required
            autoComplete="tel"
            placeholder="06 12 34 56 78"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="level">
            Niveau
          </label>
          <select
            id="level"
            name="level"
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
      </div>

      <div className="mt-5">
        <label className={labelClass} htmlFor="message">
          Message (optionnel)
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={fieldClass}
          value={form.message}
          onChange={update("message")}
          maxLength={1000}
          placeholder="Matières souhaitées, objectifs, disponibilités…"
        />
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

      <button
        type="submit"
        disabled={pending}
        className="mt-7 w-full rounded-full bg-primary px-7 py-3 text-sm font-medium tracking-wide text-primary-foreground shadow-[var(--shadow-gold)] transition hover:brightness-110 disabled:opacity-60"
      >
        {pending ? "Envoi en cours…" : "Envoyer ma demande"}
      </button>
    </form>
  );
}
