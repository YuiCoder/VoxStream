(function () {
  const DEFAULT_API = "https://voxstream-production.up.railway.app";
  const $ = function (id) { return document.getElementById(id); };
  let hostedOn = false;
  let hostedSock = null;

  function apiBase() {
    try {
      return (localStorage.getItem("voxstreamApi") || DEFAULT_API).replace(/\/$/, "");
    } catch (e) {
      return DEFAULT_API;
    }
  }

  function isHosted() {
    return !!(window.voxMe && window.voxMe.flags && window.voxMe.flags.tiktokHosted);
  }

  function setStatus(kind, text) {
    const dot = $("tiktok-dot");
    const st = $("tiktok-st");
    if (dot) {
      dot.className = "dot" + (kind === "live" ? " live" : kind === "error" ? " err" : kind === "wait" ? " wait" : "");
    }
    if (st) st.textContent = text || "-";
  }

  function stopHosted() {
    hostedOn = false;
    if (hostedSock) {
      try { hostedSock.close(); } catch (e) {}
      hostedSock = null;
    }
    setStatus("", "cut");
  }

  function startHosted(user) {
    user = String(user || "").replace(/^@/, "").trim();
    if (user.length < 2) {
      setStatus("error", "error");
      return;
    }
    stopHosted();
    if (typeof window.stopDemo === "function") window.stopDemo();
    hostedOn = true;
    setStatus("wait", "connecting");
    const api = apiBase();
    fetch(api + "/v1/tiktok/hosted", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uniqueId: user })
    }).then(function (res) {
      return res.json().then(function (body) {
        return { ok: res.ok, body: body || {} };
      });
    }).then(function (pack) {
      if (!hostedOn) return;
      if (!pack.ok || !pack.body.relay) {
        const code = pack.body.code || "";
        setStatus("error", code === "need_pro" ? "need Pro" : code === "euler_not_configured" ? "host key later" : "error");
        hostedOn = false;
        return;
      }
      const wsUrl = api.replace(/^http/, "ws") + pack.body.relay;
      const ws = new WebSocket(wsUrl);
      hostedSock = ws;
      ws.onopen = function () {
        if (hostedSock !== ws) return;
        setStatus("live", "on air");
      };
      ws.onmessage = function (ev) {
        if (typeof ev.data !== "string") return;
        try {
          const obj = JSON.parse(ev.data);
          if (typeof window.ingestTikTok === "function") window.ingestTikTok(obj);
        } catch (e) {}
      };
      ws.onclose = function () {
        if (hostedSock !== ws) return;
        hostedSock = null;
        hostedOn = false;
        setStatus("", "cut");
      };
      ws.onerror = function () {
        if (hostedSock !== ws) return;
        setStatus("error", "error");
      };
    }).catch(function () {
      hostedOn = false;
      setStatus("error", "error");
    });
  }

  const btn = $("tiktok-btn");
  if (!btn) return;
  const prev = btn.onclick;
  btn.onclick = function (ev) {
    if (!isHosted()) {
      if (typeof prev === "function") return prev.call(this, ev);
      return;
    }
    if (hostedOn) stopHosted();
    else {
      if (typeof window.unlockFromGesture === "function") window.unlockFromGesture();
      startHosted(($("tiktok") && $("tiktok").value) || "");
    }
  };
})();
