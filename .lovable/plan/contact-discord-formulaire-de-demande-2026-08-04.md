# Contact Discord + formulaire de demande

## Ce qui est ajouté

### 1. Bloc Discord (section contact, sous le QR code)
Une ligne « Ou en rejoignant le serveur Discord » avec un bouton doré vers
https://discord.gg/U5w5qYZ4RZ (ouvre dans un nouvel onglet), dans le même style
que le reste du site.

### 2. Formulaire de contact
Nouvelle carte dans la section contact avec les champs :
- Nom et prénom
- Email
- Téléphone
- Niveau (collège / lycée / prépa)
- Message

Validation côté client et serveur, message de confirmation après envoi, et
protection anti-spam simple.

### 3. Réception des demandes
Comme il n'y a pas encore de nom de domaine, l'envoi d'email « classique »
depuis le site n'est pas possible pour l'instant. Le plan :

- Chaque demande est enregistrée dans une base de données sécurisée (Lovable
  Cloud), donc rien n'est jamais perdu.
- Pour recevoir la demande directement dans la boîte coursinus.aide@gmail.com,
  on connecte ce compte Gmail au site : le site enverra alors le récapitulatif
  de chaque demande à cette adresse, depuis cette adresse. Cela demande une
  connexion en un clic à Google au moment de la mise en place.
- Si vous préférez ne pas connecter Gmail tout de suite, les demandes restent
  consultables dans la base, et on branche l'email plus tard (ou dès que vous
  avez un domaine).

## Détails techniques

- Activation de Lovable Cloud (base de données).
- Table `contact_requests` (nom, email, téléphone, niveau, message, date) avec
  RLS : insertion publique autorisée, lecture réservée au service_role.
- Server function `submitContactRequest` : validation Zod, insertion, puis envoi
  de l'email via le connecteur Gmail (API `users/me/messages/send`) vers
  coursinus.aide@gmail.com. Échec d'envoi = la demande reste enregistrée.
- Composant `ContactForm` en frontend (inputs shadcn + sonner pour le toast),
  intégré dans la section `#contact` de `src/routes/index.tsx`.
