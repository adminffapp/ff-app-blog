/* FF-App Labs marka sitesi: ortak kod (dil, Firestore okuma, Markdown, üst/alt bilgi, form, animasyon). */
(function () {
  "use strict";
  var PROJECT = "site-biolink", KEY = "AIzaSyB1_1SFf59n3dtsrwlQOAZ8v9O2Ip0lzgA";
  var BASE = "https://firestore.googleapis.com/v1/projects/" + PROJECT + "/databases/(default)/documents";
  var HUB = "https://hub.ffapplabs.com";

  // ---------------- varsayılan marka ayarları (panelden değişir: siteData/brand) ----------------
  var DEFAULT_BRAND = {
    email: "contact@ffapplabs.com",
    bionluk: "https://bionluk.com",
    social: { instagram: "https://instagram.com/ffapplabs", tiktok: "https://tiktok.com/@ffapplabsadmin", x: "https://x.com/ffapplabs", facebook: "https://www.facebook.com/profile.php?id=61592924292148" },
    hubUrl: HUB
  };

  // ---------------- dil ----------------
  var DICT = { tr: {}, en: {} };
  function lang() { try { var l = localStorage.getItem("lang"); if (l === "en" || l === "tr") return l; } catch (e) {} return (navigator.language || "").toLowerCase().indexOf("tr") === 0 ? "tr" : "en"; }
  function t(k) { var d = DICT[lang()] || DICT.tr; return d[k] != null ? d[k] : (DICT.tr[k] != null ? DICT.tr[k] : k); }
  function extend(add) { ["tr", "en"].forEach(function (l) { if (add[l]) for (var k in add[l]) DICT[l][k] = add[l][k]; }); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function applyI18n(root) {
    root = root || document;
    var L = lang(); document.documentElement.lang = L;
    root.querySelectorAll("[data-i18n]").forEach(function (el) { var v = t(el.getAttribute("data-i18n")); if (v !== el.getAttribute("data-i18n")) el.innerHTML = v; });
    root.querySelectorAll("[data-i18n-ph]").forEach(function (el) { el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph"))); });
    root.querySelectorAll("[data-i18n-label]").forEach(function (el) { el.setAttribute("aria-label", t(el.getAttribute("data-i18n-label"))); });
    var m = DICT[L] && DICT[L].pageTitle; if (m) document.title = m;
    var md = DICT[L] && DICT[L].metaDesc; if (md) { var x = document.querySelector('meta[name="description"]'); if (x) x.setAttribute("content", md); }
    var lb = document.getElementById("langBtn"); if (lb) { lb.textContent = L === "tr" ? "EN" : "TR"; lb.setAttribute("aria-label", L === "tr" ? "Switch to English" : "Türkçe'ye geç"); }
    syncLangUI(L);
    if (BRAND) wireBrand(root);
  }
  // ---- bayraklı dil seçici (web app ile aynı) ----
  var LSEL = { tr: { title: "Dilinizi seçin", btn: "Dil seçin", close: "Kapat" }, en: { title: "Choose your language", btn: "Choose language", close: "Close" } };
  function syncLangUI(L) {
    var T = LSEL[L] || LSEL.tr, g = function (i) { return document.getElementById(i); };
    ["Tr", "En"].forEach(function (k) {
      var f = g("navbarFlag" + k), r = g("navbarLangRow" + k);
      if (f) { if (k.toLowerCase() === L) f.removeAttribute("hidden"); else f.setAttribute("hidden", ""); }
      if (r) { if (k.toLowerCase() === L) r.setAttribute("aria-current", "true"); else r.removeAttribute("aria-current"); }
    });
    if (g("navbarLangCode")) g("navbarLangCode").textContent = L.toUpperCase();
    if (g("navbarLangTitle")) g("navbarLangTitle").textContent = T.title;
    if (g("navbarLangClose")) g("navbarLangClose").setAttribute("aria-label", T.close);
    if (g("navbarLangBtn")) g("navbarLangBtn").setAttribute("aria-label", T.btn);
  }
  function wireLangSel() {
    var sel = document.getElementById("navbarLangSel"), btn = document.getElementById("navbarLangBtn"), cl = document.getElementById("navbarLangClose");
    if (!sel || !btn) return;
    function setOpen(o) { sel.classList.toggle("is-open", o); btn.setAttribute("aria-expanded", String(o)); }
    btn.addEventListener("click", function (e) { e.stopPropagation(); setOpen(!sel.classList.contains("is-open")); });
    document.addEventListener("click", function (e) { if (!sel.contains(e.target)) setOpen(false); });
    if (cl) cl.addEventListener("click", function (e) { e.stopPropagation(); setOpen(false); btn.focus(); });
    sel.addEventListener("keydown", function (e) { if (e.key === "Escape" && sel.classList.contains("is-open")) { e.stopPropagation(); setOpen(false); btn.focus(); } });
    sel.querySelectorAll(".navbar-langsel-row").forEach(function (row) { row.addEventListener("click", function (e) { e.stopPropagation(); setOpen(false); btn.focus(); setLang(row.getAttribute("data-lang")); }); });
    syncLangUI(lang());
  }
  function setLang(l) { try { localStorage.setItem("lang", l); } catch (e) {} applyI18n(); document.dispatchEvent(new CustomEvent("ffb:lang")); }
  function pick(o, f) { return lang() === "en" && o[f + "En"] ? o[f + "En"] : o[f]; }
  function fmtDate(v) { var d = new Date(v); if (isNaN(d)) return ""; return d.toLocaleDateString(lang() === "en" ? "en-GB" : "tr-TR", { day: "numeric", month: "long", year: "numeric" }); }
  function nf(n) { return Number(n || 0).toLocaleString(lang() === "en" ? "en-US" : "tr-TR"); }

  // ---------------- Firestore (REST, yalnızca okuma + sayaç + form) ----------------
  function dec(v) {
    if (!v) return null;
    if ("stringValue" in v) return v.stringValue; if ("integerValue" in v) return Number(v.integerValue); if ("doubleValue" in v) return v.doubleValue;
    if ("booleanValue" in v) return v.booleanValue; if ("timestampValue" in v) return v.timestampValue; if ("nullValue" in v) return null;
    if ("arrayValue" in v) return (v.arrayValue.values || []).map(dec);
    if ("mapValue" in v) { var o = {}, f = v.mapValue.fields || {}; for (var k in f) o[k] = dec(f[k]); return o; }
    return null;
  }
  function decDoc(d) { var o = {}, f = d.fields || {}; for (var k in f) o[k] = dec(f[k]); o.id = String(d.name || "").split("/").pop(); return o; }
  function http(url, opt, ms) {
    var ctl = window.AbortController ? new AbortController() : null, to = setTimeout(function () { if (ctl) ctl.abort(); }, ms || 6000);
    opt = opt || {}; if (ctl) opt.signal = ctl.signal;
    return fetch(url, opt).then(function (r) { clearTimeout(to); if (!r.ok) throw new Error("http " + r.status); return r.json(); }, function (e) { clearTimeout(to); throw e; });
  }
  var sampleP = null;
  function sample() { if (!sampleP) sampleP = http("/veri/ornek.json", { cache: "no-cache" }).catch(function () { return { posts: [], projects: [], brand: {} }; }); return sampleP; }
  function key() { return "?key=" + KEY; }

  var brandP = null;
  // Panelde marka belgesi hiç oluşturulmadıysa (null) ve içerik boşsa örnek içerik gösterilir.
  function rawBrand() { if (!brandP) brandP = http(BASE + "/siteData/brand" + key()).then(function (d) { var f = d.fields && d.fields.data; return f && f.stringValue ? JSON.parse(f.stringValue) : {}; }).catch(function (e) { return e && /404/.test(e.message) ? null : undefined; }); return brandP; }
  function getBrand() { return rawBrand().then(function (b) { var o = JSON.parse(JSON.stringify(DEFAULT_BRAND)); if (b) { for (var k in b) { if (k === "social" && b.social) for (var s in b.social) o.social[s] = b.social[s]; else if (b[k]) o[k] = b[k]; } } return o; }); }

  // Yazılar ve projeler önce sitenin kendi veri dosyasından okunur (panel bu dosyayı yazıp git ile yayınlar).
  // Dosya yoksa ya da okunamazsa eski yöntemle Firestore'dan okunur.
  var fileP = null;
  function fileData() { if (!fileP) fileP = http("/veri/icerik.json", { cache: "no-cache" }).then(function (d) { return d && Array.isArray(d.posts) && Array.isArray(d.projects) ? d : null; }).catch(function () { return null; }); return fileP; }
  var projP = null, postP = null;
  function getProjects() {
    if (projP) return projP;
    projP = fileData().then(function (d) { return d ? d.projects.filter(function (p) { return p.active !== false; }).sort(function (a, b) { return (a.order || 0) - (b.order || 0); }) : fsProjects(); });
    return projP;
  }
  function fsProjects() {
    return Promise.all([rawBrand(), http(BASE + "/projects" + key() + "&pageSize=60").then(function (r) { return (r.documents || []).map(decDoc); }).catch(function () { return undefined; })]).then(function (x) {
      var brand = x[0], list = x[1];
      if (list === undefined || (!list.length && brand === null)) return sample().then(function (s) { return s.projects || []; });
      return list.filter(function (p) { return p.active !== false; }).sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    });
  }
  function getPosts() {
    if (postP) return postP;
    postP = fileData().then(function (d) { return d ? d.posts.filter(function (p) { return p.published !== false; }) : fsPosts(); }).then(function (list) {
      var now = Date.now();
      return list.filter(function (p) { return !p.publishedAt || Date.parse(p.publishedAt) <= now + 86400000; }).sort(function (a, b) { return Date.parse(b.publishedAt || 0) - Date.parse(a.publishedAt || 0); });
    });
    return postP;
  }
  function fsPosts() {
    var q = { structuredQuery: { from: [{ collectionId: "posts" }], where: { fieldFilter: { field: { fieldPath: "published" }, op: "EQUAL", value: { booleanValue: true } } }, limit: 100 } };
    return Promise.all([rawBrand(), http(BASE + ":runQuery" + key(), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(q) }).then(function (r) { return r.filter(function (x) { return x.document; }).map(function (x) { return decDoc(x.document); }); }).catch(function () { return undefined; })]).then(function (x) {
      var brand = x[0], list = x[1];
      if (list === undefined || (!list.length && brand === null)) return sample().then(function (s) { return (s.posts || []).slice(); });
      return list;
    });
  }
  function getPost(slug) { return getPosts().then(function (l) { return l.filter(function (p) { return (p.slug || p.id) === slug; })[0] || null; }); }
  var viewsP = null;
  function getViews() { if (!viewsP) viewsP = http(BASE + "/postViews" + key() + "&pageSize=300").then(function (r) { var m = {}; (r.documents || []).forEach(function (d) { var o = decDoc(d); m[o.id] = o.views || 0; }); return m; }).catch(function () { return {}; }); return viewsP; }
  function popular(posts, views, n) {
    var arr = posts.slice().sort(function (a, b) { var d = (views[b.slug || b.id] || 0) - (views[a.slug || a.id] || 0); return d || Date.parse(b.publishedAt || 0) - Date.parse(a.publishedAt || 0); });
    return arr.slice(0, n);
  }
  function hit(slug) {
    try { if (sessionStorage.getItem("ffb_v_" + slug)) return; sessionStorage.setItem("ffb_v_" + slug, "1"); } catch (e) {}
    var name = "projects/" + PROJECT + "/databases/(default)/documents/postViews/" + slug;
    fetch("https://firestore.googleapis.com/v1/projects/" + PROJECT + "/databases/(default)/documents:commit" + key(), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ writes: [{ transform: { document: name, fieldTransforms: [{ fieldPath: "views", increment: { integerValue: "1" } }] } }] }) }).catch(function () {});
  }
  var banP = null;
  function getBanner() { if (!banP) banP = rawBrand().then(function (b) { if (b && b.banner) return b.banner; if (b === null || b === undefined) return sample().then(function (s) { return (s.brand || {}).banner || null; }); return null; }).catch(function () { return null; }); return banP; }
  var usageP = null;
  function hubUsage() { if (!usageP) usageP = http(BASE + "/pageViews" + key() + "&pageSize=300").then(function (r) { var s = 0, n = 0; (r.documents || []).forEach(function (d) { var o = decDoc(d); s += o.views || 0; n++; }); return { total: s, tools: n }; }).catch(function () { return null; }); return usageP; }

  // ---------------- güvenli Markdown ----------------
  function inline(s) {
    s = esc(s);
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    s = s.replace(/!\[([^\]]*)\]\((https:\/\/[^\s)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');
    s = s.replace(/\[([^\]]+)\]\(((?:https?:\/\/|\/|#|mailto:)[^\s)]*)\)/g, function (m, a, u) { return '<a href="' + u + '"' + (/^https?:/.test(u) ? ' rel="noopener"' : "") + ">" + a + "</a>"; });
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
    return s;
  }
  function md(src) {
    var lines = String(src || "").replace(/\r/g, "").split("\n"), out = [], i = 0;
    function para(buf) { if (buf.length) out.push("<p>" + inline(buf.join(" ")) + "</p>"); }
    var buf = [];
    while (i < lines.length) {
      var l = lines[i], m;
      if (/^```/.test(l)) { para(buf); buf = []; var code = []; i++; while (i < lines.length && !/^```/.test(lines[i])) code.push(lines[i++]); i++; out.push("<pre><code>" + esc(code.join("\n")) + "</code></pre>"); continue; }
      if ((m = /^(#{1,3})\s+(.*)$/.exec(l))) { para(buf); buf = []; var lv = m[1].length + 1; out.push("<h" + lv + ">" + inline(m[2]) + "</h" + lv + ">"); i++; continue; }
      if (/^>\s?/.test(l)) { para(buf); buf = []; var q = []; while (i < lines.length && /^>\s?/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, "")); out.push("<blockquote>" + inline(q.join(" ")) + "</blockquote>"); continue; }
      if (/^\s*([-*])\s+/.test(l)) { para(buf); buf = []; var u = []; while (i < lines.length && /^\s*([-*])\s+/.test(lines[i])) u.push("<li>" + inline(lines[i++].replace(/^\s*[-*]\s+/, "")) + "</li>"); out.push("<ul>" + u.join("") + "</ul>"); continue; }
      if (/^\s*\d+\.\s+/.test(l)) { para(buf); buf = []; var o = []; while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) o.push("<li>" + inline(lines[i++].replace(/^\s*\d+\.\s+/, "")) + "</li>"); out.push("<ol>" + o.join("") + "</ol>"); continue; }
      if (/^---+\s*$/.test(l)) { para(buf); buf = []; out.push("<hr>"); i++; continue; } /* taste-skill-ignore */
      if (!l.trim()) { para(buf); buf = []; i++; continue; }
      buf.push(l.trim()); i++;
    }
    para(buf); return out.join("\n");
  }

  // ---------------- ortak metinler ----------------
  extend({
    tr: { navHome: "Ana Sayfa", navProjects: "Projeler", navBlog: "Blog", navAbout: "Hakkımızda", navContact: "İletişim", copyL: "E-postayı kopyala", copied: "E-posta kopyalandı", copyFail: "Kopyalanamadı", fdPages: "Sitedeki sayfalar.", fdLegal: "Gizlilik ve kullanım metinleri.", fdSocial: "Güncel gelişmeleri buradan takip edin.", fdContact: "Soru ve önerileriniz için bize ulaşın.", fBionluk: "Bionluk sayfamız", menu: "Menü", close: "Kapat",
      fPages: "Sayfalar", fLegal: "Yasal", fSocial: "Sosyal medya", fContact: "İletişim", fPrivacy: "Gizlilik politikası", fKvkk: "KVKK aydınlatma metni", fTerms: "Kullanım şartları", fHub: "Araçlar (Hub)", fWork: "Birlikte çalışalım",
      legalLine: "© {y} FF-App Labs. Tüm hakları saklıdır.", skip: "Ana içeriğe geç",
      fName: "Adınız", fEmail: "E-posta adresiniz", fType: "Ne yapmak istiyorsunuz?", fMsg: "Kısaca anlatın", fSend: "Gönder", fSending: "Gönderiliyor…",
      tWeb: "Web sitesi", tTool: "Web aracı / hesaplayıcı", tApp: "Uygulama", tOther: "Başka bir şey",
      fConsent: "<a href=\"/kvkk/\">KVKK aydınlatma metnini</a> okudum; mesajım yanıt vermek için saklanır.",
      fOk: "Mesajınız alındı. En kısa sürede e-postanıza dönüş yapacağız.", fFail: "Gönderilemedi. Birazdan yeniden deneyin ya da e-posta yazın.", fWait: "Çok hızlı gönderiyorsunuz, biraz bekleyin.", fBadMail: "Geçerli bir e-posta adresi yazın.", fShort: "Mesaj en az 3 karakter olmalı.", fNeedName: "Adınızı yazın.", fNeedConsent: "Devam etmek için onay kutusunu işaretleyin.",
      reads: "okunma", min: "dk okuma", notFound: "Sayfa bulunamadı.", back: "Ana sayfa" },
    en: { navHome: "Home", navProjects: "Projects", navBlog: "Blog", navAbout: "About", navContact: "Contact", copyL: "Copy email", copied: "Email copied", copyFail: "Could not copy", fdPages: "Pages on this site.", fdLegal: "Privacy and usage texts.", fdSocial: "Follow the latest updates here.", fdContact: "Reach us with questions and ideas.", fBionluk: "Our Bionluk page", menu: "Menu", close: "Close",
      fPages: "Pages", fLegal: "Legal", fSocial: "Social", fContact: "Contact", fPrivacy: "Privacy policy", fKvkk: "KVKK notice", fTerms: "Terms of use", fHub: "Tools (Hub)", fWork: "Work with me",
      legalLine: "© {y} FF-App Labs. All rights reserved.", skip: "Skip to content",
      fName: "Your name", fEmail: "Your email", fType: "What would you like to build?", fMsg: "Tell me briefly", fSend: "Send", fSending: "Sending…",
      tWeb: "Website", tTool: "Web tool / calculator", tApp: "App", tOther: "Something else",
      fConsent: "I have read the <a href=\"/kvkk/\">KVKK notice</a>; my message is stored so I can be answered.",
      fOk: "Message received. We will reply to your email soon.", fFail: "Could not send. Try again shortly or email directly.", fWait: "You are sending too fast. Please wait a moment.", fBadMail: "Enter a valid email address.", fShort: "Message must be at least 3 characters.", fNeedName: "Enter your name.", fNeedConsent: "Tick the box to continue.",
      reads: "reads", min: "min read", notFound: "Page not found.", back: "Home" }
  });

  // ---------------- üst bilgi / alt bilgi ----------------
  function wireChrome() {
    var bar = document.querySelector(".bar");
    if (bar) {
      var mb = bar.querySelector(".menu");
      if (mb) mb.addEventListener("click", function () { var o = bar.classList.toggle("open"); mb.setAttribute("aria-expanded", o ? "true" : "false"); mb.textContent = t(o ? "close" : "menu"); document.body.style.overflow = o ? "hidden" : ""; });
      bar.querySelectorAll("nav a").forEach(function (a) { a.addEventListener("click", function () { bar.classList.remove("open"); document.body.style.overflow = ""; if (mb) { mb.textContent = t("menu"); mb.setAttribute("aria-expanded", "false"); } }); });
    }
    var lb = document.getElementById("langBtn"); if (lb) lb.addEventListener("click", function () { setLang(lang() === "tr" ? "en" : "tr"); });
    wireLangSel();
    var cur = location.pathname.replace(/\/index\.html$/, "/");
    document.querySelectorAll(".subnav a[href]").forEach(function (a) { var h = a.getAttribute("href"); if (h !== "/" && cur.indexOf(h) === 0) a.setAttribute("aria-current", "page"); });
    var y = document.querySelector("[data-year]"); if (y) { y.textContent = t("legalLine").replace("{y}", new Date().getFullYear()); document.addEventListener("ffb:lang", function () { y.textContent = t("legalLine").replace("{y}", new Date().getFullYear()); }); }
    getBrand().then(function (b) { BRAND = b; wireBrand(document); });
    var cp = document.getElementById("copyMail");
    if (cp) {
      var live = document.createElement("span"); live.setAttribute("aria-live", "polite"); live.setAttribute("role", "status"); live.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap"; cp.parentNode.appendChild(live);
      cp.addEventListener("click", function () {
        var m = (BRAND && BRAND.email) || "contact@ffapplabs.com";
        function done(okk) { live.textContent = ""; setTimeout(function () { live.textContent = t(okk ? "copied" : "copyFail"); }, 30); if (okk) { cp.textContent = "\u2713"; setTimeout(function () { cp.textContent = "\u29c9"; }, 1600); } }
        function legacy() { try { var ta = document.createElement("textarea"); ta.value = m; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(ta); ta.select(); var r = document.execCommand("copy"); ta.remove(); done(r); } catch (e) { done(false); } }
        if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(m).then(function () { done(true); }, legacy); else legacy();
      });
    }
    document.querySelectorAll(".sc-link[data-user]").forEach(function (a) {
      var n = a.querySelector(".nm"); if (!n) return; var orig = n.textContent, tm;
      a.addEventListener("mouseenter", function () { n.classList.add("swap"); clearTimeout(tm); tm = setTimeout(function () { n.textContent = a.getAttribute("data-user"); n.classList.add("user"); n.classList.remove("swap"); }, 150); });
      a.addEventListener("mouseleave", function () { n.classList.add("swap"); clearTimeout(tm); tm = setTimeout(function () { n.textContent = orig; n.classList.remove("user"); n.classList.remove("swap"); }, 150); });
    });
    // e-posta uygulaması açılmazsa forma yönlendir
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[data-mail-fallback]"); if (!a) return; e.preventDefault();
      var hid = false, f = function () { hid = true; }; document.addEventListener("visibilitychange", f); window.addEventListener("blur", f);
      location.href = a.getAttribute("href");
      setTimeout(function () { document.removeEventListener("visibilitychange", f); window.removeEventListener("blur", f); if (!hid) location.href = "/iletisim/?konu=" + (a.getAttribute("data-mail-fallback") || "is"); }, 1500);
    });
  }
  var BRAND = null;
  function userOf(u) { try { var x = new URL(u), p = x.pathname.split("/").filter(Boolean); if (x.search.indexOf("id=") > -1) return ""; var l = p[p.length - 1] || ""; return l ? (l.charAt(0) === "@" ? l : "@" + l) : ""; } catch (e) { return ""; } }
  function wireBrand(root) {
    var b = BRAND; if (!b) return; root = root || document;
    root.querySelectorAll("[data-brand-email]").forEach(function (a) { a.href = "mailto:" + b.email; if (!a.hasAttribute("data-keep")) a.textContent = b.email; });
    root.querySelectorAll("[data-brand-bionluk]").forEach(function (a) { a.href = b.bionluk; a.rel = "noopener"; a.target = "_blank"; });
    root.querySelectorAll("[data-brand-hub]").forEach(function (a) { a.href = b.hubUrl || HUB; });
    root.querySelectorAll("[data-social]").forEach(function (a) { var u = (b.social || {})[a.getAttribute("data-social")]; if (u) { a.href = u; a.hidden = false; var us = userOf(u); if (us) a.setAttribute("data-user", us); } else if (a.hasAttribute("data-optional")) a.hidden = true; });
  }

  // ---------------- giriş animasyonları ----------------
  function reveal(root) {
    var els = (root || document).querySelectorAll(".rv:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    els.forEach(function (e) { io.observe(e); });
  }

  // ---------------- iletişim formu (contactMessages) ----------------
  // iletişim formu mesajını Firestore'a yazar (mountForm ile aynı kayıt biçimi)
  function sendMessage(name, mail, text, tag) {
    return fetch(BASE + "/contactMessages" + key(), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fields: { name: { stringValue: String(name).slice(0, 80) }, email: { stringValue: mail }, message: { stringValue: ("[Marka sitesi" + (tag ? " \u00b7 " + tag : "") + "] " + text).slice(0, 1000) }, date: { timestampValue: new Date().toISOString() }, lang: { stringValue: lang() }, status: { stringValue: "new" } } }) })
      .then(function (r) { if (!r.ok) throw new Error("http " + r.status); });
  }
  function mountForm(form) {
    var box = form.querySelector(".status"), btn = form.querySelector("button[type=submit]");
    function say(kind, k, fld) { box.className = "status " + kind; box.textContent = t(k); box.hidden = false; if (fld) { fld.setAttribute("aria-invalid", "true"); fld.focus(); } }
    var TOP = { web: 0, arac: 1, uygulama: 2, diger: 3 }; try { var kq = new URLSearchParams(location.search).get("konu"); if (kq && form.elements.type && TOP[kq] != null) form.elements.type.selectedIndex = TOP[kq]; } catch (x) {}
    form.addEventListener("submit", function (e) {
      e.preventDefault(); box.hidden = true;
      var f = form.elements; Array.prototype.forEach.call(form.querySelectorAll("[aria-invalid]"), function (n) { n.removeAttribute("aria-invalid"); });
      if (f.website && f.website.value) return; // tuzak alan: botlar doldurur
      var name = f.name.value.trim(), mail = f.email.value.trim(), msg = f.message.value.trim(), typ = f.type ? f.type.options[f.type.selectedIndex].text : "";
      if (!name) return say("bad", "fNeedName", f.name);
      if (!/^.+@.+\..+$/.test(mail) || mail.length > 120) return say("bad", "fBadMail", f.email);
      if (msg.length < 3) return say("bad", "fShort", f.message);
      if (f.consent && !f.consent.checked) return say("bad", "fNeedConsent", f.consent);
      try { var last = Number(localStorage.getItem("ffb_last") || 0); if (Date.now() - last < 30000) return say("bad", "fWait"); } catch (x) {}
      var text = ("[Marka sitesi" + (typ ? " · " + typ : "") + "] " + msg).slice(0, 1000);
      btn.disabled = true; btn.textContent = t("fSending");
      fetch(BASE + "/contactMessages" + key(), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fields: { name: { stringValue: name.slice(0, 80) }, email: { stringValue: mail }, message: { stringValue: text }, date: { timestampValue: new Date().toISOString() }, lang: { stringValue: lang() }, status: { stringValue: "new" } } }) })
        .then(function (r) { if (!r.ok) throw new Error("http " + r.status); try { localStorage.setItem("ffb_last", String(Date.now())); } catch (x) {} form.reset(); say("ok", "fOk"); })
        .catch(function () { say("bad", "fFail"); })
        .then(function () { btn.disabled = false; btn.textContent = t("fSend"); });
    });
    document.addEventListener("ffb:lang", function () { if (!btn.disabled) btn.textContent = t("fSend"); });
  }

  window.FFB = { PROJECT: PROJECT, extend: extend, t: t, lang: lang, setLang: setLang, applyI18n: applyI18n, esc: esc, pick: pick, fmtDate: fmtDate, nf: nf, md: md,
    getBrand: getBrand, getProjects: getProjects, getPosts: getPosts, getPost: getPost, getViews: getViews, getBanner: getBanner, popular: popular, hit: hit, hubUsage: hubUsage, reveal: reveal, mountForm: mountForm, sendMessage: sendMessage, HUB: HUB };
  document.addEventListener("DOMContentLoaded", function () { wireChrome(); });
})();
