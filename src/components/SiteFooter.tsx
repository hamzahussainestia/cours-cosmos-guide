import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";

import { CONTACT_EMAIL, DISCORD_URL } from "@/data/home-content";

const LOGO_URL = "/coursinus-logo.png";
const QR_URL = "/coursinus-qr.png";

export function SiteFooter() {
  return (
    <footer className="border-t border-gold/20 px-5 py-6 sm:px-8 sm:py-12">
      {/* Sous `sm`, la grille passe sur deux colonnes (contact et informations
          côte à côte) : le pied de page ne pèse plus un écran entier. */}
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-6 sm:gap-10 lg:grid-cols-4">
        <div className="col-span-2 text-left sm:col-span-1 md:text-left">
          <img
            src={LOGO_URL}
            alt=""
            aria-hidden="true"
            className="h-8 w-8 object-contain opacity-80 sm:h-10 sm:w-10"
          />
          <p className="mt-2 font-display tracking-[0.3em] text-gold sm:mt-3">COURSINUS</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            L&apos;écurie d&apos;excellence scientifique — soutien scolaire et accompagnement
            académique personnalisé.
          </p>
        </div>

        <div className="text-left md:text-left">
          <p className="text-xs tracking-[0.25em] text-gold uppercase">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground sm:mt-4 sm:space-y-3">
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 text-xs transition hover:text-gold-soft sm:text-sm"
              >
                <Mail className="hidden h-4 w-4 shrink-0 text-gold sm:block" />
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-gold-soft"
              >
                Rejoindre le Discord
              </a>
            </li>
            <li>
              <a href="#rdv" className="transition hover:text-gold-soft">
                Prendre rendez-vous
              </a>
            </li>
          </ul>
        </div>

        <div className="text-left md:text-left">
          <p className="text-xs tracking-[0.25em] text-gold uppercase">Informations</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground sm:mt-4 sm:space-y-3">
            <li>
              <Link to="/mentions-legales" className="transition hover:text-gold-soft">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link to="/politique-confidentialite" className="transition hover:text-gold-soft">
                Politique de confidentialité
              </Link>
            </li>
            <li>
              <a href="#faq" className="transition hover:text-gold-soft">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        {/* Sous `sm`, le QR code passe à gauche de son titre. */}
        <div className="col-span-2 grid grid-cols-[auto_1fr] items-center gap-x-4 text-left sm:col-span-1 sm:block md:text-left">
          <p className="col-start-2 row-start-1 self-end text-xs tracking-[0.25em] text-gold uppercase">
            Nous contacter
          </p>
          <div className="col-start-1 row-span-2 row-start-1 inline-block rounded-xl border border-gold/40 bg-foreground/95 p-2 sm:mt-4">
            <img
              src={QR_URL}
              alt="QR code de contact Coursinus"
              className="h-20 w-20 object-contain sm:h-24 sm:w-24"
              loading="lazy"
            />
          </div>
          <p className="col-start-2 row-start-2 mt-1 self-start text-xs tracking-[0.2em] text-muted-foreground uppercase sm:mt-2">
            Scannez-moi
          </p>
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-6xl border-t border-gold/10 pt-4 text-center text-xs text-muted-foreground sm:mt-10 sm:pt-6">
        © {new Date().getFullYear()} Coursinus — Tous droits réservés
      </p>
    </footer>
  );
}
