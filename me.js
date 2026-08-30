(function () {
  const $ = function (id) { return document.getElementById(id); };

  function apiBase() {
    try {
      const q = new URLSearchParams(location.search).get("api");
      if (q) {
        localStorage.setItem("voxstreamApi", q.replace(/\/$/, ""));
      }
      return (localStorage.getItem("voxstreamApi") || "").replace(/\/$/, "");
    } catch (e) {
      return "";
    }
  }

  function paint(me) {
    const plan = (me && me.plan) || "free";
    const badge = $("freebadge");
    if (badge) badge.textContent = "VOXSTREAM " + String(plan).toUpperCase();
    const plus = $("lock-plus");
    const pro = $("lock-pro");
    if (plus) plus.textContent = plan === "free" ? "Plus: filtros extra" : "Plus " + (me.flags && me.flags.extraFilters ? "activo" : "cerrado");
    if (pro) pro.textContent = me.flags && me.flags.tiktokHosted ? "Pro activo" : "Pro: TikTok hosted + YouTube";
    window.voxMe = me;
  }

  async function loadMe() {
    const base = apiBase();
    if (!base) {
      paint({ plan: "free", email: null, flags: { extraFilters: false, tiktokHosted: false, youtube: false } });
      return;
    }
    try {
      const res = await fetch(base + "/v1/me", { credentials: "include" });
      const me = await res.json();
      paint(me);
    } catch (e) {
      paint({ plan: "free", email: null, flags: { extraFilters: false, tiktokHosted: false, youtube: false } });
    }
  }

  loadMe();
})();
