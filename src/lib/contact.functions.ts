import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().min(6, "Téléphone invalide").max(30),
  level: z.enum(["Collège", "Lycée", "Prépa"]),
  message: z.string().trim().max(1000).optional().default(""),
  // Honeypot anti-spam : doit rester vide.
  website: z.string().max(0).optional().default(""),
});

export type ContactInput = z.input<typeof contactSchema>;

const RECIPIENT = "coursinus.aide@gmail.com";

function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function buildRawEmail(data: {
  name: string;
  email: string;
  phone: string;
  level: string;
  message: string;
}): string {
  const subject = `Nouvelle demande Coursinus — ${data.name} (${data.level})`;
  const body = [
    "Nouvelle demande de contact depuis le site Coursinus :",
    "",
    `Nom      : ${data.name}`,
    `Email    : ${data.email}`,
    `Téléphone: ${data.phone}`,
    `Niveau   : ${data.level}`,
    "",
    "Message :",
    data.message || "(aucun message)",
  ].join("\r\n");

  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject, "utf8").toString("base64")}?=`;

  const email = [
    `To: ${RECIPIENT}`,
    `Reply-To: ${data.email}`,
    `Subject: ${encodedSubject}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "MIME-Version: 1.0",
    "",
    body,
  ].join("\r\n");

  return toBase64Url(email);
}

export const submitContactRequest = createServerFn({ method: "POST" })
  .inputValidator((data: ContactInput) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.website) {
      return { ok: true as const, emailed: false as const };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_requests").insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      level: data.level,
      message: data.message || null,
    });
    if (error) {
      console.error("contact_requests insert failed:", error.message);
      throw new Error("Impossible d'enregistrer la demande.");
    }

    let emailed = false;
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const gmailKey = process.env["GOOGLE_MAIL_API_KEY"];

    if (lovableKey && gmailKey) {
      try {
        const response = await fetch(
          "https://connector-gateway.lovable.dev/google_mail/gmail/v1/users/me/messages/send",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${lovableKey}`,
              "X-Connection-Api-Key": gmailKey,
            },
            body: JSON.stringify({ raw: buildRawEmail(data) }),
          },
        );
        if (!response.ok) {
          const errorBody = await response.text();
          console.error(`Gmail send failed [${response.status}]: ${errorBody}`);
        } else {
          emailed = true;
        }
      } catch (err) {
        console.error("Gmail send threw:", err);
      }
    } else {
      console.error("Gmail connector env vars missing; email not sent.");
    }

    return { ok: true as const, emailed };
  });
