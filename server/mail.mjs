export function magicLinkEmail({ email, url, minutes } = {}) {
  const mins = Number.isFinite(Number(minutes)) && Number(minutes) > 0 ? Number(minutes) : 15;
  const to = String(email || "").trim();
  const link = String(url || "").trim();
  const subject = "Tu enlace de VoxStream";
  const hello = to ? "Hola, " + to + "." : "Hola.";
  const text = [
    "VOX·STREAM",
    "",
    hello,
    "",
    "Entra al estudio con este enlace. Caduca en " + mins + " minutos.",
    "",
    link || "(sin enlace)",
    "",
    "Si no pediste esto, ignóralo. Nadie cobró nada.",
    "",
    "— VoxStream, de noche."
  ].join("\n");
  const html = [
    "<!doctype html>",
    "<html lang=\"es\">",
    "<head>",
    "  <meta charset=\"utf-8\" />",
    "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />",
    "  <title>VoxStream</title>",
    "</head>",
    "<body style=\"margin:0;padding:0;background:#09090b;color:#f4f0ff;font-family:Georgia,serif;\">",
    "  <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#09090b;padding:40px 16px;\">",
    "    <tr>",
    "      <td align=\"center\">",
    "        <table role=\"presentation\" width=\"480\" cellpadding=\"0\" cellspacing=\"0\" style=\"max-width:480px;background:#12111a;border:1px solid #2a2438;border-radius:16px;padding:32px 28px;\">",
    "          <tr>",
    "            <td>",
    "              <div style=\"font-family:Syne,system-ui,sans-serif;font-weight:700;letter-spacing:.18em;font-size:13px;color:#c9a2ff;\">VOX·STREAM</div>",
    "              <h1 style=\"font-family:Syne,system-ui,sans-serif;font-size:22px;line-height:1.3;margin:18px 0 12px;color:#f4f0ff;\">Tu enlace al estudio</h1>",
    "              <p style=\"margin:0 0 16px;color:#c8bdd6;line-height:1.55;\">" + hello + " Entra con este enlace. Caduca en " + mins + " minutos.</p>",
    "              <p style=\"margin:0 0 24px;\">",
    "                <a href=\"" + link + "\" style=\"display:inline-block;background:#c9a2ff;color:#16081f;text-decoration:none;font-family:system-ui,sans-serif;font-weight:600;font-size:14px;padding:12px 18px;border-radius:10px;\">Abrir VoxStream</a>",
    "              </p>",
    "              <p style=\"margin:0 0 8px;color:#8b7f9c;font-size:12px;line-height:1.5;word-break:break-all;\">" + link + "</p>",
    "              <p style=\"margin:18px 0 0;color:#8b7f9c;font-size:12px;line-height:1.5;\">Si no pediste esto, ignóralo. Nadie cobró nada.</p>",
    "            </td>",
    "          </tr>",
    "        </table>",
    "      </td>",
    "    </tr>",
    "  </table>",
    "</body>",
    "</html>"
  ].join("\n");
  return { subject, text, html };
}
