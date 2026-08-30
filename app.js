const $ = id => document.getElementById(id);

const copy = {
  es: {
    live: "AL AIRE",
    idle: "EN ESPERA",
    connect: "Conectar",
    cut: "Cortar",
    src: "Fuentes",
    twH: "Canal sin #. Twitch no pide contrasena.",
    ttH: "Crea clave gratis en eulerstream.com. El LIVE debe estar abierto. Sin clave no hay chat real de TikTok.",
    twPh: "canal, sin #",
    ttPh: "usuario, sin @",
    demo: "Ensayo",
    demoH: "Simulado. Se apaga al conectar en vivo.",
    voice: "Voz",
    ttsOn: "Leer en voz alta",
    name: "Decir el nombre",
    test: "Probar voz",
    pause: "Pausa",
    resume: "Seguir",
    skip: "Saltar",
    waiting: "En silencio",
    reading: "Leyendo",
    queue: "en cola",
    speak: "Voxlive listo",
    stage: "Escenario",
    studio: "Estudio",
    rate: "Velocidad",
    voiceL: "Voz",
    twWait: "conectando",
    twLive: "al aire",
    twErr: "error",
    twCut: "cortado",
    ttWait: "conectando",
    ttLive: "al aire",
    ttNeed: "falta clave",
    ttOff: "no esta en vivo",
    ttKey: "clave invalida",
    ttErr: "error",
    ttCut: "cortado",
    ttKeyL: "Clave TikTok (gratis)",
    showKey: "Mostrar",
    hideKey: "Ocultar",
    free: "Uso gratuito. Planes despues.",
    freeBadge: "VOXLIVE FREE",
    ck1: "Pulsa Probar voz",
    ck2: "Conecta Twitch (canal en directo)",
    ck3: "TikTok: clave + usuario en LIVE",
    empty: "Conecta Twitch o activa Ensayo para ver el chat. TikTok necesita LIVE abierto y una clave de eulerstream.com.",
    proTitle: "Proximamente Pro",
    proBody: "Pro no esta activo. Hoy Voxlive es Free.",
    proClose: "Cerrar"
  },
  en: {
    live: "ON AIR",
    idle: "IDLE",
    connect: "Connect",
    cut: "Cut",
    src: "Sources",
    twH: "Channel, no #. Twitch does not ask for a password.",
    ttH: "Free key at eulerstream.com. LIVE must be open. No key means no real TikTok chat.",
    twPh: "channel, no #",
    ttPh: "username, no @",
    demo: "Rehearsal",
    demoH: "Simulated. Turns off when a live source connects.",
    voice: "Voice",
    ttsOn: "Read aloud",
    name: "Say the name",
    test: "Test voice",
    pause: "Pause",
    resume: "Continue",
    skip: "Skip",
    waiting: "Silent",
    reading: "Reading",
    queue: "queued",
    speak: "Voxlive is ready.",
    stage: "Stage",
    studio: "Studio",
    rate: "Rate",
    voiceL: "Voice",
    twWait: "connecting",
    twLive: "on air",
    twErr: "error",
    twCut: "cut",
    ttWait: "connecting",
    ttLive: "on air",
    ttNeed: "missing key",
    ttOff: "not live",
    ttKey: "invalid key",
    ttErr: "error",
    ttCut: "cut",
    ttKeyL: "TikTok key (free)",
    showKey: "Show",
    hideKey: "Hide",
    free: "Free to use. Plans later.",
    freeBadge: "VOXLIVE FREE",
    ck1: "Click Test voice",
    ck2: "Connect Twitch (live channel)",
    ck3: "TikTok: key + user in LIVE",
    empty: "Connect Twitch or turn on Rehearsal to see chat. TikTok needs an open LIVE and a key from eulerstream.com.",
    proTitle: "Pro coming soon",
    proBody: "Pro is not active. Voxlive is Free today.",
    proClose: "Close"
  }
};

let lang = "es";
let ttsOn = true;
let readName = true;
let paused = false;
let rate = 1;
let twitchOn = false;
let tiktokOn = false;
let demoOn = true;
let twitchSock = null;
let tiktokSock = null;
let demoTimer = null;
let selectedVoice = "";
let speaking = null;
let msgN = 0;
let unlocked = false;
let speakStarted = 0;
let keyVisible = false;
let triedVoice = false;

const queue = [];
const feed = $("feed");

