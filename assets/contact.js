(function(){
var D={tr:{
ct_heading:"Bize yazın",ct_intro:"Görüş, öneri, hata bildirimi ya da iş birliği — formu doldurun, size dönelim.",ct_cardTitle:"Bize ulaşın",
ct_kEmail:"E-posta",ct_kPhone:"Telefon",ct_soon:"Yakında",ct_lName:"Ad Soyad",ct_lEmail:"E-posta",ct_lMsg:"Mesajınız",
ct_phName:"Adınız ve soyadınız",ct_phEmail:"ornek@eposta.com",ct_phMsg:"Nasıl yardımcı olabiliriz?",
ct_consent:'<a href="/kvkk/" target="_blank" rel="noopener">KVKK Aydınlatma Metni</a>\'ni okudum; bilgilerimin yanıt verilmesi amacıyla işlenmesini kabul ediyorum.',
ct_send:"Gönder",ct_sending:"Gönderiliyor…",ct_back:"Ana sayfa",ct_relTitle:"İlgili sayfalar",ct_relPrivacy:"Gizlilik Politikası",ct_relKvkk:"KVKK Aydınlatma Metni",ct_relTerms:"Kullanım Şartları",
ct_errName:"Lütfen adınızı yazın.",ct_errEmail:"Geçerli bir e-posta adresi yazın.",ct_errMsg:"Mesajınız en az 10 karakter olmalı.",ct_errOk:"Devam etmek için onay vermelisiniz.",
ct_failMsg:"Gönderilemedi. Lütfen biraz sonra tekrar deneyin veya e-posta ile yazın.",ct_wait:"Çok hızlı gönderiyorsunuz, biraz bekleyin.",
ct_ownerTitle:"Alıcı",ct_senderTitle:"Gönderen",ct_greet:"Merhaba! Formu doldurun, mesajınızı doğrudan bize iletelim.",ct_flySending:"Mesajınız gönderiliyor…",
ct_flyDone:"Mesajınız FF-App Labs’a ulaştı. En kısa sürede dönüş yapacağız.",ct_flyClose:"Tamam",ct_pvName:"Adınız Soyadınız",ct_pvMail:"e-posta adresiniz",ct_pvMsg:"Mesajınız burada görünecek.",ct_pvTime:"Gönderim",
ct_role:"FF-App Labs ekibi",ct_reply:"Genelde 1–2 gün içinde yanıt"},
en:{
ct_heading:"Write to us",ct_intro:"Feedback, suggestions, bug reports or partnerships — fill in the form and we’ll get back to you.",ct_cardTitle:"Get in touch",
ct_kEmail:"Email",ct_kPhone:"Phone",ct_soon:"Coming soon",ct_lName:"Full name",ct_lEmail:"Email",ct_lMsg:"Your message",
ct_phName:"Your full name",ct_phEmail:"you@example.com",ct_phMsg:"How can we help?",
ct_consent:'I have read the <a href="/kvkk/" target="_blank" rel="noopener">KVKK Disclosure</a> and agree to my details being processed to reply to me.',
ct_send:"Send",ct_sending:"Sending…",ct_back:"Home",ct_relTitle:"Related pages",ct_relPrivacy:"Privacy Policy",ct_relKvkk:"KVKK Disclosure",ct_relTerms:"Terms of Use",
ct_errName:"Please enter your name.",ct_errEmail:"Enter a valid email address.",ct_errMsg:"Your message must be at least 10 characters.",ct_errOk:"You must agree to continue.",
ct_failMsg:"Could not send. Please try again later or email us.",ct_wait:"You are sending too fast. Please wait a moment.",
ct_ownerTitle:"Recipient",ct_senderTitle:"Sender",ct_greet:"Hi! Fill in the form and your message comes straight to us.",ct_flySending:"Sending your message…",
ct_flyDone:"Your message has reached FF-App Labs. We’ll reply as soon as we can.",ct_flyClose:"Done",ct_pvName:"Your full name",ct_pvMail:"your email address",ct_pvMsg:"Your message will appear here.",ct_pvTime:"Sent",
ct_role:"FF-App Labs team",ct_reply:"Usually replies within 1–2 days"}};
FFB.extend(D);
var $=function(i){return document.getElementById(i);},T=function(k){return FFB.t(k);},L=function(){return FFB.lang();};
var ICONS={instagram:"M12 2.2c3.2 0 3.6 0 4.8.1 3.2.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 4 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zm5.2-9.4a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z",tiktok:"M16.6 5.8A4.3 4.3 0 0115.5 3h-3.1v12.4a2.6 2.6 0 11-1.9-2.5V9.7a5.8 5.8 0 105 5.7V9a7.4 7.4 0 004.3 1.4V7.3a4.3 4.3 0 01-3.2-1.5z",x:"M18.2 2.3h3.3l-7.2 8.3 8.5 11.2h-6.7l-5.2-6.8-6 6.8H1.6l7.7-8.8L1.2 2.3H8l4.7 6.2zm-1.2 17.5h1.8L7 4.2H5.1z",facebook:"M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0022 12z"};
var NAMES={instagram:"Instagram",tiktok:"TikTok",x:"X",facebook:"Facebook"};
function brand(){FFB.getBrand().then(function(b){
 var m=$("ctMail");if(b.email){m.textContent=b.email;m.href="mailto:"+b.email;}
 var box=$("ctSocial");box.innerHTML="";var so=b.social||{};
 Object.keys(ICONS).forEach(function(k){if(!so[k])return;var a=document.createElement("a");a.href=so[k];a.target="_blank";a.rel="noopener me";a.setAttribute("aria-label",NAMES[k]);a.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+ICONS[k]+'"/></svg>';box.appendChild(a);});});}
function initials(n){var w=n.trim().split(/\s+/).filter(Boolean);if(!w.length)return "";return ((w[0][0]||"")+(w.length>1?w[w.length-1][0]:"")).toLocaleUpperCase(L()==="en"?"en":"tr");}
var lastIni="",lastMode="";
function setT(id,v,ph){var e=$(id);e.textContent=v||ph;e.classList.toggle("is-empty",!v);}
function preview(){
 var name=$("fName").value.trim(),mail=$("fEmail").value.trim(),msg=$("fMsg").value.trim(),sender=!!(name||mail||msg),mode=sender?"s":"o",box=$("ctIni"),img=$("ctAvImg");
 $("ctPrevTitle").textContent=T(sender?"ct_senderTitle":"ct_ownerTitle");
 if(sender){setT("ctPvName",name,T("ct_pvName"));setT("ctPvMail",mail,T("ct_pvMail"));setT("ctPvMsg",msg,T("ct_pvMsg"));$("ctPvTime").textContent=T("ct_pvTime")+" "+new Date().toLocaleTimeString(L()==="en"?"en-GB":"tr-TR",{hour:"2-digit",minute:"2-digit"});}
 else{setT("ctPvName","FF-App Labs","");setT("ctPvMail",T("ct_role"),"");setT("ctPvMsg",T("ct_greet"),"");$("ctPvTime").textContent=T("ct_reply");}
 var ini=sender?initials(name):"";box.hidden=!ini;box.textContent=ini;img.style.opacity=sender&&!ini?".3":"";
 if((ini&&ini!==lastIni)||mode!==lastMode){var el=ini?box:img;el.classList.remove("pop");void el.offsetWidth;el.classList.add("pop");
  if(mode!==lastMode)document.querySelectorAll(".ct-name,.ct-role,.ct-chip,.ct-bubble").forEach(function(n){n.classList.remove("ct-swap");void n.offsetWidth;n.classList.add("ct-swap");});}
 lastIni=ini;lastMode=mode;$("ctReply").textContent=sender?T("ct_reply"):"";}
function refresh(){preview();var b=$("ctSend");if(!b.disabled)b.firstElementChild.textContent=T("ct_send");$("ctBack").setAttribute("aria-label",T("ct_back"));if(document.querySelector(".ct-field.is-bad, #eOk:not(:empty)"))validate(true);}
function setErr(f,id,m){var p=$(id);p.textContent=m||"";if(f){f.closest(".ct-field").classList.toggle("is-bad",!!m);f.setAttribute("aria-invalid",m?"true":"false");}}
function validate(silent){
 var name=$("fName").value.trim(),email=$("fEmail").value.trim(),msg=$("fMsg").value.trim();
 var eN=name.length<2?T("ct_errName"):"",eE=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)?"":T("ct_errEmail"),eM=msg.length<10?T("ct_errMsg"):"",eO=$("fOk").checked?"":T("ct_errOk");
 setErr($("fName"),"eName",eN);setErr($("fEmail"),"eEmail",eE);setErr($("fMsg"),"eMsg",eM);$("eOk").textContent=eO;$("fOk").setAttribute("aria-invalid",eO?"true":"false");
 if(!silent){var f=[["fName",eN],["fEmail",eE],["fMsg",eM],["fOk",eO]].filter(function(x){return x[1];})[0];if(f)$(f[0]).focus();}
 return !(eN||eE||eM||eO);}
function status(cls,text){var s=$("ctStatus");s.className="ct-status "+(cls||"");[].slice.call(s.childNodes).forEach(function(n){if(n.nodeType===3)n.remove();});if(text)s.appendChild(document.createTextNode(text));}
["fName","fEmail","fMsg"].forEach(function(id){$(id).addEventListener("input",preview);$(id).addEventListener("input",function(){if($(id).closest(".ct-field").classList.contains("is-bad"))validate(true);});});
$("fMsg").addEventListener("input",function(){$("ctCount").textContent=$("fMsg").value.length+"/1000";});
$("fOk").addEventListener("change",function(){if($("eOk").textContent)validate(true);});
var reduce=function(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches;},wait=function(ms){return new Promise(function(r){setTimeout(r,ms);});};
var TAG="";try{var kq=new URLSearchParams(location.search).get("konu");TAG={is:"İş"}[kq]||"";}catch(x){}
var DEMO=/[?&]demo=1\b/.test(location.search);
function openFly(name,mail){var fly=$("ctFly");$("flyIni").textContent=initials(name)||"?";$("flyFromName").textContent=name;$("flyFromMail").textContent=mail;$("flyToRole").textContent=T("ct_role");$("ctFlyText").textContent=T("ct_flySending");$("ctFlyDone").hidden=true;$("ctFlyDone").textContent=T("ct_flyClose");fly.classList.remove("go","arrived");fly.hidden=false;void fly.offsetWidth;var tr=$("ctTrack");tr.style.setProperty("--d",Math.max(0,tr.clientWidth-46)+"px");fly.classList.add("go");fly.scrollIntoView({block:"center",behavior:reduce()?"auto":"smooth"});}
function closeFly(reset){$("ctFly").hidden=true;$("ctFly").classList.remove("go","arrived");if(reset){$("ctForm").reset();$("ctCount").textContent="0/1000";preview();$("fName").focus();}}
$("ctFlyDone").addEventListener("click",function(){closeFly(true);});
$("ctFly").addEventListener("keydown",function(e){if(e.key==="Escape"&&!$("ctFlyDone").hidden)closeFly(true);});
$("ctForm").addEventListener("submit",function(e){
 e.preventDefault();status("","");if($("fHp").value)return;if(!validate(false))return;
 try{if(Date.now()-Number(localStorage.getItem("ffb_last")||0)<30000&&!DEMO){status("bad",T("ct_wait"));return;}}catch(x){}
 var name=$("fName").value.trim(),mail=$("fEmail").value.trim(),msg=$("fMsg").value.trim(),btn=$("ctSend");
 btn.disabled=true;btn.firstElementChild.textContent=T("ct_sending");openFly(name,mail);
 var flight=wait(reduce()?500:1700),p=DEMO?wait(300):FFB.sendMessage(name,mail,msg,TAG);
 p.then(function(){try{localStorage.setItem("ffb_last",String(Date.now()));}catch(x){}return true;},function(){return false;}).then(function(ok){
  return flight.then(function(){btn.disabled=false;btn.firstElementChild.textContent=T("ct_send");
   if(!ok){closeFly(false);status("bad",T("ct_failMsg"));return;}
   $("ctFly").classList.add("arrived");$("ctFlyText").textContent=T("ct_flyDone");$("ctFlyDone").hidden=false;$("ctFlyDone").focus();});});});
document.addEventListener("ffb:lang",refresh);
document.addEventListener("DOMContentLoaded",function(){FFB.applyI18n();brand();refresh();});
})();
