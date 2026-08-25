-- Étend contact_requests pour le nouveau parcours de RDV guidé :
-- distingue élève/parent vs prof, et ajoute matière / école pour les profs.
ALTER TABLE public.contact_requests
  ADD COLUMN role TEXT NOT NULL DEFAULT 'eleve_parent',
  ADD COLUMN subject TEXT,
  ADD COLUMN school TEXT;

-- Un candidat prof n'a pas de "niveau" (Collège/Lycée/Prépa) à renseigner.
ALTER TABLE public.contact_requests
  ALTER COLUMN level DROP NOT NULL;
