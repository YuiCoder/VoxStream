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
