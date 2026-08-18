// ==========================================================
// site-config.js — SADECE VERİ (site adı, footer linkleri, logo).
// Bu veriyi ekrana asıl çizen dosya footer.js'tir.
// Buradaki değerleri değiştirmek, sitedeki HER sayfayı günceller.
// ==========================================================

const siteConfig = {
  siteName: "FF-App Labs",
  copyrightYear: new Date().getFullYear(),

  // Bu sitede reklam/AdSense yok, bu yüzden false — footer.js'teki
  // ilgili kontrol zaten hiçbir şey bulamayacağı için etkisiz kalır.
  showAdPlaceholders: false,

  // ---- Footer: 3 sütun (Sayfalar, Sosyal Medya, İletişim) ----
  footerCorporate: [
    { url: "/", label: "Ana Sayfa" },
    { url: "/urunlerimiz/", label: "Ürünlerimiz" },
    { url: "/gizlilik-politikasi", label: "Gizlilik Politikası" }
  ],

  footerSocial: [
    { name: "Instagram", url: "https://instagram.com/ffapplabs", icon: "instagram" },
    { name: "TikTok", url: "https://tiktok.com/@ffapplabsadmin", icon: "tiktok" },
    { name: "X (Twitter)", url: "https://x.com/ffapplabs", icon: "x" },
    { name: "Facebook", url: "https://www.facebook.com/profile.php?id=61592924292148", icon: "facebook" }
  ],

  footerContact: {
    email: "contact@ffapplabs.com",
    phone: "", // henüz yok, boş bırakılırsa "Yakında" gösterilir
    telegram: "" // henüz yok, boş bırakılırsa "Yakında" gösterilir
  },

  // Navbar'daki logo (özel tasarlanmış şerit logo, ikon+yazı bir arada)
  logoStripImagePath: "assets/logo-strip.png"
};
