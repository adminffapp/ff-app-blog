// Yazı listelerini (arama motorlarının JavaScript çalıştırmadan görebileceği düz linkler) veri/icerik.json'dan üretir.
// Kullanım (proje kökünde):  node scripts/yazi-listesi.js
// index.html  → <!--SON-YAZILAR-->…<!--/SON-YAZILAR--> arası: en yeni 5 yazı
// blog/index.html → aynı işaretler arası: tüm yazılar
const fs = require("fs"), path = require("path");
const kok = path.join(__dirname, "..");
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const veri = JSON.parse(fs.readFileSync(path.join(kok, "veri", "icerik.json"), "utf8"));
const yazilar = (veri.posts || []).filter((p) => p && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug || "") && p.status !== "draft" && p.published !== false)
  .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
const liste = (l, sinif) => `<ul class="${sinif}">${l.map((p) => `<li><a href="/blog/${esc(p.slug)}/">${esc(p.title)}</a></li>`).join("")}</ul>`;
function yaz(dosya, html) {
  const f = path.join(kok, dosya); let s = fs.readFileSync(f, "utf8");
  const re = /<!--SON-YAZILAR-->[\s\S]*?<!--\/SON-YAZILAR-->/;
  if (!re.test(s)) throw new Error(dosya + ": işaret yok");
  s = s.replace(re, () => `<!--SON-YAZILAR-->${html}<!--/SON-YAZILAR-->`);
  fs.writeFileSync(f, s);
  console.log(dosya, "güncellendi");
}
yaz("index.html", liste(yazilar.slice(0, 5), "son-liste"));
yaz("blog/index.html", liste(yazilar, "son-liste"));
