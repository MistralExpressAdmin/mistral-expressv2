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

function setupLangMenuA11y() {
  const btn = document.getElementById("langBtn");
  const menu = document.getElementById("langMenu");
  if (!btn || !menu) return;

  // a11y attributes (safe even if already present)
  btn.setAttribute("aria-haspopup", "menu");
  btn.setAttribute("aria-expanded", menu.classList.contains("open") ? "true" : "false");

  const close = () => {
    menu.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  };

  const open = () => {
    menu.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
  };

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    menu.classList.contains("open") ? close() : open();
  });

  // Click outside
  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("open")) return;
    const inside = menu.contains(e.target) || btn.contains(e.target);
    if (!inside) close();
  });

  // ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  // Click item
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
  window.ME_CART?.bindCartUI?.();

  // 4) i18n (single source of truth)
  const initial = window.ME_I18N?.getInitialLang?.() || "fr";
  await window.ME_I18N?.load?.(initial);
}

document.addEventListener("DOMContentLoaded", () => {
  initSite().catch((err) => console.error(err));
});
