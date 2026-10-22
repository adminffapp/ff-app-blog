// Firestore (site-biolink) okuma yardımcıları: yayındaki yazıları getirir.
const PROJECT = "site-biolink", KEY = "AIzaSyB1_1SFf59n3dtsrwlQOAZ8v9O2Ip0lzgA";
function dec(v) {
  if (!v) return null;
  if ("stringValue" in v) return v.stringValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return v.doubleValue;
  if ("booleanValue" in v) return v.booleanValue;
  if ("timestampValue" in v) return v.timestampValue;
  if ("arrayValue" in v) return (v.arrayValue.values || []).map(dec);
  if ("mapValue" in v) { const o = {}; for (const k in (v.mapValue.fields || {})) o[k] = dec(v.mapValue.fields[k]); return o; }
  return null;
}
async function posts() {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents:runQuery?key=${KEY}`;
  const q = { structuredQuery: { from: [{ collectionId: "posts" }], where: { fieldFilter: { field: { fieldPath: "published" }, op: "EQUAL", value: { booleanValue: true } } }, limit: 300 } };
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(q) });
  if (!r.ok) throw new Error("firestore " + r.status);
  const rows = await r.json();
  return rows.filter((x) => x.document).map((x) => {
    const o = {}, f = x.document.fields || {};
    for (const k in f) o[k] = dec(f[k]);
    o.id = String(x.document.name || "").split("/").pop();
    o.slug = o.slug || o.id;
    return o;
  });
}
const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
module.exports = { posts, esc };
