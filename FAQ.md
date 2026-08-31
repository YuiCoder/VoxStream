# FAQ

## Where is the site?

https://yuicoder.github.io/VoxStream/

The old URL https://yuicoder.github.io/Voxlive/ is dead. Use VoxStream.

## I hear nothing

Chrome blocks audio until a click. Press **Probar voz** once.

The tab cannot be muted. Unmute the Chrome tab (right-click the tab, then unmute).

## TikTok chat is empty

The LIVE has to be open. Get a free Euler key at https://www.eulerstream.com/register
Paste it, type the username without `@`, click **Conectar**.

No key means no real TikTok chat. **Ensayo** is the demo.

## Is there an installer?

No. There is no exe. It is a website. Open the studio in Chrome.


## Do I need an account?

No. Free does not need an account. Open the studio and use it.

## How do teammates get Pro?

Ko-fi shop orders grant Plus/Pro. Stream tips, bits, and Twitch subs do not. The owner can still grant (`POST /v1/admin/grant`). Team is VE/LATAM/US/EU. Free stays free with no account.


## How do I log in?

Studio has GitHub and Google next to the badge, or open:

https://voxstream-production.up.railway.app/v1/auth/github

https://voxstream-production.up.railway.app/v1/auth/google

Free does not need an account. There is no password form.

## How do I get Plus or Pro?

Ko-fi **shop orders** for the VoxStream products grant Plus or Pro (use the same email as GitHub/Google). Stream tips, bits, Twitch subs, and the VTuber tip jar do **not** grant. Owner grant still works for the team.

## Do I need a local terminal?

No. Open the Pages studio. The API runs on Railway. You do not need npm on your machine.

## Is live Stripe on?

No. Stripe live is closed. Plus/Pro come from the Ko-fi shop, not a card. Stream tips do not grant.

## Whose Euler key?

Free keeps your own Euler key in the studio. Hosted TikTok is Pro.


## How do I test the studio?

Open https://yuicoder.github.io/VoxStream/studio.html in Chrome. No account. No prices.

1. **Voice.** Unmute the tab. Click **Probar voz** once. You should hear a short line.
2. **Twitch.** Type a live channel, no `#`. Click **Conectar**. Chat should show and be read.
3. **TikTok (Free).** The LIVE must be open. Paste **your** Euler key, username without `@`, **Conectar**. No key: use **Ensayo**.
4. **Escenario.** Click **Escenario** (or open `studio.html#stage`) for the OBS view.

## Español

**No oigo nada.** Pulsa **Probar voz**. La pestaña de Chrome no puede estar muteada.

**TikTok vacío.** El LIVE tiene que estar abierto. Clave Euler gratis en https://www.eulerstream.com/register — pégala, usuario sin `@`, **Conectar**. Sin clave no hay chat real. **Ensayo** es la demo.

**El link viejo no funciona.** https://yuicoder.github.io/Voxlive/ está muerto. El sitio es https://yuicoder.github.io/VoxStream/

**No hay exe.** Es una web. Ábrela en Chrome.

**No hace falta cuenta.** Free no necesita cuenta.


**Entrar.** GitHub o Google en el estudio, o:
https://voxstream-production.up.railway.app/v1/auth/github
https://voxstream-production.up.railway.app/v1/auth/google
Free no necesita cuenta. No hay formulario de contraseña.

**Tienda Ko-fi.** Solo pedidos de la shop de VoxStream otorgan Plus/Pro. Tips, bits y subs del stream no. El owner también puede otorgar al equipo.


**No hace falta terminal.** Abre el estudio en Pages. La API está en Railway. No necesitas npm.

**Stripe live está cerrado.** Plus/Pro salen de la tienda Ko-fi. Tips del stream no otorgan.

**Euler en Free.** Free usa tu clave Euler. TikTok hospedado es Pro.

**Cómo probar el estudio.** Chrome, sin cuenta y sin precios: 1) **Probar voz** (pestaña no muteada). 2) Twitch: canal en directo, **Conectar**. 3) TikTok Free: tu clave Euler + LIVE, o **Ensayo**. 4) **Escenario** para OBS.
