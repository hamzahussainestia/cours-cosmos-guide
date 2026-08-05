import type { LucideIcon } from "lucide-react";
import {
  Atom,
  BookOpen,
  Calculator,
  FlaskConical,
  GraduationCap,
  Microscope,
  School,
  Trophy,
} from "lucide-react";

export const CONTACT_EMAIL = "coursinus.aide@gmail.com";
export const DISCORD_URL = "https://discord.gg/U5w5qYZ4RZ";
export const SITE_URL = "https://cours-cosmos-guide.lovable.app";

export const navLinks = [
  { label: "Offres", href: "#offres" },
  { label: "Méthode", href: "#methode" },
  { label: "Matières", href: "#matieres" },
  { label: "Équipe", href: "#equipe" },
  { label: "Avis", href: "#temoignages" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
] as const;

export const stats = [
  { value: "150+", label: "Élèves accompagnés" },
  { value: "95 %", label: "Satisfaction familles" },
  { value: "12", label: "Filières prépa couvertes" },
  { value: "100 %", label: "Professeurs diplômés" },
] as const;

export const steps = [
  {
    step: "01",
    title: "Premier échange",
    text: "Contactez-nous via le formulaire, le QR code ou Discord. Nous échangeons sur le profil de l'élève, ses objectifs et ses disponibilités — sans engagement.",
  },
  {
    step: "02",
    title: "Bilan & diagnostic",
    text: "Nous identifions les points forts, les lacunes et le rythme de travail adapté pour construire un parcours réaliste et exigeant.",
  },
  {
    step: "03",
    title: "Programme sur mesure",
    text: "Un plan de cours personnalisé est défini : matières, fréquence, préparation aux examens (brevet, bac, concours).",
  },
  {
    step: "04",
    title: "Suivi & progression",
    text: "Des points réguliers avec l'élève et sa famille garantissent une progression transparente et des ajustements continus.",
  },
] as const;

export const subjects = [
  {
    name: "Mathématiques",
    levels: "Collège → Prépa",
    icon: Calculator,
  },
  {
    name: "Physique-Chimie",
    levels: "Lycée → Prépa",
    icon: FlaskConical,
  },
  {
    name: "Sciences de l'Ingénieur",
    levels: "Lycée → Prépa",
    icon: Microscope,
  },
  {
    name: "Méthodologie & Oraux",
    levels: "Lycée → Prépa",
    icon: BookOpen,
  },
  {
    name: "Préparation concours",
    levels: "Prépa scientifique & commerce",
    icon: Trophy,
  },
  {
    name: "Renforcement scientifique",
    levels: "Collège → Lycée",
    icon: Atom,
  },
] as const;

export const teachers = [
  {
    role: "Professeur agrégé",
    specialty: "Mathématiques",
    detail: "15 ans d'expérience en lycée et prépa. Spécialiste de la préparation aux concours CPGE.",
  },
  {
    role: "Normalien",
    specialty: "Physique-Chimie",
    detail: "Ancien élève de l'ENS, expert en préparation au bac et aux khôlles de prépa scientifique.",
  },
  {
    role: "Ingénieur & enseignant",
    specialty: "Sciences de l'Ingénieur",
    detail: "Double compétence industrie et pédagogie. Accompagnement projets, SI et Parcoursup.",
  },
] as const;

export const testimonials = [
  {
    quote:
      "Grâce à Coursinus, notre fils a gagné en autonomie et obtenu son bac avec mention Très Bien. Le suivi régulier nous a rassurés tout au long de l'année.",
    author: "Sophie M.",
    context: "Parent — Terminale générale",
  },
  {
    quote:
      "Les khôlles prépa m'ont permis de progresser rapidement. Mon prof connaissait parfaitement les attentes des concours et m'a donné une vraie méthode.",
    author: "Lucas D.",
    context: "Élève — PCSI",
  },
  {
    quote:
      "Enfin une structure claire : tarifs annoncés, profs compétents, et une vraie écoute. Ma fille a retrouvé confiance en maths dès le premier mois.",
    author: "Karim B.",
    context: "Parent — 3ème",
  },
] as const;

export const faqItems = [
  {
    question: "Quels sont vos tarifs ?",
    answer:
      "Collège : 20 €/h · Lycée : 25 €/h · Prépa : 35 €/h. Les tarifs sont affichés clairement sur le site, sans frais cachés. Un devis personnalisé peut être établi lors du premier échange.",
  },
  {
    question: "Les cours sont-ils en présentiel ou en visio ?",
    answer:
      "Les deux sont possibles. Le présentiel se organise selon votre localisation et nos disponibilités. La visioconférence est disponible partout en France avec le même niveau d'exigence pédagogique.",
  },
  {
    question: "Quelle est la durée d'une séance ?",
    answer:
      "Une séance dure en général 1h30 à 2h, selon le niveau et les objectifs. La fréquence hebdomadaire est adaptée au profil de l'élève (1 à 3 séances par semaine en prépa).",
  },
  {
    question: "Comment se déroule le premier contact ?",
    answer:
      "Remplissez le formulaire, scannez le QR code ou rejoignez notre Discord. Nous vous rappelons rapidement pour un échange gratuit et sans engagement sur le profil et les objectifs de l'élève.",
  },
  {
    question: "Proposez-vous une préparation Parcoursup / concours ?",
    answer:
      "Oui. Nous accompagnons la rédaction du dossier Parcoursup, la préparation au grand oral, aux bac blancs et aux concours des grandes écoles (MPSI, PCSI, TSI, ATS, ECE, ECG).",
  },
  {
    question: "Comment fonctionne l'annulation d'un cours ?",
    answer:
      "Toute annulation doit être signalée au minimum 24 h à l'avance. Passé ce délai, la séance peut être due sauf cas de force majeure, discuté au cas par cas.",
  },
  {
    question: "Comment sont sélectionnés vos professeurs ?",
    answer:
      "Chaque enseignant est recruté pour son excellence académique (agrégés, normaliens, ingénieurs) et sa capacité à transmettre une méthode de travail rigoureuse et bienveillante.",
  },
  {
    question: "Recevez-vous bien les demandes du formulaire ?",
    answer:
      "Oui. Chaque demande est enregistrée de façon sécurisée et transmise à l'équipe Coursinus. Vous pouvez aussi nous écrire directement à coursinus.aide@gmail.com.",
  },
] as const;

export const modalities = [
  {
    title: "Présentiel",
    text: "Cours à domicile ou en lieu adapté, selon votre secteur géographique. Idéal pour un accompagnement direct et une relation de confiance.",
  },
  {
    title: "Visioconférence",
    text: "Disponible partout en France. Tableau numérique, partage d'écran et suivi des devoirs à distance, avec la même exigence qu'en présentiel.",
  },
  {
    title: "Horaires flexibles",
    text: "Créneaux en semaine, le soir et le week-end selon disponibilités. Adaptation aux emplois du temps scolaires et aux périodes d'examens.",
  },
] as const;

export type Offer = {
  level: string;
  range: string;
  price: string;
  featured?: boolean;
  icon: LucideIcon;
  points: string[];
};

export const offers: Offer[] = [
  {
    level: "Collège",
    range: "6ème à la 3ème",
    price: "20",
    icon: School,
    points: [
      "Renforcement solide des bases",
      "Acquisition d'une méthode de travail rigoureuse",
      "Réussite au brevet avec mention",
    ],
  },
  {
    level: "Lycée",
    range: "2nde à la Terminale",
    price: "25",
    featured: true,
    icon: GraduationCap,
    points: [
      "Maîtrise des spécialités scientifiques (maths, physique-chimie, SI)",
      "Préparation du bac et du grand oral",
      "Dossier Parcoursup d'excellence",
      "Bac blanc en conditions réelles",
    ],
  },
  {
    level: "Prépa",
    range: "MPSI, PCSI, TSI, ATS, ECE, ECG",
    price: "35",
    icon: Trophy,
    points: [
      "Préparation aux exigences des concours",
      "Développement de la performance",
      "Khôlles personnalisées",
      "Concours blanc",
    ],
  },
];

export const reasons = [
  {
    title: "Professeurs d'exception",
    text: "Des enseignants sélectionnés avec exigence : agrégés, normaliens et experts de leur discipline.",
    numeral: "I",
  },
  {
    title: "Suivi individuel transparent",
    text: "Un accompagnement sur mesure, avec un point de progression clair et régulier pour l'élève et sa famille.",
    numeral: "II",
  },
  {
    title: "Flexibilité & tarifs clairs",
    text: "Des horaires adaptés à votre rythme et une tarification annoncée à l'heure, sans frais cachés.",
    numeral: "III",
  },
] as const;
