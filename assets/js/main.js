Main 

(() => {
  "use strict";

  /* ==========================================================
     NAV ACTIVE LINK
     ========================================================== */
  function setActiveNavLink() {
    const path = window.location.pathname || "";
    let page = path.split("/").pop() || "index.html";
    if (!page.includes(".")) page = "index.html";
    page = page.toLowerCase();

    const nav = document.querySelector(".site-header .menu");
    if (!nav) return;

    const links = Array.from(nav.querySelectorAll("a[href]"));
    links.forEach(a => a.classList.remove("active"));

    const found = links.find(a =>
      (a.getAttribute("href") || "").toLowerCase().includes(page)
    );

    if (found) found.classList.add("active");
  }

  /* ==========================================================
     CART INIT
     ========================================================== */
  function initCartEverywhere() {
    if (window.ME_CART?.bindCartUI) {
      window.ME_CART.bindCartUI();
    }
  }

  /* ==========================================================
     FOOTER YEAR
     ========================================================== */
  function initFooterYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  /* ==========================================================
     MOBILE NAV (BURGER)
     ========================================================== */
  function initMobileNav() {
    const toggle = document.getElementById("navToggle");
    const panel = document.getElementById("primaryNav");
    const backdrop = document.getElementById("navBackdrop");

    if (!toggle || !panel || !backdrop) return;

    function openNav() {
      panel.dataset.open = "true";
      toggle.setAttribute("aria-expanded", "true");
      backdrop.hidden = false;
      document.documentElement.classList.add("nav-open");
    }

    function closeNav() {
      panel.dataset.open = "false";
      toggle.setAttribute("aria-expanded", "false");
      backdrop.hidden = true;
      document.documentElement.classList.remove("nav-open");
    }

    toggle.addEventListener("click", () => {
      if (panel.dataset.open === "true") closeNav();
      else openNav();
    });

    backdrop.addEventListener("click", closeNav);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });

    // Ferme quand on clique un lien
    panel.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeNav);
    });
  }

  /* ==========================================================
     MOBILE LANGUAGE MENU
     ========================================================== */
  function initMobileLang() {
    const wrap = document.getElementById("mobileLangQuick");
    const toggle = document.getElementById("mobileLangQuickToggle");
    const menu = document.getElementById("mobileLangQuickMenu");

    if (!wrap || !toggle || !menu) return;

    function openMenu() {
      menu.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
    }

    function closeMenu() {
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (menu.hidden) openMenu();
      else closeMenu();
    });

    menu.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    document.addEventListener("click", (e) => {
      if (!wrap.contains(e.target)) closeMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ==========================================================
     INIT GLOBAL
     ========================================================== */
  function initAll() {
    initFooterYear();
    initCartEverywhere();
    setActiveNavLink();
    initMobileNav();
    initMobileLang();
  }

  /* ==========================================================
     LOAD (avec retry header injecté)
     ========================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    initAll();

    let tries = 0;

    const t = setInterval(() => {
      tries++;

      const hasHeader = document.querySelector(".site-header .menu");

      if (hasHeader) {
        initAll();
        clearInterval(t);
      }

      if (tries >= 20) clearInterval(t);
    }, 100);
  });

})();