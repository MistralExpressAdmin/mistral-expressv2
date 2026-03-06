const ME_CART = (() => {
  const KEY = "me_cart_v2";
  let cart = safeParse(localStorage.getItem(KEY)) || []; // {id,name,price,qty}

  function safeParse(s) {
    try {
      return JSON.parse(s || "");
    } catch {
      return null;
    }
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(cart));
    updateBadge();
    renderDrawer();
  }

  function getQty(id) {
    return cart.find((x) => x.id === id)?.qty || 0;
  }

  function addItem(item, delta = 1) {
    if (!item || !item.id || !Number.isFinite(delta)) return;

    const idx = cart.findIndex((x) => x.id === item.id);

    if (idx === -1) {
      if (delta <= 0) return;
      if (typeof item.name !== "string" || !Number.isFinite(item.price)) return;

      cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: delta,
      });
      save();
      return;
    }

    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    save();
  }

  function total() {
    return cart.reduce(
      (s, x) => s + (Number(x.price) || 0) * (Number(x.qty) || 0),
      0
    );
  }

  function euro(v) {
    const n = Math.round((Number(v) || 0) * 100) / 100;
    return `${n}€`;
  }

  function updateBadge() {
    const c = cart.reduce((s, x) => s + (Number(x.qty) || 0), 0);

    const el = document.getElementById("cartCount");
    if (el) el.textContent = String(c);

    const floatingCount = document.getElementById("floatingCartCount");
    if (floatingCount) floatingCount.textContent = String(c);

    const floatingBtn = document.getElementById("floatingCartBtn");
    if (floatingBtn) {
      if (c > 0) {
        floatingBtn.hidden = false;
        floatingBtn.classList.add("show");
      } else {
        floatingBtn.hidden = true;
        floatingBtn.classList.remove("show");
      }
    }
  }

  function openDrawer() {
    const d = document.getElementById("cartDrawer");
    if (!d) return;
    d.classList.add("open");
    d.setAttribute("aria-hidden", "false");
  }

  function closeDrawer() {
    const d = document.getElementById("cartDrawer");
    if (!d) return;
    d.classList.remove("open");
    d.setAttribute("aria-hidden", "true");
  }

  function hasInvalidPrice() {
    return cart.some(
      (x) =>
        !(
          typeof x.price === "number" &&
          Number.isFinite(x.price) &&
          x.price > 0
        )
    );
  }

  async function startStripeCheckout() {
    if (cart.length === 0) {
      alert("Ton panier est vide.");
      return;
    }

    if (hasInvalidPrice()) {
      alert(
        "Certains produits n'ont pas de prix. Renseigne les prix avant de payer par carte."
      );
      return;
    }

    const btn = document.getElementById("checkoutStripe");
    const oldText = btn?.textContent || "";

    if (btn) {
      btn.setAttribute("aria-busy", "true");
      btn.style.pointerEvents = "none";
      btn.textContent = "Redirection…";
    }

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((x) => ({
            id: x.id,
            name: x.name,
            price: Number(x.price),
            qty: Number(x.qty),
          })),
        }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        const msg = data?.error || `Erreur Stripe (${res.status}).`;
        throw new Error(msg);
      }

      if (!data?.url) {
        throw new Error("Réponse Stripe invalide (URL manquante).");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert(err?.message || "Impossible de démarrer le paiement Stripe.");

      if (btn) {
        btn.removeAttribute("aria-busy");
        btn.style.pointerEvents = "";
        btn.textContent = oldText || "Payer par carte";
      }
    }
  }

  function renderDrawer() {
    const itemsEl = document.getElementById("cartItems");
    const emptyEl = document.getElementById("cartEmpty");
    const totalEl = document.getElementById("cartTotal");

    if (!itemsEl || !emptyEl || !totalEl) return;

    if (cart.length === 0) {
      itemsEl.innerHTML = "";
      emptyEl.classList.add("show");
    } else {
      emptyEl.classList.remove("show");

      itemsEl.innerHTML = cart
        .map(
          (x) => `
        <div class="cart-item">
          <div>
            <div class="ci-name">${escapeHtml(x.name ?? "")}</div>
            <div class="ci-sub">${escapeHtml(
              window.ME_I18N?.t?.("cart.deliveryIncluded") || "Livraison incluse"
            )}</div>
          </div>
          <div class="ci-right">
            <div><strong>${euro((x.price || 0) * (x.qty || 0))}</strong></div>
            <div class="ci-sub">${euro(x.price || 0)} × ${x.qty || 0}</div>
            <div class="ci-actions">
              <button class="icon-btn" data-dec="${escapeHtml(
                x.id
              )}" aria-label="retirer">−</button>
              <button class="icon-btn" data-inc="${escapeHtml(
                x.id
              )}" aria-label="ajouter">+</button>
            </div>
          </div>
        </div>
      `
        )
        .join("");

      itemsEl.querySelectorAll("[data-inc]").forEach((b) =>
        b.addEventListener("click", () => addItem({ id: b.dataset.inc }, 1))
      );

      itemsEl.querySelectorAll("[data-dec]").forEach((b) =>
        b.addEventListener("click", () => addItem({ id: b.dataset.dec }, -1))
      );
    }

    totalEl.textContent = euro(total());

    const phone = "33668443067";
    const base = `https://wa.me/${phone}`;
    const lines = cart
      .map(
        (x) => `• ${x.qty} × ${x.name} — ${euro((x.price || 0) * (x.qty || 0))}`
      )
      .join("\n");

    const msg =
      `${
        window.ME_I18N?.t?.("cart.waIntro") ||
        "Bonjour Mistral Express, voici ma commande :"
      }\n\n` +
      `${lines}\n\n` +
      `${
        window.ME_I18N?.t?.("cart.waTotal") ||
        "Total (livraison incluse)"
      }: ${euro(total())}\n\n` +
      `${
        window.ME_I18N?.t?.("cart.waInfos") ||
        "Port + ponton + nom du bateau + créneau souhaité :"
      } `;

    const chk = document.getElementById("checkoutWhatsApp");
    if (chk) chk.setAttribute("href", `${base}?text=${encodeURIComponent(msg)}`);

    const stripeBtn = document.getElementById("checkoutStripe");
    if (stripeBtn) {
      const disabled = cart.length === 0 || hasInvalidPrice();
      stripeBtn.style.opacity = disabled ? "0.55" : "1";
      stripeBtn.style.pointerEvents = disabled ? "none" : "";
      stripeBtn.setAttribute("aria-disabled", disabled ? "true" : "false");

      if (!stripeBtn.getAttribute("aria-busy")) {
        stripeBtn.textContent = "Payer par carte";
      }
    }
  }

  function bindCartUI() {
    document.getElementById("cartOpenBtn")?.addEventListener("click", openDrawer);
    document.getElementById("floatingCartBtn")?.addEventListener("click", openDrawer);
    document.getElementById("cartCloseBtn")?.addEventListener("click", closeDrawer);
    document.getElementById("cartBackdrop")?.addEventListener("click", closeDrawer);

    document.getElementById("checkoutStripe")?.addEventListener("click", (e) => {
      e.preventDefault();
      startStripeCheckout();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawer();
    });

    updateBadge();
    renderDrawer();
  }

  document.addEventListener("DOMContentLoaded", updateBadge);

  return { addItem, getQty, bindCartUI };
})();

window.ME_CART = ME_CART;