const $ = id => document.getElementById(id);

const BOTS = /^(nightbot|streamelements|streamlabs|moobot|fossabot|wizebot|soundalerts|sery_bot|kofistreambot|tiktoklive|bot)$/i;
const EMOTE_ONLY = /^(?:[\s\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}<\w\d]+)+$/u;

const copy = {
  es: {
    live: "AL AIRE", idle: "EN ESPERA", connect: "Conectar", cut: "Cortar",
    src: "Fuentes",
    twH: "Canal sin #. Twitch no pide contraseña. Si se cae, reconecta solo.",
    ttH: 'TikTok necesita LIVE abierto y una <a href="https://www.eulerstream.com/register" target="_blank" rel="noopener">clave gratis en eulerstream.com</a>. Sin clave no hay chat real de TikTok.',
    twPh: "canal, sin #", ttPh: "usuario, sin @",
    demo: "Ensayo", demoH: "Simulado. Se apaga al conectar en vivo.",
    voice: "Voz", ttsOn: "Leer en voz alta", name: "Decir el nombre",
    test: "Probar voz", pause: "Pausa", resume: "Seguir", skip: "Saltar", clear: "Vaciar",
    waiting: "En silencio", reading: "Leyendo", queue: "en cola",
    speak: "VoxStream listo", stage: "Escenario", studio: "Estudio",
    rate: "Velocidad", vol: "Volumen", pitch: "Tono", voiceL: "Voz",
    filter: "Filtros", gift: "Leer regalos", follow: "Leer follows", sub: "Leer subs",
    bots: "Saltar bots", emo: "Saltar solo emotes", qmax: "Cola máx",
    keys: "Atajos: S saltar, P pausa (fuera de un campo).",
    soon: "Después", soonH: "Plus y Pro se abren en el mismo estudio. Hoy no hay cobro.",
    lockPlus: "Plus: filtros extra", lockPro: "Pro: YouTube + ElevenLabs",
    twWait: "conectando", twLive: "al aire", twErr: "error", twCut: "cortado", twRetry: "reconectando",
    ttWait: "conectando", ttLive: "al aire", ttNeed: "falta clave", ttOff: "no está en vivo",
    ttKey: "clave inválida", ttErr: "error", ttCut: "cortado",
    ttKeyL: "Clave TikTok (gratis)", showKey: "Mostrar", hideKey: "Ocultar",
    free: "Uso gratuito. Planes después.", freeBadge: "VOXSTREAM FREE",
    ck1: "Pulsa Probar voz", ck2: "Conecta Twitch (canal en directo)", ck3: "TikTok: clave + usuario en LIVE",
    empty: "Conecta Twitch o activa Ensayo para ver el chat. TikTok necesita LIVE abierto y una clave de eulerstream.com.",
    proTitle: "Próximamente", proBody: "Hoy VoxStream es Free. Plus y Pro se activan en este mismo estudio cuando haya cuenta.",
    proClose: "Cerrar", ttPhKey: "Pega aquí tu API key"
  },
  en: {
    live: "ON AIR", idle: "IDLE", connect: "Connect", cut: "Cut",
    src: "Sources",
    twH: "Channel, no #. Twitch does not ask for a password. It reconnects if the socket drops.",
    ttH: 'TikTok needs an open LIVE and a <a href="https://www.eulerstream.com/register" target="_blank" rel="noopener">free key at eulerstream.com</a>. No key means no real TikTok chat.',
    twPh: "channel, no #", ttPh: "username, no @",
    demo: "Rehearsal", demoH: "Simulated. Turns off when a live source connects.",
    voice: "Voice", ttsOn: "Read aloud", name: "Say the name",
    test: "Test voice", pause: "Pause", resume: "Continue", skip: "Skip", clear: "Clear",
    waiting: "Silent", reading: "Reading", queue: "queued",
    speak: "VoxStream is ready.", stage: "Stage", studio: "Studio",
    rate: "Rate", vol: "Volume", pitch: "Pitch", voiceL: "Voice",
    filter: "Filters", gift: "Read gifts", follow: "Read follows", sub: "Read subs",
    bots: "Skip bots", emo: "Skip emote-only", qmax: "Max queue",
    keys: "Shortcuts: S skip, P pause (when not typing).",
    soon: "Later", soonH: "Plus and Pro unlock in this same studio. No charges today.",
    lockPlus: "Plus: extra filters", lockPro: "Pro: YouTube + ElevenLabs",
    twWait: "connecting", twLive: "on air", twErr: "error", twCut: "cut", twRetry: "reconnecting",
    ttWait: "connecting", ttLive: "on air", ttNeed: "missing key", ttOff: "not live",
    ttKey: "invalid key", ttErr: "error", ttCut: "cut",
    ttKeyL: "TikTok key (free)", showKey: "Show", hideKey: "Hide",
    free: "Free to use. Plans later.", freeBadge: "VOXSTREAM FREE",
    ck1: "Click Test voice", ck2: "Connect Twitch (live channel)", ck3: "TikTok: key + user in LIVE",
    empty: "Connect Twitch or turn on Rehearsal to see chat. TikTok needs an open LIVE and a key from eulerstream.com.",
    proTitle: "Coming soon", proBody: "VoxStream is Free today. Plus and Pro will unlock in this same studio when accounts exist.",
    proClose: "Close", ttPhKey: "Paste your API key"
  }
};

