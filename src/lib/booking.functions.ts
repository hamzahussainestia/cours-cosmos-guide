import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const bookingSchema = z.object({
  role: z.enum(["eleve_parent", "prof"]),
  contactMethod: z.enum(["telephone", "visio"]),
  name: z.string().trim().min(2, "Nom trop court").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().min(6, "Téléphone invalide").max(30),
  level: z.enum(["Collège", "Lycée", "Prépa"]).optional(),
  subject: z.string().trim().max(120).optional(),
  school: z.string().trim().max(120).optional(),
  message: z.string().trim().max(1000).optional().default(""),
  // Honeypot anti-spam : doit rester vide.
  website: z.string().max(0).optional().default(""),
});

export type BookingInput = z.input<typeof bookingSchema>;

const RECIPIENT = "coursinus.aide@gmail.com";

function buildEmailContent(data: z.infer<typeof bookingSchema>): {
  subject: string;
  text: string;
} {
  const roleLabel = data.role === "prof" ? "Candidature prof" : "Élève / Parent";
  const contactLabel =
    data.contactMethod === "telephone" ? "Appel téléphonique" : "Visio (Google Meet)";
  const subject = `Nouvelle demande Coursinus — ${data.name} (${roleLabel})`;
  const lines = [
    "Nouvelle demande de rendez-vous depuis le site Coursinus :",
    "",
    `Profil    : ${roleLabel}`,
    `Contact souhaité : ${contactLabel}`,
    `Nom       : ${data.name}`,
    `Email     : ${data.email}`,
    `Téléphone : ${data.phone}`,
  ];
  if (data.contactMethod === "telephone") {
    lines.push(
      "",
      `À appeler directement au ${data.phone} — pas de créneau Google Meet pour cette demande.`,
    );
  }
  if (data.level) lines.push(`Niveau    : ${data.level}`);
  if (data.subject) lines.push(`Matière   : ${data.subject}`);
  if (data.school) lines.push(`École/filière : ${data.school}`);
  lines.push("", "Message :", data.message || "(aucun message)");

  return { subject, text: lines.join("\n") };
}

/**
 * Copie la demande dans la feuille de suivi Google Sheets.
 *
 * Volontairement silencieuse : une feuille indisponible, un quota atteint ou
 * un déploiement Apps Script renommé ne doivent JAMAIS faire échouer une
 * demande côté visiteur. L'email reste la source de vérité ; la feuille n'est
 * qu'une commodité de suivi.
 */
async function recordInSheet(data: z.infer<typeof bookingSchema>): Promise<void> {
  const url = process.env["SHEETS_WEBHOOK_URL"];
  const token = process.env["SHEETS_WEBHOOK_TOKEN"];
  if (!url || !token) return;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify({
        token,
        receivedAt: new Date().toISOString(),
        role: data.role === "prof" ? "Candidature prof" : "Élève / Parent",
        contactMethod: data.contactMethod === "telephone" ? "Téléphone" : "Visio",
        name: data.name,
        email: data.email,
        phone: data.phone,
        level: data.level ?? "",
        subject: data.subject ?? "",
        school: data.school ?? "",
        message: data.message ?? "",
      }),
    });
    if (!response.ok) {
      console.error(`Sheets webhook failed [${response.status}]: ${await response.text()}`);
    }
  } catch (error) {
    console.error("Sheets webhook unreachable:", error);
  }
}

export const submitBookingRequest = createServerFn({ method: "POST" })
  .validator((data: BookingInput) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.website) {
      return { ok: true as const, emailed: false as const };
    }

    // L'email EST le seul enregistrement de la demande : il n'y a pas de
    // copie en base. Toute défaillance doit donc remonter au visiteur pour
    // qu'il puisse réessayer, plutôt que de lui afficher une confirmation
    // pour une demande que personne ne recevra.
    const resendKey = process.env["RESEND_API_KEY"];
    if (!resendKey) {
      console.error("RESEND_API_KEY missing; booking request cannot be delivered.");
      throw new Error("Le service d'envoi est indisponible.");
    }

    const { subject, text } = buildEmailContent(data);
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: "Coursinus <contact@coursinus.fr>",
        to: [RECIPIENT],
        reply_to: data.email,
        subject,
        text,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Resend send failed [${response.status}]: ${errorBody}`);
      throw new Error("L'envoi de la demande a échoué.");
    }

    // En aval de l'email, et sans propagation d'erreur (voir recordInSheet).
    await recordInSheet(data);

    return { ok: true as const, emailed: true as const };
  });
