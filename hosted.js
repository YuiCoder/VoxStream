(function () {
  const DEFAULT_API = "https://voxstream-production.up.railway.app";
  const $ = function (id) { return document.getElementById(id); };

  function apiBase() {
    try {
      return (localStorage.getItem("voxstreamApi") || DEFAULT_API).replace(/\/$/, "");
    } catch (e) {
      return DEFAULT_API;
    }
  }

  function setStatus(kind, text) {
    const dot = $("tiktok-dot");
    const st = $("tiktok-st");
    if (dot) {
      dot.className = "dot" + (kind === "live" ? " live" : kind === "error" ? " err" : kind === "wait" ? " wait" : "");
    }
    if (st) st.textContent = text || "";
  }

  const orig = window.startTikTok;
  if (typeof orig !== "function") return;

  window.startTikTok = function (user) {
    const hosted = window.voxMe && window.voxMe.flags && window.voxMe.flags.tiktokHosted;
    if (!hosted) return orig(user);

    user = String(user || "").replace(/^@/, "").trim();
    if (user.length < 2) {
      setStatus("error", "error");
      return;
    }
    if (typeof window.stopTikTok === "function") window.stopTikTok();
    if (typeof window.stopDemo === "function") window.stopDemo();

    setStatus("wait", "connecting");
    const api = apiBase();
    fetch(api + "/v1/tiktok/hosted", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uniqueId: user })
    }).then(function (res) {
      return res.json().then(function (body) {
        return { res: res, body: body || {} };
      });
    }).then(function (pack) {
      if (!pack.res.ok || !pack.body.relay) {
        const code = pack.body.code || "";
        setStatus("error", code === "need_pro" ? "need Pro" : code === "euler_not_configured" ? "host key later" : "error");
        return;
      }
      const wsUrl = api.replace(/^http/, "ws") + pack.body.relay;
      const ws = new WebSocket(wsUrl);
      window.tiktokSock = ws;
      ws.onopen = function () { setStatus("live", "on air"); };
      ws.onmessage = function (ev) {
        if (typeof ev.data !== "string") return;
        try {
          const obj = JSON.parse(ev.data);
          if (typeof window.ingestTikTok === "function") window.ingestTikTok(obj);
        } catch (e) {}
      };
      ws.onclose = function () { setStatus("", "cut"); };
      ws.onerror = function () { setStatus("error", "error"); };
    }).catch(function () {
      setStatus("error", "error");
    });
  };
})();