let lang = "es";
let ttsOn = true;
let readName = true;
let readGift = true;
let readFollow = true;
let readSub = true;
let skipBots = true;
let skipEmo = true;
let paused = false;
let rate = 1;
let volume = 1;
let pitch = 1;
let maxQ = 12;
let twitchOn = false;
let tiktokOn = false;
let demoOn = true;
let twitchWanted = false;
let twitchChannel = "";
let twitchRetry = null;
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
let checklistClosed = false;
let lastSpeakKey = "";
let lastSpeakAt = 0;

const queue = [];
const feed = $("feed");
const t = () => copy[lang];

const demoScript = [
  { platform: "tiktok", kind: "chat", user: "valeria.r", display: "valeria.r", text: "hola, acabo de entrar" },
  { platform: "twitch", kind: "chat", user: "nexo_", display: "nexo_", text: "vamos con todo hoy" },
  { platform: "tiktok", kind: "gift", user: "mar.ok", display: "mar.ok", text: "envió Rosa", giftName: "Rosa", giftCount: 5 },
  { platform: "twitch", kind: "chat", user: "SofiaPlays", display: "SofiaPlays", text: "ese clip estuvo brutal" },
  { platform: "tiktok", kind: "follow", user: "luna.tt", display: "luna.tt", text: "empezó a seguir" },
  { platform: "twitch", kind: "bits", user: "kai_live", display: "kai_live", text: "100 bits", bits: 100 },
  { platform: "tiktok", kind: "sub", user: "mira", display: "mira", text: "se suscribió" },
  { platform: "twitch", kind: "chat", user: "rojo", display: "rojo", text: "buena partida" }
];

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function initials(name) { return String(name || "?").trim().slice(0, 2).toUpperCase(); }
function clock(ts) {
  const d = new Date(ts || Date.now());
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
}
function setDot(id, state) {
  $(id).className = "dot" + (state === "live" ? " live" : state === "error" ? " err" : state === "connecting" ? " wait" : "");
}
function openSoon() { $("pro-modal").classList.remove("hidden"); }

function isEmoteOnly(text, tags) {
  if (tags && tags["emote-only"] === "1") return true;
  const raw = String(text || "").trim();
  if (!raw) return true;
  const stripped = raw.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "").replace(/\s+/g, "");
  return stripped.length === 0;
}

