# ENG.md — OPEN for Son

Owner: Spanish is out. English only. No language switch. No ES / PT / JA bars.
Owner runs **Firefox on Windows 11 IoT Enterprise**. Voices will be Microsoft. That is Firefox, not a studio bug.

## app.js (must keep the file whole — no truncate)

- `let lang = "en";` never `es`.
- If load() restored `s.lang === "es"`, force `en`.
- Delete `#es` / `#en` click handlers. Guard applyLang so missing buttons do not throw.
- `speechText`: English only.
  - gift: `{name} sent {gift}`
  - follow: `{name} followed`
  - sub: `{name} subscribed`
  - bits: `{name} sent {n} bits`
  - chat: `{name} says {text}`
- Demo lines in English. No hola / envió / se suscribió.
- Twitch sub fallback text: `subscribed` not `se suscribió`.
- Utterance lang always `en-US` unless the chosen voice has its own `voice.lang`.
- `fillVoices`: list **every** `speechSynthesis.getVoices()` entry. Do not filter by language.
- Keep `speechSynthesis.onvoiceschanged = fillVoices`.
- Also call `fillVoices` at 0ms, 300ms, and 1200ms (Firefox often returns `[]` on the first tick).
- Default pick: saved name, else `en-US` / `en`, else first voice.
- Studio hint under the voice select: "Voices come from Firefox / Windows. Microsoft-only is normal in Firefox. Chrome on this PC lists more."
- Bump `studio.html` to `app.js?v=16`.

## studio.html + site

- `html lang="en"`.
- Visible copy English (Connect, Cut, Test voice, Rehearsal, Stage, Home…).
- Remove the ES/EN (and PT/JA) switch from studio and every landing page.
- `i18n.js` English strings only; delete `es`/`pt`/`ja` dicts.
- `me.js` free-note in English.

## Do not

- Do not add TikTok back.
- Do not revive Stripe.
- Do not fake Google voices. Firefox on Windows only exposes installed Microsoft TTS voices. Win11 IoT often has fewer language packs than Home/Pro.

STOP after studio is English and the lang buttons are gone.
