import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const guideSchema = z.object({
  email: z.string().trim().email("Email invalide").max(255),
  firstName: z.string().trim().max(80).optional().default(""),
  lastName: z.string().trim().max(80).optional().default(""),
  // Honeypot anti-spam : doit rester vide.
  website: z.string().max(0).optional().default(""),
});

export type GuideInput = z.input<typeof guideSchema>;

/**
 * Expéditeur du guide.
 *
 * Par défaut le domaine principal, déjà vérifié chez Resend. Dès qu'un
 * sous-domaine d'envoi est vérifié (par exemple news.coursinus.fr), poser
 * GUIDE_FROM="Hamza <hello@news.coursinus.fr>" : les plaintes pour spam d'un
 * lycéen n'abîment alors plus la réputation de contact@coursinus.fr, qui sert
 * à confirmer les rendez-vous des clients.
 */
const FROM = process.env["GUIDE_FROM"] || "Coursinus <contact@coursinus.fr>";

/** Où atterrissent les réponses au guide. */
const REPLY_TO = process.env["GUIDE_REPLY_TO"] || "coursinus.aide@gmail.com";

const GUIDE_URL = "https://coursinus.fr/guide-parcoursup.pdf";

/**
 * Enregistre l'inscription dans la feuille de suivi Google Sheets.
 *
 * C'est ici la source de vérité : la feuille est écrite AVANT l'envoi, pour
 * qu'une adresse ne soit jamais perdue parce que le quota Resend est atteint.
 * L'appel reste silencieux en cas d'échec : une feuille indisponible ne doit
 * pas priver le visiteur de son guide.
 *
 * Renvoie true si la ligne est bien partie, false sinon.
 */
async function recordInSheet(data: z.infer<typeof guideSchema>): Promise<boolean> {
  // Une feuille dédiée si GUIDE_SHEETS_WEBHOOK_URL est posée, sinon celle
  // des demandes de rendez-vous (les lignes y sont identifiables par role).
  const url = process.env["GUIDE_SHEETS_WEBHOOK_URL"] || process.env["SHEETS_WEBHOOK_URL"];
  const token = process.env["GUIDE_SHEETS_WEBHOOK_TOKEN"] || process.env["SHEETS_WEBHOOK_TOKEN"];
  if (!url || !token) return false;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify({
        token,
        receivedAt: new Date().toISOString(),
        role: "Guide Parcoursup",
        contactMethod: "Téléchargement",
        name: [data.firstName, data.lastName].filter(Boolean).join(" "),
        email: data.email,
        phone: "",
        level: "",
        subject: "",
        school: "",
        message: "Inscription au guide Parcoursup",
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

function confirmationText(firstName: string): string {
  const hello = firstName ? `Salut ${firstName},` : "Salut,";
  return [
    hello,
    "",
    "Voici le guide Parcoursup, comme promis :",
    GUIDE_URL,
    "",
    "Douze pages sur ce que personne ne t'explique : comment répartir tes dix vœux,",
    "les sous-vœux que presque personne n'utilise, ce que les commissions lisent",
    "vraiment dans une lettre de motivation, et la seule erreur irréversible de la",
    "phase d'admission.",
    "",
    "Je t'écrirai quand les dates officielles de la session 2027 sortiront, et quand",
    "j'aurai quelque chose d'utile à te transmettre sur l'orientation. Rien d'autre.",
    "Si tu ne veux plus rien recevoir, réponds simplement STOP à ce mail.",
    "",
    "Hamza",
    "@azmaoff sur TikTok",
  ].join("\n");
}

/**
 * Envoie le guide. Ne lève jamais : un quota atteint ou une panne Resend ne
 * doit pas empêcher le visiteur de télécharger son guide depuis la page.
 */
async function sendGuide(data: z.infer<typeof guideSchema>): Promise<boolean> {
  const resendKey = process.env["RESEND_API_KEY"];
  if (!resendKey) {
    console.error("RESEND_API_KEY missing; guide email not sent.");
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
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
        subject: "Ton guide Parcoursup",
        text: confirmationText(data.firstName),
      }),
    });

    if (!response.ok) {
      // 429 = quota journalier atteint. La ligne Google Sheets garde l'adresse,
      // et la page affiche quand même le téléchargement.
      console.error(`Resend send failed [${response.status}]: ${await response.text()}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Resend unreachable:", error);
    return false;
  }
}

export const subscribeToGuide = createServerFn({ method: "POST" })
  .validator((data: GuideInput) => guideSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.website) {
      return { ok: true as const, emailed: false };
    }

    // 1. L'adresse est enregistrée d'abord : c'est elle, le livrable.
    const recorded = await recordInSheet(data);

    // 2. Puis le guide part par mail, sans jamais bloquer la suite.
    const emailed = await sendGuide(data);

    if (!recorded && !emailed) {
      // Le seul cas vraiment perdu : ni feuille ni mail. Au moins, c'est tracé.
      console.error(`Guide subscription lost (no sheet, no email): ${data.email}`);
    }

    return { ok: true as const, emailed };
  });
