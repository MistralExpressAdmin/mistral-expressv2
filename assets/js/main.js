(() => {
  "use strict";

  function setActiveNavLink() {
    // Récupère le nom du fichier courant (index.html, carte.html, etc.)
    const path = window.location.pathname || "";
    let page = path.split("/").pop() || "index.html";

    // Si on est sur / (sans fichier), considérer index.html
    if (!page.includes(".")) page = "index.html";

    // Normalise
    page = page.toLowerCase();

    // Cherche les liens dans le header injecté
    const nav = document.querySelector(".site-header .menu");
    if (!nav) return;

    const links = Array.from(nav.querySelectorAll("a[href]"));

    // Retire toute classe active
    links.forEach(a => a.classList.remove("active"));

    // Active celui qui correspond
    const found = links.find(a => (a.getAttribute("href") || "").toLowerCase().includes(page));
    if (found) found.classList.add("active");
  }

  function initCartEverywhere() {
    // Le drawer est dans le header injecté, donc on attend que include.js ait fini.
    // Si le drawer n’est pas là, bindCartUI ne fera rien de toute façon.
    if (window.ME_CART?.bindCartUI) {
      window.ME_CART.bindCartUI();
    }
  }

  function initFooterYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  // On attend que include.js ait injecté le header/footer.
  // include.js déclenche souvent après DOMContentLoaded, donc on fait :
  // - un premier passage après DOMContentLoaded
  // - puis un petit retry si le header n’est pas encore injecté.
  document.addEventListener("DOMContentLoaded", () => {
    initFooterYear();
    initCartEverywhere();
    setActiveNavLink();

    // Retry léger (header injecté parfois après)
    let tries = 0;
    const t = setInterval(() => {
      tries += 1;
      const hasHeader = document.querySelector(".site-header .menu");
      if (hasHeader) {
        setActiveNavLink();
        initCartEverywhere();
        clearInterval(t);
      }
      if (tries >= 20) clearInterval(t); // ~2s max
    }, 100);
  });
})();