const ME_I18N = (() => {
  const supported = ["fr", "en", "ru"];
  const defaultLang = "fr";
  const STORAGE_KEY = "lang";

  let dict = {};
  let lang = defaultLang;

  function isSupported(l) {
    return supported.includes(l);
  }

  function getInitialLang() {
    const urlLang = new URLSearchParams(window.location.search).get("lang");
    if (urlLang && isSupported(urlLang)) return urlLang;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isSupported(saved)) return saved;

    return defaultLang;
  }

  async function loadTranslations(l) {
    const res = await fetch(`assets/i18n/${l}.json`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Cannot load i18n: assets/i18n/${l}.json (${res.status})`);
    }
    return await res.json();
  }

  function deepGet(obj, path) {
    return path.split(".").reduce((acc, k) => {
      return acc && acc[k] != null ? acc[k] : null;
    }, obj);
  }

  function t(key) {
    const val = deepGet(dict, key);
    return typeof val === "string" ? val : key;
  }

  function apply() {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      el.textContent = t(key);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      el.setAttribute("placeholder", t(key));
    });
  }

  function updateLangUI() {
    const desktopCurrent = document.getElementById("langCurrent");
    if (desktopCurrent) desktopCurrent.textContent = lang.toUpperCase();

    const mobileCurrent = document.getElementById("mobileLangQuickCurrent");
    if (mobileCurrent) mobileCurrent.textContent = lang.toUpperCase();

    document.querySelectorAll(".lang-item[data-lang]").forEach((btn) => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-checked", active ? "true" : "false");
    });

    document.querySelectorAll(".mobile-lang-quick__item[data-lang]").forEach((btn) => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    const langBtn = document.getElementById("langBtn");
    if (langBtn) {
      langBtn.setAttribute("aria-expanded", "false");
    }

    const mobileBtn = document.getElementById("mobileLangQuickToggle");
    if (mobileBtn) {
      mobileBtn.setAttribute("aria-expanded", "false");
    }
  }

  function openDesktopMenu() {
    const btn = document.getElementById("langBtn");
    const menu = document.getElementById("langMenu");
    if (!btn || !menu) return;

    btn.setAttribute("aria-expanded", "true");
    menu.classList.add("open");
  }

  function closeDesktopMenu() {
    const btn = document.getElementById("langBtn");
    const menu = document.getElementById("langMenu");
    if (!btn || !menu) return;

    btn.setAttribute("aria-expanded", "false");
    menu.classList.remove("open");
  }

  function toggleDesktopMenu() {
    const menu = document.getElementById("langMenu");
    if (!menu) return;

    if (menu.classList.contains("open")) {
      closeDesktopMenu();
    } else {
      openDesktopMenu();
    }
  }

  function openMobileMenu() {
    const btn = document.getElementById("mobileLangQuickToggle");
    const menu = document.getElementById("mobileLangQuickMenu");
    if (!btn || !menu) return;

    btn.setAttribute("aria-expanded", "true");
    menu.hidden = false;
  }

  function closeMobileMenu() {
    const btn = document.getElementById("mobileLangQuickToggle");
    const menu = document.getElementById("mobileLangQuickMenu");
    if (!btn || !menu) return;

    btn.setAttribute("aria-expanded", "false");
    menu.hidden = true;
  }

  function toggleMobileMenu() {
    const menu = document.getElementById("mobileLangQuickMenu");
    if (!menu) return;

    if (menu.hidden) {
      openMobileMenu();
    } else {
      closeMobileMenu();
    }
  }

  async function load(l) {
    lang = isSupported(l) ? l : defaultLang;
    localStorage.setItem(STORAGE_KEY, lang);

    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState({}, "", url.toString());

    dict = await loadTranslations(lang);
    apply();
    updateLangUI();

    window.dispatchEvent(new CustomEvent("me:lang", { detail: { lang } }));
  }

  function bindDelegatedUI() {
    if (document.body.dataset.meI18nDelegatedBound === "1") return;

    document.addEventListener("click", async (e) => {
      const desktopToggle = e.target.closest("#langBtn");
      if (desktopToggle) {
        e.preventDefault();
        e.stopPropagation();
        toggleDesktopMenu();
        return;
      }

      const mobileToggle = e.target.closest("#mobileLangQuickToggle");
      if (mobileToggle) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
        return;
      }

      const desktopItem = e.target.closest(".lang-item[data-lang]");
      if (desktopItem) {
        e.preventDefault();
        e.stopPropagation();
        await load(desktopItem.dataset.lang);
        closeDesktopMenu();
        return;
      }

      const mobileItem = e.target.closest(".mobile-lang-quick__item[data-lang]");
      if (mobileItem) {
        e.preventDefault();
        e.stopPropagation();
        await load(mobileItem.dataset.lang);
        closeMobileMenu();
        return;
      }

      const insideDesktop =
        e.target.closest("#langBtn") || e.target.closest("#langMenu");
      if (!insideDesktop) {
        closeDesktopMenu();
      }

      const insideMobile =
        e.target.closest("#mobileLangQuickToggle") ||
        e.target.closest("#mobileLangQuickMenu");
      if (!insideMobile) {
        closeMobileMenu();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeDesktopMenu();
        closeMobileMenu();
      }
    });

    document.body.dataset.meI18nDelegatedBound = "1";
  }

  return {
    load,
    t,
    getInitialLang,
    bindDelegatedUI,
    updateLangUI,
  };
})();

window.ME_I18N = ME_I18N;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await window.ME_I18N.load(window.ME_I18N.getInitialLang());
  } catch (err) {
    console.error(err);
  }

  window.ME_I18N.bindDelegatedUI();
  window.ME_I18N.updateLangUI();
});

window.addEventListener("me:lang", () => {
  window.ME_I18N.updateLangUI();
});