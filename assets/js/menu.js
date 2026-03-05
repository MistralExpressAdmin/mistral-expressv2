(() => {
  "use strict";

  // ============================================================
  // MENU DATA
  // price: null => affiche "— €" et désactive l'ajout au panier
  // img: chemins à adapter selon tes images
  // ============================================================
  const MENU = [
    // =======================
    // FOOD
    // =======================
    {
      id: "premium",
      group: "food",
      title: "Produits Premium",
      subtitle: "Sélection prestige",
      items: [
        // Oscietre (déjà OK chez toi)
        { id: "caviar-oscietre-30",  name: "Caviar Oscietre 30g",  desc: "Caviar Oscietre premium.", price: 120, badge: "Premium", img: "assets/img/menu/caviar-oscietre.jpg" },
        { id: "caviar-oscietre-100", name: "Caviar Oscietre 100g", desc: "Caviar Oscietre premium.", price: 250, badge: "Premium", img: "assets/img/menu/caviar-oscietre.jpg" },
        { id: "caviar-oscietre-250", name: "Caviar Oscietre 250g", desc: "Caviar Oscietre premium.", price: 500, badge: "Premium", img: "assets/img/menu/caviar-oscietre.jpg" },

        // Baeri (test premium mais légèrement moins cher)
        { id: "caviar-baeri-30",  name: "Caviar Baeri 30g",  desc: "Caviar Baeri sélection.", price: 85,  badge: "Premium", img: "assets/img/menu/caviar-baeri.jpg" },
        { id: "caviar-baeri-100", name: "Caviar Baeri 100g", desc: "Caviar Baeri sélection.", price: 195, badge: "Premium", img: "assets/img/menu/caviar-baeri.jpg" },
        { id: "caviar-baeri-250", name: "Caviar Baeri 250g", desc: "Caviar Baeri sélection.", price: 420, badge: "Premium", img: "assets/img/menu/caviar-baeri.jpg" },

        { id: "foie-gras-castaing",   name: "Foie Gras Castaing 2 × 40g", desc: "Foie gras Castaing.", price: 48, badge: "Maison", img: "assets/img/menu/foie-gras.jpg" },
        { id: "saumon-barthouil-100", name: "Saumon fumé Maison Barthouil 100g", desc: "Saumon fumé Barthouil.", price: 32, badge: "Maison", img: "assets/img/menu/saumon-fume.jpg" },
        { id: "saumon-barthouil-200", name: "Saumon fumé Maison Barthouil 200g", desc: "Saumon fumé Barthouil.", price: 58, badge: "Maison", img: "assets/img/menu/saumon-fume.jpg" }
      ]
    },

    {
      id: "tartares",
      group: "food",
      title: "Tartares",
      subtitle: "Préparés minute",
      items: [
        { id: "tartare-saumon", name: "Tartare saumon", desc: "Préparé minute, assaisonnement premium.", price: 26, badge: "Frais", img: "assets/img/menu/tartare-saumon.jpg" },
        { id: "tartare-thon",   name: "Tartare thon",   desc: "Découpe fine, texture parfaite.",        price: 29, badge: "Signature", img: "assets/img/menu/tartare-thon.jpg" },
        { id: "tartare-boeuf",  name: "Tartare de bœuf", desc: "Classique premium, goût net.",          price: 27, badge: "Classique", img: "assets/img/menu/tartare-boeuf.jpg" }
      ]
    },

    {
      id: "salades",
      group: "food",
      title: "Salades",
      subtitle: "Fraîches & équilibrées",
      items: [
        { id: "salade-cesar",   name: "Salade César",    desc: "Poulet, croûtons, parmesan, sauce.", price: 19, badge: "Best-seller", img: "assets/img/menu/salade-cesar.jpg" },
        { id: "salade-nicoise", name: "Salade niçoise",  desc: "Fraîche, méditerranéenne.",          price: 18, badge: "Local",       img: "assets/img/menu/salade-nicoise.jpg" },
        { id: "salade-pates",   name: "Salade de pâtes", desc: "Généreuse, idéale à bord.",          price: 16, badge: "Pratique",    img: "assets/img/menu/salade-pates.jpg" }
      ]
    },

    {
      id: "planches",
      group: "food",
      title: "Planches & Mix",
      subtitle: "À partager — apéritif à bord",
      items: [
        { id: "mix-charcuterie", name: "Mix de charcuterie", desc: "Sélection fine, tranchée prête à servir.", price: 34, badge: "Apéro", img: "assets/img/menu/mix-charcuterie.jpg" },
        { id: "mix-fromages",    name: "Mix de fromages français", desc: "Assortiment français premium.",      price: 32, badge: "Fromages", img: "assets/img/menu/mix-fromages.jpg" },

        { id: "plateau-caviar-service", name: "Plateau Caviar Service", desc: "Service premium prêt à déguster (présentation élégante).", price: 95, badge: "Premium", img: "assets/img/menu/plateau-caviar.jpg" },
        { id: "plateau-fromages-fr",    name: "Plateau Fromages Français", desc: "Sélection de fromages français — prêt à servir.",       price: 62, badge: "Maison",  img: "assets/img/menu/plateau-fromages.jpg" },
        { id: "plateau-charcuterie-iberique", name: "Plateau Charcuterie Ibérique", desc: "Sélection ibérique premium — prêt à servir.",  price: 68, badge: "Apéro",   img: "assets/img/menu/plateau-charcuterie.jpg" },
        { id: "plateau-fruits-premium", name: "Plateau Fruits Premium", desc: "Fruits de saison, sélection premium — parfait au mouillage.", price: 44, badge: "Frais", img: "assets/img/menu/plateau-fruits.jpg" }
      ]
    },

    {
      id: "brochettes",
      group: "food",
      title: "Brochettes",
      subtitle: "Finger food élégant",
      items: [
        { id: "brochettes-melon-jambon", name: "Brochettes melon & jambon de pays", desc: "Sucré-salé chic.", price: 18, badge: "Sunset", img: "assets/img/menu/brochettes-melon-jambon.jpg" },
        { id: "brochettes-fruits",       name: "Brochettes de fruits de saison",    desc: "Frais, léger, élégant.", price: 16, badge: "Frais", img: "assets/img/menu/brochettes-fruits.jpg" },
        { id: "brochettes-tomate-mozza", name: "Brochettes tomates & mozzarella",   desc: "Simple, premium, parfait à bord.", price: 17, badge: "Végé", img: "assets/img/menu/brochettes-tomate-mozza.jpg" }
      ]
    },

    {
      id: "wraps",
      group: "food",
      title: "Wraps",
      subtitle: "On-the-go — parfait en mer",
      items: [
        { id: "wrap-poulet", name: "Wrap de poulet", desc: "Pratique, gourmand, service rapide.", price: 15, badge: "On-the-go", img: "assets/img/menu/wrap-poulet.jpg" },
        { id: "wrap-saumon", name: "Wrap de saumon", desc: "Saumon premium, texture douce.",      price: 17, badge: "Premium",   img: "assets/img/menu/wrap-saumon.jpg" }
      ]
    },

    // =======================
    // DRINKS
    // =======================
    {
      id: "champagnes",
      group: "drinks",
      title: "Champagnes",
      subtitle: "Du moins cher au plus cher",
      items: [
        { id: "champ-extra-brut-bdn",     name: "Extra brut Blanc de Noirs",       desc: "Champagne — sélection.",       price: 62,  badge: "Champagne", img: "assets/img/menu/champagne-1.jpg" },
        { id: "champ-neuville-autolyse",  name: "Brut de Neuville Autolyse",       desc: "Champagne — sélection.",       price: 68,  badge: "Champagne", img: "assets/img/menu/champagne-2.jpg" },
        { id: "champ-neuville-2012",      name: "Brut de Neuville Millésimé 2012", desc: "Champagne — millésime.",       price: 95,  badge: "Millésime", img: "assets/img/menu/champagne-3.jpg" },
        { id: "champ-roederer-246",       name: "Louis Roederer Collection 246",   desc: "Champagne — collection.",      price: 110, badge: "Prestige",  img: "assets/img/menu/champagne-4.jpg" },
        { id: "champ-ruinart-bdb",        name: "Ruinart Blanc de Blanc",          desc: "Champagne — blanc de blancs.", price: 135, badge: "Iconique",  img: "assets/img/menu/champagne-5.jpg" },
        { id: "champ-roederer-bdb",       name: "Louis Roederer Blanc de Blanc",   desc: "Champagne — blanc de blancs.", price: 145, badge: "Prestige",  img: "assets/img/menu/champagne-6.jpg" },
        { id: "champ-perrier-jouet-2016", name: "Perrier Jouet 2016",              desc: "Champagne — millésime.",       price: 165, badge: "Millésime", img: "assets/img/menu/champagne-7.jpg" },
        { id: "champ-cristal",            name: "Cristal Roederer",                desc: "Champagne — ultra prestige.",  price: 360, badge: "Ultra",     img: "assets/img/menu/champagne-8.jpg" }
      ]
    },

    {
      id: "vins-blancs",
      group: "drinks",
      title: "Vins blancs",
      subtitle: "Fraîcheur & élégance",
      items: [
        { id: "blanc-minuty-prestige-2024", name: "Minuty Prestige 2024",        desc: "Vin blanc — sélection.", price: 26, badge: "Blanc",      img: "assets/img/menu/vin-blanc-1.jpg" },
        { id: "blanc-minuty-blanc-or-2024", name: "Blanc et Or Minuty 2024",     desc: "Vin blanc — premium.",   price: 42, badge: "Premium",    img: "assets/img/menu/vin-blanc-2.jpg" },
        { id: "blanc-secret-lunes-chardo",  name: "Secret de Lunès Chardonnay",  desc: "Chardonnay — élégant.",  price: 22, badge: "Chardonnay", img: "assets/img/menu/vin-blanc-3.jpg" }
      ]
    },

    {
      id: "vins-roses",
      group: "drinks",
      title: "Vins rosés",
      subtitle: "L’iconique Côte d’Azur",
      items: [
        { id: "rose-minuty-prestige-2024", name: "Minuty Prestige 2024",    desc: "Vin rosé — sélection.", price: 26, badge: "Rosé",     img: "assets/img/menu/vin-rose-1.jpg" },
        { id: "rose-minuty-rose-or-2024",  name: "Rose et Or Minuty 2024",  desc: "Vin rosé — premium.",   price: 42, badge: "Premium",  img: "assets/img/menu/vin-rose-2.jpg" },
        { id: "rose-chateau-281",          name: "Château 281",             desc: "Vin rosé — iconique.",  price: 95, badge: "Iconique", img: "assets/img/menu/vin-rose-3.jpg" }
      ]
    },

    {
      id: "softs",
      group: "drinks",
      title: "Softs & Energy",
      subtitle: "Canettes 33cl",
      items: [
        { id: "coca-33",         name: "Coca Cola 33cl",        desc: "Canette.", price: 4.5, badge: "Soft",   img: "assets/img/menu/coca.jpg" },
        { id: "coca-zero-33",    name: "Coca Cola Zero 33cl",   desc: "Canette.", price: 4.5, badge: "Soft",   img: "assets/img/menu/coca-zero.jpg" },
        { id: "sprite-33",       name: "Sprite 33cl",           desc: "Canette.", price: 4.5, badge: "Soft",   img: "assets/img/menu/sprite.jpg" },
        { id: "fanta-33",        name: "Fanta 33cl",            desc: "Canette.", price: 4.5, badge: "Soft",   img: "assets/img/menu/fanta.jpg" },
        { id: "oasis-33",        name: "Oasis 33cl",            desc: "Canette.", price: 4.5, badge: "Soft",   img: "assets/img/menu/oasis.jpg" },
        { id: "fuze-tea-33",     name: "Fuze Tea 33cl",         desc: "Canette.", price: 5.0, badge: "Soft",   img: "assets/img/menu/fuze-tea.jpg" },
        { id: "redbull-33",      name: "Red Bull 33cl",         desc: "Canette.", price: 6.5, badge: "Energy", img: "assets/img/menu/redbull.jpg" },
        { id: "redbull-zero-33", name: "Red Bull Zero 33cl",    desc: "Canette.", price: 6.5, badge: "Energy", img: "assets/img/menu/redbull-zero.jpg" }
      ]
    },

    {
      id: "eaux",
      group: "drinks",
      title: "Eaux",
      subtitle: "Premium waters",
      items: [
        { id: "evian-50",         name: "Evian 50cl",            desc: "Eau minérale.",   price: 3.5, badge: "Eau", img: "assets/img/menu/evian.jpg" },
        { id: "evian-1l",         name: "Evian 1L",              desc: "Eau minérale.",   price: 5.5, badge: "Eau", img: "assets/img/menu/evian.jpg" },
        { id: "sanpellegrino-50", name: "San Pellegrino 50cl",   desc: "Eau pétillante.", price: 4.0, badge: "Eau", img: "assets/img/menu/sanpellegrino.jpg" },
        { id: "sanpellegrino-1l", name: "San Pellegrino 1L",     desc: "Eau pétillante.", price: 6.5, badge: "Eau", img: "assets/img/menu/sanpellegrino.jpg" }
      ]
    }
  ];

  // ============================================================
  // Helpers
  // ============================================================
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => [...r.querySelectorAll(s)];

  const T = (key, fallback) => {
    try { return window.ME_I18N?.t?.(key) ?? fallback; }
    catch { return fallback; }
  };

  function escapeHtml(str){
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatPrice(price){
    if (typeof price !== "number" || !Number.isFinite(price)) return "— €";
    const v = Math.round(price * 100) / 100;
    return `${v}€`;
  }

  function canAdd(price){
    return typeof price === "number" && Number.isFinite(price) && price > 0;
  }

  function flatten(){
    return MENU.flatMap(cat =>
      (cat.items || []).map(it => ({
        ...it,
        catId: cat.id,
        catTitle: cat.title,
        catSubtitle: cat.subtitle || "",
        group: cat.group || "food"
      }))
    );
  }

  // ============================================================
  // Tabs (Tout / Food / Boissons) — reads .tab-btn in carte.html
  // ============================================================
  function setupTabs(){
    const tabs = qsa(".tab-btn");
    if (!tabs.length) return;

    const activate = (chip) => {
      tabs.forEach(b => b.classList.toggle("active", (b.dataset.chip || "all") === chip));

      const chipsWrap = qs("#menuChips");
      if (chipsWrap){
        qsa(".chip", chipsWrap).forEach(c => c.classList.toggle("active", c.dataset.chip === chip));
      }

      filterAndRender({ chip, query: qs("#menuSearch")?.value || "" });
      qs("#menuRoot")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    tabs.forEach(btn => btn.addEventListener("click", () => activate(btn.dataset.chip || "all")));

    const current = qs(".tab-btn.active")?.dataset.chip || "all";
    activate(current);
  }

  // ============================================================
  // Render chips (categories)
  // ============================================================
  function renderChips(){
    const chips = qs("#menuChips");
    if (!chips) return;

    const chipBtn = (id, label) =>
      `<button class="chip" type="button" data-chip="${escapeHtml(id)}">${escapeHtml(label)}</button>`;

    const cats = MENU.map(c => chipBtn(c.id, c.title)).join("");
    chips.innerHTML = cats;

    chips.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-chip]");
      if (!btn) return;

      qsa(".chip", chips).forEach(x => x.classList.toggle("active", x === btn));

      const id = btn.dataset.chip;
      qsa(".tab-btn").forEach(t => t.classList.remove("active"));

      filterAndRender({ chip: id, query: qs("#menuSearch")?.value || "" });
      qs("#menuRoot")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // ============================================================
  // Render menu sections
  // ============================================================
  function renderMenu(list){
    const root = qs("#menuRoot");
    if (!root) return;

    if (!list.length){
      root.innerHTML = `<p class="muted">${escapeHtml(T("menu.ui.empty","Aucun produit ne correspond à ta recherche."))}</p>`;
      return;
    }

    const byCat = new Map();
    for (const it of list){
      if (!byCat.has(it.catId)){
        const def = MENU.find(c => c.id === it.catId);
        byCat.set(it.catId, {
          title: def?.title || it.catTitle,
          subtitle: def?.subtitle || "",
          group: def?.group || it.group,
          items: []
        });
      }
      byCat.get(it.catId).items.push(it);
    }

    const orderedCatIds = MENU.map(c => c.id).filter(id => byCat.has(id));

    root.innerHTML = orderedCatIds.map((catId) => {
      const cat = byCat.get(catId);
      return `
        <div class="menu-section" id="cat-${escapeHtml(catId)}">
          <div class="menu-section__head">
            <h2>${escapeHtml(cat.title)}</h2>
            ${cat.subtitle ? `<p class="muted">${escapeHtml(cat.subtitle)}</p>` : ``}
          </div>

          <div class="product-grid">
            ${cat.items.map(renderProductCard).join("")}
          </div>
        </div>
      `;
    }).join("");

    bindProductClicks();
    updateQtyBadges();
  }

  function renderProductCard(p){
    const badge = p.badge ? `<span class="badge">${escapeHtml(p.badge)}</span>` : ``;
    const price = `<span class="price">${escapeHtml(formatPrice(p.price))}</span>`;
    const disabled = canAdd(p.price) ? "" : " data-disabled='1'";

    return `
      <article class="product me-clickable" tabindex="0" role="button"
        data-id="${escapeHtml(p.id)}"
        data-name="${escapeHtml(p.name)}"
        data-desc="${escapeHtml(p.desc)}"
        data-img="${escapeHtml(p.img)}"
        data-price="${p.price ?? ""}"
        ${disabled}
        aria-label="${escapeHtml(p.name)}"
      >
        <div class="me-product-media">
          <img src="${escapeHtml(p.img)}" alt="${escapeHtml(p.name)}" loading="lazy" />
        </div>

        <div class="meta">
          <div>
            <h3>${escapeHtml(p.name)}</h3>
            <p class="desc">${escapeHtml(p.desc)}</p>
          </div>
          <div style="text-align:right; display:grid; gap:8px; justify-items:end;">
            ${badge}
            ${price}
          </div>
        </div>

        <div class="actions">
          <button class="btn btn-chip me-add" type="button" ${canAdd(p.price) ? "" : "disabled"} aria-label="Ajouter ${escapeHtml(p.name)}">
            ${escapeHtml(T("menu.add","Ajouter"))}
          </button>

          <div class="qty" aria-label="Quantité">
            <button type="button" class="me-dec" aria-label="Retirer">−</button>
            <span class="me-qty" data-qty-for="${escapeHtml(p.id)}">0</span>
            <button type="button" class="me-inc" aria-label="Ajouter">+</button>
          </div>
        </div>
      </article>
    `;
  }

  function updateQtyBadges(){
    const all = flatten();
    for (const it of all){
      const q = window.ME_CART?.getQty?.(it.id) || 0;
      qsa(`[data-qty-for="${CSS.escape(it.id)}"]`).forEach(el => el.textContent = String(q));
    }
  }

  // ============================================================
  // Filtering
  // chip: all | food | drinks | categoryId
  // ============================================================
  function filterAndRender({ chip = "all", query = "" }){
    const q = query.trim().toLowerCase();
    let list = flatten();

    if (chip === "food"){
      list = list.filter(x => (x.group || "food") === "food");
    } else if (chip === "drinks"){
      list = list.filter(x => (x.group || "food") === "drinks");
    } else if (chip !== "all"){
      list = list.filter(x => x.catId === chip);
    }

    if (q){
      list = list.filter(x =>
        x.name.toLowerCase().includes(q) ||
        (x.desc || "").toLowerCase().includes(q) ||
        (x.catTitle || "").toLowerCase().includes(q)
      );
    }

    renderMenu(list);
  }

  // ============================================================
  // Modal
  // ============================================================
  let lastFocus = null;
  let currentModalProductId = null;

  function openModal(p){
    const modal = qs("#productModal");
    const panel = modal?.querySelector(".me-modal__panel");
    if (!modal || !panel) return;

    lastFocus = document.activeElement;
    currentModalProductId = p.id;

    qs("#productModalTitle").textContent = p.name;
    qs("#productModalDesc").textContent = p.desc || "";
    qs("#productModalPrice").textContent = formatPrice(p.price);

    const badgeEl = qs("#productModalBadge");
    if (badgeEl){
      if (p.badge){
        badgeEl.style.display = "inline-flex";
        badgeEl.textContent = p.badge;
      } else {
        badgeEl.style.display = "none";
      }
    }

    const img = qs("#productModalImg");
    if (img){
      img.src = p.img || "";
      img.alt = p.name || "Produit";
    }

    const addBtn = qs("#productModalAdd");
    if (addBtn) addBtn.disabled = !canAdd(p.price);

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    panel.focus();
  }

  function closeModal(){
    const modal = qs("#productModal");
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");

    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    lastFocus = null;
    currentModalProductId = null;
  }

  function bindModal(){
    qs("#productModalClose")?.addEventListener("click", closeModal);
    qs("#productModalBackdrop")?.addEventListener("click", closeModal);

    document.addEventListener("keydown", (e) => {
      const modal = qs("#productModal");
      if (!modal?.classList.contains("open")) return;
      if (e.key === "Escape") closeModal();
    });

    qs("#productModalGoCart")?.addEventListener("click", () => {
      closeModal();
      document.getElementById("cartOpenBtn")?.click();
    });

    qs("#productModalAdd")?.addEventListener("click", () => {
      if (!currentModalProductId) return;
      const p = flatten().find(x => x.id === currentModalProductId);
      if (!p) return;
      addToCart(p, 1);
    });
  }

  // ============================================================
  // Click handlers
  // ============================================================
  function readProductFromCard(card){
    const priceRaw = card.dataset.price;
    const price = priceRaw === "" ? null : Number(priceRaw);

    return {
      id: card.dataset.id,
      name: card.dataset.name,
      desc: card.dataset.desc,
      img: card.dataset.img,
      price,
      badge: card.querySelector(".badge")?.textContent || ""
    };
  }

  function addToCart(p, delta = 1){
    if (!canAdd(p.price)){
      alert("Prix non renseigné pour ce produit. Ajoute ton prix dans menu.js puis recharge la page.");
      return;
    }
    window.ME_CART?.addItem?.({ id: p.id, name: p.name, price: p.price }, delta);
    updateQtyBadges();
  }

  function bindProductClicks(){
    qsa(".product.me-clickable").forEach(card => {
      card.addEventListener("click", (e) => {
        const isBtn = e.target.closest("button, a");
        if (isBtn) return;
        openModal(readProductFromCard(card));
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " "){
          e.preventDefault();
          openModal(readProductFromCard(card));
        }
      });

      card.querySelector(".me-add")?.addEventListener("click", () => addToCart(readProductFromCard(card), 1));
      card.querySelector(".me-inc")?.addEventListener("click", () => addToCart(readProductFromCard(card), 1));
      card.querySelector(".me-dec")?.addEventListener("click", () => addToCart(readProductFromCard(card), -1));
    });
  }

  // ============================================================
  // Init
  // ============================================================
  document.addEventListener("DOMContentLoaded", () => {
    renderChips();
    bindModal();
    setupTabs();

    qs("#menuSearch")?.addEventListener("input", (e) => {
      const active =
        qs(".tab-btn.active")?.dataset.chip ||
        qs(".chip.active")?.dataset.chip ||
        "all";

      filterAndRender({ chip: active, query: e.target.value || "" });
    });

    window.addEventListener("me:lang", () => updateQtyBadges());

    if (!qs(".tab-btn")){
      filterAndRender({ chip: "all", query: "" });
    }
  });

})();