const demoScript = [
  { platform: "tiktok", kind: "chat", user: "valeria.r", display: "valeria.r", text: "hola, acabo de entrar" },
  { platform: "twitch", kind: "chat", user: "nexo_", display: "nexo_", text: "vamos con todo hoy" },
  { platform: "tiktok", kind: "gift", user: "mar.ok", display: "mar.ok", text: "envio Rosa", giftName: "Rosa", giftCount: 5 },
  { platform: "twitch", kind: "chat", user: "SofiaPlays", display: "SofiaPlays", text: "ese clip estuvo brutal" },
  { platform: "tiktok", kind: "follow", user: "luna.tt", display: "luna.tt", text: "empezo a seguir" },
  { platform: "twitch", kind: "chat", user: "kai_live", display: "kai_live", text: "se escucha bien el audio" },
  { platform: "tiktok", kind: "sub", user: "mira", display: "mira", text: "se suscribio" },
  { platform: "twitch", kind: "chat", user: "rojo", display: "rojo", text: "buena partida" }
];

const t = () => copy[lang];

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function initials(name) {
  return String(name || "?").trim().slice(0, 2).toUpperCase();
}

function clock(ts) {
  const d = new Date(ts || Date.now());
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
}

function setDot(id, state) {
  $(id).className = "dot" + (state === "live" ? " live" : state === "error" ? " err" : state === "connecting" ? " wait" : "");
}

function applyLang() {
  const c = t();
  $("h-src").textContent = c.src;
  $("h-voice").textContent = c.voice;
  $("twitch-h").textContent = c.twH;
  $("tiktok-h").textContent = c.ttH;
  $("demo-l").textContent = c.demo;
  $("demo-h").textContent = c.demoH;
  $("tts-l").textContent = c.ttsOn;
  $("name-l").textContent = c.name;
  $("test").textContent = c.test;
  $("skip").textContent = c.skip;
  $("pause").textContent = c.pause;
  $("resume").textContent = c.resume;
  $("twitch").placeholder = c.twPh;
  $("tiktok").placeholder = c.ttPh;
  $("twitch-btn").textContent = twitchOn ? c.cut : c.connect;
  $("tiktok-btn").textContent = tiktokOn ? c.cut : c.connect;
  $("now-k").textContent = speaking ? c.reading : c.waiting;
  $("stage").textContent = document.body.classList.contains("stage") ? c.studio : c.stage;
  $("rate-l").textContent = c.rate;
  $("voice-l").textContent = c.voiceL;
  $("ttkey-l").textContent = c.ttKeyL;
  $("ttkey-toggle").textContent = keyVisible ? c.hideKey : c.showKey;
  $("free-note").textContent = c.free;
  $("freebadge").textContent = c.freeBadge;
  $("ck1").textContent = c.ck1;
  $("ck2").textContent = c.ck2;
  $("ck3").textContent = c.ck3;
  $("feed-empty").textContent = c.empty;
  $("pro-title").textContent = c.proTitle;
  $("pro-body").textContent = c.proBody;
  $("pro-close").textContent = c.proClose;
  $("q").textContent = queue.length + " " + c.queue;
  const onAir = twitchOn || tiktokOn || demoOn;
  $("livepill").textContent = onAir ? c.live : c.idle;
  $("livepill").className = "pill" + (onAir ? "" : " off");
}

function hideChecklist() {
  $("checklist").classList.add("hidden");
}

function markTried() {
  triedVoice = true;
  try { localStorage.setItem("voxlive-tried", "1"); } catch (e) {}
  hideChecklist();
}

function speakReady() {
  try { speechSynthesis.cancel(); } catch (e) {}
  speaking = { ready: true };
  speakStarted = Date.now();
  const u = new SpeechSynthesisUtterance(t().speak);
  u.lang = lang === "es" ? "es-ES" : "en-US";
  u.rate = rate;
  const pref = pickVoice();
  if (pref) {
    u.voice = pref;
    u.lang = pref.lang || u.lang;
  }
  u.onend = function () { kick(); };
  u.onerror = function () { speaking = null; setTimeout(kick, 120); };
  try {
    speechSynthesis.resume();
    speechSynthesis.speak(u);
  } catch (e) {}
}

function unlockFromGesture() {
  const first = !unlocked;
  unlocked = true;
  markTried();
  if (first) speakReady();
}

