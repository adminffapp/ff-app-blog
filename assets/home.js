(function(){var PROD=/(^|\.)(ffapplabs\.com|vercel\.app)$/.test(location.hostname);function postHref(s){return PROD?'/blog/'+encodeURIComponent(s)+'/':'/blog/#'+encodeURIComponent(s);}FFB.extend({tr:{open:"Aç"},en:{open:"Open"}});
var E=FFB.esc;
var TONES=[["#3A2C1E","#B8895A","#241a10"],["#2f2a12","#8a8a2a","#1f2012"],["#46301c","#d1a96b","#2b1d12"],["#2b2118","#9c8e77","#211912"]];
function card(p,i,views){var s=p.slug||p.id,t=TONES[i%TONES.length],img=p.cover,v=views[s]||0,tag=(p.tags||[])[0];
 return '<a class="mcard" href="'+postHref(s)+'" style="--c1:'+t[0]+';--c2:'+t[1]+';--bt:'+t[2]+'"><div class="mimg">'+(img?'<img src="'+E(img)+'" alt="'+E(FFB.pick(p,"title"))+'" width="1000" height="525" loading="lazy" decoding="async">':'')+'</div><div class="mbody">'+(tag?'<span class="mtag">'+E(tag)+'</span>':'')+'<span class="mt">'+E(FFB.pick(p,"title"))+'</span><span class="mx">'+E(FFB.pick(p,"excerpt"))+'</span><span class="md">'+E(FFB.fmtDate(p.publishedAt))+(v?' · '+E(FFB.nf(v))+' '+E(FFB.t("reads")):'')+'</span></div></a>';}
function marquee(posts,views){
 var track=document.getElementById("track"),wrap=document.getElementById("marq");if(!track||!wrap)return;
 if(!posts.length){wrap.hidden=true;return;}wrap.hidden=false;
 var set=[],n=0;while(set.length<8){set.push(posts[n%posts.length]);n++;}
 var one=set.map(function(p,i){return card(p,i,views);}).join("");
 track.innerHTML=one+one.replace(/<a /g,'<a aria-hidden="true" tabindex="-1" ');
 track.style.animationDuration=Math.max(50,set.length*9)+"s";
}
var held=null;
function hold(on){var w=document.getElementById("marq");if(!w)return;clearTimeout(held);if(on)w.classList.add("hold");else held=setTimeout(function(){w.classList.remove("hold");},1400);}
function projects(){FFB.getProjects().then(function(l){var r=document.getElementById("prjRows");if(!r||!l||!l.length)return;l=l.slice(0,4);
 r.innerHTML=l.map(function(p){var live=p.status==="live",u=p.url,inner='<span class="lab-name">'+E(FFB.pick(p,"name"))+'</span><span class="badge'+(live?' live':'')+'">'+E(FFB.t(live?"stLive":"stDev"))+'</span><span class="lab-desc">'+E(FFB.pick(p,"brief")||FFB.pick(p,"desc"))+'</span>';
  return u?'<a class="lab-row" href="'+E(u)+'" rel="noopener">'+inner+'</a>':'<div class="lab-row">'+inner+'</div>';}).join("");});}
function stats(){var u=document.getElementById("lsUse"),q=document.getElementById("lsPosts");if(u&&FFB.hubUsage)FFB.hubUsage().then(function(r){if(r&&r.total)u.textContent=FFB.nf(r.total);});if(q)FFB.getPosts().then(function(l){if(l&&l.length)q.textContent=l.length;});}
function tilt(){var w=document.querySelector(".lab-wrap"),c=document.getElementById("labCard");if(!w||!c||!window.matchMedia||matchMedia("(prefers-reduced-motion: reduce)").matches||!matchMedia("(hover: hover)").matches)return;
 w.addEventListener("mousemove",function(e){var r=w.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.setProperty("--ry",(x*6).toFixed(2)+"deg");c.style.setProperty("--rx",(-y*5).toFixed(2)+"deg");});
 w.addEventListener("mouseleave",function(){c.style.setProperty("--ry","0deg");c.style.setProperty("--rx","0deg");});}
function load(){if(document.getElementById("track"))Promise.all([FFB.getPosts(),FFB.getViews()]).then(function(x){marquee(FFB.popular(x[0],x[1],12),x[1]);});projects();stats();}
document.addEventListener("DOMContentLoaded",function(){FFB.applyI18n();FFB.reveal();load();tilt();var w=document.getElementById("marq");if(w){
 w.addEventListener("touchstart",function(){hold(true);},{passive:true});w.addEventListener("touchend",function(){hold(false);},{passive:true});w.addEventListener("touchcancel",function(){hold(false);},{passive:true});}});
document.addEventListener("ffb:lang",load);
})();
