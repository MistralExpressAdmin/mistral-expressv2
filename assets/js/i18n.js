const ME_I18N = (() => {
  const supported = ["fr", "en", "ru"];
  const defaultLang = "fr";
  const STORAGE_KEY = "lang";

  let dict = {};
  let lang = defaultLang;

  function isSupported(value) {
    return supported.includes(value);
  }

  function getInitialLang() {
    const urlLang = new URLSearchParams(window.location.search).get("lang");
    if (urlLang && isSupported(urlLang)) return urlLang;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isSupported(saved)) return saved;

    return defaultLang;
  }

  async function loadTranslations(value) {
    const res = await fetch(`assets/i18n/${value}.json`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Cannot load i18n: assets/i18n/${value}.json (${res.status})`);
    }
    return await res.json();
  }

  function deepGet(obj, path) {
    return path
      .split(".")
      .reduce((acc, key) => (acc && acc[key] != null ? acc[key] : null), obj);
  }

  function t(key) {
    const val = deepGet(dict, key);
    return typeof val === "string" ? val : key;
  }

  function apply() {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = t(key);
      el.textContent = val;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      el.setAttribute("placeholder", t(key));
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria-label");
      el.setAttribute("aria-label", t(key));
    });

    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      el.setAttribute("title", t(key));
    });
  }

  function closeDesktopLangMenu() {
    const btn = document.getElementById("langBtn");
    const menu = document.getElementById("langMenu");
    if (!btn || !menu) return;

    menu.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }

  function closeMobileLangMenu() {
    const btn = document.getElementById("mobileLangQuickToggle");
    const menu = document.getElementById("mobileLangQuickMenu");
    if (!btn || !menu) return;

    menu.hidden = true;
    btn.setAttribute("aria-expanded", "false");
  }

  function updateLangUI() {
    const upper = lang.toUpperCase();

    const label = document.getElementById("langLabel");
    if (label) label.textContent = upper;

    const current = document.getElementById("langCurrent");
    if (current) current.textContent = upper;

    const mobileCurrent = document.getElementById("mobileLangQuickCurrent");
    if (mobileCurrent) mobileCurrent.textContent = upper;

    document.querySelectorAll(".lang-item[data-lang]").forEach((btn) => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-checked", active ? "true" : "false");
      btn.setAttribute("role", "menuitemradio");
    });

    document.querySelectorAll(".mobile-lang-quick__item[data-lang]").forEach((btn) => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  async function load(value) {
    lang = isSupported(value) ? value : defaultLang;

    localStorage.setItem(STORAGE_KEY, lang);

    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState({}, "", url.toString());

    dict = await loadTranslations(lang);
    apply();
    updateLangUI();

    window.dispatchEvent(new CustomEvent("me:lang", { detail: { lang } }));
  }

  function bindDesktopLangMenu() {
    const btn = document.getElementById("langBtn");
    const menu = document.getElementById("langMenu");

    if (!btn || !menu) return;
    if (btn.dataset.meLangBound === "1") return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.contains("open");
      if (isOpen) {
        closeDesktopLangMenu();
      } else {
        menu.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });

    menu.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    btn.dataset.meLangBound = "1";
  }

  function bindMobileLangMenu() {
    const wrap = document.getElementById("mobileLangQuick");
    const btn = document.getElementById("mobileLangQuickToggle");
    const menu = document.getElementById("mobileLangQuickMenu");

    if (!wrap || !btn || !menu) return;
    if (btn.dataset.meLangBound === "1") return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = !menu.hidden;
      if (isOpen) {
        closeMobileLangMenu();
      } else {
        menu.hidden = false;
        btn.setAttribute("aria-expanded", "true");
      }
    });

    menu.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    btn.dataset.meLangBound = "1";
  }

  function bindLanguageButtons() {
    document.querySelectorAll(".lang-item[data-lang], .mobile-lang-quick__item[data-lang]")
      .forEach((btn) => {
        if (btn.dataset.meLangPickBound === "1") return;

        btn.addEventListener("click", async () => {
          const nextLang = btn.dataset.lang;
          if (!isSupported(nextLang)) return;

          try {
            await load(nextLang);
          } catch (err) {
            console.error("Language switch failed:", err);
          } finally {
            closeDesktopLangMenu();
            closeMobileLangMenu();
          }
        });

        btn.dataset.meLangPickBound = "1";
      });
  }

  function bindGlobalCloseHandlers() {
    if (document.body.dataset.meLangGlobalBound === "1") return;

    document.addEventListener("click", () => {
      closeDesktopLangMenu();
      closeMobileLangMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeDesktopLangMenu();
        closeMobileLangMenu();
      }
    });

    document.body.dataset.meLangGlobalBound = "1";
  }

  function bindUI() {
    bindDesktopLangMenu();
    bindMobileLangMenu();
    bindLanguageButtons();
    bindGlobalCloseHandlers();
    updateLangUI();
  }

  return {
    load,
    t,
    getInitialLang,
    bindUI
  };
})();

window.ME_I18N = ME_I18N;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await window.ME_I18N.load(window.ME_I18N.getInitialLang());
    window.ME_I18N.bindUI();
  } catch (err) {
    console.error("i18n init failed:", err);
  }

  let tries = 0;
  const t = setInterval(() => {
    tries += 1;
    window.ME_I18N.bindUI();
    if (tries >= 20) clearInterval(t);
  }, 100);
});