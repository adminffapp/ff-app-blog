// /blog/<yazi-adi>/: blog sayfasını yazıya özel başlık/açıklama/JSON-LD ile sunar; sayfadaki JS yazıyı açıp oraya kaydırır.
const fs = require("fs"), path = require("path");
const { posts, esc } = require("./_fs");
const DOMAIN = "https://ffapplabs.com";
async function template(req) {
  try { return fs.readFileSync(path.join(process.cwd(), "blog", "index.html"), "utf8"); } catch (e) {}
  const r = await fetch(`https://${req.headers["x-forwarded-host"] || req.headers.host}/blog/`);
  return r.text();
}
module.exports = async (req, res) => {
  let slug = String((req.query && req.query.slug) || "").replace(/\/+$/, "").toLowerCase();
  let html = await template(req);
  let p = null, failed = false;
  if (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) { try { p = (await posts()).find((x) => x.slug === slug) || null; } catch (e) { failed = true; } }
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  if (failed) { // veritabanı geçici olarak okunamadı: 404 değil 503 dön, arama motoru yazıyı dizinden çıkarmasın
    res.statusCode = 503; res.setHeader("Retry-After", "120"); res.setHeader("Cache-Control", "no-store");
    return res.end(html);
  }
  if (!p) {
    html = html.replace("</head>", '<meta name="robots" content="noindex"></head>');
    res.statusCode = 404; res.setHeader("Cache-Control", "public, s-maxage=60");
    return res.end(html);
  }
  const url = `${DOMAIN}/blog/${slug}/`, title = `${p.title} | FF-App Labs`, desc = String(p.excerpt || "").slice(0, 300);
  const img = p.cover && /^https:/.test(p.cover) ? p.cover : DOMAIN + "/assets/og.png";
  html = html
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(desc)}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`)
    .replace(/<meta property="og:type" content="website">/, '<meta property="og:type" content="article">')
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(desc)}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`)
    .replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${esc(img)}">`);
  const ld = { "@context": "https://schema.org", "@type": "BlogPosting", headline: p.title, description: desc, datePublished: p.publishedAt, dateModified: p.updatedAt || p.publishedAt, inLanguage: "tr", image: img, mainEntityOfPage: url, author: { "@type": "Organization", name: "FF-App Labs" }, publisher: { "@type": "Organization", name: "FF-App Labs" } };
  html = html.replace("</head>", `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script></head>`);
  // JS çalışmayan tarayıcılar ve arama botları için yazı metni (sayfadaki JS yüklenince liste bunun yerini alır)
  const inl = (s) => esc(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>").replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g, '<a href="$2">$1</a>');
  const paras = String(p.body || "").split(/\n{2,}/).map((s) => s.trim()).filter(Boolean).map((s) => { const h = s.match(/^(#{1,4})\s+(.+)$/); return h ? `<h3>${inl(h[2])}</h3>` : `<p>${inl(s).replace(/\n/g, "<br>")}</p>`; }).join("");
  html = html.replace('<div class="bgrid" id="plist"></div>', `<div class="bgrid" id="plist"><article class="prose"><h2>${esc(p.title)}</h2>${paras}</article></div>`);
  res.statusCode = 200;
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=86400");
  res.end(html);
};
