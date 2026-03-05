// assets/js/include.js

async function inject(id, url) {
  const el = document.getElementById(id);
  if (!el) return;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch failed: ${url} (${res.status})`);

  el.innerHTML = await res.text();
}

function setLink(el, href) {
  if (!el) return;
  el.href = href;
  el.target = "_blank";
  el.rel = "noopener noreferrer";
}

function setupPartnerLinks() {
  const partnerUrl = "https://www.beaulieumarine.com/";
  setLink(document.getElementById("partnerLink"), partnerUrl);
  setLink(document.getElementById("partnerLinkFooter"), partnerUrl);
}

function setupWhatsAppLink() {
  // Page contact (si tu as un bouton #whatsappLink)
  const phone = "33668443067"; // format international sans +
  const base = `https://wa.me/${phone}`;
  const wa = document.getElementById("whatsappLink");
  if (!wa) return;

  const msg = "Bonjour Mistral Express — j’aimerais commander / demander un devis.";
  setLink(wa, `${base}?text=${encodeURIComponent(msg)}`);
}

function setupFooterYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
}

/* ==========================================================
   LANG MENU A11Y
   ========================================================== */
function setupLangMenuA11y() {
  const btn = document.getElementById("langBtn");
  const menu = document.getElementById("langMenu");
  if (!btn || !menu) return;

  const isOpen = () => menu.classList.contains("open");

  const close = () => {
    menu.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  };

  const open = () => {
    menu.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
  };

  // a11y attributes (safe even if already present)
  btn.setAttribute("aria-haspopup", "menu");
  btn.setAttribute("aria-expanded", isOpen() ? "true" : "false");

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    isOpen() ? close() : open();
  });

  // Click outside
  document.addEventListener("click", (e) => {
    if (!isOpen()) return;
    const inside = menu.contains(e.target) || btn.contains(e.target);
    if (!inside) close();
  });

  // ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  // Click item -> load lang
  menu.querySelectorAll(".lang-item[data-lang]").forEach((item) => {
    item.addEventListener("click", async () => {
      const lang = item.dataset.lang;
      try {
        await window.ME_I18N?.load?.(lang);
      } catch (err) {
        console.error(err);
        alert("Erreur chargement langue. Vérifie assets/i18n/ et lance le site via localhost.");
      } finally {
        close();
      }
    });
  });
}

/* ==========================================================
   MOBILE NAV (Burger + Drawer + Backdrop)
   Expects:
   - #navToggle
   - #primaryNav (.nav-panel) with data-open="false|true"
   - #navBackdrop (hidden by default)
   Also toggles: html.nav-open (prevents scroll)
   ========================================================== */
function setupMobileNav() {
  const toggle = document.getElementById("navToggle");
  const panel = document.getElementById("primaryNav");
  const backdrop = document.getElementById("navBackdrop");
  if (!toggle || !panel || !backdrop) return;

  const html = document.documentElement;

  const isOpen = () => panel.getAttribute("data-open") === "true";

  const open = () => {
    panel.setAttribute("data-open", "true");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Fermer le menu");
    backdrop.hidden = false;
    html.classList.add("nav-open");
  };

  const close = () => {
    panel.setAttribute("data-open", "false");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Ouvrir le menu");
    backdrop.hidden = true;
    html.classList.remove("nav-open");
  };

  // Init safe state
  panel.setAttribute("data-open", panel.getAttribute("data-open") || "false");
  toggle.setAttribute("aria-controls", "primaryNav");
  toggle.setAttribute("aria-expanded", isOpen() ? "true" : "false");
  backdrop.hidden = !isOpen();

  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    isOpen() ? close() : open();
  });

  backdrop.addEventListener("click", () => close());

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) close();
  });

  // Close when clicking a link in the menu (mobile UX)
  panel.querySelectorAll("a[href]").forEach((a) => {
    a.addEventListener("click", () => {
      if (isOpen()) close();
    });
  });

  // Close if resizing back to desktop
  window.addEventListener("resize", () => {
    // On desktop widths, ensure closed
    if (window.innerWidth > 980 && isOpen()) close();
  });

  // Expose for debugging if needed
  window.ME_NAV = { open, close };
}

/* ==========================================================
   INIT
   ========================================================== */
async function initSite() {
  // 1) Inject header/footer (elements must exist before binding)
  await inject("site-header", "assets/partials/header.html");
  await inject("site-footer", "assets/partials/footer.html");

  // 2) Small dynamic bits
  setupFooterYear();
  setupPartnerLinks();
  setupWhatsAppLink();

  // 3) Bind UI (after injection)
  setupLangMenuA11y();
  setupMobileNav();
  window.ME_CART?.bindCartUI?.();

  // 4) i18n (single source of truth)
  const initial = window.ME_I18N?.getInitialLang?.() || "fr";
  await window.ME_I18N?.load?.(initial);
}

document.addEventListener("DOMContentLoaded", () => {
  initSite().catch((err) => console.error(err));
});