import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu, X } from "lucide-react";

import { navLinks } from "@/data/home-content";

const WORDMARK_URL = "/coursinus-wordmark.png";

/**
 * Un lien de navigation : ancre de la page d'accueil, ou route a part entiere.
 *
 * Les navLinks ont longtemps ete uniquement des ancres ("#offres"). Depuis
 * l'ajout du guide Parcoursup, l'un d'eux vise une vraie route. Un <a> ferait
 * recharger toute l'application ; <Link> navigue cote client, comme le fait
 * deja SiteFooter pour les pages legales.
 */
function NavLink({
  href,
  className,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  if (href.startsWith("/")) {
    return (
      <Link to={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

export function RentreeBanner() {
  return (
    <div className="bg-gradient-to-r from-primary/5 via-primary/20 to-primary/5 px-5 py-2 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs sm:text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-2.5 py-1 text-xs font-bold tracking-[0.12em] text-primary-foreground uppercase">
          <span className="relative flex h-1.5 w-1.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary-foreground" />
          </span>
          Rentrée 2026
        </span>
        <span className="text-gold-soft">Places limitées — réservez votre créneau</span>
        <a
          href="#rdv"
          className="group inline-flex items-center gap-1 font-medium text-gold underline-offset-4 hover:underline"
        >
          Prendre rendez-vous
          <ArrowRight
            className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </a>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-gold/20 bg-background/90 shadow-[var(--shadow-deep)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        {/* `Link to="/"` et non `href="#"` : depuis une sous-page comme le
            guide Parcoursup, une ancre vide n'allait nulle part et laissait
            le visiteur coincé. */}
        <Link to="/" className="flex min-w-0 items-center gap-1">
          {/* Logo complet (marque + nom) : un seul visuel, cadré au plus juste. */}
          <img src={WORDMARK_URL} alt="Coursinus" className="h-9 w-auto shrink-0 sm:h-11" />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Navigation principale">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-xs tracking-[0.12em] text-muted-foreground uppercase transition hover:bg-gold/10 hover:text-gold-soft"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#rdv"
            className="btn-press hidden shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground sm:inline-block"
          >
            Réserver un RDV
          </a>
          <button
            type="button"
            className="rounded-full border border-gold/30 p-2 text-gold xl:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="border-t border-gold/20 bg-background/95 px-5 py-4 backdrop-blur-md xl:hidden"
          aria-label="Navigation mobile"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavLink
                  href={link.href}
                  className="block rounded-xl px-4 py-3 text-sm tracking-wide text-muted-foreground transition hover:bg-gold/10 hover:text-gold-soft"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
