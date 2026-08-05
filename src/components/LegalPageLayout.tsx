import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader, RentreeBanner } from "@/components/SiteHeader";

const LOGO_URL = "/coursinus-logo.png";

export function LegalPageLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <RentreeBanner />
      <SiteHeader />

      <main className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-gold-soft"
          >
            <img src={LOGO_URL} alt="" className="h-6 w-6 opacity-70" aria-hidden />
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="mt-8 font-display text-4xl text-gold sm:text-5xl">{title}</h1>
          <div className="rule-gold my-8 w-32" />
          <div className="prose-legal space-y-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {children}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