function shouldSkipSpeak(m) {
  const raw = String(m.text || "").trim();
  const user = String(m.user || m.displayName || "");
  if (skipBots && BOTS.test(user.replace(/_$/, ""))) return true;
  if (m.kind === "gift" && !readGift) return true;
  if (m.kind === "follow" && !readFollow) return true;
  if ((m.kind === "sub" || m.kind === "bits") && !readSub) return true;
  if (m.kind !== "chat" && m.kind !== "bits") return false;
  if (!raw) return true;
  if (raw.charAt(0) === "!") return true;
  if (/^https?:\/\//i.test(raw)) return true;
  if (/^[\w.-]+\.[a-z]{2,}\/\S+/i.test(raw)) return true;
  if (skipEmo && isEmoteOnly(raw, m.tags)) return true;
  const key = user.toLowerCase() + "|" + raw.toLowerCase();
  if (key === lastSpeakKey && Date.now() - lastSpeakAt < 2500) return true;
  return false;
}

function applyVoice(u) {
  u.rate = rate; u.volume = volume; u.pitch = pitch;
  const pref = pickVoice();
  if (pref) { u.voice = pref; u.lang = pref.lang || u.lang; }
}

function applyLang() {
  const c = t();
  const set = (id, v, html) => { const el = $(id); if (!el) return; if (html) el.innerHTML = v; else el.textContent = v; };
  set("h-src", c.src); set("h-voice", c.voice); set("h-filter", c.filter); set("h-soon", c.soon);
  set("twitch-h", c.twH); set("tiktok-h", c.ttH, true);
  set("demo-l", c.demo); set("demo-h", c.demoH);
  set("tts-l", c.ttsOn); set("name-l", c.name); set("test", c.test);
  set("skip", c.skip); set("clearq", c.clear);
  set("pause", paused ? c.resume : c.pause);
  if ($("twitch")) $("twitch").placeholder = c.twPh;
  if ($("tiktok")) $("tiktok").placeholder = c.ttPh;
  if ($("ttkey") && c.ttPhKey) $("ttkey").placeholder = c.ttPhKey;
  set("twitch-btn", twitchOn ? c.cut : c.connect);
  set("tiktok-btn", tiktokOn ? c.cut : c.connect);
  set("now-k", speaking ? c.reading : c.waiting);
  set("stage", document.body.classList.contains("stage") ? c.studio : c.stage);
  set("rate-l", c.rate); set("vol-l", c.vol); set("pitch-l", c.pitch); set("voice-l", c.voiceL);
  set("gift-l", c.gift); set("follow-l", c.follow); set("sub-l", c.sub);
  set("bot-l", c.bots); set("emo-l", c.emo); set("qmax-l", c.qmax); set("keys-h", c.keys);
  set("soon-h", c.soonH); set("lock-plus", c.lockPlus); set("lock-pro", c.lockPro);
  set("ttkey-l", c.ttKeyL);
  set("ttkey-toggle", keyVisible ? c.hideKey : c.showKey);
  set("free-note", c.free); set("freebadge", c.freeBadge);
  set("ck1", c.ck1); set("ck2", c.ck2); set("ck3", c.ck3);
  set("feed-empty", c.empty);
  set("pro-title", c.proTitle); set("pro-body", c.proBody); set("pro-close", c.proClose);
  set("q", queue.length + " " + c.queue);
  const onAir = twitchOn || tiktokOn || demoOn;
  set("livepill", onAir ? c.live : c.idle);
  if ($("livepill")) $("livepill").className = "pill" + (onAir ? "" : " off");
}

function hideChecklist() { if ($("checklist")) $("checklist").classList.add("hidden"); }
function maybeHideChecklist() { if (checklistClosed || (triedVoice && twitchOn)) hideChecklist(); }
function markTried() {
  triedVoice = true;
  try { localStorage.setItem("voxlive-tried", "1"); } catch (e) {}
  maybeHideChecklist();
}

function speakReady() {
  try { speechSynthesis.cancel(); } catch (e) {}
  speaking = { ready: true };
  speakStarted = Date.now();
  const u = new SpeechSynthesisUtterance(t().speak);
  u.lang = lang === "es" ? "es-ES" : "en-US";
  applyVoice(u);
  u.onend = function () { speaking = null; kick(); };
  u.onerror = function () { speaking = null; setTimeout(kick, 120); };
  try { speechSynthesis.resume(); speechSynthesis.speak(u); } catch (e) {}
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
    if (firstMsg) feed.removeChild(firstMsg); else break;
  }
  if ($("msgcount")) $("msgcount").textContent = msgN + (lang === "es" ? " mensajes" : " messages");
  if (shouldSkipSpeak(m)) return;
  if (ttsOn && unlocked) {
    lastSpeakKey = String(m.user || "").toLowerCase() + "|" + String(m.text || "").toLowerCase();
    lastSpeakAt = Date.now();
    if (queue.length >= maxQ) queue.shift();
    queue.push(m);
    $("q").textContent = queue.length + " " + t().queue;
    kick();
  }
}

function speechText(m) {
  const name = readName ? (m.displayName || m.user) : "";
  if (m.kind === "gift") return (name ? name + " " : "") + "envió " + (m.giftName || "un regalo");
  if (m.kind === "follow") return (name || "alguien") + " empezó a seguir";
  if (m.kind === "sub") return (name || "alguien") + " se suscribió";
  if (m.kind === "bits") return (name || "alguien") + " mandó " + (m.bits || "") + " bits";
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
      || voices[0] || null;
  }
  return voices.find(v => /^en/i.test(v.lang || "")) || voices[0] || null;
}

