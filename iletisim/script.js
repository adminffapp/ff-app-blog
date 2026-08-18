// ==========================================================
// iletisim/script.js — FF-App Labs marka sitesi
// Hub'daki İletişim formuyla AYNI Google Apps Script Web App'e
// gönderiyor (tek bir gelen kutusunda/Sheets'te birleşsin diye).
//
// Konu (İş veya Ortaklık / Geri Bildirim), kullanıcıya sorulmuyor —
// hangi butondan bu sayfaya gelindiğine göre URL'deki ?konu= parametresinden
// otomatik belirleniyor.
// ==========================================================

// ---- 1. URL'den konuyu oku, rozeti ve mesaj etiketini ayarla ----
const params = new URLSearchParams(window.location.search);
const konuParam = params.get("konu"); // "is" | "geri-bildirim" | yoksa genel

let subjectLabel = "Genel Mesaj";
let subjectTag = "Genel";

if (konuParam === "is") {
  subjectLabel = "İş veya Ortaklık";
  subjectTag = "İş veya Ortaklık — Öncelikli";
} else if (konuParam === "geri-bildirim") {
  subjectLabel = "Geri Bildirim";
  subjectTag = "Geri Bildirim";
}

document.getElementById("subjectBadge").textContent = subjectLabel;

// ---- 2. Google Apps Script Web App URL'si (Hub ile aynı) ----
const SHEETS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbya8XuO_fCW5WbwVGyVGabZ1oOrOYTD49hWF40Y9gig10eSaiFVELiAKANegqY2IHwW/exec";

// ---- 3. DOM referansları ----
const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const messageInput = document.getElementById("messageInput");
const websiteInput = document.getElementById("hfConfirmInput"); // bot tuzağı
const submitBtn = document.getElementById("submitBtn");
const statusMsg = document.getElementById("statusMsg");

// ---- 4. Form gönderimi ----
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Bot tuzağı doluysa sessizce hiçbir şey yapma
  if (websiteInput.value.trim() !== "") {
    return;
  }

  // Konu etiketi hem ayrı bir alan olarak hem de (eski uyumluluk için)
  // mesajın başında gönderiliyor
  const taggedMessage = `[FF-App Labs · ${subjectTag}]\n\n${messageInput.value.trim()}`;

  const formData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    message: taggedMessage,
    website: "",
    source: "ffapplabs.com",
    subject: subjectTag
  };

  submitBtn.disabled = true;
  statusMsg.textContent = "Gönderiliyor...";
  statusMsg.className = "status-msg";

  try {
    const res = await fetch(SHEETS_WEBAPP_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" }, // Apps Script CORS için text/plain gerektirir
      body: JSON.stringify(formData)
    });
    const resultJson = await res.json();

    if (resultJson.success) {
      statusMsg.textContent = "✓ Mesajınız alındı, teşekkürler!";
      statusMsg.className = "status-msg success";
      contactForm.reset();
    } else {
      console.error("Gönderim başarısız, sunucu mesajı:", resultJson.error);
      statusMsg.textContent = "✗ Bir hata oluştu, lütfen tekrar deneyin.";
      statusMsg.className = "status-msg error";
    }
  } catch (err) {
    console.error("Form gönderim hatası:", err);
    statusMsg.textContent = "✗ Bir hata oluştu, lütfen tekrar deneyin.";
    statusMsg.className = "status-msg error";
  } finally {
    submitBtn.disabled = false;
  }
});
