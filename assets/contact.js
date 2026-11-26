(function(){
var D={tr:{ct_back:"← Ana sayfaya dön",ct_pill:"Bir merhabayla başlar.",ct_h:"İyi fikirler, <em>birlikte büyür.</em>",
ct_lead:"Aklınızda bir fikir, işinizi yavaşlatan bir süreç ya da sadece bir soru mu var? Anlatın, nereden başlayacağımızı birlikte bulalım.",
ct_note:"Teknik bir dokümana ihtiyacınız yok. <b>“Şu işi daha kolay yapabilir miyim?”</b> demeniz yeterli.",
ct_kMail:"Doğrudan yazmak isterseniz",ct_copy:"E-postayı kopyala",ct_copied:"Kopyalandı",ct_bnT:"Bionluk üzerinden başlayın",ct_bnS:"Ödemenin ve teslimin güvence altında olmasını isteyenler için.",
ct_direct:"Arada katmanlar yok.<br>Doğrudan geliştiriciyle iletişim.",ct_fH:"Biraz projenizden bahsedelim.",ct_fSub:"Küçük bir başlangıç için birkaç satır yeter.",
ct_topic:"Ne üzerine konuşalım?",ct_t1:"Özel yazılım",ct_t2:"Web sitesi",ct_t3:"Mobil uygulama",ct_t4:"Bir fikrim var",
ct_lName:"Adınız",ct_lEmail:"E-posta adresiniz",ct_lMsg:"Aklınızdakini anlatın",ct_phName:"Size nasıl hitap edelim?",ct_phEmail:"siz@ornek.com",ct_phMsg:"Ne yapmak istiyorsunuz? Şu anda sizi en çok zorlayan şey ne?",
ct_hint:"En az 10 karakter. Detayları sonra konuşuruz.",
ct_consent:'<a href="/kvkk/" target="_blank" rel="noopener">KVKK Aydınlatma Metni</a>\'ni okudum; bilgilerimin yanıt verilmesi amacıyla işlenmesini kabul ediyorum.',
ct_send:"Mesajı gönder",ct_sending:"Gönderiliyor…",ct_errName:"Lütfen adınızı yazın.",ct_errEmail:"Geçerli bir e-posta adresi yazın.",ct_errMsg:"Mesajınız en az 10 karakter olmalı.",ct_errOk:"Devam etmek için onay vermelisiniz.",
ct_failMsg:"Gönderilemedi. Lütfen biraz sonra tekrar deneyin ya da e-posta ile yazın.",ct_wait:"Çok hızlı gönderiyorsunuz, biraz bekleyin.",
ct_doneH:"Mesajınız ulaştı.",ct_doneP:"Teşekkürler. Mesajınızı okuyup genelde 1–2 gün içinde e-posta ile dönüş yapıyorum.",ct_again:"Yeni mesaj yaz",
ct_nextH:"Peki, sonra ne oluyor?",ct_nextP:"Net adımlar. Gereksiz karmaşa olmadan.",ct_n1h:"Önce sizi dinliyorum",ct_n1:"İhtiyacınızı anlamak için mesajınızı inceliyor, gerekirse birkaç soru soruyorum.",
ct_n2h:"Birlikte netleştiriyoruz",ct_n2:"Yapılacakları, kapsamı ve en uygun başlangıç noktasını konuşuyoruz.",ct_n3h:"Yol haritasını çıkarıyoruz",ct_n3:"İlerlemeye karar verirsek süreyi, ücreti ve teslim adımlarını belirliyoruz.",
ct_relTitle:"İlgili sayfalar",ct_relPrivacy:"Gizlilik Politikası",ct_relKvkk:"KVKK Aydınlatma Metni",ct_relTerms:"Kullanım Şartları"},
en:{ct_back:"← Back to home",ct_pill:"It starts with a hello.",ct_h:"Good ideas <em>grow together.</em>",
ct_lead:"Have an idea, a process that slows you down, or just a question? Tell me, and we'll find where to start together.",
ct_note:"You don't need a technical document. Asking <b>“Could this task be easier?”</b> is enough.",
ct_kMail:"If you'd rather write directly",ct_copy:"Copy email",ct_copied:"Copied",ct_bnT:"Start on Bionluk",ct_bnS:"For those who want payment and delivery protected.",
ct_direct:"No layers in between.<br>Talk straight to the developer.",ct_fH:"Tell me a little about your project.",ct_fSub:"A few lines are enough for a small start.",
ct_topic:"What shall we talk about?",ct_t1:"Custom software",ct_t2:"Website",ct_t3:"Mobile app",ct_t4:"I have an idea",
ct_lName:"Your name",ct_lEmail:"Your email",ct_lMsg:"Tell me what's on your mind",ct_phName:"What should I call you?",ct_phEmail:"you@example.com",ct_phMsg:"What would you like to do? What is slowing you down most right now?",
ct_hint:"At least 10 characters. We'll go into detail later.",
ct_consent:'I have read the <a href="/kvkk/" target="_blank" rel="noopener">KVKK Disclosure</a> and agree to my details being processed to reply to me.',
ct_send:"Send message",ct_sending:"Sending…",ct_errName:"Please enter your name.",ct_errEmail:"Enter a valid email address.",ct_errMsg:"Your message must be at least 10 characters.",ct_errOk:"You must agree to continue.",
ct_failMsg:"Could not send. Please try again later or write by email.",ct_wait:"You are sending too fast. Please wait a moment.",
ct_doneH:"Your message arrived.",ct_doneP:"Thank you. I read every message and usually reply by email within 1–2 days.",ct_again:"Write a new message",
ct_nextH:"So, what happens next?",ct_nextP:"Clear steps. No needless complexity.",ct_n1h:"I listen first",ct_n1:"I read your message to understand what you need and ask a few questions if necessary.",
ct_n2h:"We make it clear together",ct_n2:"We talk through what needs doing, the scope and the best place to start.",ct_n3h:"We map the way",ct_n3:"If we decide to go ahead, we set the timing, price and delivery steps.",
ct_relTitle:"Related pages",ct_relPrivacy:"Privacy Policy",ct_relKvkk:"KVKK Disclosure",ct_relTerms:"Terms of Use"}};
FFB.extend(D);
var $=function(i){return document.getElementById(i);},T=function(k){return FFB.t(k);};
var TOPICS={yazilim:"Özel yazılım",web:"Web sitesi",mobil:"Mobil uygulama",fikir:"Fikir"};
var DEMO=/[?&]demo=1\b/.test(location.search);
try{var q=new URLSearchParams(location.search).get("konu");var r=q&&document.querySelector('input[name=topic][value="'+q.replace(/[^a-z]/g,"")+'"]');if(r)r.checked=true;}catch(x){}
function tag(){var c=document.querySelector("input[name=topic]:checked");if(c)return TOPICS[c.value]||"";try{return new URLSearchParams(location.search).get("konu")==="is"?"İş":"";}catch(x){return "";}}
function setErr(id,f,m){$(id).textContent=m||"";if(f){f.setAttribute("aria-invalid",m?"true":"false");var w=f.closest(".ct2-field");if(w)w.classList.toggle("is-bad",!!m);}}
function validate(silent){
 var n=$("fName").value.trim(),e=$("fEmail").value.trim(),m=$("fMsg").value.trim();
 var eN=n.length<2?T("ct_errName"):"",eE=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)?"":T("ct_errEmail"),eM=m.length<10?T("ct_errMsg"):"",eO=$("fOk").checked?"":T("ct_errOk");
 setErr("eName",$("fName"),eN);setErr("eEmail",$("fEmail"),eE);setErr("eMsg",$("fMsg"),eM);setErr("eOk",$("fOk"),eO);
 if(!silent){var f=[["fName",eN],["fEmail",eE],["fMsg",eM],["fOk",eO]].filter(function(x){return x[1];})[0];if(f)$(f[0]).focus();}
 return !(eN||eE||eM||eO);}
function status(cls,t){var s=$("ctStatus");s.className="ct2-status "+(cls||"");s.textContent=t||"";}
["fName","fEmail","fMsg"].forEach(function(id){$(id).addEventListener("input",function(){if($(id).getAttribute("aria-invalid")==="true")validate(true);});});
$("fOk").addEventListener("change",function(){if($("eOk").textContent)validate(true);});
$("fMsg").addEventListener("input",function(){$("ctCount").textContent=$("fMsg").value.length+"/950";});
$("ctCopy").addEventListener("click",function(){var b=this,m=$("ctMail").textContent.trim();var done=function(){b.classList.add("ok");b.setAttribute("aria-label",T("ct_copied"));setTimeout(function(){b.classList.remove("ok");b.setAttribute("aria-label",T("ct_copy"));},1600);};
 if(navigator.clipboard)navigator.clipboard.writeText(m).then(done,function(){});});
$("ctForm").addEventListener("submit",function(e){
 e.preventDefault();status("","");if($("fHp").value)return;if(!validate(false))return;
 try{if(Date.now()-Number(localStorage.getItem("ffb_last")||0)<30000&&!DEMO){status("bad",T("ct_wait"));return;}}catch(x){}
 var btn=$("ctSend");btn.disabled=true;btn.textContent=T("ct_sending");
 var p=DEMO?new Promise(function(r){setTimeout(r,400);}):FFB.sendMessage($("fName").value.trim(),$("fEmail").value.trim(),$("fMsg").value.trim(),tag());
 p.then(function(){try{localStorage.setItem("ffb_last",String(Date.now()));}catch(x){}
   $("ctForm").hidden=true;$("ctDone").hidden=false;$("ctDone").focus();},
  function(){status("bad",T("ct_failMsg"));}).then(function(){btn.disabled=false;btn.textContent=T("ct_send");});});
$("ctAgain").addEventListener("click",function(){$("ctForm").reset();$("ctCount").textContent="0/950";$("ctDone").hidden=true;$("ctForm").hidden=false;$("fName").focus();});
document.addEventListener("ffb:lang",function(){if($("ctSend").disabled)$("ctSend").textContent=T("ct_sending");if(document.querySelector(".ct2-err:not(:empty)"))validate(true);});
document.addEventListener("DOMContentLoaded",function(){FFB.applyI18n();FFB.reveal();FFB.getBrand().then(function(b){if(b&&b.email){$("ctMail").textContent=b.email;$("ctMail").href="mailto:"+b.email;}});});
})();
