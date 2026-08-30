(function () {
  const $ = function (id) { return document.getElementById(id); };
  const DEFAULT_API = "https://voxstream-production.up.railway.app";

  function apiBase() {
    try {
      const q = new URLSearchParams(location.search).get("api");
      if (q) localStorage.setItem("voxstreamApi", q.replace(/\/$/, ""));
      return (localStorage.getItem("voxstreamApi") || DEFAULT_API).replace(/\/$/, "");
    } catch (e) {
      return DEFAULT_API;
    }
  }

  function paint(me) {
    const plan = (me && me.plan) || "free";
    const flags = (me && me.flags) || {};
    const badge = $("freebadge");
    if (badge) badge.textContent = "VOXSTREAM " + String(plan).toUpperCase();
    const plus = $("lock-plus");
    const pro = $("lock-pro");
    if (plus) plus.textContent = flags.extraFilters ? "Plus activo" : "Plus: filtros extra (cerrado)";
    if (pro) pro.textContent = flags.tiktokHosted ? "Pro activo" : "Pro: TikTok hosted (cerrado)";
    const box = $("eleven-byok");
    if (box) {
      if (flags.elevenlabsByok) box.removeAttribute("hidden");
      else box.setAttribute("hidden", "");
    }
    const note = $("free-note");
    if (note) {
      note.textContent = plan === "free"
        ? "Free: Twitch, Ensayo, tu clave Euler. Pro no se cobra en esta página."
        : ("Plan " + plan + ". Hosted TikTok y BYOK siguen las flags del servidor.");
    }
    window.voxMe = me;
  }

  async function loadMe() {
    try {
      const res = await fetch(apiBase() + "/v1/me", { credentials: "include" });
      paint(await res.json());
    } catch (e) {
      paint({ plan: "free", email: null, flags: {} });
    }
  }

  loadMe();
})();
