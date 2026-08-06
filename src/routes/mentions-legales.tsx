import { createFileRoute } from "@tanstack/react-router";

import { LegalPageLayout } from "@/components/LegalPageLayout";
import { CONTACT_EMAIL, SITE_URL } from "@/data/home-content";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales — Coursinus" },
      {
        name: "description",
        content: "Mentions légales du site Coursinus, structure de soutien scolaire.",
      },
    ],
  }),
  component: MentionsLegalesPage,
});

function MentionsLegalesPage() {
  return (
    <LegalPageLayout title="Mentions légales">
      <section>
        <h2 className="font-display text-xl text-gold-soft">Éditeur du site</h2>
        <p className="mt-3">
          Le site <strong>{SITE_URL}</strong> est édité par <strong>Coursinus</strong>,
          structure de soutien scolaire et d&apos;accompagnement académique.
        </p>
        <p className="mt-3">
          Contact :{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold-soft hover:underline">
            {CONTACT_EMAIL}
          </a>
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl text-gold-soft">Directeur de la publication</h2>
        <p className="mt-3">Le responsable de la publication est le représentant légal de Coursinus.</p>
      </section>

      <section>
        <h2 className="font-display text-xl text-gold-soft">Hébergement</h2>
        <p className="mt-3">
          Le site <strong>{SITE_URL}</strong> est hébergé par un prestataire professionnel
          conforme à la réglementation en vigueur. Pour toute question relative à
          l&apos;hébergement, contactez-nous à{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold-soft hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl text-gold-soft">Propriété intellectuelle</h2>
        <p className="mt-3">
          L&apos;ensemble du contenu de ce site (textes, images, logo, graphismes) est la
          propriété exclusive de Coursinus, sauf mention contraire. Toute reproduction,
          représentation ou diffusion, totale ou partielle, sans autorisation écrite
          préalable est interdite.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl text-gold-soft">Limitation de responsabilité</h2>
        <p className="mt-3">
          Coursinus s&apos;efforce de fournir des informations exactes et à jour. Toutefois,
          des erreurs ou omissions peuvent survenir. L&apos;utilisateur reconnaît utiliser
          ces informations sous sa responsabilité exclusive.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl text-gold-soft">Droit applicable</h2>
        <p className="mt-3">
          Les présentes mentions légales sont soumises au droit français. En cas de litige,
          et à défaut de résolution amiable, les tribunaux français seront seuls compétents.
        </p>
      </section>
    </LegalPageLayout>
  );
}