function addMsg(m) {
  msgN++;
  const empty = $("feed-empty");
  if (empty) empty.hidden = true;
  const wrap = document.createElement("article");
  wrap.className = "msg" + (m.kind !== "chat" ? " event" : "");
  const who = m.displayName || m.user || "?";
  const tag = m.source === "demo" ? '<span class="tag">ENSAYO</span>' : "";
  wrap.innerHTML =
    '<div class="av">' + escapeHtml(initials(who)) + "</div>" +
    "<div><div class=\"name\">" + escapeHtml(who) + tag + "</div>" +
    '<div class="body">' + escapeHtml(m.text || "") + "</div></div>" +
    "<div><div class=\"time\">" + clock(m.ts) + "</div>" +
    '<div class="plat">' + escapeHtml(m.platform || "") + "</div></div>";
  feed.appendChild(wrap);
  feed.scrollTop = feed.scrollHeight;
  while (feed.querySelectorAll(".msg").length > 220) {
    const firstMsg = feed.querySelector(".msg");
    if (firstMsg) feed.removeChild(firstMsg);
    else break;
  }
  $("msgcount").textContent = msgN + (lang === "es" ? " mensajes" : " messages");
  const raw = String(m.text || "").trim();
  if (raw.charAt(0) === "!") return;
  if (ttsOn && unlocked) {
    if (queue.length >= 10) queue.shift();
    queue.push(m);
    $("q").textContent = queue.length + " " + t().queue;
    kick();
  }
}

function speechText(m) {
  const name = readName ? (m.displayName || m.user) : "";
  if (m.kind === "gift") return (name ? name + " " : "") + "envio " + (m.giftName || "un regalo");
  if (m.kind === "follow") return (name || "alguien") + " empezo a seguir";
  if (m.kind === "sub") return (name || "alguien") + " se suscribio";
  if (m.kind === "bits") return (name || "alguien") + " mando bits";
  return name ? name + " dice " + (m.text || "") : (m.text || "");
}

function pickVoice() {
  const voices = speechSynthesis.getVoices() || [];
  if (selectedVoice) {
    const exact = voices.find(v => v.name === selectedVoice);
    if (exact) return exact;
  }
  if (lang === "es") {
    return voices.find(v => /^es-ES/i.test(v.lang || ""))
      || voices.find(v => /^es-US/i.test(v.lang || ""))
      || voices.find(v => /^es/i.test(v.lang || ""))
      || voices[0]
      || null;
  }
  return voices.find(v => /^en/i.test(v.lang || "")) || voices[0] || null;
}

function fillVoices() {
  const sel = $("voice");
  const voices = speechSynthesis.getVoices() || [];
  const prev = selectedVoice || sel.value;
  sel.innerHTML = "";
  voices.forEach(v => {
    const o = document.createElement("option");
    o.value = v.name;
    o.textContent = v.name + " (" + v.lang + ")";
    sel.appendChild(o);
  });
  if (prev) sel.value = prev;
  selectedVoice = sel.value;
}

function kick() {
  if (!unlocked || paused || speaking || !ttsOn) return;
  const next = queue.shift();
  $("q").textContent = queue.length + " " + t().queue;
  if (!next) {
    speaking = null;
    $("now-k").textContent = t().waiting;
    $("now-text").textContent = "-";
    $("now-user").textContent = "";
    return;
  }
  speaking = next;
  speakStarted = Date.now();
  $("now-k").textContent = t().reading;
  $("now-text").textContent = next.text || "";
  $("now-user").textContent = (next.displayName || next.user || "") + (next.platform ? " - " + next.platform : "");
  const u = new SpeechSynthesisUtterance(speechText(next));
  u.lang = lang === "es" ? "es-ES" : "en-US";
  u.rate = rate;
  const pref = pickVoice();
  if (pref) {
    u.voice = pref;
    u.lang = pref.lang || u.lang;
  }
  u.onend = function () { speaking = null; kick(); };
  u.onerror = function () { speaking = null; setTimeout(kick, 120); };
  try {
    speechSynthesis.resume();
    speechSynthesis.speak(u);
  } catch (e) {
    speaking = null;
  }
}

function startDemo() {
  if (demoTimer) clearInterval(demoTimer);
  demoOn = true;
  $("demo").checked = true;
  let i = 0;
  const tick = function () {
    const item = demoScript[i % demoScript.length];
    i++;
    addMsg({
      platform: item.platform,
      kind: item.kind,
      user: item.user,
      displayName: item.display,
      text: item.text,
      giftName: item.giftName,
      giftCount: item.giftCount,
      bits: item.bits,
      ts: Date.now(),
      source: "demo"
    });
  };
  tick();
  demoTimer = setInterval(tick, 3200);
  applyLang();
}

