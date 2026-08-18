// ==========================================================
// footer.js — site-config.js İÇİNDEKİ BİLGİLERİ SAYFAYA UYGULAR
// 3 sütunlu footer (Kurumsal / Sosyal Medya / İletişim) burada
// tamamen JS ile inşa edilir; gereken CSS de kendi kendine enjekte
// edilir. Bu sayede TEK bu dosyayı güncelleyerek tüm site otomatik
// güncellenir, hiçbir sayfaya elle dokunmaya gerek kalmaz.
// ==========================================================

// ---- Basit çizgi ikonlar (SVG, currentColor ile temaya uyar) ----
const FOOTER_ICONS = {
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.82c-.7-.68-1.13-1.6-1.24-2.62h-3.06v13.3a2.6 2.6 0 1 1-1.84-2.49V10.9a5.8 5.8 0 1 0 4.9 5.73V9.6a6.9 6.9 0 0 0 4.04 1.3V7.83a4.2 4.2 0 0 1-2.8-2.01z"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.2 3h3.2l-7 8 8.2 10h-6.4l-5-6.5L4.9 21H1.7l7.5-8.6L1.4 3h6.5l4.5 6z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 8h-2a2 2 0 0 0-2 2v11M8 13h6"/><rect x="3" y="3" width="18" height="18" rx="4"/></svg>',
  telegram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 4 3 11l6 2m12-9-4 16-6-6m10-10-8.5 7.7"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 3a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c1 .3 2 .5 3 .7a2 2 0 0 1 1.7 2z"/></svg>',
  email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m4 7 8 6 8-6"/></svg>'
};

// ---- Footer için gerekli CSS'i sayfaya bir kere enjekte eder ----
function injectFooterStyles() {
  if (document.getElementById("footerStyles")) return; // zaten eklenmişse tekrar ekleme
  const style = document.createElement("style");
  style.id = "footerStyles";
  style.textContent = `
    footer.site-footer {
      width: 100%; border-top: 1px solid var(--coffee-line);
      padding: 40px 24px 24px; margin-top: 40px;
      background: var(--bg); position: relative; z-index: 1;
    }
    .footer-grid {
      width: 100%; max-width: 1300px; margin: 0 auto;
      display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 60px;
    }
    @media (max-width: 700px) { .footer-grid { grid-template-columns: 1fr; gap: 28px; } }
    .footer-col h4 {
      font-size: 11px; font-family: monospace; letter-spacing: 1.5px; color: var(--sub);
      margin-bottom: 6px; font-weight: 600;
    }
    .footer-col .footer-col-desc {
      font-size: 11px; color: var(--sub); opacity: 0.7; margin-bottom: 14px; line-height: 1.5;
    }
    .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 9px; }
    .footer-col ul a {
      color: var(--beige); text-decoration: none; font-size: 12.5px;
      transition: color .15s ease;
    }
    .footer-col ul a:hover { color: var(--neon); }

    .footer-social-list { display: flex; flex-direction: column; gap: 10px; }
    .footer-social-icon {
      display: flex; align-items: center; gap: 10px;
      color: var(--sub); text-decoration: none; font-size: 12.5px;
      transition: color .18s ease;
    }
    .footer-social-icon:hover { color: var(--neon); }
    .footer-social-icon .fsi-badge {
      width: 32px; height: 32px; border: 1px solid var(--coffee-line); border-radius: 8px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      transition: border-color .18s ease, box-shadow .18s ease;
    }
    .footer-social-icon:hover .fsi-badge { border-color: var(--neon); box-shadow: 0 0 14px 2px rgba(232,255,77,0.3); }
    .footer-social-icon svg { width: 16px; height: 16px; }

    .footer-contact-item { display: flex; align-items: flex-start; gap: 9px; margin-bottom: 12px; font-size: 12.5px; }
    .footer-contact-item svg { width: 15px; height: 15px; flex-shrink: 0; margin-top: 1px; color: var(--sub); }
    .footer-contact-item a { color: var(--beige); text-decoration: none; }
    .footer-contact-item a:hover { color: var(--neon); }
    .footer-contact-item.pending { color: var(--sub); opacity: 0.6; }
    .footer-contact-item.pending .fc-label { font-style: italic; }
    .footer-copy-email-btn {
      background: transparent; border: 1px solid var(--coffee-line); color: var(--sub);
      width: 20px; height: 20px; border-radius: 5px; cursor: pointer; font-size: 11px; line-height: 1;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      transition: border-color .15s ease, color .15s ease;
    }
    .footer-copy-email-btn:hover { border-color: var(--neon); color: var(--neon); }

    .footer-bottom {
      width: 100%; max-width: 1300px; margin: 26px auto 0;
      font-size: 9.5px; color: var(--sub);
    }
  `;
  document.head.appendChild(style);
}

