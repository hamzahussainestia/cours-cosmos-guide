import { createFileRoute } from "@tanstack/react-router";

import { LegalPageLayout } from "@/components/LegalPageLayout";
import { CONTACT_EMAIL } from "@/data/home-content";

export const Route = createFileRoute("/politique-confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité — Coursinus" },
      {
        name: "description",
        content:
          "Politique de confidentialité et protection des données personnelles — Coursinus.",
      },
    ],
  }),
  component: PolitiqueConfidentialitePage,
});

function PolitiqueConfidentialitePage() {
  return (
    <LegalPageLayout title="Politique de confidentialité">
      <section>
        <h2 className="font-display text-xl text-gold-soft">Responsable du traitement</h2>
        <p className="mt-3">
          Coursinus est responsable du traitement des données personnelles collectées via
          le site et le formulaire de contact. Pour toute question :{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold-soft hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl text-gold-soft">Données collectées</h2>
        <p className="mt-3">Via le formulaire de contact, nous collectons :</p>
        <ul className="mt-3 list-inside list-disc space-y-1">
          <li>Nom et prénom</li>
          <li>Adresse email</li>
          <li>Numéro de téléphone</li>
          <li>Niveau scolaire (collège, lycée, prépa)</li>
          <li>Message libre (optionnel)</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl text-gold-soft">Finalités du traitement</h2>
        <p className="mt-3">Vos données sont utilisées exclusivement pour :</p>
        <ul className="mt-3 list-inside list-disc space-y-1">
          <li>Répondre à votre demande de contact ou de rappel</li>
          <li>Organiser un premier échange pédagogique</li>
          <li>Assurer le suivi de votre demande d&apos;accompagnement</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl text-gold-soft">Base légale</h2>
        <p className="mt-3">
          Le traitement repose sur votre consentement, manifesté lors de l&apos;envoi du
          formulaire, et sur l&apos;intérêt légitime de Coursinus à répondre aux demandes
          reçues.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl text-gold-soft">Durée de conservation</h2>
        <p className="mt-3">
          Les données sont conservées pendant la durée nécessaire au traitement de votre
          demande, puis archivées ou supprimées conformément aux obligations légales, sauf
          relation contractuelle en cours.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl text-gold-soft">Destinataires des données</h2>
        <p className="mt-3">
          Les données sont accessibles uniquement à l&apos;équipe Coursinus et à nos
          prestataires techniques (hébergement, base de données) dans le cadre strict de
          leurs missions. Elles ne sont ni vendues ni cédées à des tiers à des fins
          commerciales.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl text-gold-soft">Vos droits (RGPD)</h2>
        <p className="mt-3">
          Conformément au Règlement Général sur la Protection des Données (RGPD), vous
          disposez des droits suivants :
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1">
          <li>Droit d&apos;accès à vos données</li>
          <li>Droit de rectification</li>
          <li>Droit à l&apos;effacement</li>
          <li>Droit à la limitation du traitement</li>
          <li>Droit d&apos;opposition</li>
          <li>Droit à la portabilité</li>
        </ul>
        <p className="mt-3">
          Pour exercer ces droits, contactez-nous à{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold-soft hover:underline">
            {CONTACT_EMAIL}
          </a>
          . Vous pouvez également introduire une réclamation auprès de la CNIL (
          <a
            href="https://www.cnil.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-soft hover:underline"
          >
            www.cnil.fr
          </a>
          ).
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl text-gold-soft">Cookies</h2>
        <p className="mt-3">
          Ce site n&apos;utilise pas de cookies publicitaires ou de traçage à des fins
          marketing. Des cookies techniques strictement nécessaires au fonctionnement du
          site peuvent être utilisés.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl text-gold-soft">Sécurité</h2>
        <p className="mt-3">
          Nous mettons en œuvre des mesures techniques et organisationnelles appropriées
          pour protéger vos données contre tout accès, modification ou divulgation non
          autorisés.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl text-gold-soft">Mise à jour</h2>
        <p className="mt-3">
          Cette politique peut être modifiée à tout moment. La date de dernière mise à
          jour est indiquée ci-dessous. Nous vous invitons à la consulter régulièrement.
        </p>
        <p className="mt-3 text-xs">Dernière mise à jour : août 2026</p>
      </section>
    </LegalPageLayout>
  );
}