function stopDemo() {
  demoOn = false;
  $("demo").checked = false;
  if (demoTimer) clearInterval(demoTimer);
  demoTimer = null;
  applyLang();
}

function parseTwitch(raw) {
  let tags = {}, rest = raw;
  if (rest.charAt(0) === "@") {
    const sp = rest.indexOf(" ");
    rest.slice(1, sp).split(";").forEach(p => {
      const parts = p.split("=");
      tags[parts[0]] = parts[1] || "";
    });
    rest = rest.slice(sp + 1);
  }
  const prefixEnd = rest.charAt(0) === ":" ? rest.indexOf(" ") : -1;
  const prefix = prefixEnd > 0 ? rest.slice(1, prefixEnd) : "";
  const after = prefixEnd > 0 ? rest.slice(prefixEnd + 1) : rest;
  const cmdEnd = after.indexOf(" :");
  const head = cmdEnd >= 0 ? after.slice(0, cmdEnd) : after;
  const text = cmdEnd >= 0 ? after.slice(cmdEnd + 2) : "";
  return { tags: tags, nick: prefix.split("!")[0], cmd: head.split(" ")[0], text: text };
}

function startTwitch(channel) {
  stopTwitch();
  channel = channel.replace(/^#/, "").trim().toLowerCase();
  if (channel.length < 3) {
    setDot("twitch-dot", "error");
    $("twitch-st").textContent = t().twErr;
    return;
  }
  twitchOn = true;
  setDot("twitch-dot", "connecting");
  $("twitch-st").textContent = t().twWait;
  applyLang();
  const nick = "justinfan" + Math.floor(10000 + Math.random() * 80000);
  const ws = new WebSocket("wss://irc-ws.chat.twitch.tv:443");
  twitchSock = ws;
  ws.onopen = function () {
    ws.send("CAP REQ :twitch.tv/tags twitch.tv/commands");
    ws.send("PASS SCHMOOPIIE");
    ws.send("NICK " + nick);
    ws.send("JOIN #" + channel);
  };
  ws.onmessage = function (ev) {
    String(ev.data).split("\r\n").forEach(function (line) {
      if (!line) return;
      if (line.indexOf("PING") === 0) {
        ws.send("PONG :tmi.twitch.tv");
        return;
      }
      const m = parseTwitch(line);
      if (m.cmd === "001" || m.cmd === "JOIN") {
        twitchOn = true;
        setDot("twitch-dot", "live");
        $("twitch-st").textContent = t().twLive;
        applyLang();
      }
      if (m.cmd === "PRIVMSG") {
        addMsg({
          platform: "twitch",
          kind: "chat",
          user: m.nick,
          displayName: m.tags["display-name"] || m.nick,
          text: m.text,
          ts: Date.now(),
          source: "live"
        });
      }
    });
  };
  ws.onerror = function () {
    setDot("twitch-dot", "error");
    $("twitch-st").textContent = t().twErr;
    twitchOn = false;
    applyLang();
  };
  ws.onclose = function () {
    if (twitchSock === ws) {
      twitchOn = false;
      setDot("twitch-dot", "");
      $("twitch-st").textContent = t().twCut;
      applyLang();
    }
  };
}

function stopTwitch() {
  if (twitchSock) {
    try { twitchSock.close(); } catch (e) {}
    twitchSock = null;
  }
  twitchOn = false;
  setDot("twitch-dot", "");
  $("twitch-st").textContent = t().twCut;
}

function ingestTikTok(obj) {
  if (!obj) return;
  const ev = (obj.event || obj.type || obj.method || obj.eventName || "").toString().toLowerCase();
  const data = obj.data || obj.payload || obj;
  const user = data.user || data.userInfo || {};
  const name = user.nickname || user.uniqueId || user.nickName || data.uniqueId || data.nickname || "tiktok";
  const uname = user.uniqueId || user.nickName || name;
  if (ev.indexOf("chat") >= 0 || ev.indexOf("comment") >= 0 || data.comment) {
    addMsg({
      platform: "tiktok",
      kind: "chat",
      user: uname,
      displayName: name,
      text: data.comment || data.text || data.content || "",
      ts: Date.now(),
      source: "live"
    });
    return;
  }
  if (ev.indexOf("gift") >= 0) {
    const g = data.giftName || (data.gift && data.gift.name) || "regalo";
    addMsg({
      platform: "tiktok",
      kind: "gift",
      user: uname,
      displayName: name,
      text: "envio " + g,
      giftName: g,
      giftCount: data.repeatCount || 1,
      ts: Date.now(),
      source: "live"
    });
    return;
  }
  if (ev.indexOf("follow") >= 0 || ev.indexOf("social") >= 0) {
    addMsg({
      platform: "tiktok",
      kind: "follow",
      user: uname,
      displayName: name,
      text: "empezo a seguir",
      ts: Date.now(),
      source: "live"
    });
    return;
  }
  if (ev.indexOf("sub") >= 0 || ev.indexOf("subscribe") >= 0 || ev.indexOf("member") >= 0) {
    addMsg({
      platform: "tiktok",
      kind: "sub",
      user: uname,
      displayName: name,
      text: "se suscribio",
      ts: Date.now(),
      source: "live"
    });
    return;
  }
  if (Array.isArray(obj.messages)) obj.messages.forEach(ingestTikTok);
}

function classifyTikTokError(obj) {
  const blob = JSON.stringify(obj || {}).toLowerCase();
  if (/invalid|unauthorized|unauthorised|forbidden|api.?key|401|403|clave/.test(blob)) return "ttKey";
  if (/not.?live|offline|isn'?t live|is not live|not in live|no.?esta|ended/.test(blob)) return "ttOff";
  return "ttErr";
}

function startTikTok(user) {
  stopTikTok();
  user = user.replace(/^@/, "").trim();
  const key = ($("ttkey").value || "").trim();
  if (user.length < 2) {
    setDot("tiktok-dot", "error");
    $("tiktok-st").textContent = t().ttErr;
    return;
  }
  if (!key) {
    setDot("tiktok-dot", "error");
    $("tiktok-st").textContent = t().ttNeed;
    return;
  }
  stopDemo();
  tiktokOn = true;
  setDot("tiktok-dot", "connecting");
  $("tiktok-st").textContent = t().ttWait;
  applyLang();
  const urls = [
    "wss://ws.eulerstream.com?uniqueId=" + encodeURIComponent(user) + "&apiKey=" + encodeURIComponent(key),
    "wss://api.tik.tools/?uniqueId=" + encodeURIComponent(user) + "&apiKey=" + encodeURIComponent(key)
  ];
  let i = 0;
  function tryNext() {
    if (i >= urls.length) {
      tiktokOn = false;
      setDot("tiktok-dot", "error");
      $("tiktok-st").textContent = t().ttErr;
      applyLang();
      return;
    }
    const url = urls[i++];
    let opened = false;
    const ws = new WebSocket(url);
    tiktokSock = ws;
    ws.onopen = function () {
      opened = true;
      tiktokOn = true;
      setDot("tiktok-dot", "live");
      $("tiktok-st").textContent = t().ttLive;
      applyLang();
    };
    ws.onmessage = function (ev) {
      let raw = ev.data;
      if (typeof raw !== "string") return;
      try {
        const obj = JSON.parse(raw);
        if (obj.event === "error" || obj.type === "error" || obj.error || obj.status === "error") {
          const kind = classifyTikTokError(obj);
          setDot("tiktok-dot", "error");
          $("tiktok-st").textContent = t()[kind];
          tiktokOn = kind === "ttOff" || kind === "ttKey" ? false : tiktokOn;
          applyLang();
          return;
        }
        ingestTikTok(obj);
      } catch (e) {}
    };
    ws.onerror = function () {};
    ws.onclose = function () {
      if (tiktokSock === ws) {
        if (!opened) tryNext();
        else {
          tiktokOn = false;
          setDot("tiktok-dot", "");
          $("tiktok-st").textContent = t().ttCut;
          applyLang();
        }
      }
    };
  }
  tryNext();
}

function stopTikTok() {
  if (tiktokSock) {
    try { tiktokSock.close(); } catch (e) {}
    tiktokSock = null;
  }
  tiktokOn = false;
  setDot("tiktok-dot", "");
  $("tiktok-st").textContent = t().ttCut;
}

function save() {
  try {
    localStorage.setItem("voxlive", JSON.stringify({
      lang: lang,
      twitch: $("twitch").value,
      tiktok: $("tiktok").value,
      ttkey: $("ttkey").value,
      ttsOn: ttsOn,
      readName: readName,
      rate: rate,
      selectedVoice: selectedVoice,
      demoOn: demoOn
    }));
  } catch (e) {}
}

function load() {
  try {
    triedVoice = localStorage.getItem("voxlive-tried") === "1";
    if (triedVoice) hideChecklist();
    const s = JSON.parse(localStorage.getItem("voxlive") || "{}");
    if (s.lang) lang = s.lang;
    if (s.twitch) $("twitch").value = s.twitch;
    if (s.tiktok) $("tiktok").value = s.tiktok;
    if (s.ttkey) $("ttkey").value = s.ttkey;
    if (typeof s.ttsOn === "boolean") {
      ttsOn = s.ttsOn;
      $("tts").checked = ttsOn;
    }
    if (typeof s.readName === "boolean") {
      readName = s.readName;
      $("readname").checked = readName;
    }
    if (s.rate) {
      rate = Number(s.rate);
      $("rate").value = rate;
      $("rate-v").textContent = rate.toFixed(1) + "x";
    }
    if (s.selectedVoice) selectedVoice = s.selectedVoice;
    if (typeof s.demoOn === "boolean") demoOn = s.demoOn;
    $("es").classList.toggle("on", lang === "es");
    $("en").classList.toggle("on", lang === "en");
  } catch (e) {}
}

function syncStage() {
  const on = location.hash === "#stage";
  document.body.classList.toggle("stage", on);
  applyLang();
}

$("es").onclick = function () {
  lang = "es";
  $("es").classList.add("on");
  $("en").classList.remove("on");
  applyLang();
  save();
};
$("en").onclick = function () {
  lang = "en";
  $("en").classList.add("on");
  $("es").classList.remove("on");
  applyLang();
  save();
};
$("tts").onchange = function (e) {
  ttsOn = e.target.checked;
  if (!ttsOn) {
    try { speechSynthesis.cancel(); } catch (err) {}
    queue.length = 0;
    speaking = null;
  }
  save();
};
$("readname").onchange = function (e) {
  readName = e.target.checked;
  save();
};
$("voice").onchange = function (e) {
  selectedVoice = e.target.value;
  save();
};
$("rate").oninput = function (e) {
  rate = Number(e.target.value);
  $("rate-v").textContent = rate.toFixed(1) + "x";
  save();
};
$("demo").onchange = function (e) {
  if (e.target.checked) startDemo();
  else stopDemo();
  save();
};
$("test").onclick = function () {
  unlocked = true;
  markTried();
  try { speechSynthesis.cancel(); } catch (e) {}
  speaking = null;
  queue.length = 0;
  speakReady();
};
$("skip").onclick = function () {
  try { speechSynthesis.cancel(); } catch (e) {}
  speaking = null;
  kick();
};
$("pause").onclick = function () {
  paused = true;
  try { speechSynthesis.pause(); } catch (e) {}
};
$("resume").onclick = function () {
  paused = false;
  try { speechSynthesis.resume(); } catch (e) {}
  if (!speaking) kick();
};
$("stage").onclick = function () {
  if (location.hash === "#stage") {
    history.replaceState(null, "", location.pathname + location.search);
  } else {
    location.hash = "stage";
  }
  syncStage();
};
$("twitch-btn").onclick = function () {
  if (twitchOn) {
    stopTwitch();
  } else {
    unlockFromGesture();
    const ch = $("twitch").value.replace(/^#/, "").trim();
    if (ch.length >= 3) stopDemo();
    startTwitch($("twitch").value);
  }
  applyLang();
  save();
};
$("tiktok-btn").onclick = function () {
  if (tiktokOn) {
    stopTikTok();
  } else {
    unlockFromGesture();
    startTikTok($("tiktok").value);
  }
  applyLang();
  save();
};
$("ttkey-toggle").onclick = function () {
  keyVisible = !keyVisible;
  $("ttkey").type = keyVisible ? "text" : "password";
  $("ttkey-toggle").textContent = keyVisible ? t().hideKey : t().showKey;
};

$("freebadge").onclick = function () {
  $("pro-modal").classList.remove("hidden");
};
$("pro-close").onclick = function () {
  $("pro-modal").classList.add("hidden");
};
$("twitch").onchange = save;
$("tiktok").onchange = save;
$("ttkey").onchange = save;

window.addEventListener("hashchange", syncStage);

setInterval(function () {
  if (speaking && speakStarted && Date.now() - speakStarted > 8000) {
    try { speechSynthesis.cancel(); } catch (e) {}
    speaking = null;
    kick();
  }
}, 1000);

speechSynthesis.onvoiceschanged = fillVoices;
load();
fillVoices();
syncStage();
applyLang();
if (demoOn) startDemo();
else {
  $("demo").checked = false;
  applyLang();
}
