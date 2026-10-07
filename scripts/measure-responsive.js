/**
 * Mesure la page d'accueil pour la refonte 2026-10.
 * À coller dans la console du navigateur, sur la page à mesurer.
 *
 * Le script parcourt la page entière avant de mesurer, de manière que les
 * animations pilotées par le scroll aient le temps de se jouer.
 *
 * Le contrôle le plus important est `contenuInvisible` : il attrape le cas
 * où une animation masque du contenu sans jamais le révéler. Ce contrôle ne
 * fait autorité que dans les modes dégradés (prefers-reduced-motion activé,
 * ou bloc @supports désactivé en devtools) : c'est là que tout DOIT être
 * visible sans exception.
 */
(async () => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Parcourir la page : descendre jusqu'en bas par paliers, puis remonter.
  const hauteurPage = document.body.scrollHeight;
  const nombrePaliers = Math.ceil(hauteurPage / vh);

  for (let i = 0; i < nombrePaliers; i++) {
    window.scrollTo(0, i * vh);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Remonter en haut et attendre avant de mesurer.
  window.scrollTo(0, 0);
  await new Promise((resolve) => setTimeout(resolve, 300));

  const debordement = [];
  document.querySelectorAll("main *").forEach((el) => {
    const b = el.getBoundingClientRect();
    if (b.width > 0 && (b.right > vw + 1 || b.left < -1)) {
      // Les pistes de défilement continu débordent par construction.
      if (el.closest(".logo-marquee")) return;
      debordement.push(`${el.tagName}.${(el.className + "").slice(0, 40)}`);
    }
  });

  const textesSous12px = new Set();
  document
    .querySelectorAll("main p, main span, main li, main a, main h1, main h2, main h3")
    .forEach((el) => {
      if (!el.textContent.trim()) return;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < 12) textesSous12px.add(Math.round(fs * 10) / 10);
    });

  const ciblesSous44px = [];
  document.querySelectorAll("main a, main button").forEach((el) => {
    const b = el.getBoundingClientRect();
    if (b.width === 0) return;
    if (b.height < 44) ciblesSous44px.push(el.textContent.trim().slice(0, 30) || el.tagName);
  });

  const contenuInvisible = [];
  document.querySelectorAll("main section").forEach((s) => {
    const texte = s.innerText.trim();
    if (!texte) return;
    const op = parseFloat(getComputedStyle(s).opacity);
    if (op < 0.05) {
      contenuInvisible.push(s.id || texte.slice(0, 30));
      return;
    }
    // Attraper les éléments de classe .reveal ou .parallax cachés par animation.
    s.querySelectorAll(".reveal, .parallax").forEach((el) => {
      if (!el.innerText.trim()) return;
      if (parseFloat(getComputedStyle(el).opacity) < 0.05) {
        contenuInvisible.push(el.innerText.trim().slice(0, 30));
      }
    });
    // Attraper aussi les autres éléments porteurs de texte qui seraient invisibles.
    s.querySelectorAll("[class]").forEach((el) => {
      if (el.closest(".reveal, .parallax")) return; // Déjà couvert ci-dessus.
      if (!el.innerText.trim()) return;
      const elOp = parseFloat(getComputedStyle(el).opacity);
      if (elOp < 0.05) {
        contenuInvisible.push(el.innerText.trim().slice(0, 30));
      }
    });
  });

  const sections = [...document.querySelectorAll("main > section")].map((s) => ({
    titre: s.querySelector("h2")?.textContent?.trim() || s.id || "(hero)",
    ecrans: +(s.getBoundingClientRect().height / vh).toFixed(1),
  }));

  return {
    largeur: vw,
    hauteurPx: document.body.scrollHeight,
    ecrans: +(document.body.scrollHeight / vh).toFixed(1),
    debordement: debordement.slice(0, 5),
    debordementCount: debordement.length,
    textesSous12px: [...textesSous12px],
    ciblesSous44px: ciblesSous44px.slice(0, 5),
    ciblesSous44pxCount: ciblesSous44px.length,
    contenuInvisible: contenuInvisible.slice(0, 5),
    contenuInvisibleCount: contenuInvisible.length,
    sections,
  };
})();
