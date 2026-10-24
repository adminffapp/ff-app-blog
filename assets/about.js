(function(){var E=FFB.esc;
FFB.extend({tr:{nowT:"Şu an üzerinde",stL:"Yayında",stD:"Hazırlanıyor"},en:{nowT:"Working on now",stL:"Live",stD:"In progress"}});
FFB.extend({tr:{inT:"Bu sayfa biraz farklı",inP1:"Hakkımızda sayfasını gazete şeklinde hazırladık.",inP2:"Sitenin genel düzeninin dışına çıkarak markamızı daha doğal ve samimi anlatmak istedik.",inH:"Kapatmak için herhangi bir yere dokunun"},en:{inT:"This page is a little different",inP1:"We made the About page as a newspaper.",inP2:"We stepped outside the site's usual layout to tell our story in a more natural, personal way.",inH:"Tap anywhere to close"}});
var list=null;
function intro(){try{if(sessionStorage.getItem("ffb_about_intro"))return;}catch(e){}
 var prev=document.activeElement;var o=document.createElement("div");o.className="intro";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-labelledby","inT");o.tabIndex=-1;
 function fill(){o.innerHTML='<div class="intro-box"><span class="intro-tag" aria-hidden="true">✦</span><h2 id="inT">'+E(FFB.t("inT"))+'</h2><p>'+E(FFB.t("inP1"))+'</p><p>'+E(FFB.t("inP2"))+'</p><small>'+E(FFB.t("inH"))+'</small></div>';}
 fill();document.body.appendChild(o);document.body.style.overflow="hidden";requestAnimationFrame(function(){o.classList.add("on");o.focus();});
 function key(e){if(e.key==="Tab"){e.preventDefault();return;}if(e.key==="Escape"||e.key==="Enter"||e.key===" ")close();}
 function close(){document.removeEventListener("keydown",key);try{if(prev&&prev.focus)prev.focus();}catch(e){}document.removeEventListener("ffb:lang",fill);o.classList.remove("on");o.classList.add("off");document.body.style.overflow="";try{sessionStorage.setItem("ffb_about_intro","1");}catch(e){}setTimeout(function(){o.remove();},450);}
 o.addEventListener("click",close);document.addEventListener("keydown",key);document.addEventListener("ffb:lang",fill);}
function date(){var el=document.getElementById("nwDate");if(!el)return;var l=FFB.lang()==="en"?"en-GB":"tr-TR";el.textContent=new Date().toLocaleDateString(l,{weekday:"long",day:"numeric",month:"long",year:"numeric"});}
function flow(){var src=FFB.t("ab5Flow")||"",ol=document.getElementById("flowList");if(!ol)return;var steps=src.split(/\s*→\s*/).filter(Boolean);ol.innerHTML=steps.map(function(x,i){return '<li><b>'+(i+1)+'</b><span>'+E(x)+'</span></li>';}).join("");}
function now(){var b=document.getElementById("nowBox");if(!b)return;if(!list||!list.length){b.hidden=true;return;}b.hidden=false;document.getElementById("nowT").textContent=FFB.t("nowT");
 document.getElementById("nowList").innerHTML=list.slice(0,5).map(function(p){var live=p.status==="live",n=E(FFB.pick(p,"name")),st='<em class="'+(live?'live':'')+'">'+E(FFB.t(live?"stL":"stD"))+'</em>';return '<li>'+((live&&p.url)?'<a href="'+E(p.url)+'" target="_blank" rel="noopener">'+n+'</a>':'<span>'+n+'</span>')+st+'</li>';}).join("");}
function all(){date();flow();now();}
function extras(){
 var v=document.querySelector(".ph-in .vid");if(v&&window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches){v.removeAttribute("autoplay");v.pause();}
 document.querySelectorAll(".sw").forEach(function(el){function d(){el.setAttribute("data-dir",Math.random()<.5?"up":"down");}d();el.addEventListener("mouseenter",d);el.addEventListener("focus",d);el.addEventListener("click",function(){el.classList.toggle("tap");if(el.classList.contains("tap"))d();});});
 var fl=document.getElementById("flowList");if(fl){if("IntersectionObserver" in window){var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){fl.classList.add("shown");io.disconnect();}});},{threshold:.25});io.observe(fl);}else fl.classList.add("shown");}}
document.addEventListener("DOMContentLoaded",function(){extras();intro();FFB.applyI18n();FFB.reveal();all();FFB.getProjects().then(function(l){list=l;now();}).catch(function(){});});
document.addEventListener("ffb:lang",function(){all();});})();
