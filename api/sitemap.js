// /sitemap-blog.xml: yayındaki tüm yazıları veri dosyasından (yoksa Firestore'dan) okuyup anında üretir.
const { posts, esc } = require("./_fs");
const DOMAIN = "https://ffapplabs.com";
module.exports = async (req, res) => {
  let list = [];
  try { list = await posts(); } catch (e) { res.statusCode = 502; res.setHeader("Cache-Control", "no-store"); return res.end("Yazılar okunamadı"); }
  const day = (v) => { const d = new Date(v); return isNaN(d) ? "" : d.toISOString().slice(0, 10); };
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    list.filter((p) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)).map((p) => {
      const lm = day(p.updatedAt || p.publishedAt);
      return `<url><loc>${DOMAIN}/blog/${esc(p.slug)}/</loc>${lm ? `<lastmod>${lm}</lastmod>` : ""}<priority>0.6</priority></url>`;
    }).join("\n") + "\n</urlset>\n";
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=86400");
  res.end(xml);
};
