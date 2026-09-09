const $ = id => document.getElementById(id);

const BOTS = /^(nightbot|streamelements|streamlabs|moobot|fossabot|wizebot|soundalerts|sery_bot|kofistreambot|tiktoklive|bot)$/i;
const EMOTE_ONLY = /^(?:[\s\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}<\w\d]+)+$/u;

const copy = {
  en: {
    live: "ON AIR", idle: "IDLE", connect: "Connect", cut: "Cut",
    src: "Sources",
    twH: "Channel, no #. Twitch does not ask for a password. It reconnects if the socket drops.",
    twPh: "channel, no #",
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
    free: "Free to use. Plans later.", freeBadge: "VOXSTREAM FREE",
    ck1: "Click Test voice", ck2: "Connect Twitch (live channel)", ck3: "Connect Twitch, or use Rehearsal",
    empty: "Connect Twitch or turn on Rehearsal to see chat.",
    proTitle: "Coming soon", proBody: "VoxStream is Free today. Plus and Pro will unlock in this same studio when accounts exist.",
    proClose: "Close"
  }
};

let lang = "en";
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
let maxQ = 8;
const SPEAK_FRESH_MS = 5000;
let twitchOn = false;
let demoOn = true;
let twitchWanted = false;
let twitchChannel = "";
let twitchRetry = null;
let twitchSock = null;
let demoTimer = null;
let selectedVoice = "";
let speaking = null;
let msgN = 0;
let unlocked = false;
let speakStarted = 0;
let triedVoice = false;
let checklistClosed = false;
let lastSpeakKey = "";
let lastSpeakAt = 0;

const queue = [];
const feed = $("feed");
const t = () => copy[lang];

