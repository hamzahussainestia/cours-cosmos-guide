import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";

import { CONTACT_EMAIL, DISCORD_URL } from "@/data/home-content";

const LOGO_URL = "/coursinus-logo.png";
const QR_URL = "/coursinus-qr.png";

export function SiteFooter() {
  return (
    <footer className="border-t border-gold/20 px-5 py-12 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="text-center md:text-left">
          <img
            src={LOGO_URL}
            alt=""
            aria-hidden="true"
            className="mx-auto h-10 w-10 object-contain opacity-80 md:mx-0"
          />
          <p className="mt-3 font-display tracking-[0.3em] text-gold">COURSINUS</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            L&apos;écurie d&apos;excellence scientifique — soutien scolaire et accompagnement
            académique personnalisé.
          </p>
        </div>

        <div className="text-center md:text-left">
          <p className="text-xs tracking-[0.25em] text-gold uppercase">Contact</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center justify-center gap-2 transition hover:text-gold-soft md:justify-start"
              >
                <Mail className="h-4 w-4 shrink-0 text-gold" />
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

        <div className="text-center md:text-left">
          <p className="text-xs tracking-[0.25em] text-gold uppercase">Informations</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
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

        <div className="text-center md:text-left">
          <p className="text-xs tracking-[0.25em] text-gold uppercase">Nous contacter</p>
          <div className="mt-4 inline-block rounded-xl border border-gold/40 bg-foreground/95 p-2">
            <img
              src={QR_URL}
              alt="QR code de contact Coursinus"
              className="h-24 w-24 object-contain"
              loading="lazy"
            />
          </div>
          <p className="mt-2 text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Scannez-moi
          </p>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-6xl border-t border-gold/10 pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Coursinus — Tous droits réservés
      </p>
    </footer>
  );
}
