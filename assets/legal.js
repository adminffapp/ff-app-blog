(function(){
FFB.extend({tr:{lg_eyebrow:"YASAL",lg_toc:"İçindekiler",lg_rel:"İlgili sayfalar"},en:{lg_eyebrow:"LEGAL",lg_toc:"Contents",lg_rel:"Related pages"}});
var io=null;
function toc(){var ol=document.getElementById("tocList");if(!ol)return;ol.innerHTML="";
 document.querySelectorAll(".lg-sec[id]").forEach(function(sec){var h=sec.querySelector("h2");if(!h)return;var li=document.createElement("li"),a=document.createElement("a");a.href="#"+sec.id;a.textContent=h.textContent;li.appendChild(a);ol.appendChild(li);});}
function observe(){if(io)io.disconnect();if(!("IntersectionObserver" in window))return;var links={};
 document.querySelectorAll("#tocList a").forEach(function(a){links[a.getAttribute("href").slice(1)]=a;});
 io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;Object.keys(links).forEach(function(k){links[k].classList.remove("is-active");});var l=links[e.target.id];if(l)l.classList.add("is-active");});},{rootMargin:"-20% 0px -70% 0px"});
 document.querySelectorAll(".lg-sec[id]").forEach(function(s){io.observe(s);});}
function refresh(){toc();observe();}
document.addEventListener("DOMContentLoaded",function(){FFB.applyI18n();refresh();});
document.addEventListener("ffb:lang",refresh);
})();
