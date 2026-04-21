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
      btn.setAttribute("role", "menuitemradio");
    });

    document.querySelectorAll(".mobile-lang-quick__item[data-lang]").forEach((btn) => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function closeDesktopMenu() {
    const btn = document.getElementById("langBtn");
    const menu = document.getElementById("langMenu");
    if (!btn || !menu) return;

    btn.setAttribute("aria-expanded", "false");
    menu.classList.remove("open");
  }

  function toggleDesktopMenu() {
    const btn = document.getElementById("langBtn");
    const menu = document.getElementById("langMenu");
    if (!btn || !menu) return;

    const willOpen = !menu.classList.contains("open");
    btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    menu.classList.toggle("open", willOpen);
  }

  function closeMobileMenu() {
    const btn = document.getElementById("mobileLangQuickToggle");
    const menu = document.getElementById("mobileLangQuickMenu");
    if (!btn || !menu) return;

    btn.setAttribute("aria-expanded", "false");
    menu.hidden = true;
  }

  function toggleMobileMenu() {
    const btn = document.getElementById("mobileLangQuickToggle");
    const menu = document.getElementById("mobileLangQuickMenu");
    if (!btn || !menu) return;

    const willOpen = menu.hidden;
    btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    menu.hidden = !willOpen;
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

  function bindUI() {
    const langBtn = document.getElementById("langBtn");
    const langMenu = document.getElementById("langMenu");
    const mobileBtn = document.getElementById("mobileLangQuickToggle");
    const mobileMenu = document.getElementById("mobileLangQuickMenu");

    if (langBtn && !langBtn.dataset.bound) {
      langBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleDesktopMenu();
      });
      langBtn.dataset.bound = "1";
    }

    if (mobileBtn && !mobileBtn.dataset.bound) {
      mobileBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMobileMenu();
      });
      mobileBtn.dataset.bound = "1";
    }

    document.querySelectorAll(".lang-item[data-lang]").forEach((btn) => {
      if (btn.dataset.bound) return;
      btn.addEventListener("click", async () => {
        await load(btn.dataset.lang);
        closeDesktopMenu();
      });
      btn.dataset.bound = "1";
    });

    document.querySelectorAll(".mobile-lang-quick__item[data-lang]").forEach((btn) => {
      if (btn.dataset.bound) return;
      btn.addEventListener("click", async () => {
        await load(btn.dataset.lang);
        closeMobileMenu();
      });
      btn.dataset.bound = "1";
    });

    if (!document.body.dataset.i18nGlobalBound) {
      document.addEventListener("click", (e) => {
        if (langBtn && langMenu) {
          const insideDesktop = langBtn.contains(e.target) || langMenu.contains(e.target);
          if (!insideDesktop) closeDesktopMenu();
        }

        if (mobileBtn && mobileMenu) {
          const insideMobile = mobileBtn.contains(e.target) || mobileMenu.contains(e.target);
          if (!insideMobile) closeMobileMenu();
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          closeDesktopMenu();
          closeMobileMenu();
        }
      });

      document.body.dataset.i18nGlobalBound = "1";
    }

    updateLangUI();
  }

  return { load, t, getInitialLang, bindUI };
})();

window.ME_I18N = ME_I18N;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await window.ME_I18N.load(window.ME_I18N.getInitialLang());
  } catch (err) {
    console.error(err);
  }

  window.ME_I18N.bindUI();

  let tries = 0;
  const t = setInterval(() => {
    tries += 1;
    window.ME_I18N.bindUI();
    if (document.getElementById("langBtn") || tries >= 20) {
      clearInterval(t);
    }
  }, 150);
});

window.addEventListener("me:includes-ready", () => {
  window.ME_I18N.bindUI();
});