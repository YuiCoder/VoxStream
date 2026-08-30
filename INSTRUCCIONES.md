# Voxlive — instrucciones maestras para el bot

Repo: https://github.com/YuiCoder/Voxlive
Sitio publico: https://yuicoder.github.io/Voxlive/
Owner GitHub: YuiCoder
Branch: main
Pages: main / root (index.html en la raiz)

Lee este archivo entero. Es la unica fuente de verdad. BOT.md es un resumen. Este archivo manda.

Trabaja, commitea y haz `git push origin main`. No dejes cambios solo en local. No abras Chrome hasta que el push exista en GitHub.

---

## 0. Que es Voxlive

Voxlive es un lector de chat en vivo para streamers. Muestra el chat de Twitch y TikTok y lo lee en voz alta.

No es un .exe. Es una web. La gente entra al link y lo usa. Eso es lo que se va a vender despues con suscripciones. Primero tiene que funcionar bien y ser usable por cualquiera, gratis.

Idioma de la interfaz: espanol primero, ingles con toggle ES/EN.
Publico objetivo: streamers en Windows 11 + Chrome. Tambien OBS (browser source).

Licencia actual: uso gratuito publico. En la web y el README debe decir claro:
**Voxlive Free — uso gratuito. Planes de pago despues.**
No pongas precios inventados. No conectes Stripe todavia.

---

## 1. Reglas que no se rompen

1. Solo este repo. Solo branch main.
2. GitHub Pages debe seguir vivo: `index.html` en la raiz.
3. Nada de .exe, .zip de instaladores, Electron, ni binarios.
4. Nada de API keys, tokens, contrasenas ni secretos en el repo.
5. No borres Twitch IRC. Ya funciona sin cuenta.
6. No prometas TikTok real sin puente. TikTok oficial no deja leer el chat desde una pagina estatica.
7. Despues de cambiar CSS/JS, sube el `?v=` en los tags (`styles.css?v=N`, `app.js?v=N`).
8. Espanol natural. Sin texto cortado ni encoding roto.
9. Al terminar cada bloque: `git add -A && git commit -m "mensaje claro" && git push origin main`.
10. Si algo no se puede hacer en Pages, documentalo. No lo finjas.

---

## 2. Orden de trabajo (obligatorio)

### FASE A — que el publico lo pueda usar (HAZ ESTO PRIMERO)
El programa tiene que servir hoy, gratis, en:
https://yuicoder.github.io/Voxlive/

### FASE B — sitio / landing del mismo estilo
Una cara publica de producto, no solo el estudio.

### FASE C — preparar tiers (sin cobrar)
UI y texto de Free / Pro. Sin pagos reales.

### FASE D — no construir todavia
Login, Stripe, servidor TikTok propio, apps moviles. Solo dejarlo escrito en ROADMAP.md.

No saltes a D. No construyas cobros.

---

## 3. FASE A — app publica que funciona

### 3.1 Archivos de la app
- `index.html` — estudio
- `app.js` — logica
- `styles.css` — tema oscuro estudio
- `.nojekyll` — dejarlo

Si hace falta, puedes anadir `landing.html` o usar `index.html` como landing y `studio.html` como estudio. Si separas, el estudio DEBE quedar publicable en Pages. Lo mas simple y correcto:

- `index.html` = landing de producto
- `studio.html` = el programa (el lector)
- Links claros entre los dos

Si dejas todo en un solo `index.html` tambien vale, pero entonces la landing va arriba o en `/` con un boton **Abrir estudio** que lleve a `#studio` o `studio.html`.

Preferido: `index.html` landing + `studio.html` app.

### 3.2 Twitch
- Input: canal sin #
- Conectar / Cortar
- WebSocket `wss://irc-ws.chat.twitch.tv:443` con nick justinfan
- CAP tags + commands
- PRIVMSG al feed
- Estados: conectando / al aire / error / cortado
- Sin contrasena

### 3.3 TikTok
- Input: usuario sin @
- Input: clave API (Euler Stream o tik.tools), con show/hide
- Guardar clave solo en localStorage
- Al conectar: apagar Ensayo
- Intentar:
  - `wss://ws.eulerstream.com?uniqueId=USER&apiKey=KEY`
  - `wss://api.tik.tools/?uniqueId=USER&apiKey=KEY`
- Parsear chat, gift, follow/sub si el JSON viene
- Estados claros:
  - falta clave
  - conectando
  - al aire
  - no esta en vivo
  - clave invalida
  - error
- Texto de ayuda: crear clave gratis en eulerstream.com, el LIVE tiene que estar abierto
- Sin clave no hay chat real de TikTok. Ensayo cubre la demo

### 3.4 Ensayo
- Toggle On por defecto en la primera visita
- Mensajes falsos de Twitch y TikTok para probar voz
- Tag visible ENSAYO
- Se apaga solo al conectar una fuente real
- Se puede volver a encender

### 3.5 Voz (critico)
Chrome bloquea speak() hasta un clic.
- No hablar al cargar la pagina
- El primer clic en **Probar voz** o **Conectar** desbloquea audio y dice una frase corta: "Voxlive listo"
- Skip, Pausa, Seguir
- Cola maxima 10. Si se llena, tira el mas viejo
- Si una frase lleva mas de 8 segundos, cancelar y pasar a la siguiente
- Preferir voces es-ES / es-US cuando el idioma es ES
- Ignorar mensajes que empiezan por `!`
- Toggle: leer en voz alta, decir el nombre, velocidad
- Si la pestana esta mute, no hay nada que programar: el README lo explica

