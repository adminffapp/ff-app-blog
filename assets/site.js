/* FF-App Labs marka sitesi: arka plan (Rive), logo vitrini tozu, banner. */
(function () {
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var dust = document.getElementById("logoDust");
  if (dust && !reduce) {
    for (var i = 0; i < 45; i++) {
      var d = document.createElement("span"), s = (Math.random() * 2 + 1).toFixed(1);
      d.style.cssText = "width:" + s + "px;height:" + s + "px;left:" + (Math.random() * 100).toFixed(1) + "%;top:" + (Math.random() * 100).toFixed(1) + "%;animation-duration:" + (Math.random() * 6 + 6).toFixed(1) + "s;animation-delay:" + (Math.random() * 8).toFixed(1) + "s";
      d.style.setProperty("--dx", (Math.random() * 60 - 30).toFixed(0) + "px");
      dust.appendChild(d);
    }
  }
  function startRive() {
    var cv = document.getElementById("riveBgCanvas");
    if (!cv || !window.rive || reduce) return;
    var r;
    function size() { cv.width = innerWidth * Math.min(devicePixelRatio || 1, 2); cv.height = innerHeight * Math.min(devicePixelRatio || 1, 2); if (r) r.resizeDrawingSurfaceToCanvas(); }
    try {
      r = new rive.Rive({ src: "/assets/circuits-bg.riv", canvas: cv, artboard: "Scene_1", stateMachines: "State Machine 1", autoplay: true,
        layout: new rive.Layout({ fit: rive.Fit.Cover, alignment: rive.Alignment.Center }), onLoad: size });
    } catch (e) { return; }
    size(); addEventListener("resize", size); addEventListener("focus", size); addEventListener("pageshow", size);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) size(); });
    function fwd(e, type, ptr) {
      if (!e.isTrusted) return;
      var o = { clientX: e.clientX, clientY: e.clientY, bubbles: false, cancelable: true, view: window };
      cv.dispatchEvent(ptr ? new PointerEvent(type, Object.assign(o, { pointerId: 1, pointerType: "mouse", isPrimary: true, button: 0, buttons: 0 })) : new MouseEvent(type, o));
    }
    ["move", "down", "up"].forEach(function (k) { addEventListener("pointer" + k, function (e) { fwd(e, "pointer" + k, true); fwd(e, "mouse" + k, false); }); });
  }
  function loadRive() {
    var s = document.createElement("script"); s.src = "https://unpkg.com/@rive-app/canvas@2.19.5/rive.js"; s.async = true; s.onload = startRive; document.head.appendChild(s);
  }
  if (document.readyState === "complete") setTimeout(loadRive, 200); else addEventListener("load", function () { setTimeout(loadRive, 200); });

  var ban = document.getElementById("banner"), bg = document.getElementById("bannerBg");
  function drawBanner() {
    FFB.getBanner().then(function (cfg) {
      clearInterval(drawBanner.t);
      ban.querySelectorAll(".bn-over,.sb-dots").forEach(function (n) { n.remove(); });
      if (!cfg || !cfg.enabled || !cfg.images || !cfg.images.length) { bg.innerHTML = ""; ban.classList.remove("has-img"); return; }
      var E = FFB.esc, en = FFB.lang() === "en", pk = function (k) { return (en && cfg[k + "En"]) || cfg[k] || ""; };
      bg.innerHTML = cfg.images.map(function (u, i) { return '<div class="sb-slide' + (i ? "" : " on") + '" style="background-image:url(\'' + String(u).replace(/['"\\()]/g, encodeURIComponent) + '\')"></div>'; }).join("") + '<span class="bn-fade"></span>';
      ban.classList.add("has-img");
      var title = pk("title"), text = pk("text"), btn = pk("btn"), url = cfg.url || "";
      var over = (title || text || (btn && url)) ? '<div class="bn-over">' + (title ? "<h2>" + E(title) + "</h2>" : "") + (text ? "<p>" + E(text) + "</p>" : "") + (btn && url ? '<a class="btn solid" href="' + E(url) + '"' + (/^https?:/.test(url) ? ' rel="noopener"' : "") + ">" + E(btn) + "</a>" : "") + "</div>" : "";
      if (over) ban.insertAdjacentHTML("afterbegin", over);
      bg.setAttribute("role", "img"); bg.setAttribute("aria-label", cfg.alt || title || "FF-App Labs");
      if (cfg.images.length > 1) {
        ban.insertAdjacentHTML("beforeend", '<div class="sb-dots">' + cfg.images.map(function (u, i) { return '<span class="sb-dot' + (i ? "" : " on") + '"></span>'; }).join("") + "</div>");
        if (!reduce) {
          var sl = bg.querySelectorAll(".sb-slide"), dt = ban.querySelectorAll(".sb-dot"), c = 0;
          drawBanner.t = setInterval(function () { sl[c].classList.remove("on"); dt[c].classList.remove("on"); c = (c + 1) % sl.length; sl[c].classList.add("on"); dt[c].classList.add("on"); }, Math.max(4, Math.min(30, cfg.seconds || 8)) * 1000);
        }
      }
    });
  }
  if (ban && bg && window.FFB) { drawBanner(); document.addEventListener("ffb:lang", drawBanner); }
})();
