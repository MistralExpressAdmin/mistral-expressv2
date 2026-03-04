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
    if (!res.ok) throw new Error(`Cannot load i18n: assets/i18n/${l}.json (${res.status})`);
    return await res.json();
  }

  function deepGet(obj, path) {
    return path.split(".").reduce((acc, k) => (acc && acc[k] != null ? acc[k] : null), obj);
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
  }

  function updateLangUI() {
    const label = document.getElementById("langLabel");
    if (label) label.textContent = lang.toUpperCase();

    document.querySelectorAll(".lang-item[data-lang]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
      btn.setAttribute("aria-checked", btn.dataset.lang === lang ? "true" : "false");
      btn.setAttribute("role", "menuitemradio");
    });
  }

  async function load(l) {
    lang = isSupported(l) ? l : defaultLang;

    localStorage.setItem(STORAGE_KEY, lang);

    // keep ?lang=
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState({}, "", url.toString());

    dict = await loadTranslations(lang);
    apply();
    updateLangUI();

    window.dispatchEvent(new CustomEvent("me:lang", { detail: { lang } }));
  }

  return { load, t, getInitialLang };
})();

window.ME_I18N = ME_I18N;