function fillVoices() {
  const sel = $("voice");
  if (!sel) return;
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
  applyVoice(u);
  u.onend = function () { speaking = null; kick(); };
  u.onerror = function () { speaking = null; setTimeout(kick, 120); };
  try { speechSynthesis.resume(); speechSynthesis.speak(u); } catch (e) { speaking = null; }
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
      platform: item.platform, kind: item.kind, user: item.user, displayName: item.display,
      text: item.text, giftName: item.giftName, giftCount: item.giftCount, bits: item.bits,
      ts: Date.now(), source: "demo"
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

function startTwitch(channel, isRetry) {
  if (!isRetry) stopTwitch(false);
  channel = String(channel || "").replace(/^#/, "").trim().toLowerCase();
  if (channel.length < 3) {
    setDot("twitch-dot", "error");
    $("twitch-st").textContent = t().twErr;
    return;
  }
  twitchChannel = channel;
  twitchWanted = true;
  twitchOn = true;
  setDot("twitch-dot", "connecting");
  $("twitch-st").textContent = isRetry ? t().twRetry : t().twWait;
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
      if (line.indexOf("PING") === 0) { ws.send("PONG :tmi.twitch.tv"); return; }
      const m = parseTwitch(line);
      if (m.cmd === "001" || m.cmd === "JOIN") {
        twitchOn = true;
        setDot("twitch-dot", "live");
        $("twitch-st").textContent = t().twLive;
        applyLang();
        maybeHideChecklist();
      }
      if (m.cmd === "PRIVMSG") {
        const bits = Number(m.tags.bits || 0);
        addMsg({
          platform: "twitch",
          kind: bits ? "bits" : "chat",
          user: m.nick,
          displayName: m.tags["display-name"] || m.nick,
          text: bits ? (bits + " bits" + (m.text ? " " + m.text : "")) : m.text,
          bits: bits || undefined,
          tags: m.tags,
          ts: Date.now(),
          source: "live"
        });
      }
      if (m.cmd === "USERNOTICE") {
        const id = (m.tags["msg-id"] || "").toLowerCase();
        const who = m.tags["display-name"] || m.nick;
        if (/sub|resub|subgift|gift/.test(id)) {
          addMsg({ platform: "twitch", kind: "sub", user: m.nick, displayName: who, text: m.text || "se suscribió", ts: Date.now(), source: "live" });
        }
      }
    });
  };
  ws.onerror = function () {
    setDot("twitch-dot", "error");
    $("twitch-st").textContent = t().twErr;
  };
  ws.onclose = function () {
    if (twitchSock !== ws) return;
    twitchSock = null;
    twitchOn = false;
    if (twitchWanted) {
      setDot("twitch-dot", "connecting");
      $("twitch-st").textContent = t().twRetry;
      applyLang();
      twitchRetry = setTimeout(function () { startTwitch(twitchChannel, true); }, 2200);
    } else {
      setDot("twitch-dot", "");
      $("twitch-st").textContent = t().twCut;
      applyLang();
    }
  };
}

function stopTwitch(userStop) {
  if (userStop !== false) twitchWanted = false;
  if (twitchRetry) { clearTimeout(twitchRetry); twitchRetry = null; }
  if (twitchSock) { try { twitchSock.close(); } catch (e) {} twitchSock = null; }
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
    addMsg({ platform: "tiktok", kind: "chat", user: uname, displayName: name, text: data.comment || data.text || data.content || "", ts: Date.now(), source: "live" });
    return;
  }
  if (ev.indexOf("gift") >= 0) {
    const g = data.giftName || (data.gift && data.gift.name) || "regalo";
    addMsg({ platform: "tiktok", kind: "gift", user: uname, displayName: name, text: "envió " + g, giftName: g, giftCount: data.repeatCount || 1, ts: Date.now(), source: "live" });
    return;
  }
  if (ev.indexOf("follow") >= 0 || ev.indexOf("social") >= 0) {
    addMsg({ platform: "tiktok", kind: "follow", user: uname, displayName: name, text: "empezó a seguir", ts: Date.now(), source: "live" });
    return;
  }
  if (ev.indexOf("sub") >= 0 || ev.indexOf("subscribe") >= 0 || ev.indexOf("member") >= 0) {
    addMsg({ platform: "tiktok", kind: "sub", user: uname, displayName: name, text: "se suscribió", ts: Date.now(), source: "live" });
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
  if (user.length < 2) { setDot("tiktok-dot", "error"); $("tiktok-st").textContent = t().ttErr; return; }
  if (!key) { setDot("tiktok-dot", "error"); $("tiktok-st").textContent = t().ttNeed; return; }
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
      tiktokOn = false; setDot("tiktok-dot", "error"); $("tiktok-st").textContent = t().ttErr; applyLang(); return;
    }
    const url = urls[i++];
    let opened = false;
    const ws = new WebSocket(url);
    tiktokSock = ws;
    ws.onopen = function () {
      opened = true; tiktokOn = true; setDot("tiktok-dot", "live"); $("tiktok-st").textContent = t().ttLive; applyLang();
    };
    ws.onmessage = function (ev) {
      if (typeof ev.data !== "string") return;
      try {
        const obj = JSON.parse(ev.data);
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
      if (tiktokSock !== ws) return;
      if (!opened) tryNext();
      else { tiktokOn = false; setDot("tiktok-dot", ""); $("tiktok-st").textContent = t().ttCut; applyLang(); }
    };
  }
  tryNext();
}

