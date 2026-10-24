(function(){var E=FFB.esc,tag="",DATA=null;
var TONES=[["#3A2C1E","#E4D5B7"],["#E4D5B7","#1E160F"],["#2A1F15","#E4D5B7"],["#CDBE9F","#1E160F"]];
function tone(i){var t=TONES[i%TONES.length];return '--c1:'+t[0]+';--c2:'+t[1];}
function meta(p,views){var v=views[p.slug||p.id]||0;return E(FFB.fmtDate(p.publishedAt))+(p.readMin?' · '+p.readMin+' '+E(FFB.t("min")):'')+(v?' · '+E(FFB.nf(v))+' '+E(FFB.t("reads")):'');}
var OPEN={};
FFB.extend({tr:{bRead:"Yazıyı oku",bClose:"Yazıyı kapat"},en:{bRead:"Read the post",bClose:"Close the post"}});
function card(p,i,views,top){var s=p.slug||p.id,c=(p.tags||[])[0],o=!!OPEN[s];return '<article class="brow rv'+(o?' open':'')+'" data-s="'+E(s)+'" id="p-'+E(s)+'"><div class="bd"><button class="bhead" type="button" aria-expanded="'+o+'"><span class="meta">'+(top?'<b class="hot">'+E(FFB.t("mostRead"))+'</b> · ':'')+meta(p,views)+'</span><h3>'+E(FFB.pick(p,"title"))+'</h3><p>'+E(FFB.pick(p,"excerpt"))+'</p><span class="rd">'+E(FFB.t(o?"bClose":"bRead"))+'<i aria-hidden="true"></i></span></button>'+(c?'<button class="cat" type="button" data-t="'+E(c)+'">'+E(c)+'</button>':'')+'</div><div class="th" style="'+tone(i)+'">'+(p.cover?'<img src="'+E(p.cover)+'" alt="" loading="lazy">':'')+'</div><div class="bfull"><div class="bin"><div class="prose">'+FFB.md(FFB.pick(p,"body")||"")+'</div><button class="bclose" type="button">'+E(FFB.t("bClose"))+' ↑</button></div></div></article>';}
function draw(){if(!DATA)return;var posts=DATA.posts,views=DATA.views;
 var cats={};posts.forEach(function(p){var c=(p.tags||[])[0];if(c)cats[c]=1;});var keys=Object.keys(cats);
 document.getElementById("chips").innerHTML=keys.length?['<button class="chip" type="button" data-t="" aria-pressed="'+(tag===""?'true':'false')+'">'+E(FFB.t("all"))+'</button>'].concat(keys.map(function(t){return '<button class="chip" type="button" data-t="'+E(t)+'" aria-pressed="'+(tag===t?'true':'false')+'">'+E(t)+'</button>';})).join(""):"";
 var list=tag?posts.filter(function(p){return (p.tags||[])[0]===tag;}):posts;
 var f=document.getElementById("feat"),pl=document.getElementById("plist");
 if(!list.length){f.innerHTML="";pl.innerHTML='<p class="small">'+E(FFB.t("empty"))+'</p>';return;}
 var top=FFB.popular(list,views,1)[0];f.innerHTML="";
 pl.innerHTML=[top].concat(list.filter(function(p){return p!==top;})).map(function(p,i){return card(p,i,views,i===0&&list.length>1);}).join("");FFB.reveal(document.getElementById("main"));}
function load(){Promise.all([FFB.getPosts(),FFB.getViews()]).then(function(x){DATA={posts:x[0],views:x[1]};var h=decodeURIComponent((location.hash||"").slice(1));if(h&&x[0].some(function(p){return (p.slug||p.id)===h;}))OPEN[h]=true;draw();var el=h&&document.getElementById("p-"+h);if(el){FFB.hit(h);setTimeout(function(){el.scrollIntoView({block:"start"});},60);}});}
function toggle(a,force){var s=a.getAttribute("data-s"),o=force===undefined?!a.classList.contains("open"):force;a.classList.toggle("open",o);OPEN[s]=o;var h=a.querySelector(".bhead");h.setAttribute("aria-expanded",o);h.querySelector(".rd").firstChild.nodeValue=FFB.t(o?"bClose":"bRead");if(o){FFB.hit(s);try{history.replaceState(null,"","#"+s);}catch(x){}}else{try{history.replaceState(null,"",location.pathname);}catch(x){}}}
document.addEventListener("click",function(e){var hd=e.target.closest&&e.target.closest(".bhead,.bclose");if(hd){var a=hd.closest(".brow"),was=a.classList.contains("open");toggle(a);if(was&&hd.classList.contains("bclose"))a.scrollIntoView({block:"nearest",behavior:"smooth"});return;}var b=e.target.closest&&e.target.closest(".chip,.cat");if(b){var t=b.getAttribute("data-t");tag=t;draw();window.scrollTo({top:0,behavior:"smooth"});}});
document.addEventListener("DOMContentLoaded",function(){FFB.applyI18n();FFB.reveal();load();});
document.addEventListener("ffb:lang",draw);})();
