(() => {
  "use strict";

  let MENU = [];
  let FLAT_MENU = [];

  function buildFlatMenu() {
    FLAT_MENU = MENU.flatMap(cat =>
      (cat.items || []).map(it => ({
        ...it,
        catId: cat.id,
        catTitle: cat.title,
        catSubtitle: cat.subtitle || "",
        group: cat.group || "food",
        subgroup: cat.subgroup || ""
      }))
    );
  }

  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => [...r.querySelectorAll(s)];
  const mobileMenuMq = window.matchMedia("(max-width: 820px)");

  let currentChip = "all";
  let currentQuery = "";
  let lastFocus = null;
  let currentModalProductId = null;
  let currentModalOptionId = null;

  const T = (key, fallback) => {
    try { return window.ME_I18N?.t?.(key) ?? fallback; }
    catch { return fallback; }
  };

  function tName(p) { return T(`menu.item.${p.id}.name`, p.name); }
  function tDesc(p) { return T(`menu.item.${p.id}.desc`, p.desc); }
  function tOptLabel(p, opt) { return T(`menu.item.${p.id}.opt.${opt.id}.label`, opt.label); }
  function tOptDetail(p, opt) { return T(`menu.item.${p.id}.opt.${opt.id}.detail`, opt.detail || p.desc || ""); }
  function tCatTitle(id, fallback) { return T(`menu.cat.${id}.title`, fallback); }
  function tCatSub(id, fallback) { return T(`menu.cat.${id}.subtitle`, fallback); }
  function tSubgroup(sg) { return T(`menu.sg.${sg}`, sg); }

  function isMobileMenuMode() {
    return mobileMenuMq.matches;
  }

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

  function getPackageLabel() {
    return "Format";
  }

  function getOptionDisplayLabel(label) {
    const raw = String(label || "").trim();
    if (!raw) return "";

    return raw
      .replace(/^(\d+)\s*personnes?$/i, "$1 pers.")
      .replace(/^(\d+)\s*pax$/i, "$1 pers.");
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
        name: tName(product),
        desc: tDesc(product),
        img: product.img,
        price: product.price,
        badge: product.badge || ""
      };
    }

    const label = tOptLabel(product, option);
    const detail = tOptDetail(product, option);
    return {
      id: `${product.id}-${option.id}`,
      baseId: product.id,
      optionId: option.id,
      name: `${tName(product)} — ${label}`,
      desc: detail,
      img: product.img,
      price: option.price,
      badge: product.badge || "",
      optionLabel: label
    };
  }

  function setCategoriesToggleLabel(label = "Catégories") {
    const el = qs("#menuCategoriesToggleLabel");
    if (el) el.textContent = label;
  }

  function syncCategoriesPanelMode() {
    const panel = qs("#menuCategoriesPanel");
    const btn = qs("#menuCategoriesToggle");
    if (!panel || !btn) return;

    if (isMobileMenuMode()) {
      const isOpen = panel.classList.contains("open");
      panel.hidden = !isOpen;
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    } else {
      panel.hidden = false;
      panel.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }
  }

  function openCategoriesPanel() {
    const panel = qs("#menuCategoriesPanel");
    const btn = qs("#menuCategoriesToggle");
    if (!panel || !btn) return;

    if (!isMobileMenuMode()) {
      panel.hidden = false;
      return;
    }

    panel.hidden = false;
    panel.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
  }

  function closeCategoriesPanel() {
    const panel = qs("#menuCategoriesPanel");
    const btn = qs("#menuCategoriesToggle");
    if (!panel || !btn) return;

    panel.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");

    if (isMobileMenuMode()) {
      panel.hidden = true;
    } else {
      panel.hidden = false;
    }
  }

  function setupCategoriesPanel() {
    const btn = qs("#menuCategoriesToggle");
    const panel = qs("#menuCategoriesPanel");
    if (!btn || !panel) return;

    btn.addEventListener("click", () => {
      if (!isMobileMenuMode()) return;

      if (panel.classList.contains("open")) {
        closeCategoriesPanel();
      } else {
        openCategoriesPanel();
      }
    });

    document.addEventListener("click", (e) => {
      if (!isMobileMenuMode()) return;
      if (!panel.classList.contains("open")) return;

      const inside = panel.contains(e.target) || btn.contains(e.target);
      if (!inside) closeCategoriesPanel();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeCategoriesPanel();
    });

    if (typeof mobileMenuMq.addEventListener === "function") {
      mobileMenuMq.addEventListener("change", syncCategoriesPanelMode);
    } else if (typeof mobileMenuMq.addListener === "function") {
      mobileMenuMq.addListener(syncCategoriesPanelMode);
    }

    window.addEventListener("resize", syncCategoriesPanelMode);

    syncCategoriesPanelMode();
  }

  function syncActiveStates() {
    qsa(".tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.chip === currentChip);
    });

    qsa("#menuChips .chip").forEach(chip => {
      chip.classList.toggle("active", chip.dataset.chip === currentChip);
    });

    const category = MENU.find(c => c.id === currentChip);
    setCategoriesToggleLabel(category ? tCatTitle(category.id, category.title) : T("menu.ui.categories", "Catégories"));
  }

  function renderChips() {
    const chips = qs("#menuChips");
    if (!chips) return;

    const seen = new Set();
    const entries = [];
    MENU.forEach(c => {
      if (c.subgroup) {
        const key = `sg:${c.subgroup}`;
        if (!seen.has(key)) {
          seen.add(key);
          entries.push({ id: key, label: tSubgroup(c.subgroup) });
        }
      } else {
        entries.push({ id: c.id, label: tCatTitle(c.id, c.title) });
      }
    });

    chips.innerHTML = entries.map(e =>
      `<button class="chip" type="button" data-chip="${escapeHtml(e.id)}">${escapeHtml(e.label)}</button>`
    ).join("");

    if (chips.dataset.bound === "1") return;

    chips.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      applyState({ chip: btn.dataset.chip, query: currentQuery });
    });

    chips.dataset.bound = "1";
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
        <div class="package-picker__label">${escapeHtml(getPackageLabel())}</div>
        <div class="package-picker__buttons">
          ${product.options.map(opt => `
            <button
              type="button"
              class="package-option ${opt.id === first.id ? "active" : ""}"
              data-option-id="${escapeHtml(opt.id)}"
              aria-label="${escapeHtml(tOptLabel(product, opt))}"
            >
              ${escapeHtml(getOptionDisplayLabel(tOptLabel(product, opt)))}
            </button>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderFormuleCard(product) {
    const effective = getEffectiveProduct(product, getDefaultOption(product)?.id || null);
    const badge = product.badge ? `<span class="badge">${escapeHtml(product.badge)}</span>` : "";

    return `
      <article class="product formule-card me-clickable" tabindex="0" role="button"
        data-id="${escapeHtml(product.id)}"
        data-name="${escapeHtml(product.name)}"
        data-desc="${escapeHtml(product.desc)}"
        data-img="${escapeHtml(product.img)}"
        data-price="${effective.price ?? ""}"
        data-has-options="${product.options?.length ? "1" : "0"}"
        data-selected-option="${escapeHtml(getDefaultOption(product)?.id || "")}"
        ${canAdd(effective.price) ? "" : "data-disabled='1'"}
        aria-label="${escapeHtml(product.name)}"
      >
        <div class="formule-card__photo">
          <picture>
            <source srcset="${escapeHtml(product.img.replace('.jpg', '.webp'))}" type="image/webp">
            <img
              src="${escapeHtml(product.img)}"
              alt="${escapeHtml(tName(product))}"
              loading="lazy"
              onerror="this.style.display='none';this.parentElement.classList.add('is-missing')"
            />
          </picture>
        </div>
        <div class="formule-card__body">
          <div class="formule-card__top">
            ${badge}
            <h3>${escapeHtml(tName(product))}</h3>
            <p class="formule-card__desc">${escapeHtml(tDesc(product))}</p>
          </div>
          ${renderOptionsInline(product)}
          <div class="formule-card__foot">
            <span class="price formule-card__price" data-price-for="${escapeHtml(product.id)}">${escapeHtml(formatPrice(effective.price))}</span>
            <button class="btn btn-primary me-add" type="button" ${canAdd(effective.price) ? "" : "disabled"} aria-label="Ajouter ${escapeHtml(product.name)}">
              Ajouter
            </button>
            <div class="qty" aria-label="Quantité">
              <button type="button" class="me-dec" aria-label="Retirer">−</button>
              <span class="me-qty" data-qty-for="${escapeHtml(product.id)}">0</span>
              <button type="button" class="me-inc" aria-label="Ajouter">+</button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function renderWineRow(product) {
    const canAddItem = canAdd(product.price);
    const badge = product.badge ? `<span class="badge">${escapeHtml(product.badge)}</span>` : "";

    return `
      <div class="product wine-row me-clickable" tabindex="0" role="button"
        data-id="${escapeHtml(product.id)}"
        data-name="${escapeHtml(product.name)}"
        data-desc="${escapeHtml(product.desc)}"
        data-img="${escapeHtml(product.img)}"
        data-price="${product.price ?? ""}"
        data-has-options="0"
        data-selected-option=""
        ${canAddItem ? "" : "data-disabled='1'"}
        aria-label="${escapeHtml(product.name)}"
      >
        <div class="wine-row__info">
          <span class="wine-row__name">${escapeHtml(tName(product))}</span>
          <span class="wine-row__desc">${escapeHtml(tDesc(product))}</span>
        </div>
        <div class="wine-row__right">
          ${badge}
          <span class="price wine-row__price">${escapeHtml(formatPrice(product.price))}</span>
          <button class="btn btn-chip me-add" type="button" ${canAddItem ? "" : "disabled"} aria-label="Ajouter ${escapeHtml(product.name)}">
            ${escapeHtml(T("menu.add", "Ajouter"))}
          </button>
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
          <picture>
            <source srcset="${escapeHtml(product.img.replace('.jpg', '.webp'))}" type="image/webp">
            <img
              src="${escapeHtml(product.img)}"
              alt="${escapeHtml(tName(product))}"
              loading="lazy"
              onerror="this.style.display='none';this.parentElement.classList.add('is-missing')"
            />
          </picture>
        </div>

        <div class="meta">
          <div class="meta-copy">
            <h3>${escapeHtml(tName(product))}</h3>
            <p class="desc">${escapeHtml(tDesc(product))}</p>
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
          layout: def?.layout || null,
          items: []
        });
      }
      byCat.get(it.catId).items.push(it);
    }

    const orderedCatIds = MENU.map(c => c.id).filter(id => byCat.has(id));

    root.innerHTML = orderedCatIds.map(catId => {
      const cat = byCat.get(catId);
      const head = `
        <div class="menu-section__head">
          <h2>${escapeHtml(tCatTitle(catId, cat.title))}</h2>
          ${cat.subtitle ? `<p class="muted">${escapeHtml(tCatSub(catId, cat.subtitle))}</p>` : ``}
        </div>`;

      if (cat.layout === "formule") {
        return `
          <div class="menu-section is-featured" id="cat-${escapeHtml(catId)}">
            ${head}
            <div class="formule-grid">
              ${cat.items.map(renderFormuleCard).join("")}
            </div>
          </div>`;
      }

      if (cat.layout === "cave") {
        return `
          <div class="menu-section" id="cat-${escapeHtml(catId)}">
            ${head}
            <div class="wine-list">
              ${cat.items.map(renderWineRow).join("")}
            </div>
          </div>`;
      }

      return `
        <div class="menu-section" id="cat-${escapeHtml(catId)}">
          ${head}
          <div class="product-grid">
            ${cat.items.map(renderProductCard).join("")}
          </div>
        </div>`;
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
    } else if (chip.startsWith("sg:")) {
      const sg = chip.slice(3);
      list = list.filter(x => x.subgroup === sg);
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

    if (isMobileMenuMode()) {
      closeCategoriesPanel();
    }
  }

  function renderModalOptions(product, optionId) {
    if (!product.options?.length) return escapeHtml(tDesc(product) || "");

    const selected = getSelectedOption(product, optionId) || getDefaultOption(product);

    return `
      <div class="modal-package">
        <p class="muted">${escapeHtml(tDesc(product) || "")}</p>

        <div class="package-picker package-picker--modal">
          <div class="package-picker__label">${escapeHtml(getPackageLabel())}</div>
          <div class="package-picker__buttons">
            ${product.options.map(opt => `
              <button
                type="button"
                class="package-option package-option--modal ${opt.id === selected.id ? "active" : ""}"
                data-modal-option-id="${escapeHtml(opt.id)}"
                aria-label="${escapeHtml(tOptLabel(product, opt))}"
              >
                ${escapeHtml(getOptionDisplayLabel(tOptLabel(product, opt)))}
              </button>
            `).join("")}
          </div>
        </div>

        <p class="tiny muted modal-package__detail" id="productModalOptionDetail">
          ${escapeHtml(tOptDetail(product, selected))}
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
          detailEl.textContent = option ? tOptDetail(product, option) : "";
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

    qs("#productModalTitle").textContent = tName(product);

    const descEl = qs("#productModalDesc");
    if (descEl) {
      if (product.options?.length) {
        descEl.innerHTML = renderModalOptions(product, currentModalOptionId);
      } else {
        descEl.textContent = tDesc(product) || "";
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

    const imgSource = qs("#productModalImgSource");
    if (imgSource) imgSource.srcset = (product.img || "").replace(".jpg", ".webp");
    const img = qs("#productModalImg");
    if (img) {
      img.src = product.img || "";
      img.alt = tName(product) || "Produit";
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

      if (e.key === "Escape") { closeModal(); return; }
      if (e.key !== "Tab") return;

      const panel = modal.querySelector(".me-modal__panel");
      const focusable = Array.from(panel.querySelectorAll(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )).filter(el => !el.closest('[aria-hidden="true"]'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        last.focus(); e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus(); e.preventDefault();
      }
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

  document.addEventListener("DOMContentLoaded", async () => {
    const root = document.getElementById("menuRoot");
    if (root) root.innerHTML = '<p class="muted" style="padding:2rem">Chargement…</p>';

    try {
      const res = await fetch("assets/data/menu.json");
      if (!res.ok) throw new Error(res.status);
      MENU = await res.json();
      buildFlatMenu();
    } catch (e) {
      console.error("Menu load failed", e);
      if (root) root.innerHTML = '<p class="muted" style="padding:2rem">Impossible de charger la carte. Veuillez recharger la page.</p>';
      return;
    }

    bindModal();
    setupTabs();
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