function stopTikTok() {
  if (tiktokSock) { try { tiktokSock.close(); } catch (e) {} tiktokSock = null; }
  tiktokOn = false;
  setDot("tiktok-dot", "");
  $("tiktok-st").textContent = t().ttCut;
}

function save() {
  try {
    localStorage.setItem("voxlive", JSON.stringify({
      lang, twitch: $("twitch").value, tiktok: $("tiktok").value, ttkey: $("ttkey").value,
      ttsOn, readName, readGift, readFollow, readSub, skipBots, skipEmo,
      rate, volume, pitch, maxQ, selectedVoice, demoOn
    }));
  } catch (e) {}
}

function bindToggle(id, apply) {
  const el = $(id);
  if (!el) return;
  el.onchange = function (e) { apply(e.target.checked); save(); };
}

function load() {
  try {
    triedVoice = localStorage.getItem("voxlive-tried") === "1";
    checklistClosed = localStorage.getItem("voxlive-ck-closed") === "1";
    if (checklistClosed) hideChecklist();
    const s = JSON.parse(localStorage.getItem("voxlive") || "{}");
    if (s.lang) lang = s.lang;
    if (s.twitch) $("twitch").value = s.twitch;
    if (s.tiktok) $("tiktok").value = s.tiktok;
    if (s.ttkey) $("ttkey").value = s.ttkey;
    const flags = [
      ["ttsOn", "tts", v => ttsOn = v],
      ["readName", "readname", v => readName = v],
      ["readGift", "readgift", v => readGift = v],
      ["readFollow", "readfollow", v => readFollow = v],
      ["readSub", "readsub", v => readSub = v],
      ["skipBots", "skipbots", v => skipBots = v],
      ["skipEmo", "skipemo", v => skipEmo = v]
    ];
    flags.forEach(function (row) {
      if (typeof s[row[0]] === "boolean") {
        row[2](s[row[0]]);
        if ($(row[1])) $(row[1]).checked = s[row[0]];
      }
    });
    if (s.rate) { rate = Number(s.rate); $("rate").value = rate; $("rate-v").textContent = rate.toFixed(1) + "x"; }
    if (s.volume && $("vol")) { volume = Number(s.volume); $("vol").value = volume; $("vol-v").textContent = volume.toFixed(1); }
    if (s.pitch && $("pitch")) { pitch = Number(s.pitch); $("pitch").value = pitch; $("pitch-v").textContent = pitch.toFixed(1); }
    if (s.maxQ && $("qmax")) { maxQ = Number(s.maxQ); $("qmax").value = maxQ; $("qmax-v").textContent = String(maxQ); }
    if (s.selectedVoice) selectedVoice = s.selectedVoice;
    if (typeof s.demoOn === "boolean") demoOn = s.demoOn;
    $("es").classList.toggle("on", lang === "es");
    $("en").classList.toggle("on", lang === "en");
  } catch (e) {}
}

function syncStage() {
  document.body.classList.toggle("stage", location.hash === "#stage");
  applyLang();
}

