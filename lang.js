// ==========================================================
// lang.js — Ortak TR/EN dil motoru
// Her sayfa kendi küçük "pageDict" sözlüğünü tanımlar,
// bu dosya sadece geçiş mantığını (localStorage + uygulama) yönetir.
// ==========================================================

function getLang() {
  return localStorage.getItem("lang") === "en" ? "en" : "tr";
}

function applyLang() {
  const lang = getLang();
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (pageDict[lang] && pageDict[lang][key] !== undefined) {
      el.innerHTML = pageDict[lang][key];
    }
  });
  const toggleBtn = document.getElementById("langToggle");
  if (toggleBtn) toggleBtn.textContent = lang === "tr" ? "EN" : "TR";
  document.documentElement.lang = lang;
}

function initLangToggle() {
  const toggleBtn = document.getElementById("langToggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      localStorage.setItem("lang", getLang() === "tr" ? "en" : "tr");
      applyLang();
    });
  }
  applyLang();
}