// ---- Footer'ın tamamını (3 sütun + alt telif satırı) inşa eder ----
function renderFooterContent() {
  const footerEl = document.querySelector("footer.site-footer");
  if (!footerEl) return;

  const corporateLinks = siteConfig.footerCorporate
    .filter((link) => !link.onlyOnPathPrefix || window.location.pathname.startsWith(link.onlyOnPathPrefix))
    .map((link) => `<li><a href="${link.url}">${link.label}</a></li>`)
    .join("");

  const socialIcons = siteConfig.footerSocial
    .map((s) => `
      <a class="footer-social-icon" href="${s.url}" target="_blank" rel="noopener">
        <span class="fsi-badge">${FOOTER_ICONS[s.icon] || ""}</span>
        <span>${s.name}</span>
      </a>`)
    .join("");

  const contact = siteConfig.footerContact;
  const emailItem = `
    <div class="footer-contact-item">
      ${FOOTER_ICONS.email}
      <a href="mailto:${contact.email}" id="footerEmailLink">${contact.email}</a>
      <button class="footer-copy-email-btn" id="footerCopyEmailBtn" title="E-postayı kopyala">⧉</button>
    </div>`;
  const phoneItem = contact.phone
    ? `<div class="footer-contact-item">${FOOTER_ICONS.phone}<a href="tel:${contact.phone}">${contact.phone}</a></div>`
    : `<div class="footer-contact-item pending">${FOOTER_ICONS.phone}<span class="fc-label">Telefon: Yakında</span></div>`;
  const telegramItem = contact.telegram
    ? `<div class="footer-contact-item">${FOOTER_ICONS.telegram}<a href="${contact.telegram}" target="_blank" rel="noopener">Telegram</a></div>`
    : `<div class="footer-contact-item pending">${FOOTER_ICONS.telegram}<span class="fc-label">Telegram: Yakında</span></div>`;

  footerEl.innerHTML = `
    <div class="footer-grid">
      <div class="footer-col">
        <h4>SAYFALAR</h4>
        <p class="footer-col-desc">Site hakkında bilgi ve yasal metinler.</p>
        <ul>${corporateLinks}</ul>
      </div>
      <div class="footer-col">
        <h4>SOSYAL MEDYA</h4>
        <p class="footer-col-desc">Güncel gelişmeleri buradan takip edin.</p>
        <div class="footer-social-list">${socialIcons}</div>
      </div>
      <div class="footer-col">
        <h4>İLETİŞİM BİLGİLERİ</h4>
        <p class="footer-col-desc">Soru ve önerileriniz için bize ulaşın.</p>
        ${emailItem}
        ${phoneItem}
        ${telegramItem}
      </div>
    </div>
    <div class="footer-bottom">
      © ${siteConfig.copyrightYear} ${siteConfig.siteName}. Tüm hakları saklıdır.
    </div>
  `;

  const copyBtn = document.getElementById("footerCopyEmailBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      copyTextToClipboard(contact.email)
        .then(() => {
          copyBtn.textContent = "✓";
          setTimeout(() => { copyBtn.textContent = "⧉"; }, 1800);
        })
        .catch((err) => {
          console.warn("Kopyalama başarısız:", err);
          copyBtn.textContent = "✗";
          setTimeout(() => { copyBtn.textContent = "⧉"; }, 1800);
        });
    });
  }

  // E-postaya tıklayınca: bir mail uygulaması açılırsa (sayfa odağını kaybederse)
  // onunla devam et; kısa süre içinde hiçbir şey açılmadıysa (odak sayfada kaldıysa)
  // otomatik olarak iletişim formuna yönlendir.
  const emailLink = document.getElementById("footerEmailLink");
  if (emailLink) {
    emailLink.addEventListener("click", (e) => {
      e.preventDefault();
      let appOpened = false;
      const onBlur = () => { appOpened = true; };
      window.addEventListener("blur", onBlur);

      window.location.href = emailLink.getAttribute("href"); // mailto: dene

      setTimeout(() => {
        window.removeEventListener("blur", onBlur);
        if (!appOpened) {
          window.location.href = "/iletisim/"; // açılmadıysa forma düş
        }
      }, 600);
    });
  }
}

