(() => {
  "use strict";

  const CART_SESSION_KEY = "me_cart_session_started";

  function setActiveNavLink() {
    const path = window.location.pathname || "";
    let page = path.split("/").pop() || "index.html";

    if (!page.includes(".")) page = "index.html";
    page = page.toLowerCase();

    const nav = document.querySelector(".site-header .menu");
    if (!nav) return;

    const links = Array.from(nav.querySelectorAll("a[href]"));
    links.forEach((a) => a.classList.remove("active"));

    const found = links.find((a) =>
      (a.getAttribute("href") || "").toLowerCase().includes(page)
    );

    if (found) found.classList.add("active");
  }

  function initCartEverywhere() {
    if (window.ME_CART?.bindCartUI) {
      window.ME_CART.bindCartUI();
    }
  }

  function initFooterYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  function clearLegacyCartKeys() {
    try {
      localStorage.removeItem("me_cart");
      localStorage.removeItem("cart");
      localStorage.removeItem("mistral_cart");
      localStorage.removeItem("me_cart_v1");
    } catch (err) {
      console.warn("Impossible de nettoyer les anciennes clés panier.", err);
    }
  }

  function preparePublicCartSession() {
    const url = new URL(window.location.href);
    const keepCart = url.searchParams.get("cart") === "keep";

    if (keepCart) return;

    try {
      const alreadyStarted = sessionStorage.getItem(CART_SESSION_KEY) === "1";
      if (alreadyStarted) return;

      clearLegacyCartKeys();

      if (window.ME_CART?.clear) {
        window.ME_CART.clear();
      } else {
        localStorage.removeItem("me_cart_v2");
      }

      sessionStorage.setItem(CART_SESSION_KEY, "1");
    } catch (err) {
      console.warn("Impossible d'initialiser la session panier.", err);
    }
  }
  function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const panel = document.getElementById("primaryNav");
  const backdrop = document.getElementById("navBackdrop");

  if (!toggle || !panel || !backdrop) return;
  if (toggle.dataset.meNavBound === "1") return;

  const openNav = () => {
    panel.setAttribute("data-open", "true");
    toggle.setAttribute("aria-expanded", "true");
    backdrop.hidden = false;
    document.documentElement.classList.add("nav-open");
  };

  const closeNav = () => {
    panel.setAttribute("data-open", "false");
    toggle.setAttribute("aria-expanded", "false");
    backdrop.hidden = true;
    document.documentElement.classList.remove("nav-open");
  };

  const isOpen = () => panel.getAttribute("data-open") === "true";

  toggle.addEventListener("click", () => {
    if (isOpen()) closeNav();
    else openNav();
  });

  backdrop.addEventListener("click", closeNav);

  panel.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) closeNav();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) closeNav();
  });

  toggle.dataset.meNavBound = "1";
}

  function initAll() {
    initFooterYear();
    initCartEverywhere();
    setActiveNavLink();
    initMobileNav();
  }

  document.addEventListener("DOMContentLoaded", () => {
    preparePublicCartSession();
    initAll();

    let tries = 0;
    const t = setInterval(() => {
      tries += 1;

      const hasHeader = document.querySelector(".site-header .menu");
      if (hasHeader) {
        initAll();
        clearInterval(t);
      }

      if (tries >= 20) clearInterval(t);
    }, 100);
  });
})();