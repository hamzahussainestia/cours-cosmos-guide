-- Le parcours de RDV demande maintenant si le contact préfère un appel
-- téléphonique ou une visio (Google Meet) avant de proposer le calendrier.
ALTER TABLE public.contact_requests
  ADD COLUMN contact_method TEXT NOT NULL DEFAULT 'visio';