// ---- Kopyalama: önce modern API'yi dener, olmazsa eski (execCommand) yönteme düşer ----
function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  // Yedek yöntem: geçici bir metin kutusu oluşturup seçip kopyala
  return new Promise((resolve, reject) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      const successful = document.execCommand("copy");
      document.body.removeChild(textarea);
      successful ? resolve() : reject(new Error("execCommand başarısız"));
    } catch (err) {
      document.body.removeChild(textarea);
      reject(err);
    }
  });
}

function renderSiteConfig() {
  injectFooterStyles();

  // ---- Merkezi reklam kontrolü: tüm sayfalardaki reklam yer tutucularını
  // tek bir ayardan (site-config.js -> showAdPlaceholders) göster/gizle ----
  if (!siteConfig.showAdPlaceholders) {
    document
      .querySelectorAll(".ad-slot, .ad-slot-side, .ad-leaderboard, .ad-incontent")
      .forEach((el) => { el.style.display = "none"; });
  }

  // Navbar'daki site adı
  document.querySelectorAll("[data-site-name]").forEach((el) => {
    el.textContent = siteConfig.siteName;
  });

  // Navbar'daki logo: eski "dot" placeholder'ının yerine gerçek şerit logo görselini koy.
  document.querySelectorAll(".dot").forEach((el) => {
    const img = document.createElement("img");
    img.src = siteConfig.logoStripImagePath;
    img.alt = siteConfig.siteName;
    img.className = "site-logo-strip";
    const logoHeight = window.innerWidth <= 500 ? "28px" : "40px";
    img.style.height = logoHeight;
    img.style.width = "auto";
    img.style.display = "block";
    el.replaceWith(img);

    const navbarEl = img.closest(".navbar");
    if (navbarEl) {
      const currentPadding = getComputedStyle(navbarEl).paddingLeft;
      const navPadding = window.innerWidth <= 500 ? "8px" : "10px";
      navbarEl.style.padding = `${navPadding} ${currentPadding}`;
      navbarEl.style.minHeight = logoHeight;

      const navbarBrand = navbarEl.querySelector(".brand[data-site-name]");
      if (navbarBrand) navbarBrand.style.display = "none";
    }
  });

  // Footer: yeni 3 sütunlu tasarım
  renderFooterContent();
}

renderSiteConfig();

// ==========================================================
// Sayfa görüntülenme/kullanım sayacı (pageViews koleksiyonu)
// ==========================================================
(function trackPageView() {
  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyB1_1SFf59n3dtsrwlQOAZ8v9O2Ip0lzgA",
    authDomain: "site-biolink.firebaseapp.com",
    projectId: "site-biolink",
    storageBucket: "site-biolink.firebasestorage.app",
    messagingSenderId: "989281542396",
    appId: "1:989281542396:web:9ff4dea27a66949ee3f779"
  };

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function getToolIdFromPath() {
    const parts = window.location.pathname.split("/").filter(Boolean);
    let id = parts[0] || "anasayfa";
    if (id.includes(".")) id = "anasayfa";
    return id;
  }

  loadScript("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js")
    .then(() => loadScript("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"))
    .then(() => {
      const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(FIREBASE_CONFIG);
      const db = firebase.firestore();
      const toolId = getToolIdFromPath();
      const docRef = db.collection("pageViews").doc(toolId);

      return docRef.set(
        { views: firebase.firestore.FieldValue.increment(1) },
        { merge: true }
      );
    })
    .catch((err) => {
      console.warn("Sayfa görüntülenme sayacı kaydedilemedi:", err);
    });
})();
