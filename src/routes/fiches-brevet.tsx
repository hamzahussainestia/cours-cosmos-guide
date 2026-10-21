import { createFileRoute, redirect } from "@tanstack/react-router";

/*
 * Ancienne adresse de la boutique, déjà partagée et référencée : elle ne doit
 * pas casser. Redirection permanente vers /fiches (onglet 3e par défaut).
 * Les fiches elles-mêmes vivent désormais dans src/data/fiches.ts.
 */
export const Route = createFileRoute("/fiches-brevet")({
  beforeLoad: () => {
    throw redirect({ to: "/fiches", statusCode: 301 });
  },
});
