(function () {
  const DEFAULT_API = "https://voxstream-production.up.railway.app";
  const $ = function (id) { return document.getElementById(id); };
  let wanted = false;
  let sock = null;
  let retry = null;
  let userWanted = "";

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

  function clearRetry() {
    if (retry) {
      clearTimeout(retry);
      retry = null;
    }
  }

  function stopTikTokFix(userStop) {
    if (userStop !== false) wanted = false;
    clearRetry();
    if (sock) {
      try { sock.close(); } catch (e) {}
      sock = null;
    }
    if (!wanted) setStatus("", "cut");
  }

  function readFrame(ev, fn) {
    if (typeof ev.data === "string") {
      fn(ev.data);
      return;
    }
    if (ev.data && typeof ev.data.text === "function") {
      ev.data.text().then(fn).catch(function () {});
      return;
    }
  }

  function ingest(raw) {
    if (!raw) return;
    var obj = raw;
    if (typeof raw === "string") {
      try { obj = JSON.parse(raw); } catch (e) { return; }
    }
    if (obj && Array.isArray(obj.messages)) {
      obj.messages.forEach(ingest);
      return;
    }
    if (typeof window.ingestTikTok === "function") window.ingestTikTok(obj);
  }

  function eulerQuery(user, key) {
    return "uniqueId=" + encodeURIComponent(user) +
      "&schemaVersion=v1" +
      "&features.bundleEvents=false" +
      (key ? "&apiKey=" + encodeURIComponent(key) : "");
  }

  function connect(isRetry) {
    var user = userWanted;
    if (!wanted || user.length < 2) return;
    setStatus("wait", isRetry ? "reconnecting" : "connecting");
    var url;
    if (isHosted()) {
      url = apiBase().replace(/^http/, "ws") + "/v1/tiktok/relay?" + eulerQuery(user, "");
    } else {
      var key = (($("ttkey") && $("ttkey").value) || "").trim();
      if (!key) {
        setStatus("error", "missing key");
        wanted = false;
        return;
      }
      url = "wss://ws.eulerstream.com?" + eulerQuery(user, key);
    }
    var ws = new WebSocket(url);
    sock = ws;
    ws.onopen = function () {
      if (sock !== ws) return;
      setStatus("live", "on air");
    };
    ws.onmessage = function (ev) {
      readFrame(ev, function (text) {
        try {
          var obj = JSON.parse(text);
          if (obj.event === "error" || obj.type === "error" || obj.error || obj.status === "error") {
            var blob = text.toLowerCase();
            var kind = /not.?live|offline|ended/.test(blob) ? "not live" :
              /invalid|unauthorized|401|403|api.?key/.test(blob) ? "invalid key" : "error";
            setStatus("error", kind);
            if (kind === "invalid key" || kind === "not live") wanted = false;
            return;
          }
        } catch (e) {}
        ingest(text);
      });
    };
    ws.onerror = function () {};
    ws.onclose = function () {
      if (sock !== ws) return;
      sock = null;
      if (wanted) {
        setStatus("wait", "reconnecting");
        retry = setTimeout(function () { connect(true); }, 1600);
      } else {
        setStatus("", "cut");
      }
    };
  }

  function startFromUi() {
    var user = String(($("tiktok") && $("tiktok").value) || "").replace(/^@/, "").trim();
    if (user.length < 2) {
      setStatus("error", "error");
      return;
    }
    if (!isHosted()) {
      var key = (($("ttkey") && $("ttkey").value) || "").trim();
      if (!key) {
        setStatus("error", "missing key");
        return;
      }
    }
    stopTikTokFix(true);
    if (typeof window.stopDemo === "function") window.stopDemo();
    if (typeof window.unlockFromGesture === "function") window.unlockFromGesture();
    userWanted = user;
    wanted = true;
    connect(false);
  }

  var btn = $("tiktok-btn");
  if (!btn) return;
  btn.onclick = function () {
    if (wanted || sock) stopTikTokFix(true);
    else startFromUi();
  };
})();
