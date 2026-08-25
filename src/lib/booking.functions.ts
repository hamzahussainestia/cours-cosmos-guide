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

export const submitBookingRequest = createServerFn({ method: "POST" })
  .validator((data: BookingInput) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.website) {
      return { ok: true as const, emailed: false as const };
    }

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin.from("contact_requests").insert({
        role: data.role,
        contact_method: data.contactMethod,
        name: data.name,
        email: data.email,
        phone: data.phone,
        level: data.level ?? null,
        subject: data.subject || null,
        school: data.school || null,
        message: data.message || null,
      });
      if (error) {
        console.error("contact_requests insert failed:", error.message);
      }
    } catch (err) {
      // Storage is best-effort: the lead still reaches the team by email below
      // even if Supabase is unreachable or unconfigured for this deployment.
      console.error("contact_requests storage unavailable:", err);
    }

    let emailed = false;
    const resendKey = process.env["RESEND_API_KEY"];

    if (resendKey) {
      try {
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
        } else {
          emailed = true;
          const successBody = await response.text();
          console.log(`Resend send succeeded: ${successBody}`);
        }
      } catch (err) {
        console.error("Resend send threw:", err);
      }
    } else {
      console.error("RESEND_API_KEY missing; email not sent.");
    }

    return { ok: true as const, emailed };
  });
