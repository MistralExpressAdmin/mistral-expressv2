async function inject(id, url) {
  const el = document.getElementById(id);
  if (!el) return;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${url} (${res.status})`);
  el.innerHTML = await res.text();
}

// ===============================
// i18n (FR / EN / RU)
// ===============================
const SUPPORTED_LANGS = ["fr", "en", "ru"];

function getInitialLang() {
  const urlLang = new URLSearchParams(window.location.search).get("lang");
  if (urlLang && SUPPORTED_LANGS.includes(urlLang)) return urlLang;

  const saved = localStorage.getItem("lang");
  if (saved && SUPPORTED_LANGS.includes(saved)) return saved;

  return "fr";
}

async function loadTranslations(lang) {
  const res = await fetch(`assets/i18n/${lang}.json`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Cannot load i18n file: assets/i18n/${lang}.json (${res.status})`);
  return await res.json();
}

function deepGet(obj, path) {
  return path.split(".").reduce((acc, k) => (acc && acc[k] != null ? acc[k] : null), obj);
}

function applyTranslations(dict) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const val = deepGet(dict, key);
    if (typeof val === "string") el.textContent = val;
  });
}

async function setLang(lang) {
  localStorage.setItem("lang", lang);

  // conserve ?lang=
  const url = new URL(window.location.href);
  url.searchParams.set("lang", lang);
  window.history.replaceState({}, "", url.toString());

  const dict = await loadTranslations(lang);
  applyTranslations(dict);

  const label = document.getElementById("langLabel");
  if (label) label.textContent = lang.toUpperCase();

  document.querySelectorAll(".lang-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

function setupLangMenu() {
  const btn = document.getElementById("langBtn");
  const menu = document.getElementById("langMenu");
  if (!btn || !menu) return;

  const closeMenu = () => {
    menu.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    menu.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
  };

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = menu.classList.contains("open");
    isOpen ? closeMenu() : openMenu();
  });

  document.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  menu.querySelectorAll(".lang-item").forEach(item => {
    item.addEventListener("click", async () => {
      const lang = item.dataset.lang;
      try {
        await setLang(lang);
      } catch (err) {
        console.error(err);
        alert("Erreur chargement langue. Vérifie assets/i18n/ et lance le site via localhost.");
      } finally {
        closeMenu();
      }
    });
  });
}

// ===============================
// INIT (UN SEUL DOMContentLoaded)
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
  // 1) Injecte header/footer d’abord
  await inject("site-header", "assets/partials/header.html");
  await inject("site-footer", "assets/partials/footer.html");

  // 2) footer year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // 3) Partner link (une seule fois, propre)
  const partnerUrl = "https://www.beaulieumarine.com/";
  const partner1 = document.getElementById("partnerLink");
  const partner2 = document.getElementById("partnerLinkFooter");

  [partner1, partner2].forEach(a => {
    if (!a) return;
    a.href = partnerUrl;
    a.target = "_blank";
    a.rel = "noopener";
  });

  // 4) WhatsApp (une seule fois)
  const phone = "33668443067"; // format international sans +
  const base = `https://wa.me/${phone}`;
  const wa = document.getElementById("whatsappLink");
  if (wa) {
    wa.href = `${base}?text=${encodeURIComponent("Bonjour Mistral Express — j’aimerais commander / demander un devis.")}`;
    wa.target = "_blank";
    wa.rel = "noopener";
  }

  // 5) Bind UI (après injection = éléments existent)
  setupLangMenu();

  // si tu as déjà ton panier dans un autre fichier :
  window.ME_CART?.bindCartUI?.();

  // 6) Applique la langue (après que le header existe)
  try {
    await setLang(getInitialLang());
  } catch (err) {
    console.error(err);
  }
});