// 훅(검은 화면의 문장들)이 끝나면 본문(#story)으로 부드럽게 내려간다(사용자 11-15 밤 "이거 끝나고 화면 본문으로 부드럽게 스르륵").
// 훅이 끝났는지는 hook2.js 가 내주는 window.__hk().done 으로 안다(hookgate.js 와 같은 신호).
// 마지막 문장을 읽을 틈(0.9초)을 두고, 1.3초 동안 천천히 출발해 천천히 멈추며 내려간다.
// 그사이 사용자가 위로 굴리거나 누르면 바로 손을 뗀다. 훅이 화면을 채우고 있을 때만 움직인다(이미 지나갔으면 건드리지 않음).
(function () {
  var hook = document.getElementById("challenge"), story = document.getElementById("story");
  if (!hook || !story) return;
  var timer = 0;
  function calm() { return !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches); }
  function glide() {
    var r = hook.getBoundingClientRect();
    if (document.body.classList.contains("hook-retired") || r.top < -40 || r.top > 40) return;
    var from = window.scrollY, dist = Math.ceil(story.getBoundingClientRect().top) + 1, t0 = 0, dur = 1300, stop = false;
    if (dist < 8) return;
    function cancel() { stop = true; }
    function onWheel(e) { if (e.deltaY < 0) stop = true; }
    window.addEventListener("wheel", onWheel, { passive: true });
    ["touchstart", "keydown", "mousedown"].forEach(function (ev) { window.addEventListener(ev, cancel, { once: true, passive: true }); });
    function end() { window.removeEventListener("wheel", onWheel); }
    if (calm()) { window.scrollTo({ top: from + dist, behavior: "instant" }); end(); return; }
    function step(now) {
      if (stop || document.body.classList.contains("hook-retired")) { end(); return; }
      if (!t0) t0 = now;
      var k = Math.min(1, (now - t0) / dur), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      window.scrollTo({ top: from + dist * e, behavior: "instant" });
      if (k < 1) requestAnimationFrame(step); else end();
    }
    requestAnimationFrame(step);
  }
  timer = setInterval(function () {
    var s = window.__hk && window.__hk();
    if (!s || !s.done) return;
    clearInterval(timer);
    setTimeout(glide, 900);
  }, 200);
})();
