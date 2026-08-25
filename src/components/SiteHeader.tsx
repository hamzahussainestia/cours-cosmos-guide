import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

import { navLinks } from "@/data/home-content";

const LOGO_URL = "/coursinus-logo.png";

export function RentreeBanner() {
  return (
    <div className="border-b border-gold/20 bg-primary/15 px-5 py-2.5 text-center sm:px-8">
      <p className="text-xs tracking-[0.15em] text-gold-soft sm:text-sm">
        <span className="font-medium text-gold">Places limitées</span>
        {" — "}
        Réservez votre créneau pour la rentrée 2026
        {" · "}
        <Link to="/reservation" className="underline underline-offset-4 hover:text-gold">
          Réserver un cours
        </Link>
      </p>
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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#" className="flex min-w-0 items-center gap-3">
          <img
            src={LOGO_URL}
            alt="Logo Coursinus"
            className="h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11"
          />
          <span className="truncate font-display text-xl tracking-[0.35em] text-gold sm:text-2xl">
            COURSINUS
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-xs tracking-[0.12em] text-muted-foreground uppercase transition hover:bg-gold/10 hover:text-gold-soft"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/reservation"
            className="hidden shrink-0 rounded-full bg-primary px-4 py-2 text-xs tracking-[0.2em] text-primary-foreground uppercase transition hover:brightness-110 sm:inline-block sm:text-sm"
          >
            Réserver
          </Link>
          <a
            href="#contact"
            className="hidden shrink-0 rounded-full border border-gold/50 px-4 py-2 text-xs tracking-[0.2em] text-gold-soft uppercase transition hover:bg-gold/10 sm:inline-block sm:text-sm"
          >
            Contact
          </a>
          <button
            type="button"
            className="rounded-full border border-gold/30 p-2 text-gold lg:hidden"
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
          className="border-t border-gold/20 bg-background/95 px-5 py-4 backdrop-blur-md lg:hidden"
          aria-label="Navigation mobile"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block rounded-xl px-4 py-3 text-sm tracking-wide text-muted-foreground transition hover:bg-gold/10 hover:text-gold-soft"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                to="/reservation"
                className="block rounded-xl bg-primary/15 px-4 py-3 text-sm font-medium tracking-wide text-gold-soft transition hover:bg-primary/25"
                onClick={() => setMenuOpen(false)}
              >
                Réserver un cours
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