$("es").onclick = function () { lang = "es"; $("es").classList.add("on"); $("en").classList.remove("on"); applyLang(); save(); };
$("en").onclick = function () { lang = "en"; $("en").classList.add("on"); $("es").classList.remove("on"); applyLang(); save(); };
$("tts").onchange = function (e) {
  ttsOn = e.target.checked;
  if (!ttsOn) { try { speechSynthesis.cancel(); } catch (err) {} queue.length = 0; speaking = null; }
  save();
};
bindToggle("readname", v => readName = v);
bindToggle("readgift", v => readGift = v);
bindToggle("readfollow", v => readFollow = v);
bindToggle("readsub", v => readSub = v);
bindToggle("skipbots", v => skipBots = v);
bindToggle("skipemo", v => skipEmo = v);
$("voice").onchange = function (e) { selectedVoice = e.target.value; save(); };
$("rate").oninput = function (e) { rate = Number(e.target.value); $("rate-v").textContent = rate.toFixed(1) + "x"; save(); };
if ($("vol")) $("vol").oninput = function (e) { volume = Number(e.target.value); $("vol-v").textContent = volume.toFixed(1); save(); };
if ($("pitch")) $("pitch").oninput = function (e) { pitch = Number(e.target.value); $("pitch-v").textContent = pitch.toFixed(1); save(); };
if ($("qmax")) $("qmax").oninput = function (e) { maxQ = Number(e.target.value); $("qmax-v").textContent = String(maxQ); save(); };
$("demo").onchange = function (e) { if (e.target.checked) startDemo(); else stopDemo(); save(); };
$("test").onclick = function () {
  unlocked = true; markTried();
  try { speechSynthesis.cancel(); } catch (e) {}
  speaking = null; queue.length = 0; speakReady();
};
$("skip").onclick = function () { try { speechSynthesis.cancel(); } catch (e) {} speaking = null; kick(); };
if ($("clearq")) $("clearq").onclick = function () {
  queue.length = 0;
  try { speechSynthesis.cancel(); } catch (e) {}
  speaking = null;
  applyLang();
  kick();
};
$("pause").onclick = function () {
  paused = !paused;
  $("pause").textContent = paused ? t().resume : t().pause;
  if (paused) { try { speechSynthesis.pause(); } catch (e) {} }
  else { try { speechSynthesis.resume(); } catch (e) {} if (!speaking) kick(); }
};
$("stage").onclick = function () {
  if (location.hash === "#stage") history.replaceState(null, "", location.pathname + location.search);
  else location.hash = "stage";
  syncStage();
};
$("twitch-btn").onclick = function () {
  if (twitchOn || twitchWanted) stopTwitch(true);
  else {
    unlockFromGesture();
    const ch = $("twitch").value.replace(/^#/, "").trim();
    if (ch.length >= 3) stopDemo();
    startTwitch($("twitch").value);
  }
  applyLang(); save();
};
$("tiktok-btn").onclick = function () {
  if (tiktokOn) stopTikTok();
  else { unlockFromGesture(); startTikTok($("tiktok").value); }
  applyLang(); save();
};
$("ttkey-toggle").onclick = function () {
  keyVisible = !keyVisible;
  $("ttkey").type = keyVisible ? "text" : "password";
  $("ttkey-toggle").textContent = keyVisible ? t().hideKey : t().showKey;
};
$("checklist-x").onclick = function () {
  checklistClosed = true;
  try { localStorage.setItem("voxlive-ck-closed", "1"); } catch (e) {}
  hideChecklist();
};
$("freebadge").onclick = openSoon;
$("pro-close").onclick = function () { $("pro-modal").classList.add("hidden"); };
["lock-plus", "lock-pro"].forEach(function (id) { if ($(id)) $(id).onclick = openSoon; });
$("twitch").onchange = save; $("tiktok").onchange = save; $("ttkey").onchange = save;

window.addEventListener("hashchange", syncStage);
window.addEventListener("keydown", function (e) {
  const tag = (e.target && e.target.tagName) || "";
  if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
  if (e.key === "s" || e.key === "S") { e.preventDefault(); $("skip").click(); }
  if (e.key === "p" || e.key === "P") { e.preventDefault(); $("pause").click(); }
});

setInterval(function () {
  if (speaking && speakStarted && Date.now() - speakStarted > 8000) {
    try { speechSynthesis.cancel(); } catch (e) {}
    speaking = null; kick();
  }
}, 1000);

speechSynthesis.onvoiceschanged = fillVoices;
load(); fillVoices(); syncStage(); applyLang();
if (demoOn) startDemo();
else { $("demo").checked = false; applyLang(); }
