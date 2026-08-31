(function () {
  const $ = function (id) { return document.getElementById(id); };
  const DEFAULT_API = "https://voxstream-production.up.railway.app";
  const SHOP = "https://ko-fi.com/bloodbyte/shop";

  function apiBase() {
    try {
      const q = new URLSearchParams(location.search).get("api");
      if (q) localStorage.setItem("voxstreamApi", q.replace(/\/$/, ""));
      return (localStorage.getItem("voxstreamApi") || DEFAULT_API).replace(/\/$/, "");
    } catch (e) {
      return DEFAULT_API;
    }
  }

  function capQueue(flags) {
    const cap = Number(flags.maxQueue || 12);
    const el = $("qmax");
    if (!el) return;
    el.max = String(cap);
    if (Number(el.value) > cap) {
      el.value = String(cap);
      el.dispatchEvent(new Event("input"));
    }
  }

  function paint(me) {
    const plan = (me && me.plan) || "free";
    const flags = (me && me.flags) || {};
    const badge = $("freebadge");
    if (badge) badge.textContent = "VOXSTREAM " + String(plan).toUpperCase();
    const plus = $("lock-plus");
    const pro = $("lock-pro");
    if (plus) plus.textContent = flags.extraFilters ? "Plus activo" : "Plus: filtros extra";
    if (pro) pro.textContent = flags.tiktokHosted ? "Pro activo" : "Pro: TikTok hosted";
    const box = $("eleven-byok");
    if (box) {
      if (flags.elevenlabsByok) box.removeAttribute("hidden");
      else box.setAttribute("hidden", "");
    }
    const note = $("free-note");
    if (note) {
      note.textContent = plan === "free"
        ? "Free: Twitch, Ensayo, tu clave Euler. Plus y Pro: entra y compra en Ko-fi shop."
        : ("Plan " + plan + ". Hosted TikTok y BYOK siguen las flags del servidor.");
    }
    capQueue(flags);
    window.voxMe = me;
    try {
      if (me && me.email && localStorage.getItem("voxstream-buy")) {
        localStorage.removeItem("voxstream-buy");
        location.href = SHOP;
      }
    } catch (e) {}
  }

  async function loadMe() {
    try {
      const res = await fetch(apiBase() + "/v1/me", { credentials: "include" });
      paint(await res.json());
    } catch (e) {
      paint({ plan: "free", email: null, flags: { maxQueue: 12 } });
    }
  }

  function wantShop(plan) {
    try { localStorage.setItem("voxstream-buy", plan || "pro"); } catch (e) {}
    if (window.voxMe && window.voxMe.email) {
      location.href = SHOP;
      return;
    }
    const modal = $("pro-modal");
    if (modal) {
      modal.classList.remove("hidden");
      return;
    }
    location.href = "https://voxstream-production.up.railway.app/v1/auth/google";
  }

  document.addEventListener("click", function (ev) {
    const id = ev.target && ev.target.id;
    if (id === "lock-plus") { ev.preventDefault(); wantShop("plus"); }
    if (id === "lock-pro") { ev.preventDefault(); wantShop("pro"); }
  });

  loadMe();
})();
