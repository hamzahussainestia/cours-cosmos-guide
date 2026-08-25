import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

import { navLinks } from "@/data/home-content";

const LOGO_URL = "/coursinus-logo.png";

export function RentreeBanner() {
  return (
    <div className="bg-gradient-to-r from-primary/5 via-primary/20 to-primary/5 px-5 py-2 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs sm:text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] text-primary-foreground uppercase">
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
        <a href="#" className="flex min-w-0 items-center gap-1">
          {/*
            Le PNG du logo comporte de larges marges transparentes (le motif
            n'occupe qu'environ un tiers de l'image) : on l'affiche donc dans
            une boîte volontairement grande, puis on rattrape ces marges avec
            des marges négatives. Le motif paraît deux fois plus gros sans que
            la barre gagne en hauteur.
          */}
          <img
            src={LOGO_URL}
            alt="Logo Coursinus"
            className="-mx-5 -my-6 h-24 w-24 shrink-0 object-contain sm:-mx-6 sm:-my-7 sm:h-28 sm:w-28"
          />
          <span className="font-script text-3xl leading-[1.4] whitespace-nowrap text-gold sm:text-4xl">
            Coursinus
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
          <a
            href="#rdv"
            className="btn-press hidden shrink-0 rounded-full bg-primary px-4 py-2 text-xs font-medium tracking-[0.1em] text-primary-foreground uppercase sm:inline-block sm:text-sm"
          >
            Réserver un RDV
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
          </ul>
        </nav>
      )}
    </header>
  );
}
