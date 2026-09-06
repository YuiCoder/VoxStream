(function () {
  if (typeof window.shouldSkipSpeak !== "function") return;
  const origSkip = window.shouldSkipSpeak;
  window.shouldSkipSpeak = function (m) {
    origSkip(m);
    return true;
  };

  const $ = function (id) { return document.getElementById(id); };
  const liveQ = [];
  let busy = false;
  const KEEP = 3;
  const STALE_MS = 4500;

  function on() {
    return !($("tts") && !$("tts").checked);
  }
  function paused() {
    const btn = $("pause");
    return btn && /seguir|continue/i.test(btn.textContent || "");
  }
  function want(m) {
    if (!m) return false;
    if (m.kind === "gift" && $("readgift") && !$("readgift").checked) return false;
    if (m.kind === "follow" && $("readfollow") && !$("readfollow").checked) return false;
    if ((m.kind === "sub" || m.kind === "bits") && $("readsub") && !$("readsub").checked) return false;
    return true;
  }
  function trim() {
    const now = Date.now();
    while (liveQ.length && now - (liveQ[0].ts || now) > STALE_MS) liveQ.shift();
    while (liveQ.length > KEEP) liveQ.shift();
    if ($("q")) $("q").textContent = liveQ.length + " queued";
  }
  function line(m) {
    const nameOn = !$("readname") || $("readname").checked;
    const name = nameOn ? (m.displayName || m.user || "") : "";
    if (m.kind === "gift") return (name ? name + " " : "") + "sent " + (m.giftName || "a gift");
    if (m.kind === "follow") return (name || "someone") + " followed";
    if (m.kind === "sub") return (name || "someone") + " subscribed";
    if (m.kind === "bits") return (name || "someone") + " " + (m.bits || "") + " bits";
    return name ? name + ". " + (m.text || "") : (m.text || "");
  }
  function kick() {
    if (busy || paused() || !on()) return;
    trim();
    const next = liveQ.shift();
    if ($("q")) $("q").textContent = liveQ.length + " queued";
    if (!next) return;
    busy = true;
    if ($("now-k")) $("now-k").textContent = "Reading";
    if ($("now-text")) $("now-text").textContent = next.text || "";
    const u = new SpeechSynthesisUtterance(line(next));
    u.rate = Number(($("rate") && $("rate").value) || 1);
    u.volume = Number(($("vol") && $("vol").value) || 1);
    u.pitch = Number(($("pitch") && $("pitch").value) || 1);
    u.onend = function () { busy = false; kick(); };
    u.onerror = function () { busy = false; setTimeout(kick, 80); };
    try { speechSynthesis.resume(); speechSynthesis.speak(u); } catch (e) { busy = false; }
  }

  const origAdd = window.addMsg;
  if (typeof origAdd !== "function") return;
  window.addMsg = function (m) {
    origAdd(m);
    if (!on() || !want(m)) return;
    if (origSkip(m)) return;
    liveQ.push(m);
    trim();
    kick();
  };

  if ($("clearq")) {
    const prev = $("clearq").onclick;
    $("clearq").onclick = function (ev) {
      liveQ.length = 0;
      busy = false;
      try { speechSynthesis.cancel(); } catch (e) {}
      if (typeof prev === "function") prev.call(this, ev);
    };
  }
  if ($("skip")) {
    const prev = $("skip").onclick;
    $("skip").onclick = function (ev) {
      try { speechSynthesis.cancel(); } catch (e) {}
      busy = false;
      if (typeof prev === "function") prev.call(this, ev);
      kick();
    };
  }
})();
