import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const NEWSLETTER_NIVEAUX = ["3e", "2de", "1re"] as const;

const newsletterSchema = z.object({
  email: z.string().trim().email("Email invalide").max(255),
  profil: z.enum(["parent", "eleve"]),
  niveau: z.enum(NEWSLETTER_NIVEAUX),
  // Honeypot anti-spam : doit rester vide.
  website: z.string().max(0).optional().default(""),
});

export type NewsletterInput = z.input<typeof newsletterSchema>;

/**
 * Échantillons de maths envoyés par mail : des extraits de 4 pages, jamais les
 * packs complets (qui sont vendus et restent hors de public/).
 */
const ECHANTILLONS: Record<(typeof NEWSLETTER_NIVEAUX)[number], string> = {
  "3e": "https://coursinus.fr/fiches/echantillon-maths-3e.pdf",
  "2de": "https://coursinus.fr/fiches/echantillon-maths-2nde.pdf",
  "1re": "https://coursinus.fr/fiches/echantillon-maths-1re.pdf",
};

/**
 * Expéditeur. Mêmes réglages que le guide Parcoursup : NEWSLETTER_FROM si
 * posée, sinon GUIDE_FROM (sous-domaine d'envoi dédié), sinon le domaine
 * principal déjà vérifié chez Resend.
 */
const FROM =
  process.env["NEWSLETTER_FROM"] || process.env["GUIDE_FROM"] || "Coursinus <contact@coursinus.fr>";

/** Où atterrissent les réponses. */
const REPLY_TO =
  process.env["NEWSLETTER_REPLY_TO"] || process.env["GUIDE_REPLY_TO"] || "coursinus.aide@gmail.com";

/**
 * Enregistre l'inscription dans la feuille de suivi Google Sheets.
 *
 * Écrite AVANT l'envoi du mail, pour qu'une adresse ne soit jamais perdue parce
 * que le quota Resend est atteint. Reste silencieuse en cas d'échec : une
 * feuille indisponible ne doit pas empêcher le visiteur de recevoir son
 * échantillon. Si le mail échoue ensuite et que le visiteur réessaie, la
 * feuille peut contenir deux lignes pour la même adresse : c'est voulu, mieux
 * vaut un doublon qu'une adresse perdue.
 */
async function recordInSheet(data: z.infer<typeof newsletterSchema>): Promise<boolean> {
  const url = process.env["SHEETS_WEBHOOK_URL"];
  const token = process.env["SHEETS_WEBHOOK_TOKEN"];
  if (!url || !token) return false;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify({
        token,
        receivedAt: new Date().toISOString(),
        role: "Newsletter fiches",
        contactMethod: "Échantillon maths",
        name: "",
        email: data.email,
        phone: "",
        level: data.niveau,
        subject: "Mathématiques",
        school: "",
        message: `Profil : ${data.profil === "parent" ? "Parent" : "Élève"}`,
      }),
    });
    if (!response.ok) {
      console.error(`Sheets webhook failed [${response.status}]: ${await response.text()}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Sheets webhook unreachable:", error);
    return false;
  }
}

function niveauLisible(niveau: (typeof NEWSLETTER_NIVEAUX)[number]): string {
  if (niveau === "3e") return "3e";
  if (niveau === "2de") return "seconde";
  return "première";
}

function emailSubject(data: z.infer<typeof newsletterSchema>): string {
  const classe = niveauLisible(data.niveau);
  return data.profil === "parent"
    ? `Votre échantillon de maths (${classe})`
    : `Ton échantillon de maths (${classe})`;
}

function emailText(data: z.infer<typeof newsletterSchema>): string {
  const lien = ECHANTILLONS[data.niveau];
  const classe = niveauLisible(data.niveau);
  const parent = data.profil === "parent";

  // Les fiches du brevet sont en vente ; celles de la seconde et de la première
  // ne le sont pas encore, et le mail ne promet aucune date.
  const suite =
    data.niveau === "3e"
      ? ["Les fiches complètes du brevet sont en vente sur https://coursinus.fr/fiches"]
      : [
          `Les fiches complètes de ${classe} sont en préparation. ${
            parent ? "Je vous écrirai" : "Je t'écrirai"
          } à leur sortie.`,
          "Le détail des matières est sur https://coursinus.fr/fiches",
        ];

  return [
    parent ? "Bonjour," : "Salut,",
    "",
    parent
      ? `Voici l'échantillon de maths de ${classe}, comme promis :`
      : `Voici ton échantillon de maths de ${classe}, comme promis :`,
    lien,
    "",
    "Quatre pages tirées des fiches de maths : le sommaire, des fiches de cours et leur",
    parent
      ? "quiz, pour voir si le format convient à votre enfant."
      : "quiz, pour voir si le format te convient.",
    "",
    ...suite,
    "",
    parent
      ? "Si vous ne voulez plus rien recevoir, répondez simplement STOP à ce mail."
      : "Si tu ne veux plus rien recevoir, réponds simplement STOP à ce mail.",
    "",
    "Hamza",
    "@azmaoff sur TikTok",
  ].join("\n");
}

export const subscribeToNewsletter = createServerFn({ method: "POST" })
  .validator((data: NewsletterInput) => newsletterSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.website) {
      return { ok: true as const, emailed: false as const };
    }

    // 1. L'adresse est enregistrée d'abord : c'est elle, le livrable.
    const recorded = await recordInSheet(data);

    // 2. Le mail est le seul accusé de réception du visiteur. Comme pour les
    //    demandes de rendez-vous (booking.functions.ts), toute défaillance doit
    //    donc remonter pour qu'il puisse réessayer, plutôt que de lui afficher
    //    une confirmation pour un échantillon qu'il ne recevra jamais.
    const resendKey = process.env["RESEND_API_KEY"];
    if (!resendKey) {
      console.error(
        `RESEND_API_KEY missing; newsletter email not sent (sheet recorded: ${recorded}).`,
      );
      throw new Error("Le service d'envoi est indisponible.");
    }

    let response: Response;
    try {
      response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        signal: AbortSignal.timeout(8000),
        body: JSON.stringify({
          from: FROM,
          to: [data.email],
          reply_to: REPLY_TO,
          subject: emailSubject(data),
          text: emailText(data),
        }),
      });
    } catch (error) {
      console.error(`Resend unreachable (sheet recorded: ${recorded}):`, error);
      throw new Error("L'envoi de l'email a échoué.");
    }

    if (!response.ok) {
      // 429 = quota journalier atteint. La ligne Google Sheets garde l'adresse.
      console.error(
        `Resend send failed [${response.status}] (sheet recorded: ${recorded}): ${await response.text()}`,
      );
      throw new Error("L'envoi de l'email a échoué.");
    }

    return { ok: true as const, emailed: true as const };
  });
