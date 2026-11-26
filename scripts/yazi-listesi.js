// Yazı listelerini (arama motorlarının JavaScript çalıştırmadan görebileceği düz linkler) veri/icerik.json'dan üretir.
// Kullanım (proje kökünde):  node scripts/yazi-listesi.js
// blog/index.html → <!--SON-YAZILAR-->…<!--/SON-YAZILAR--> arası: tüm yazılar
// Tüm sayfaların footer'ı → <!--FOOTER-YAZILAR-->…<!--/FOOTER-YAZILAR--> arası: "Laboratuvardan notlar"
//   ESIK'ten fazla yazı varsa ilk GORUNEN kadarı açık, kalanı "Daha fazla" düğmesiyle açılır.
const fs = require("fs"), path = require("path");
const ESIK = 10, GORUNEN = 5;
const kok = path.join(__dirname, "..");
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const veri = JSON.parse(fs.readFileSync(path.join(kok, "veri", "icerik.json"), "utf8"));
const yazilar = (veri.posts || []).filter((p) => p && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug || "") && p.status !== "draft" && p.published !== false)
  .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
const li = (l) => l.map((p) => `<li><a href="/blog/${esc(p.slug)}/">${esc(p.title)}</a></li>`).join("");
const liste = (l, sinif) => `<ul class="${sinif}">${li(l)}</ul>`;
function footerHtml() {
  if (!yazilar.length) return "";
  if (yazilar.length <= ESIK) return `<ul>${li(yazilar)}</ul><a class="fn-all" href="/blog/" data-i18n="fAllPosts">Tüm yazılar →</a>`;
  return `<ul>${li(yazilar.slice(0, GORUNEN))}</ul><ul class="fn-rest" id="fnRest">${li(yazilar.slice(GORUNEN))}</ul>` +
    `<button class="fn-more" type="button" aria-expanded="false" aria-controls="fnRest"><b data-fn-label>Daha fazla</b><span aria-hidden="true">↓</span></button>` +
    `<br><a class="fn-all" href="/blog/" data-i18n="fAllPosts">Tüm yazılar →</a>`;
}
function degistir(dosya, isaret, html, zorunlu) {
  const f = path.join(kok, dosya); let s = fs.readFileSync(f, "utf8");
  const re = new RegExp(`<!--${isaret}-->[\\s\\S]*?<!--\\/${isaret}-->`);
  if (!re.test(s)) { if (zorunlu) throw new Error(dosya + ": " + isaret + " işareti yok"); return false; }
  s = s.replace(re, () => `<!--${isaret}-->${html}<!--/${isaret}-->`);
  fs.writeFileSync(f, s); return true;
}
function htmlDosyalari(d, acc = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name.startsWith(".") || e.name === "node_modules" || e.name === "api") continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) htmlDosyalari(p, acc); else if (e.name.endsWith(".html")) acc.push(path.relative(kok, p));
  }
  return acc;
}
degistir("blog/index.html", "SON-YAZILAR", liste(yazilar, "son-liste"), true);
const fh = footerHtml(); let n = 0;
for (const d of htmlDosyalari(kok)) if (degistir(d, "FOOTER-YAZILAR", fh, false)) n++;
console.log(yazilar.length + " yazı · blog listesi ve " + n + " sayfanın footer'ı güncellendi");