### 3.6 UI del estudio
Tema oscuro tipo estudio (ya hay base).
- Inputs SIEMPRE oscuros. Chrome autofill no puede pintarlos blancos
- Header: logo VOX·LIVE, pill AL AIRE / EN ESPERA, ES/EN, Escenario
- Checklist de primera visita (se oculta cuando el usuario ya probo voz):
  1. Pulsa Probar voz
  2. Conecta Twitch (canal en directo)
  3. TikTok: clave + usuario en LIVE
- Badge Free visible: `VOXLIVE FREE`
- Modo Escenario: esconde settings, deja lector + feed. URL `studio.html#stage` entra directo a eso (OBS)
- Feed con avatar, nombre, texto, hora, plataforma
- Vacio: texto que diga que hacer, no un recuadro muerto

### 3.7 Copy en pantalla (ES)
- Probar voz
- Conectar / Cortar
- Ensayo
- Clave TikTok (gratis)
- Uso gratuito. Planes despues.
- Twitch no pide contrasena.
- TikTok necesita LIVE abierto y clave de eulerstream.com

---

## 4. FASE B — pagina web de producto

`index.html` (landing) en el mismo estilo oscuro que el estudio.

Secciones, en este orden:

1. Hero
   - VOX·LIVE
   - Una linea: Lee el chat de Twitch y TikTok en voz alta.
   - Boton principal: **Abrir estudio** → studio.html
   - Texto pequeno: Gratis. Sin instalar. Chrome.
2. Como funciona (3 pasos)
   - Abre el estudio
   - Conecta Twitch o TikTok
   - El chat se lee solo
3. Que hay hoy (Free)
   - Twitch en vivo
   - Ensayo para TikTok / prueba de voz
   - TikTok real con clave gratuita de Euler
   - Modo escenario para OBS
4. Que viene (Pro, no cobrado)
   - TikTok sin que el usuario pegue clave
   - Cuentas y suscripcion
   - Mas voces
   - Solo listalo. Boton: **Avisame** que guarda email en localStorage y dice "te avisamos". Sin backend.
5. Footer
   - YuiCoder
   - Link al repo
   - "Voxlive Free — uso gratuito"
   - GitHub Pages

La landing tiene que verse seria, no un readme con CSS. Misma tipografia que el estudio (Syne + IBM Plex Sans o la que ya este).

---

## 5. FASE C — tiers, sin cobrar

Crea `PRECIOS.md` y una seccion en la landing.

### Free (ahora, activo)
- Estudio web
- Twitch live
- Ensayo
- TikTok si el usuario pone su clave Euler/tik.tools
- Modo escenario
- Precio: $0

### Pro (proximamente, no activo)
- Todo lo Free
- TikTok live sin clave del usuario (servidor Voxlive)
- Cuenta
- Cola y filtros extra
- Precio: no pongas un numero inventado. Pon **Proximamente**

En el estudio, un chip `Free` es suficiente. Un modal "Proximamente Pro" si alguien pulsa Pro. No login.

---

## 6. FASE D — solo papel

Escribe `ROADMAP.md` con:

1. Demo publica estable (esta fase)
2. Dominio propio (voxlive.app o el que el owner elija)
3. Backend (Node) + TikTok-Live-Connector u Euler con clave NUESTRA
4. Auth (email magic link o GitHub login)
5. Stripe subscriptions
6. Panel del streamer
7. App desktop encapsulada (solo si la web ya vende). No ahora.

Nada de implementar 2–7.

---

## 7. README.md

Reescribe en espanol y ingles.

Debe decir:
- Que es
- Link: https://yuicoder.github.io/Voxlive/
- Abrir estudio
- Twitch: canal en directo, sin #, Conectar
- Voz: un clic en Probar voz; la pestana de Chrome no puede estar muteada
- TikTok: clave gratis en https://www.eulerstream.com/register + usuario en LIVE
- Es Free
- No hay exe
- Issues en el repo

---

## 8. Definition of done

Puedes parar cuando TODO esto sea verdad:

- [ ] `git push` hecho. El commit se ve en github.com/YuiCoder/Voxlive/commits/main
- [ ] https://yuicoder.github.io/Voxlive/ carga la landing (o el estudio si no separaste)
- [ ] El estudio abre y Ensayo pinta mensajes
- [ ] Probar voz no requiere recargar 8 veces (el codigo espera el clic)
- [ ] Twitch documentado y el cliente IRC sigue ahi
- [ ] TikTok tiene campo de clave + estados de error honestos
- [ ] #stage existe para OBS
- [ ] README y landing dicen Free
- [ ] ROADMAP.md y PRECIOS.md existen
- [ ] No hay secretos ni exe en el repo
- [ ] `?v=` subio

Respuesta final al owner:
1. URL del commit
2. URL de Pages
3. Como abrir el estudio
4. Como conectar Twitch
5. Como conectar TikTok
6. Que queda para Pro

---

## 9. Si te atascas

- No abras el navegador para "revisar" antes de pushear.
- Si Chrome pide Save password: Never.
- Si Pages da 404: el owner ya activo Pages. No toques Settings.
- Si TikTok no entra sin clave: correcto. No lo finjas con Ensayo etiquetado como live.