const demoScript = [
  { platform: "twitch", kind: "chat", user: "valeria.r", display: "valeria.r", text: "just hopped in, hello" },
  { platform: "twitch", kind: "chat", user: "nexo_", display: "nexo_", text: "let's go today" },
  { platform: "twitch", kind: "gift", user: "mar.ok", display: "mar.ok", text: "sent Rose", giftName: "Rose", giftCount: 5 },
  { platform: "twitch", kind: "chat", user: "SofiaPlays", display: "SofiaPlays", text: "that clip was brutal" },
  { platform: "twitch", kind: "follow", user: "luna.tt", display: "luna.tt", text: "followed" },
  { platform: "twitch", kind: "bits", user: "kai_live", display: "kai_live", text: "100 bits", bits: 100 },
  { platform: "twitch", kind: "sub", user: "mira", display: "mira", text: "subscribed" },
  { platform: "twitch", kind: "chat", user: "rojo", display: "rojo", text: "good game" }
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
  set("twitch-h", c.twH);
  set("demo-l", c.demo); set("demo-h", c.demoH);
  set("tts-l", c.ttsOn); set("name-l", c.name); set("test", c.test);
  set("skip", c.skip); set("clearq", c.clear);
  set("pause", paused ? c.resume : c.pause);
  if ($("twitch")) $("twitch").placeholder = c.twPh;
  set("twitch-btn", twitchOn ? c.cut : c.connect);
  set("now-k", speaking ? c.reading : c.waiting);
  set("stage", document.body.classList.contains("stage") ? c.studio : c.stage);
  set("rate-l", c.rate); set("vol-l", c.vol); set("pitch-l", c.pitch); set("voice-l", c.voiceL);
  set("gift-l", c.gift); set("follow-l", c.follow); set("sub-l", c.sub);
  set("bot-l", c.bots); set("emo-l", c.emo); set("qmax-l", c.qmax); set("keys-h", c.keys);
  set("soon-h", c.soonH); set("lock-plus", c.lockPlus); set("lock-pro", c.lockPro);
  set("free-note", c.free); set("freebadge", c.freeBadge);
  set("ck1", c.ck1); set("ck2", c.ck2); set("ck3", c.ck3);
  set("feed-empty", c.empty);
  set("pro-title", c.proTitle); set("pro-body", c.proBody); set("pro-close", c.proClose);
  set("q", queue.length + " " + c.queue);
  const onAir = twitchOn || demoOn;
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
  u.lang = "en-US";
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


function trimSpeakQueue() {
  const now = Date.now();
  const busy = queue.length >= Math.max(4, Math.floor(maxQ * 0.5));
  if (busy) {
    for (let i = queue.length - 1; i >= 0; i--) {
      const q = queue[i];
      if (q && q.kind !== "chat" && q.kind !== "bits") queue.splice(i, 1);
    }
  }
  for (let i = queue.length - 1; i >= 0; i--) {
    const q = queue[i];
    if (q && q.ts && now - q.ts > SPEAK_FRESH_MS) queue.splice(i, 1);
  }
  while (queue.length >= maxQ) queue.shift();
}

function addMsg(m) {
  msgN++;
  const empty = $("feed-empty");
  if (empty) empty.hidden = true;
  const wrap = document.createElement("article");
  wrap.className = "msg" + (m.kind !== "chat" ? " event" : "");
  const who = m.displayName || m.user || "?";
  const tag = m.source === "demo" ? '<span class="tag">DEMO</span>' : "";
  wrap.innerHTML =
    '<div class="av">' + escapeHtml(initials(who)) + "</div>" +
    "<div><div class=\"name\">" + escapeHtml(who) + tag + "</div>" +
    '<div class="body">' + escapeHtml(m.text || "") + "</div></div>" +
    "<div><div class=\"time\">" + clock(m.ts) + "</div>" +
    '<div class="plat">' + escapeHtml(m.platform || "") + "</div></div>";
  feed.appendChild(wrap);
  feed.scrollTop = feed.scrollHeight;
  while (feed.querySelectorAll(".msg").length > 80) {
    const firstMsg = feed.querySelector(".msg");
    if (firstMsg) feed.removeChild(firstMsg); else break;
  }
  if ($("msgcount")) $("msgcount").textContent = msgN + " messages";
  if (shouldSkipSpeak(m)) return;
  if (ttsOn && unlocked) {
    lastSpeakKey = String(m.user || "").toLowerCase() + "|" + String(m.text || "").toLowerCase();
    lastSpeakAt = Date.now();
    trimSpeakQueue();
    queue.push(m);
    while (queue.length > maxQ) queue.shift();
    $("q").textContent = queue.length + " " + t().queue;
    kick();
  }
}

function speechText(m, short) {
  const name = (!short && readName) ? (m.displayName || m.user) : "";
  if (m.kind === "gift") return (name ? name + " sent " : "sent ") + (m.giftName || "a gift");
  if (m.kind === "follow") return (name || "someone") + " followed";
  if (m.kind === "sub") return (name || "someone") + " subscribed";
  if (m.kind === "bits") return (name || "someone") + " sent " + (m.bits || "") + " bits";
  return name ? name + " says " + (m.text || "") : (m.text || "");
}

function pickVoice() {
  const voices = speechSynthesis.getVoices() || [];
  if (selectedVoice) {
    const exact = voices.find(v => v.name === selectedVoice);
    if (exact) return exact;
  }
  return voices.find(v => /^en-US/i.test(v.lang || ""))
    || voices.find(v => /^en/i.test(v.lang || ""))
    || voices[0] || null;
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
  let next = null;
  const now = Date.now();
  while (queue.length) {
    const cand = queue.shift();
    if (cand && cand.ts && now - cand.ts > SPEAK_FRESH_MS) continue;
    next = cand;
    break;
  }
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
  u.lang = "en-US";
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
          addMsg({ platform: "twitch", kind: "sub", user: m.nick, displayName: who, text: m.text || "subscribed", ts: Date.now(), source: "live" });
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

function save() {
  try {
    localStorage.setItem("voxlive", JSON.stringify({
      lang, twitch: $("twitch").value,
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
    lang = "en";
    if (s.twitch) $("twitch").value = s.twitch;
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
  } catch (e) {}
}

function syncStage() {
  document.body.classList.toggle("stage", location.hash === "#stage");
  applyLang();
}

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
$("checklist-x").onclick = function () {
  checklistClosed = true;
  try { localStorage.setItem("voxlive-ck-closed", "1"); } catch (e) {}
  hideChecklist();
};
$("freebadge").onclick = openSoon;
$("pro-close").onclick = function () { $("pro-modal").classList.add("hidden"); };
$("twitch").onchange = save;

window.addEventListener("hashchange", syncStage);
window.addEventListener("keydown", function (e) {
  const tag = (e.target && e.target.tagName) || "";
  if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
  if (e.key === "s" || e.key === "S") { e.preventDefault(); $("skip").click(); }
  if (e.key === "p" || e.key === "P") { e.preventDefault(); $("pause").click(); }
});

setInterval(function () {
  trimSpeakQueue();
  if ($("q")) $("q").textContent = queue.length + " " + t().queue;
  if (speaking && speakStarted && Date.now() - speakStarted > 15000) {
    try { speechSynthesis.cancel(); } catch (e) {}
    speaking = null; kick();
  } else if (!speaking && !paused && ttsOn && unlocked && queue.length) {
    kick();
  }
}, 1000);

speechSynthesis.onvoiceschanged = fillVoices;
load(); fillVoices(); syncStage(); applyLang();
setTimeout(fillVoices, 300);
setTimeout(fillVoices, 1200);
if (demoOn) startDemo();
else { $("demo").checked = false; applyLang(); }
