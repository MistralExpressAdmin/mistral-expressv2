(() => {
  "use strict";

  const MENU = [
    {
      id: "packages",
      group: "food",
      title: "Petit déjeuner à bord",
      subtitle: "Sélection prête à bord",
      items: [
        {
          id: "dejeuner-a-bord",
          name: "Petit déjeuner à bord",
          desc: "Viennoiseries artisanales du matin, baguette tradition, beurre & confitures artisanales, jus d’orange pressé et fruits frais de saison.",
          badge: "Signature",
          img: "assets/img/menu/dejeuner-bord.jpg",
          options: [
            {
              id: "2p",
              label: "2 personnes",
              price: 48,
              detail: "2 croissants, 2 pains au chocolat, 1/2 baguette, beurre & confiture, 2 jus d’orange frais, fruits frais."
            },
            {
              id: "4p",
              label: "4 personnes",
              price: 88,
              detail: "4 croissants, 4 pains au chocolat, 1 baguette, beurre & confitures, 4 jus d’orange frais, fruits frais."
            },
            {
              id: "8p",
              label: "8 personnes",
              price: 168,
              detail: "8 croissants, 8 pains au chocolat, 2 baguettes, beurre & confitures, 8 jus d’orange frais, fruits frais."
            }
          ]
        }
      ]
    },

    {
      id: "premium",
      group: "food",
      title: "Sélection Maison",
      subtitle: "Produits d’exception",
      items: [
        { id: "caviar-oscietre-30",  name: "Caviar Oscietre 30g",  desc: "Caviar Oscietre de sélection.", price: 120, badge: "Maison", img: "assets/img/menu/caviar-oscietre.jpg" },
        { id: "caviar-oscietre-100", name: "Caviar Oscietre 100g", desc: "Caviar Oscietre de sélection.", price: 250, badge: "Maison", img: "assets/img/menu/caviar-oscietre.jpg" },
        { id: "caviar-oscietre-250", name: "Caviar Oscietre 250g", desc: "Caviar Oscietre de sélection.", price: 500, badge: "Maison", img: "assets/img/menu/caviar-oscietre.jpg" },

        { id: "caviar-baeri-30",  name: "Caviar Baeri 30g",  desc: "Caviar Baeri de sélection.", price: 85,  badge: "Maison", img: "assets/img/menu/caviar-baeri.jpg" },
        { id: "caviar-baeri-100", name: "Caviar Baeri 100g", desc: "Caviar Baeri de sélection.", price: 195, badge: "Maison", img: "assets/img/menu/caviar-baeri.jpg" },
        { id: "caviar-baeri-250", name: "Caviar Baeri 250g", desc: "Caviar Baeri de sélection.", price: 420, badge: "Maison", img: "assets/img/menu/caviar-baeri.jpg" },

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
        { id: "tartare-saumon", name: "Tartare saumon", desc: "Préparé minute, assaisonnement de sélection.", price: 26, badge: "Frais", img: "assets/img/menu/tartare-saumon.jpg" },
        { id: "tartare-thon",   name: "Tartare thon",   desc: "Découpe fine, texture parfaite.", price: 29, badge: "Signature", img: "assets/img/menu/tartare-thon.jpg" },
        { id: "tartare-boeuf",  name: "Tartare de bœuf", desc: "Classique, goût net.", price: 27, badge: "Classique", img: "assets/img/menu/tartare-boeuf.jpg" }
      ]
    },

    {
      id: "salades",
      group: "food",
      title: "Salades",
      subtitle: "Fraîches & équilibrées",
      items: [
        { id: "salade-cesar",   name: "Salade César",    desc: "Poulet, croûtons, parmesan, sauce.", price: 19, badge: "Signature", img: "assets/img/menu/salade-cesar.jpg" },
        { id: "salade-nicoise", name: "Salade niçoise",  desc: "Fraîche, méditerranéenne.", price: 18, badge: "Maison", img: "assets/img/menu/salade-nicoise.jpg" },
        { id: "salade-pates",   name: "Salade de pâtes", desc: "Généreuse, idéale à bord.", price: 16, badge: "Sélection", img: "assets/img/menu/salade-pates.jpg" }
      ]
    },

    {
      id: "planches",
      group: "food",
      title: "Planches & Plateaux",
      subtitle: "À partager à bord",
      items: [
        { id: "mix-charcuterie", name: "Mix de charcuterie", desc: "Sélection fine, tranchée prête à servir.", price: 34, badge: "Apéro", img: "assets/img/menu/mix-charcuterie.jpg" },
        { id: "mix-fromages",    name: "Mix de fromages français", desc: "Assortiment français de sélection.", price: 32, badge: "Fromages", img: "assets/img/menu/mix-fromages.jpg" },

        { id: "plateau-caviar-service", name: "Plateau Caviar Service", desc: "Service prêt à déguster, présentation élégante.", price: 95, badge: "Maison", img: "assets/img/menu/plateau-caviar.jpg" },
        { id: "plateau-fromages-fr",    name: "Plateau Fromages Français", desc: "Sélection de fromages français prête à servir.", price: 62, badge: "Maison", img: "assets/img/menu/plateau-fromages.jpg" },
        { id: "plateau-charcuterie-iberique", name: "Plateau Charcuterie Ibérique", desc: "Sélection ibérique prête à servir.", price: 68, badge: "Apéro", img: "assets/img/menu/plateau-charcuterie.jpg" },
        { id: "plateau-fruits-premium", name: "Plateau Fruits Premium", desc: "Fruits de saison, parfait au mouillage.", price: 44, badge: "Frais", img: "assets/img/menu/plateau-fruits.jpg" }
      ]
    },

    {
      id: "brochettes",
      group: "food",
      title: "Brochettes",
      subtitle: "Finger food élégant",
      items: [
        { id: "brochettes-melon-jambon", name: "Brochettes melon & jambon de pays", desc: "Sucré-salé chic.", price: 18, badge: "Sunset", img: "assets/img/menu/brochettes-melon-jambon.jpg" },
        { id: "brochettes-fruits",       name: "Brochettes de fruits de saison", desc: "Frais, léger, élégant.", price: 16, badge: "Frais", img: "assets/img/menu/brochettes-fruits.jpg" },
        { id: "brochettes-tomate-mozza", name: "Brochettes tomates & mozzarella", desc: "Simple, soigné, parfait à bord.", price: 17, badge: "Végé", img: "assets/img/menu/brochettes-tomate-mozza.jpg" }
      ]
    },

    {
      id: "wraps",
      group: "food",
      title: "Wraps Signature",
      subtitle: "Prêts à emporter en mer",
      items: [
        { id: "wrap-poulet", name: "Wrap de poulet", desc: "Pratique, gourmand, service rapide.", price: 15, badge: "Signature", img: "assets/img/menu/wrap-poulet.jpg" },
        { id: "wrap-saumon", name: "Wrap de saumon", desc: "Saumon de sélection, texture délicate.", price: 17, badge: "Maison", img: "assets/img/menu/wrap-saumon.jpg" }
      ]
    },

    {
      id: "champagnes",
      group: "drinks",
      title: "Champagnes",
      subtitle: "Du moins cher au plus cher",
      items: [
        { id: "champ-extra-brut-bdn",     name: "Extra brut Blanc de Noirs", desc: "Champagne — sélection.", price: 62, badge: "Collection", img: "assets/img/menu/champagne-1.jpg" },
        { id: "champ-neuville-autolyse",  name: "Brut de Neuville Autolyse", desc: "Champagne — sélection.", price: 68, badge: "Collection", img: "assets/img/menu/champagne-2.jpg" },
        { id: "champ-neuville-2012",      name: "Brut de Neuville Millésimé 2012", desc: "Champagne — millésime.", price: 95, badge: "Millésime", img: "assets/img/menu/champagne-3.jpg" },
        { id: "champ-roederer-246",       name: "Louis Roederer Collection 246", desc: "Champagne — collection.", price: 110, badge: "Collection", img: "assets/img/menu/champagne-4.jpg" },
        { id: "champ-ruinart-bdb",        name: "Ruinart Blanc de Blanc", desc: "Champagne — blanc de blancs.", price: 135, badge: "Collection", img: "assets/img/menu/champagne-5.jpg" },
        { id: "champ-roederer-bdb",       name: "Louis Roederer Blanc de Blanc", desc: "Champagne — blanc de blancs.", price: 145, badge: "Collection", img: "assets/img/menu/champagne-6.jpg" },
        { id: "champ-perrier-jouet-2016", name: "Perrier Jouet 2016", desc: "Champagne — millésime.", price: 165, badge: "Millésime", img: "assets/img/menu/champagne-7.jpg" },
        { id: "champ-cristal",            name: "Cristal Roederer", desc: "Champagne — de collection.", price: 360, badge: "Exception", img: "assets/img/menu/champagne-8.jpg" }
      ]
    },

    {
      id: "vins-blancs",
      group: "drinks",
      title: "Vins blancs",
      subtitle: "Fraîcheur & élégance",
      items: [
        { id: "blanc-minuty-prestige-2024", name: "Minuty Prestige 2024", desc: "Vin blanc — sélection.", price: 26, badge: "Sélection", img: "assets/img/menu/vin-blanc-1.jpg" },
        { id: "blanc-minuty-blanc-or-2024", name: "Blanc et Or Minuty 2024", desc: "Vin blanc de sélection.", price: 42, badge: "Maison", img: "assets/img/menu/vin-blanc-2.jpg" },
        { id: "blanc-secret-lunes-chardo",  name: "Secret de Lunès Chardonnay", desc: "Chardonnay — élégant.", price: 22, badge: "Chardonnay", img: "assets/img/menu/vin-blanc-3.jpg" }
      ]
    },

    {
      id: "vins-roses",
      group: "drinks",
      title: "Vins rosés",
      subtitle: "L’iconique Côte d’Azur",
      items: [
        { id: "rose-minuty-prestige-2024", name: "Minuty Prestige 2024", desc: "Vin rosé — sélection.", price: 26, badge: "Sélection", img: "assets/img/menu/vin-rose-1.jpg" },
        { id: "rose-minuty-rose-or-2024",  name: "Rose et Or Minuty 2024", desc: "Vin rosé de sélection.", price: 42, badge: "Maison", img: "assets/img/menu/vin-rose-2.jpg" },
        { id: "rose-chateau-281",          name: "Château 281", desc: "Vin rosé — de collection.", price: 95, badge: "Collection", img: "assets/img/menu/vin-rose-3.jpg" }
      ]
    },

    {
      id: "softs",
      group: "drinks",
      title: "Softs & Énergie",
      subtitle: "Canettes & boissons fraîches",
      items: [
        { id: "coca-33",         name: "Coca Cola 33cl", desc: "Canette.", price: 4.5, badge: "Sélection", img: "assets/img/menu/coca.jpg" },
        { id: "coca-zero-33",    name: "Coca Cola Zero 33cl", desc: "Canette.", price: 4.5, badge: "Sélection", img: "assets/img/menu/coca-zero.jpg" },
        { id: "sprite-33",       name: "Sprite 33cl", desc: "Canette.", price: 4.5, badge: "Sélection", img: "assets/img/menu/sprite.jpg" },
        { id: "fanta-33",        name: "Fanta 33cl", desc: "Canette.", price: 4.5, badge: "Sélection", img: "assets/img/menu/fanta.jpg" },
        { id: "oasis-33",        name: "Oasis 33cl", desc: "Canette.", price: 4.5, badge: "Sélection", img: "assets/img/menu/oasis.jpg" },
        { id: "fuze-tea-33",     name: "Fuze Tea 33cl", desc: "Canette.", price: 5.0, badge: "Sélection", img: "assets/img/menu/fuze-tea.jpg" },
        { id: "redbull-33",      name: "Red Bull 33cl", desc: "Canette.", price: 6.5, badge: "Énergie", img: "assets/img/menu/redbull.jpg" },
        { id: "redbull-zero-33", name: "Red Bull Zero 33cl", desc: "Canette.", price: 6.5, badge: "Énergie", img: "assets/img/menu/redbull-zero.jpg" }
      ]
    }
  ];

  const FLAT_MENU = MENU.flatMap(cat =>
    (cat.items || []).map(it => ({
      ...it,
      catId: cat.id,
      catTitle: cat.title,
      catSubtitle: cat.subtitle || "",
      group: cat.group || "food"
    }))
  );

  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => [...r.querySelectorAll(s)];

  let currentChip = "all";
  let currentQuery = "";
  let lastFocus = null;
  let currentModalProductId = null;
  let currentModalOptionId = null;

  const T = (key, fallback) => {
    try { return window.ME_I18N?.t?.(key) ?? fallback; }
    catch { return fallback; }
  };

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatPrice(price) {
    if (typeof price !== "number" || !Number.isFinite(price)) return "— €";
    const v = Math.round(price * 100) / 100;
    return `${v}€`;
  }

  function canAdd(price) {
    return typeof price === "number" && Number.isFinite(price) && price > 0;
  }

  function getProductById(id) {
    return FLAT_MENU.find(x => x.id === id) || null;
  }

  function getDefaultOption(product) {
    return product?.options?.[0] || null;
  }

  function getSelectedOption(product, optionId) {
    if (!product?.options?.length) return null;
    return product.options.find(opt => opt.id === optionId) || getDefaultOption(product);
  }

  function getEffectiveProduct(product, optionId = null) {
    const option = getSelectedOption(product, optionId);

    if (!option) {
      return {
        id: product.id,
        name: product.name,
        desc: product.desc,
        img: product.img,
        price: product.price,
        badge: product.badge || ""
      };
    }

    return {
      id: `${product.id}-${option.id}`,
      baseId: product.id,
      optionId: option.id,
      name: `${product.name} — ${option.label}`,
      desc: option.detail || product.desc,
      img: product.img,
      price: option.price,
      badge: product.badge || "",
      optionLabel: option.label
    };
  }

  function setCategoriesToggleLabel(label = "Catégories") {
    const el = qs("#menuCategoriesToggleLabel");
    if (el) el.textContent = label;
  }

  function openCategoriesPanel() {
    const panel = qs("#menuCategoriesPanel");
    const btn = qs("#menuCategoriesToggle");
    if (!panel || !btn) return;
    panel.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
  }

  function closeCategoriesPanel() {
    const panel = qs("#menuCategoriesPanel");
    const btn = qs("#menuCategoriesToggle");
    if (!panel || !btn) return;
    panel.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }

  function setupCategoriesPanel() {
    const btn = qs("#menuCategoriesToggle");
    const panel = qs("#menuCategoriesPanel");
    if (!btn || !panel) return;

    btn.addEventListener("click", () => {
      panel.classList.contains("open") ? closeCategoriesPanel() : openCategoriesPanel();
    });

    document.addEventListener("click", (e) => {
      if (!panel.classList.contains("open")) return;
      const inside = panel.contains(e.target) || btn.contains(e.target);
      if (!inside) closeCategoriesPanel();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeCategoriesPanel();
    });
  }

  function syncActiveStates() {
    qsa(".tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.chip === currentChip);
    });

    qsa("#menuChips .chip").forEach(chip => {
      chip.classList.toggle("active", chip.dataset.chip === currentChip);
    });

    const category = MENU.find(c => c.id === currentChip);
    setCategoriesToggleLabel(category ? category.title : "Catégories");
  }

  function renderChips() {
    const chips = qs("#menuChips");
    if (!chips) return;

    chips.innerHTML = MENU.map(c => `
      <button class="chip" type="button" data-chip="${escapeHtml(c.id)}">${escapeHtml(c.title)}</button>
    `).join("");

    chips.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      applyState({ chip: btn.dataset.chip, query: currentQuery });
      closeCategoriesPanel();
    });
  }

  function setupTabs() {
    qsa(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        applyState({ chip: btn.dataset.chip || "all", query: currentQuery });
      });
    });
  }

  function renderOptionsInline(product) {
    if (!product.options?.length) return "";

    const first = getDefaultOption(product);

    return `
      <div class="package-picker" data-options-for="${escapeHtml(product.id)}">
        <div class="package-picker__label">Choisir le nombre de personnes</div>
        <div class="package-picker__buttons">
          ${product.options.map(opt => `
            <button
              type="button"
              class="package-option ${opt.id === first.id ? "active" : ""}"
              data-option-id="${escapeHtml(opt.id)}"
            >
              ${escapeHtml(opt.label)}
            </button>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderProductCard(product) {
    const effective = getEffectiveProduct(product, getDefaultOption(product)?.id || null);
    const badge = product.badge ? `<span class="badge">${escapeHtml(product.badge)}</span>` : "";
    const price = `<span class="price" data-price-for="${escapeHtml(product.id)}">${escapeHtml(formatPrice(effective.price))}</span>`;
    const disabled = canAdd(effective.price) ? "" : " data-disabled='1'";

    return `
      <article class="product me-clickable" tabindex="0" role="button"
        data-id="${escapeHtml(product.id)}"
        data-name="${escapeHtml(product.name)}"
        data-desc="${escapeHtml(product.desc)}"
        data-img="${escapeHtml(product.img)}"
        data-price="${effective.price ?? ""}"
        data-has-options="${product.options?.length ? "1" : "0"}"
        data-selected-option="${escapeHtml(getDefaultOption(product)?.id || "")}"
        ${disabled}
        aria-label="${escapeHtml(product.name)}"
      >
        <div class="me-product-media">
          <img
            src="${escapeHtml(product.img)}"
            alt="${escapeHtml(product.name)}"
            loading="lazy"
            onerror="this.style.display='none';this.parentElement.classList.add('is-missing')"
          />
        </div>

        <div class="meta">
          <div class="meta-copy">
            <h3>${escapeHtml(product.name)}</h3>
            <p class="desc">${escapeHtml(product.desc)}</p>
          </div>
          <div class="meta-side">
            ${badge}
            ${price}
          </div>
        </div>

        ${renderOptionsInline(product)}

        <div class="actions">
          <button class="btn btn-chip me-add" type="button" ${canAdd(effective.price) ? "" : "disabled"} aria-label="Ajouter ${escapeHtml(product.name)}">
            ${escapeHtml(T("menu.add", "Ajouter"))}
          </button>

          <div class="qty" aria-label="Quantité">
            <button type="button" class="me-dec" aria-label="Retirer">−</button>
            <span class="me-qty" data-qty-for="${escapeHtml(product.id)}">0</span>
            <button type="button" class="me-inc" aria-label="Ajouter">+</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderMenu(list) {
    const root = qs("#menuRoot");
    if (!root) return;

    if (!list.length) {
      root.innerHTML = `<p class="muted">${escapeHtml(T("menu.ui.empty", "Aucun produit ne correspond à ta recherche."))}</p>`;
      return;
    }

    const byCat = new Map();

    for (const it of list) {
      if (!byCat.has(it.catId)) {
        const def = MENU.find(c => c.id === it.catId);
        byCat.set(it.catId, {
          title: def?.title || it.catTitle,
          subtitle: def?.subtitle || "",
          items: []
        });
      }
      byCat.get(it.catId).items.push(it);
    }

    const orderedCatIds = MENU.map(c => c.id).filter(id => byCat.has(id));

    root.innerHTML = orderedCatIds.map(catId => {
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

  function updateQtyBadges() {
    FLAT_MENU.forEach(product => {
      let q = 0;

      if (product.options?.length) {
        q = product.options.reduce((sum, opt) => {
          return sum + (window.ME_CART?.getQty?.(`${product.id}-${opt.id}`) || 0);
        }, 0);
      } else {
        q = window.ME_CART?.getQty?.(product.id) || 0;
      }

      qsa(`[data-qty-for="${CSS.escape(product.id)}"]`).forEach(el => {
        el.textContent = String(q);
      });
    });
  }

  function updateCardOptionUI(card, optionId) {
    const product = getProductById(card.dataset.id);
    if (!product) return;

    const effective = getEffectiveProduct(product, optionId);

    card.dataset.selectedOption = optionId;
    card.dataset.price = String(effective.price ?? "");

    const priceEl = card.querySelector(`[data-price-for="${CSS.escape(product.id)}"]`);
    if (priceEl) priceEl.textContent = formatPrice(effective.price);

    const addBtn = card.querySelector(".me-add");
    if (addBtn) addBtn.disabled = !canAdd(effective.price);

    card.querySelectorAll(".package-option").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.optionId === optionId);
    });
  }

  function filterAndRender({ chip = "all", query = "" }) {
    const q = query.trim().toLowerCase();
    let list = FLAT_MENU;

    if (chip === "food") {
      list = list.filter(x => x.group === "food");
    } else if (chip === "drinks") {
      list = list.filter(x => x.group === "drinks");
    } else if (chip !== "all") {
      list = list.filter(x => x.catId === chip);
    }

    if (q) {
      list = list.filter(x =>
        x.name.toLowerCase().includes(q) ||
        (x.desc || "").toLowerCase().includes(q) ||
        (x.catTitle || "").toLowerCase().includes(q)
      );
    }

    renderMenu(list);
  }

  function applyState({ chip = currentChip, query = currentQuery } = {}) {
    currentChip = chip;
    currentQuery = query;

    const input = qs("#menuSearch");
    if (input && input.value !== currentQuery) input.value = currentQuery;

    syncActiveStates();
    filterAndRender({ chip: currentChip, query: currentQuery });
  }

  function renderModalOptions(product, optionId) {
    if (!product.options?.length) return escapeHtml(product.desc || "");

    const selected = getSelectedOption(product, optionId) || getDefaultOption(product);

    return `
      <div class="modal-package">
        <p class="muted">${escapeHtml(product.desc || "")}</p>

        <div class="package-picker package-picker--modal">
          <div class="package-picker__label">Choisir le nombre de personnes</div>
          <div class="package-picker__buttons">
            ${product.options.map(opt => `
              <button
                type="button"
                class="package-option package-option--modal ${opt.id === selected.id ? "active" : ""}"
                data-modal-option-id="${escapeHtml(opt.id)}"
              >
                ${escapeHtml(opt.label)}
              </button>
            `).join("")}
          </div>
        </div>

        <p class="tiny muted modal-package__detail" id="productModalOptionDetail">
          ${escapeHtml(selected.detail || "")}
        </p>
      </div>
    `;
  }

  function bindModalOptionButtons(product) {
    qsa("[data-modal-option-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        currentModalOptionId = btn.dataset.modalOptionId;
        const effective = getEffectiveProduct(product, currentModalOptionId);

        qsa("[data-modal-option-id]").forEach(x => {
          x.classList.toggle("active", x.dataset.modalOptionId === currentModalOptionId);
        });

        const detailEl = qs("#productModalOptionDetail");
        if (detailEl) {
          const option = getSelectedOption(product, currentModalOptionId);
          detailEl.textContent = option?.detail || "";
        }

        const priceEl = qs("#productModalPrice");
        if (priceEl) priceEl.textContent = formatPrice(effective.price);

        const addBtn = qs("#productModalAdd");
        if (addBtn) addBtn.disabled = !canAdd(effective.price);
      });
    });
  }

  function openModal(product, optionId = null) {
    const modal = qs("#productModal");
    const panel = modal?.querySelector(".me-modal__panel");
    if (!modal || !panel) return;

    lastFocus = document.activeElement;
    currentModalProductId = product.id;
    currentModalOptionId = optionId || getDefaultOption(product)?.id || null;

    const effective = getEffectiveProduct(product, currentModalOptionId);

    qs("#productModalTitle").textContent = product.name;

    const descEl = qs("#productModalDesc");
    if (descEl) {
      if (product.options?.length) {
        descEl.innerHTML = renderModalOptions(product, currentModalOptionId);
      } else {
        descEl.textContent = product.desc || "";
      }
    }

    qs("#productModalPrice").textContent = formatPrice(effective.price);

    const badgeEl = qs("#productModalBadge");
    if (badgeEl) {
      if (product.badge) {
        badgeEl.style.display = "inline-flex";
        badgeEl.textContent = product.badge;
      } else {
        badgeEl.style.display = "none";
      }
    }

    const img = qs("#productModalImg");
    if (img) {
      img.src = product.img || "";
      img.alt = product.name || "Produit";
    }

    const addBtn = qs("#productModalAdd");
    if (addBtn) {
      addBtn.disabled = !canAdd(effective.price);
      addBtn.textContent = T("menu.add", "Ajouter");
    }

    bindModalOptionButtons(product);

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    panel.focus();
  }

  function closeModal() {
    const modal = qs("#productModal");
    if (!modal) return;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");

    const descEl = qs("#productModalDesc");
    if (descEl) descEl.textContent = "";

    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    lastFocus = null;
    currentModalProductId = null;
    currentModalOptionId = null;
  }

  function bindModal() {
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
      const product = getProductById(currentModalProductId);
      if (!product) return;
      addToCart(product, 1, currentModalOptionId);
    });
  }

  function readProductFromCard(card) {
    return getProductById(card.dataset.id);
  }

  function showAddFeedback(name) {
    const cart = document.querySelector(".floating-cart");
    if (cart) {
      cart.classList.add("pulse");
      setTimeout(() => cart.classList.remove("pulse"), 400);
    }

    const toast = document.createElement("div");
    toast.className = "cart-toast";
    toast.textContent = `${name} ajouté au panier`;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 50);
    setTimeout(() => toast.remove(), 2000);
  }

  function addToCart(product, delta = 1, optionId = null) {
    const effective = getEffectiveProduct(product, optionId);

    if (!canAdd(effective.price)) {
      alert("Prix non renseigné pour ce produit.");
      return;
    }

    window.ME_CART?.addItem?.({
      id: effective.id,
      name: effective.name,
      price: effective.price
    }, delta);

    updateQtyBadges();

    if (delta > 0) {
      showAddFeedback(effective.name);
    }
  }

  function bindProductClicks() {
    qsa(".product.me-clickable").forEach(card => {
      const product = readProductFromCard(card);
      if (!product) return;

      card.querySelectorAll(".package-option").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          updateCardOptionUI(card, btn.dataset.optionId);
        });
      });

      card.addEventListener("click", (e) => {
        if (e.target.closest("button, a")) return;
        openModal(product, card.dataset.selectedOption || null);
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(product, card.dataset.selectedOption || null);
        }
      });

      card.querySelector(".me-add")?.addEventListener("click", () => {
        addToCart(product, 1, card.dataset.selectedOption || null);
      });

      card.querySelector(".me-inc")?.addEventListener("click", () => {
        addToCart(product, 1, card.dataset.selectedOption || null);
      });

      card.querySelector(".me-dec")?.addEventListener("click", () => {
        addToCart(product, -1, card.dataset.selectedOption || null);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindModal();
    setupTabs();
    setupCategoriesPanel();
    renderChips();

    currentChip = qs(".tab-btn.active")?.dataset.chip || "all";
    applyState({ chip: currentChip, query: "" });

    qs("#menuSearch")?.addEventListener("input", (e) => {
      applyState({ chip: currentChip, query: e.target.value || "" });
    });

    window.addEventListener("me:lang", () => {
      renderChips();
      applyState({ chip: currentChip, query: currentQuery });
      updateQtyBadges();
    });
  });
})();