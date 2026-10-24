(function(){var E=FFB.esc;
FFB.extend({tr:{prMore:"Ayrıntıları göster",prLess:"Ayrıntıları gizle",prVisit:"Projeye git"},en:{prMore:"Show details",prLess:"Hide details",prVisit:"Visit project"}});
var open={};
function sq(p){return p.cover?'<img src="'+E(p.cover)+'" alt="" loading="lazy">':'<span class="ini">'+E((FFB.pick(p,"name")||"?").charAt(0))+'</span>';}
function render(){FFB.getProjects().then(function(l){var r=document.getElementById("rows");
 if(!l.length){r.innerHTML='<p class="small">'+E(FFB.t("empty"))+'</p>';return;}
 r.innerHTML=l.map(function(p,i){var live=p.status==="live",b=FFB.pick(p,"brief"),d=FFB.pick(p,"desc"),dt=FFB.pick(p,"detail")||d,wide=p.wide||p.cover,o=!!open[p.id||i];
  return '<article class="prj'+(o?' open':'')+(wide?'':' nowide')+'" data-k="'+E(p.id||i)+'">'
   +'<div class="p-thumb">'+sq(p)+'</div>'
   +(wide?'<div class="p-wide"><img src="'+E(wide)+'" alt="" loading="lazy"></div>':'')
   +'<div class="p-main"><h2>'+E(FFB.pick(p,"name"))+'</h2><p class="p-short">'+E(d)+'</p><div class="p-long prose" style="white-space:normal">'+FFB.md(dt)+'</div></div>'
   +'<div class="p-state"><span class="badge'+(live?' live':'')+'">'+E(FFB.t(live?"stLive":"stDev"))+'</span>'+(b?'<span class="small">'+E(b)+'</span>':'')+'</div>'
   +'<div class="p-act">'+((live&&p.url)?'<a class="btn pri" href="'+E(p.url)+'" target="_blank" rel="noopener">'+E(FFB.t("prVisit"))+' →</a>':'')+'<button class="p-tg" type="button" aria-expanded="'+o+'" aria-label="'+E(FFB.t(o?"prLess":"prMore"))+'" title="'+E(FFB.t(o?"prLess":"prMore"))+'"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>'
   +'</article>';}).join("");FFB.reveal(r);});}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".p-tg");if(!b)return;var a=b.closest(".prj"),k=a.getAttribute("data-k"),o=a.classList.toggle("open");open[k]=o;b.setAttribute("aria-expanded",o);var t=FFB.t(o?"prLess":"prMore");b.setAttribute("aria-label",t);b.title=t;});
document.addEventListener("DOMContentLoaded",function(){FFB.applyI18n();FFB.reveal();render();});
document.addEventListener("ffb:lang",render);})();
