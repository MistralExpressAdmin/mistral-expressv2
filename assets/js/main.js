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


  function initAll() {
    initFooterYear();
    initCartEverywhere();
    setActiveNavLink();
  }

  function initTestiSlider() {
    const track = document.getElementById("testiTrack");
    if (!track) return;

    const slides    = Array.from(track.querySelectorAll(".testi-slide"));
    const dots      = Array.from(document.querySelectorAll(".testi-dot"));
    const container = track.closest(".testi-slider") || track.parentElement;
    let current = 0;
    let timer   = null;
    let paused  = false;

    function goTo(idx) {
      slides[current].classList.remove("is-active");
      dots[current].classList.remove("active");
      dots[current].setAttribute("aria-pressed", "false");
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add("is-active");
      dots[current].classList.add("active");
      dots[current].setAttribute("aria-pressed", "true");
    }

    function stop() {
      clearInterval(timer);
      timer = null;
    }

    function start() {
      if (paused) return;
      stop();
      timer = setInterval(() => goTo(current + 1), 5000);
    }

    function pause() {
      paused = true;
      stop();
    }

    function resume() {
      paused = false;
      start();
    }

    // Clic sur un point → pause (l'utilisateur lit à son rythme)
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => { pause(); goTo(i); });

      // Navigation clavier : flèches gauche/droite entre les points
      dot.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          const prev = (i - 1 + dots.length) % dots.length;
          pause();
          goTo(prev);
          dots[prev].focus();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          const next = (i + 1) % dots.length;
          pause();
          goTo(next);
          dots[next].focus();
        }
      });
    });

    // Pause au survol
    container.addEventListener("mouseenter", pause);
    container.addEventListener("mouseleave", resume);

    // Pause quand le focus entre dans le carrousel, reprise à la sortie
    container.addEventListener("focusin", pause);
    container.addEventListener("focusout", (e) => {
      if (!container.contains(e.relatedTarget)) resume();
    });

    goTo(0);
    start();
  }

  function initNavScroll() {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const header = document.querySelector(".site-header");
          if (header) header.classList.toggle("is-scrolled", window.scrollY > 80);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", () => {
    preparePublicCartSession();
    initAll();
    initTestiSlider();
    initNavScroll();

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