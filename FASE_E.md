# Fase E — pulido para que se sienta producto de verdad

Repo: YuiCoder/Voxlive  |  branch main
Sitio: https://yuicoder.github.io/Voxlive/
Estudio: https://yuicoder.github.io/Voxlive/studio.html

La Fase A–C ya está en main. NO reescribas el programa. NO toques Stripe, login, exe ni servidores.
Haz pulido visual + copy + detalle. Commit y `git push origin main`. Sube `?v=` en css/js (v=7 o más).

---

## E1. Español con tildes (landing, studio, app.js copy ES, README si hace falta)

Corrige TODO el texto visible en español:

- Cómo funciona
- Qué hay hoy
- Qué viene
- contraseña (no contrasena)
- á, é, í, ó, ú, ñ donde correspondan
- "Pega aquí tu API key"
- "Se apaga al conectar en vivo"
- Avísame / te avisamos

No dejes mix "Como" / "Que" sin tilde en headings.

---

## E2. Landing más cara de producto

Archivo: index.html + styles.css

1. Hero sigue igual (wordmark + frase + Abrir estudio) pero:
   - Subtítulo con tilde bien escrito
   - Debajo del CTA, una línea: "Uso gratuito. Se abre en Chrome."
2. Cards "Cómo funciona":
   - Mismo alto las 3
   - El texto de la 02 NO debe partir "Twitch o / TikTok". Una línea o wrap limpio: "Conecta Twitch o TikTok"
   - Un poco de descripción corta bajo cada título (1 frase)
3. Qué hay hoy: no solo pills vacías. Icono o número + título + 1 línea de detalle cada una
4. Qué viene (Pro): deja claro PROXIMAMENTE, sin precio inventado
5. Añade una seccón **Vista del estudio** entre hero y cómo funciona:
   - Un recuadro con estilo del estudio (mock de feed + "AL AIRE" + un mensaje de ensayo)
   - No hace falta screenshot PNG si haces un mock HTML/CSS fiel al estudio
   - Si puedes generar un `og.png` 1200x630 negro + VOX·LIVE mint, mejor
6. Footer con tildes y link al estudio + repo

---

## E3. Favicon + compartir link

- `favicon.svg` (o png): fondo negro, punto mint, tipografía V o wordmark corto
- En landing y studio: `<link rel="icon" href="favicon.svg">`
- Meta og:title, og:description, og:url
- Si hay og.png, og:image
- theme-color negro

Al pegar el link en Discord/WhatsApp no debe salir genérico.

---

## E4. Estudio: controles de voz

- Un solo botón Pausa que cambia a Seguir (no los dos a la vez)
- Saltar se queda
- Checklist se oculta de verdad después de Probar voz + (Twitch conectado O user la cierra)
- Botón X en checklist para cerrarla
- Pill AL AIRE solo si hay fuente real o Ensayo; si todo off, EN ESPERA
- Inputs siguen oscuros (autofill incluido)
- `#stage` sigue funcionando y esconde checklist + settings

---

## E5. Microcopy

- Badge VOXLIVE FREE se queda
- Hint TikTok con link real a https://www.eulerstream.com/register
- Empty feed: frase útil, no recuadro muerto
- Titulo de pestaña landing: `Voxlive — Lee el chat en voz alta`
- Titulo estudio: `Voxlive Estudio`

---

## E6. No hacer

- No Stripe, no Auth0, no Cloudflare, no dominio
- No exe
- No reescribir app.js desde cero (parches)
- No commitear API keys
- No mentir que TikTok funciona sin clave

---

## Done

Push a main. Responde SOLO:
1. URL del commit
2. https://yuicoder.github.io/Voxlive/
3. Lista de 5 cambios visibles
